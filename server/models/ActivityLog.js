import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'password_change',
      'video_watched',
      'quiz_started',
      'quiz_completed',
      'badge_earned',
      'topic_completed',
      'profile_updated',
      'password_reset_by_admin',
      'xp_awarded',
      'game_created',
      'game_updated',
      'game_deleted',
      'game_completed',
      'settings_updated',
      'topic_new_toggled',
      'yearly-reset'
    ]
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;