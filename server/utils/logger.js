import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async (userId, action, details, req) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    await ActivityLog.create({
      userId,
      action,
      details,
      ipAddress,
      userAgent
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};