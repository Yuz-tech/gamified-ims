import express from 'express';
import Topic from '../models/Topic.js';
import Badge from '../models/Badge.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

router.use(authenticateToken);

// Get all active topics
router.get('/', async(req,res) => {
  try {
    const currentYear = new Date().getFullYear();
    const topics = await Topic.find({ isActive: true })
      .select({ order: 1 });
    const user = await User.findById(req.user._id);

    const topicsWithStatus = topics.map(topic => {
      const isCompleted = user.isTopicCompletedThisYear(topic._id);
      const isVideoWatched = user.isVideoWatchedThisYear(topic._id);

      return {
        ...topic.toObject(),
        isCompleted,
        isVideoWatched,
        isCurrentYear,
        questions: topic.questions.map(q => ({
          question: q.question,
          options: q.options,
          points: q.points
        }))
      };
    });

    res.json(topicsWithStatus);
  } catch(error) {
    res.status(500).json({ message: 'Server error', error:error.message });
  }
});

// Get single topic
router.get('/:topicId', async(req,res) => {
  try {
    const currentYear = new Date().getFullYear();
    const topic = await Topic.findById(req.params.topicId)
      .select('-questions.correctAnswer');

    if(!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const user = await User.findById(req.user._id);
    const isCompleted = user.isTopicCompletedThisYear(topic._id);
    const isVideoWatched = user.isVideoWatchedThisYear(topic._id);

    res.json({
      ...topic.toObject(),
      isCompleted,
      isVideoWatched,
      currentYear,
      questions: topic.questions.map(q => ({
        question: q.question,
        options: q.options,
        points: q.points
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error:error.message});
  }
});

// Mark video as watched
router.post('/:topicId/watch-video', async(req,res) => {
  try {
    const currentYear = new Date().getFullYear();
    const user = await User.findById(req.user._id);
    const topicId = req.params.topicId;
    const alreadyWatched = user.isVideoWatchedThisYear(topicId);

    if(!alreadyWatched) {
      user.watchedVideos.push({
        topicId,
        year: currentYear
      });
      await user.save();

      await logActivity(user._id, 'video_watched', {
        topicId,
        year: currentYear
      }, req);
    }

    res.json({ message: 'Video marked as watched' });
  } catch (error) {
    res.status(500).json({ messge: 'Server error', error: error.message });
  }
});

// Submit quiz
router.post('/:topicId/submit-quiz', async(req,res) => {
  try {
    const currentYear = new Date().getFullYear();
    const { answers } = req.body;
    const topicId = req.params.topicId;
    const topic = await Topic.findById(topicId);
    if(!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    const user = await User.findById(req.user._id);

    //Check if video was watched this year
    const videoWatched = user.isVideoWatchedThisYear(topicId);

    if(!videoWatched) {
      return res.status(400).json({
        message: 'You must watch the video before taking the quiz'
      });
    }

    const alreadyCompleted = user.isTopicCompletedThisYear(topicId);
    
    if(alreadyCompleted) {
      return res.status(400).json({ message: 'Quiz already completed for this year'});
    }

    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    topic.questions.forEach((question, index) => {
      totalPoints += question.points;
      if(answers[index] === question.correctAnswer) {
        correctAnswers++;
        earnedPoints += question.points;
      }
    });

    const scorePercentage = Math.round((earnedPoints / totalPoints) * 100);
    const passed = scorePercentage >= topic.passingScore;

    await logActivity(user._id, 'quiz_completed', {
      topicId,
      score: scorePercentage,
      passed,
      year: currentYear
    }, req);

    if(passed) {
      user.completedTopics.push({
        topicId, 
        year: currentYear,
        score: scorePercentage
      });

      user.xp += topic.xpReward;
      user.calculateLevel();

      const badge = await Badge.findOne({
        topicId,
        year: currentYear,
        isActive: true
      });

      if(badge) {
        const hasBadge = user.badges.some(
          b => b.badgeId.toString() === badge._id.toString() && b.year === currentYear
        );
        if(!hasBadge) {
          user.badges.push({
            badgeId: badge._id,
            year: currentYear
          });
          await logActivity(user._id,'badge_earned', {
            badgeId: badge._id,
            badgeName: badge.name,
            year: currentYear
          }, req);
        }
      }

      await user.save();

      const totalBadges = await Badge.countDocuments({
        year: currentYear,
        isActive: true
      });
      
      const userBadgesThisYear = user.badges.filter(b => b.year === currentYear).length;
      const allBadgesCollected = userBadgesThisYear >= totalBadges;

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
        allBadgesCollected,
        currentYear,
        congratsLink : allBadgesCollected ? 'https://google.com' : null
      });
    } else {
      res.json({
        passed: false,
        score: scorePercentage,
        correctAnswers,
        totalQuestions: topic.questions.length,
        requiredScore: topic.passingScore
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;