import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { authenticateToken } from '../middleware/auth.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

// parse user agent
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
router.post('/register', async(req,res) => {
  try {
    const { username, email} = req.body;
    
    //Validation
    if (!username || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Existing user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already registered' });
      }
    }

    const user = new User({
      username,
      email,
      role: 'employee',
      isApproved: false,
      requestedAt: new Date()
    });

    await user.save();

    res.status(201).json({ message: 'Registration successful! Please wait for approval.', username: user.username });
  } catch (error) {
    console.error('Registration error: ', error);
    res.status(500).json({ message: 'Registration failed.', error: error.message});
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

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
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

    // Return COMPLETE user data
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        level: user.level || 1,  // Ensure default
        xp: user.xp || 0,        // Ensure default
        badges: user.badges || [],
        completedTopics: user.completedTopics || [],
        createdAt: user.createdAt
      },
      sessionId: session._id
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      level: user.level,
      xp: user.xp,
      badges: user.badges, // Don't populate, just return raw
      completedTopics: user.completedTopics,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req,res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword.length < 3) {
      return res.status(400).json({ message: 'Password must be at least 3 characters' });
    }

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

    await logActivity(user._id, 'password_changed', {}, req);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error: ', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Profile
router.put('/update-profile', authenticateToken, async (req, res) => {
  try {
    const { avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error: ', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout
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

// Logout current session only
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