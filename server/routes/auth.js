import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { authenticateToken } from '../middleware/auth.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

// Helper function to parse user agent
const parseUserAgent = (userAgent) => {
  const ua = userAgent || '';
  
  let deviceType = 'desktop';
  if (/mobile/i.test(ua)) deviceType = 'mobile';
  else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';
  
  let browser = 'unknown';
  if (/chrome/i.test(ua)) browser = 'Chrome';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/edge/i.test(ua)) browser = 'Edge';
  
  let os = 'unknown';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac/i.test(ua)) os = 'MacOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/ios|iphone|ipad/i.test(ua)) os = 'iOS';
  
  return { deviceType, browser, os };
};

// Request new account
router.post('/request-account', async (req, res) => {
  try {
    const { username, email } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const user = new User({
      username,
      email,
      password: Math.random().toString(36).slice(-8),
      isApproved: false,
      requestedAt: new Date()
    });

    await user.save();

    res.status(201).json({ 
      message: 'Account request submitted. Please wait for admin approval.' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(`🔐 Login attempt for user: ${username}`);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token with extended expiration
    const token = jwt.sign(
      { 
        _id: user._id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Parse device info
    const deviceInfo = parseUserAgent(req.headers['user-agent']);
    deviceInfo.ipAddress = req.ip;
    deviceInfo.userAgent = req.headers['user-agent'];

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = new Session({
      userId: user._id,
      token,
      deviceInfo,
      expiresAt
    });

    await session.save();

    // Log activity
    await logActivity(user._id, 'login', { 
      deviceType: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os 
    }, req);

    console.log(`✅ Login successful for user: ${username}`);

    // Return user data with session info
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        level: user.level,
        xp: user.xp,
        badges: user.badges,
        completedTopics: user.completedTopics,
        createdAt: user.createdAt
      },
      sessionId: session._id
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user - THIS IS THE IMPORTANT ONE
router.get('/me', authenticateToken, async (req, res) => {
  try {
    console.log(`👤 Getting user data for: ${req.user.username}`);
    
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('badges.badgeId')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update session activity
    if (req.session) {
      await req.session.updateActivity();
    }

    console.log(`✅ Sending user data for: ${user.username}`);
    res.json(user);
  } catch (error) {
    console.error('❌ Error getting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    await logActivity(user._id, 'password_change', {}, req);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    if (req.session) {
      req.session.isActive = false;
      await req.session.save();
    }

    await logActivity(req.user._id, 'logout', {}, req);

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout all devices
router.post('/logout-all', authenticateToken, async (req, res) => {
  try {
    await Session.updateMany(
      { userId: req.user._id, isActive: true },
      { isActive: false }
    );

    await logActivity(req.user._id, 'logout_all_devices', {}, req);

    res.json({ message: 'Logged out from all devices' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get active sessions
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.user._id,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).sort({ lastActivity: -1 });

    const sessionsData = sessions.map(session => ({
      _id: session._id,
      deviceType: session.deviceInfo.deviceType,
      browser: session.deviceInfo.browser,
      os: session.deviceInfo.os,
      ipAddress: session.deviceInfo.ipAddress,
      lastActivity: session.lastActivity,
      isCurrent: session._id.toString() === req.session?._id?.toString(),
      createdAt: session.createdAt
    }));

    res.json(sessionsData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Revoke specific session
router.delete('/sessions/:sessionId', authenticateToken, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.sessionId,
      userId: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.isActive = false;
    await session.save();

    res.json({ message: 'Session revoked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;