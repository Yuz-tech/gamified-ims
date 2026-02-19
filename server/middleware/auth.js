import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';

export const authenticateToken = async(req,res,next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const session = await Session.findOne({
      token,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if(!session) {
      return res.status(401).json({ message: 'Session expired or invalid' });
    }

    const user = await User.findById(decoded._id);
    if(!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if(!user.isApproved) {
      return res.status(403).json({ message: 'Account not approved' });
    }

    req.user = user;
    req.session = session;

    next();
  } catch(error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid Token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired' });
    }
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const isAdmin = (req,res,next) => {
  if(req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};