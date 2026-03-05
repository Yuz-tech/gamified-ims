import express from 'express';
import Topic from '../models/Topic.js';
import User from '../models/User.js';
import Badge from '../models/Badge.js';
import { authenticateToken } from '../middleware/auth.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

router.use(authenticateToken);

// GET all topics
router.get('/', async(req,res) => {
  try {
    const topics = (await Topic.find({ isActive: true })).toSorted({ createdAt: -1 });
    const user = await User.findById(req.user._id);
    const topicsWithStatus = topics.map(topic => {
      const completion = user.completedTopics.find(
        ct => ct.topicId && ct.topicId.toString() === topic._id.toString()
      );

      return {
        ...topic.toObject(),
        mandatoryCompleted: completion?.mandatoryCompleted || false,
        bonusCompleted: completion?.bonusCompleted || false,
        bonusCorrect: completion?.bonusCorrect || 0,
        questions: topic.questions.map(q => ({
          question: q.question,
          options: q.options,
          isMandatory: q.isMandatory
        }))
      };
    });

    res.json(topicsWithStatus);
  } catch (error) {
    console.error('Error getting topics: ', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET single topic
router.get('/:topicId', async(req,res) => {
  try {
    const topic = await Topic.findById(req.params.topicId);
    if(!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const user = await User.findById(req.user._id);
    const completion = user.completedTopics.find(
      ct => ct.topicId && ct.topicId.toString() === topic._id.toString()
    );

    const mandatoryCompleted = completion?.mandatoryCompleted || false;
    const bonusCompleted = completion?.bonusCompleted || false;

    res.json({
      ...topic.toObject(),
      mandatoryCompleted, bonusCompleted, bonusCorrect: completion?.bonusCorrect || 0,
      questions: mandatoryCompleted ? topic.questions : topic.questions.map(q => ({
        question: q.question,
        options: q.options,
        isMandatory: q.isMandatory
      }))
    });
  } catch (error) {
    console.error('Error getting topic:', error);
    res.status(500).json({ message: 'Server error', error: error.message});
  }
});

// Submit question 1 (mandatory/required)
router.post('/:topicId/submit-mandatory', async (req,res) => {
  try {
    const { answer } = req.body;
    const topicId = req.params.topicId;

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const user = await User.findById(req.user._id);
    const mandatoryQuestion = topic.questions[0];
    const isCorrect = answer === mandatoryQuestion.correctAnswer;

    if (!isCorrect) {
      return res.json({
        passed: false,
        correctAnswer: false,
        correctAnswerIndex: mandatoryQuestion.correctAnswer, 
        explanation: mandatoryQuestion.explanation
      });
    }

    let completion = user.completedTopics.find(
      ct => ct.topicId && ct.topicId.toString() === topicId
    );

    if (!completion) {
      user.completedTopics.push({
        topicId,
        mandatoryCompleted: true,
        bonusCompleted: false,
        bonusCorrect: 0
      });

      user.xp += 100;
      user.level = Math.floor(Math.sqrt(user.xp / 100)) + 1;

      if (topic.badgeImage) {
        const hasBadge = user.badges.some(
          b => b.topicId && b.topicId.toString() === topicId
        );
        if (!hasBadge) {
          user.badges.push({
            topicId,
            badgeName: topic.badgeName || topic.title,
            badgeImage: topic.badgeImage
          });
        }
      }

      await user.save();

      await logActivity(user._id, 'quiz_completed', {
        topicId,
        stage: 'mandatory',
        passed: true,
        xpEarned: 100
      }, req);

      res.json({
        passed: true,
        correctAnswer: true,
        firstTime: true,
        xpEarned: 100,
        newLevel: user.level,
        newXP: user.xp,
        badgeEarned: topic.badgeName || topic.title,
        badgeImage: topic.badgeImage 
      });
    } else {
      res.json({
        passed: true,
        correctAnswer: true,
        firstTime: false,
        message: 'Already completed'
      });
    }
  } catch (error) {
    console.error('Error submitting quiz: ', error);
    res.status(500).json({ message: 'Server error', error: error.message});
  }
});

// Submit bonus questions
router.post('/:topicId/submit-bonus', async(req,res) => {
  try {
    const { answers } = req.body;
    const topicId = req.params.topicId;
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const user = await User.findById(req.user._id);
    let completion = user.completedTopics.find(
      ct => ct.topicId && ct.topicId.toString() === topicId
    );

    if (!completion || !completion.mandatoryCompleted) {
      return res.status(400).json({ message: 'Must complete mandatory question first' });
    }

    // Calculate correct answers
    let correctCount = 0;
    for (let i=1; i<=4; i++) {
      if (answers[i] === topic.questions[i].correctAnswer) {
        correctCount++;
      }
    }

    const bonusXP = correctCount * 50;

    completion.bonusCompleted = true;
    completion.bonusCorrect = correctCount;

    user.xp += bonusXP;
    user.level = Math.floor(Math.sqrt(user.xp / 100)) + 1;

    await user.save();

    await logActivity(user._id, 'quiz_completed', {
      topicId,
      stage: 'bonus',
      correctCount,
      xpEarned: bonusXP
    }, req);

    res.json({
      passed: true,
      correctCount,
      totalBonus: 4,
      xpEarned: bonusXP,
      newLevel: user.level,
      newXP: user.xp
    });
  } catch (error) {
    console.error('Error submitting bonus: ', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;