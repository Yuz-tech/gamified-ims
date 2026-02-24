import express from 'express';
import Topic from '../models/Topic.js';
import User from '../models/User.js';
import Badge from '../models/Badge.js';
import { authenticateToken } from '../middleware/auth.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

// All topic routes require authentication
router.use(authenticateToken);

// Get all active topics
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find({ isActive: true })
      .select('-questions.correctAnswer')
      .sort({ order: 1 });
    
    const user = await User.findById(req.user._id);
    
    const topicsWithStatus = topics.map(topic => {
      // Check if topic is completed
      const isCompleted = user.completedTopics.some(
        ct => ct.topicId && ct.topicId.toString() === topic._id.toString()
      );
      
      // Check if video is watched
      const isVideoWatched = user.watchedVideos.some(
        wv => wv.topicId && wv.topicId.toString() === topic._id.toString()
      );
      
      return {
        ...topic.toObject(),
        isCompleted,
        isVideoWatched,
        questions: topic.questions.map(q => ({
          question: q.question,
          options: q.options,
          points: q.points
        }))
      };
    });

    res.json(topicsWithStatus);
  } catch (error) {
    console.error('Error getting topics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single topic
router.get('/:topicId', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if topic is completed
    const isCompleted = user.completedTopics.some(
      ct => ct.topicId && ct.topicId.toString() === topic._id.toString()
    );
    
    // Check if video is watched
    const isVideoWatched = user.watchedVideos.some(
      wv => wv.topicId && wv.topicId.toString() === topic._id.toString()
    );

    // If completed, show all questions with correct answers (for review)
    // If not completed, hide correct answers
    res.json({
      ...topic.toObject(),
      isCompleted,
      isVideoWatched,
      questions: isCompleted 
        ? topic.questions // Show everything if completed (for review)
        : topic.questions.map(q => ({ // Hide correct answers if not completed
            question: q.question,
            options: q.options,
            points: q.points
          }))
    });
  } catch (error) {
    console.error('Error getting topic:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Mark video as watched
router.post('/:topicId/watch-video', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const topicId = req.params.topicId;

    // Check if already watched
    const alreadyWatched = user.watchedVideos.some(
      wv => wv.topicId && wv.topicId.toString() === topicId
    );

    if (!alreadyWatched) {
      user.watchedVideos.push({ topicId });
      await user.save();

      await logActivity(user._id, 'video_watched', { topicId }, req);
    }

    res.json({ message: 'Video marked as watched' });
  } catch (error) {
    console.error('Error marking video as watched:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit quiz
router.post('/:topicId/submit-quiz', async (req, res) => {
  try {
    const { answers } = req.body;
    const topicId = req.params.topicId;

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if video was watched
    const videoWatched = user.watchedVideos.some(
      wv => wv.topicId && wv.topicId.toString() === topicId
    );

    if (!videoWatched) {
      return res.status(400).json({ 
        message: 'You must watch the video before taking the quiz' 
      });
    }

    // Check if already completed (allow review but don't award points again)
    const alreadyCompleted = user.completedTopics.some(
      ct => ct.topicId && ct.topicId.toString() === topicId
    );

    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    topic.questions.forEach((question, index) => {
      totalPoints += question.points;
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
        earnedPoints += question.points;
      }
    });

    const scorePercentage = Math.round((earnedPoints / totalPoints) * 100);
    const passed = scorePercentage >= topic.passingScore;

    await logActivity(user._id, 'quiz_completed', { 
      topicId, 
      score: scorePercentage,
      passed
    }, req);

    // Only award XP and badge if passed AND not already completed
    if (passed && !alreadyCompleted) {
      // Add to completed topics
      user.completedTopics.push({
        topicId,
        score: scorePercentage,
        completedAt: new Date()
      });

      // Award XP
      user.xp += topic.xpReward;
      user.level = Math.floor(Math.sqrt(user.xp / 100)) + 1;

      // Find and award badge
      const badge = await Badge.findOne({ topicId });
      
      if (badge) {
        const hasBadge = user.badges.some(
          b => b.badgeId && b.badgeId.toString() === badge._id.toString()
        );
        
        if (!hasBadge) {
          user.badges.push({ badgeId: badge._id });
          await logActivity(user._id, 'badge_earned', { 
            badgeId: badge._id,
            badgeName: badge.name
          }, req);
        }
      }

      await user.save();

      // Check if all badges collected
      const totalBadges = await Badge.countDocuments();
      const allBadgesCollected = user.badges.length >= totalBadges;

      res.json({
        passed: true,
        score: scorePercentage,
        correctAnswers,
        totalQuestions: topic.questions.length,
        xpEarned: topic.xpReward,
        newLevel: user.level,
        newXP: user.xp,
        badgeEarned: badge ? badge.name : null,
        badgeImage: badge ? badge.imageUrl : null,
        allBadgesCollected
      });
    } else if (passed && alreadyCompleted) {
      // Passed but already completed - review mode
      res.json({
        passed: true,
        score: scorePercentage,
        correctAnswers,
        totalQuestions: topic.questions.length,
        message: 'Review completed - you already earned rewards for this topic'
      });
    } else {
      // Failed
      res.json({
        passed: false,
        score: scorePercentage,
        correctAnswers,
        totalQuestions: topic.questions.length,
        requiredScore: topic.passingScore
      });
    }
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;