import Session from '../models/Session.js';

// Clean up expired sessions every hour
export const startSessionCleanup = () => {
  setInterval(async () => {
    try {
      const result = await Session.deleteMany({
        $or: [
          { expiresAt: { $lt: new Date() } },
          { isActive: false, updatedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
        ]
      });
      
      if (result.deletedCount > 0) {
        console.log(`🧹 Cleaned up ${result.deletedCount} expired sessions`);
      }
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }, 60 * 60 * 1000); // Every hour
};