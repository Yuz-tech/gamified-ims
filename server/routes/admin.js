import express from 'express';
import User from '../models/User.js';
import Topic from '../models/Topic.js';
import Badge from '../models/Badge.js';
import ActivityLog from '../models/ActivityLog.js';
import SystemSettings from '../models/SystemSettings.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { sendPasswordEmail } from '../utils/email.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

router.use(authenticateToken, isAdmin);

// ===== USER MANAGEMENT =====

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create user manually
router.post('/users', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      username,
      email,
      password,
      role: role || 'employee',
      isApproved: true
    });

    await user.save();

    await sendPasswordEmail(user.email, user.username, password);

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user
router.put('/users/:userId', async (req, res) => {
  try {
    const { username, email, role, xp, level } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { username, email, role, xp, level },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/users/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== TOPIC MANAGEMENT =====

// Get all topics (admin)
router.get('/topics', authenticateToken, isAdmin, async (req, res) => {
  try {
    const topics = await Topic.find({});
    
    // Sort in JavaScript
    topics.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    res.json(topics);
  } catch (error) {
    console.error('Error getting admin topics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create topic
router.post('/topics', async (req, res) => {
  try {
    const topic = new Topic(req.body);
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle topic active/inactive (instead of delete)
router.put('/topics/:topicId/toggle', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    topic.isActive = !topic.isActive;
    await topic.save();
    
    res.json({ 
      message: `Topic ${topic.isActive ? 'enabled' : 'disabled'} successfully`,
      topic 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// toggle all topics
router.put('/topics/toggle-all', authenticateToken, isAdmin, async (req,res) => {
  try {
    const { isActive } = req.body;
    const result = await Topic.updateMany(
      {},
      { $set: { isActive }}
    );

    await logActivity(req.user._id, 'topics_bulk_toggle', {
      isActive,
      count: result.modifiedCount
    }, req);

    res.json({ message: `All topics ${isActive ? 'enabled' : 'disabled'}`, count: result.modifiedCount});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update topic
router.put('/topics/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.questions) {
      if (updateData.questions.length !== 5) {
        return res.status(400).json({ message: 'Topic must have exactly 5 questions'});
      }

      updateData.questions[0].isMandatory = true;

      for (let i=1; i<updateData.questions.length; i++) {
        updateData.questions[i].isMandatory = false;
      }
    }

    const topic = await Topic.findByIdAndUpdate(
      id, { $set: updateData }, { new: true, runValidators: true }
    );

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    await logActivity(req.user._id, 'topic_updated', {
      topicId: topic._id,
      topicTitle: topic.title
    }, req);

    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message})
  }
});

// ===== ACTIVITY LOGS =====

// Get all activity logs
router.get('/activity-logs', async (req, res) => {
  try {
    const { userId, action, limit = 100 } = req.query;
    
    const query = {};
    if (userId) query.userId = userId;
    if (action) query.action = action;

    const logs = await ActivityLog.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all activity logs with filtering
router.get('/activity-logs', async (req, res) => {
  try {
    const { userId, action, limit = 100 } = req.query;
    
    const query = {};
    if (userId) query.userId = userId;
    if (action) query.action = action;

    const logs = await ActivityLog.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get statistics
router.get('/statistics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isApproved: true, role: 'employee' });
    const totalTopics = await Topic.countDocuments();
    const totalBadges = await Badge.countDocuments();

    const topUsers = await User.find({ isApproved: true, role: 'employee'  })
      .select('username email xp level badges')
      .sort({ xp: -1 })
      .limit(10);

    res.json({
      totalUsers,
      totalTopics,
      totalBadges,
      topUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Yearly Reset
router.post('/yearly-reset', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { confirmCode } = req.body;

    if (confirmCode !== 'RESET_ALL_DATA') {
      return res.status(400).json({ message: 'Invalid confirmation code' });
    }

    console.log('Starting yearly reset...');

    const result = await User.updateMany({ role: 'employee' }, 
      {
        $set: {
          completedTopics: []
        }
      }
    );
    await ActivityLog.deleteMany({});
    await logActivity(req.user._id, 'yearly-reset', {
      usersReset: result.modifiedCount,
      timestamp: new Date()
    }, req);

    res.json({
      message: 'Yearly reset completed',
      usersReset: result.modifiedCount, 
      details: {
        completedTopicsCleared: true,
        badgesPreserved: true,
        xpPreserved: true,
        levelsPreserved: true,
        activityLogsCleared: true
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Reset failed',
      error: error.message
    });
  }
});

// Reset password
router.post('/reset-user-password/:userId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();
    await logActivity(req.user._id, 'password_reset_by_admin', {
      targetUserId: user._id,
      targetUsername: user.username
    }, req);

    res.json({
      message: 'Password reset successfully',
      username: user.username
    });
  } catch (error) {
    console.error('Password reset error: ', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/analytics', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'employee' }).select('username xp level completedTopics badges');
    const topics = await Topic.find().select('title');

    const totalUsers = users.length;
    const totalBadges = users.reduce((sum, user) => sum + (user.badges?.length || 0), 0);
    const avgXpPerUser = totalUsers > 0 ? Math.round(users.reduce((sum, user) => sum + user.xp, 0) / totalUsers) : 0;
    const avgLevel = totalUsers > 0 ? Math.round(users.reduce((sum, user) => sum + user.level, 0) / totalUsers) : 0;

    const totalTopicsCompleted = users.reduce((sum, user) => sum + (user.completedTopics?.length || 0), 0);
    const avgCompletionRate = totalUsers > 0 && topics.length > 0 ? Math.round((totalTopicsCompleted / (totalUsers * topics.length)) * 100) : 0;

    const topicCompletions = {};
    topics.forEach(topic => {
      topicCompletions[topic._id] = {
        title: topic.title,
        completions: 0
      };
    });

    users.forEach(user => {
      user.completedTopics?.forEach(ct => {
        if (topicCompletions[ct.topicId]) {
          topicCompletions[ct.topicId].completions++;
        }
      });
    });

    const topTopics = Object.values(topicCompletions)
      .sort((a, b) => b.completions - a.completions)
      .slice(0, 10);

      const topUsers = users
        .map(user => ({
          username: user.username,
          xp: user.xp,
          level: user.level,
          completedTopics: user.completedTopics?.length || 0
        }))
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 10);

      res.json({
        totalUsers,
        totalBadges,
        avgXpPerUser,
        avgLevel,
        avgCompletionRate,
        topTopics,
        topUsers
      });
  } catch (error) {
    console.error('Analytics error: ', error);
    res.status(500).json({ message: 'Server error', error: error.message});
  }
});

// Get system settings
router.get('/settings', authenticateToken, isAdmin, async (req, res) => {
  try {
    let settings = await SystemSettings.findOne({ settingKey: 'completion_form_url' });
    
    // Create default if doesn't exist
    if (!settings) {
      settings = new SystemSettings({
        settingKey: 'completion_form_url',
        settingValue: 'https://forms.gle/your-form-id',
        lastUpdatedBy: req.user._id
      });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update system settings
router.put('/settings', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { completionFormUrl } = req.body;

    if (!completionFormUrl) {
      return res.status(400).json({ message: 'Completion form URL is required' });
    }

    // Validate URL format
    try {
      new URL(completionFormUrl);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    let settings = await SystemSettings.findOne({ settingKey: 'completion_form_url' });

    if (settings) {
      settings.settingValue = completionFormUrl;
      settings.lastUpdatedBy = req.user._id;
      settings.lastUpdatedAt = new Date();
    } else {
      settings = new SystemSettings({
        settingKey: 'completion_form_url',
        settingValue: completionFormUrl,
        lastUpdatedBy: req.user._id
      });
    }

    await settings.save();

    // Log activity
    await logActivity(req.user._id, 'settings_updated', {
      setting: 'completion_form_url',
      newValue: completionFormUrl
    }, req);

    res.json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;