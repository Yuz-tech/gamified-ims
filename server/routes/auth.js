import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { logActivity } from '../utils/logger.js';
import Session from '../models/Session.js';

const router = express.Router();

//check user agents
const parseUserAgent = (userAgent) => {
  const ua = userAgent || '';

  let deviceType = 'desktop';
  if(/mobile/i.test(ua)) deviceType = 'mobile';
  else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';

  let browser = 'unknown';
  if(/chrome/i.test(ua)) browser = 'Chrome';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/edge/i.test(ua)) browser = 'Edge';

  let os = 'unknown';
  if(/windows/i.test(ua)) os = 'Windows';
  else if (/mac/i.test(ua)) os = 'MacOS';
  else if (/linux/i.test(ua)) os = 'linux';
  else if (/android/i.test(ua)) os = 'Android';

  return {deviceType, browser, os};
};

// Request account
router.post('/request-account', async (req, res) => {
  try {
    const { username, email } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken' 
      });
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const user = new User({
      username,
      email,
      password: tempPassword,
      isApproved: false
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

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const deviceInfo = parseUserAgent(req.headers['user-agent']);
    deviceInfo.ipAddress = req.ip;
    deviceInfo.userAgent = req.headers['user-agent'];

    // Session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = new Session({
      userId: user._id,
      token,
      deviceInfo,
      expiresAt
    });

    await session.save();

    await logActivity(user._id, 'login', {
      deviceType: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os
    }, req);

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
        completedTopics: user.completedTopics
      },
      sessionId: session._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', authenticateToken, async(req,res) => {
  try {
    const user = await User.findById(req.user._id)
       .select('password')
       .populate('badges.badgeId')
       .populate('completedTopics.topicId');

    if(!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if(req.session) {
      await req.session.updateActivity();
    }

    res.json(user);
  } catch(error) {
    res.status(500).json({ message: 'Server error', error: error.message});
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if(!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if(!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    await logActivity(user._id, 'password_change', {}, req);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error occurred for some reason', error: error.message });
  }
});

// Logout logic => invalidate current session
router.post('/logout', authenticateToken, async(req,res) => {
  try {
    if (req.session) {
      req.session.isActive = false;
      await req.session.save();
    }
    await logActivity(req.user._id, 'logout', {}, req);

    res.json({ message: 'Logged out successfully' });
  } catch(error) {
    res.status(500).json({ message: 'Server error', error: error.message});
  }
});

//Logout all devices (in case lang naman)
router.post('/logout-all', authenticateToken, async(req,res) => {
  try {
    await Session.updateMany(
      { userId: req.user._id, isActive: true},
      { isActive: false }
    );

    await logActivity(req.user._id, 'logout_all_devices', {}, req);

    res.json({ message: 'Logged out from all devices' });
  } catch(error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get active sessions
router.get('/sessions', authenticateToken, async(req,res) => {
  try {
    Session.find({
      userId: req.user._id,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).sort({ lastActivity: -1 });

    const sessionsData = sessionsStorage.map(session=>({
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

//Revoke session
router.delete('/sessions/:sessionId',authenticateToken, async(req,res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.sessionId,
      userId: req.user._id
    });

    if(!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.isActive = false;
    await session.save();

    res.json({ message: 'Session revoked' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;