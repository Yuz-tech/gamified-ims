import express from 'express';
import Topic from '../models/Topic.js';
import User from '../models/User.js';
import Badge from '../models/Badge.js';
import { authenticateToken } from '../middleware/auth.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();
router.use(authenticateToken);

//Get all topics
router.get('/', async(req,res) => {
  try {
    const topics = await Topic.find({ isActive: true })
      .select('-questions.correctAnswer')
      .sort({ order: 1 });

    const user = await User.findById(req.user._id);
    const topicsWithStatus = topics.map(topic => {
      const isCompleted = user.completedTopics.some(
        ct => ct.topicId && ct.topicId.toString() === topic._id.toString()
      );

      return {
        ...topic.toObject(),
        isCompleted,
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

//Get single topic
router.get('/:topicId', async(req,res) => {
  try {
    const topic = await Topic.findById(req.params.topicId);
    if(!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const user = await User.findById(req.user._id);
    const isCompleted = user.completedTopics.some(
      ct => ct.topicId && ct.topicId.toString() === topic._id.toString()
    );

    res.json({
      ...topic.toObject(),
      isCompleted,
      questions: isCompleted
        ? topic.questions
        : topic.questions.map(q => ({
          question: q.question,
          options: q.options,
          isMandatory: q.isMandatory
        }))
    });
  } catch(error) {
    console.error('Error getting topic:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit Quiz
router.post('/:topicId/submit-quiz', async(req,res) => {
  try {
    const { answers, stage } = req.body;
    const topicId = req.params.topicId;
    const topic = await Topic.findById(topicId);
    if(!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const user = await User.findById(req.user._id);

    const alreadyCompleted = user.completedTopics.some(
      ct => ct.topicId && ct.topicId.toString() === topicId
    );

    if(stage === 'mandatory') {
      const mandatoryQuestion = topic.questions[0];
      const userAnswer = answers[0];
      const isCorrect = userAnswer === mandatoryQuestion.correctAnswer;

      if(isCorrect) {
        //100 xp for mandatory question
        if(!alreadyCompleted) {
          user.completedTopics.push({
            topicId,
            score: 100,
            completedAt: new Date(),
            stage: 'mandatory'
          });
          user.xp += 100;
          user.level = Math.floor(Math.sqrt(user.xp/100)) + 1;
          const badge = await Badge.findOne({ topicId });

          if(badge) {
            const hasBadge = user.badges.some(
              b => b.badgeId && b.badgeId.toString() === badge._id.toString()
            );

            if(!hasBadge) {
              user.badges.push({ badgeId: badge._id })
              await logActivity(user._id, 'badge_earned', {
                badgeId: badge._id,
                badgeName: badge.name
              }, req);
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
            stage: 'mandatory',
            correctAnswer: true,
            xpEarned: 100,
            newLevel: user.level,
            newXP: user.xp,
            badgeEarned: badge ? badge.name : null,
            badgeImage: badge ? badge.imageUrl : null
          });
        } else {
          res.json({
            passed: true,
            stage: 'mandatory',
            correctAnswer: true,
            message: 'Already completed'
          });
        }
      } else {
        await logActivity(user._id, 'quiz_completed', {
          topicId,
          stage: 'mandatory',
          passed: false
        }, req);

        res.json({
          passed: false,
          stage: 'mandatory',
          correctAnswer: 'false',
          correctAnswerIndex: mandatoryQuestion.correctAnswer
        });
      }
    } else if (stage === 'bonus') {
      let correctCount = 0;

      for (let i = 1; i<5; i++) {
        if (answers[i] === topic.questions[i].correctAnswer) {
          correctCount++;
        }
      }

      const bonusXP = correctCount * 50; //50 xp per correct bonus question

      const completionIndex = user.completedTopics.findIndex(
        ct => ct.topicId && ct.topicId.toString() === topicId
      );

      if(completionIndex !== -1) {
        user.completedTopics[completionIndex].stage = 'full';
        user.completedTopics[completionIndex].bonusScore = (correctCount/4) * 100;
      }

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
        stage: 'bonus',
        correctCount,
        totalBonus: 4,
        xpEarned: bonusXP,
        newLevel: user.level,
        newXP: user.xp
      });
    }
  } catch (error) {
    console.error('Error submitting quiz: ', error);
    res.status(500).json({ message: 'Server error', error:error.message});
  }
});

export default router;