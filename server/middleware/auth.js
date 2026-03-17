import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Check if session exists and is active
    const session = await Session.findOne({
      token,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return res.status(401).json({ message: 'Session expired or invalid' });
    }
    // Get user
    const user = await User.findById(decoded._id);
    if (!user) {
      console.log('User not found:', decoded._id);
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isApproved) {
      console.log('User not approved:', user.username);
      return res.status(403).json({ message: 'Account not approved' });
    }

    // Attach user and session to request
    req.user = user;
    req.session = session;
    
    // Update session activity
    session.lastActivity = new Date();
    await session.save();
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    console.log('User is not admin:', req.user.username);
    return res.status(403).json({ message: 'Admin access required' });
  }
  console.log('dmin access granted:', req.user.username);
  next();
};