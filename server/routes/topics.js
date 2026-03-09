import express from 'express';
import Topic from '../models/Topic.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

router.use(authenticateToken);

// Get all active topics
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find({ isActive: true });
    
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

    // Sort in JavaScript after mapping (newest first by createdAt)
    topicsWithStatus.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
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
    const completion = user.completedTopics.find(
      ct => ct.topicId && ct.topicId.toString() === topic._id.toString()
    );

    const mandatoryCompleted = completion?.mandatoryCompleted || false;
    const bonusCompleted = completion?.bonusCompleted || false;

    res.json({
      ...topic.toObject(),
      mandatoryCompleted,
      bonusCompleted,
      bonusCorrect: completion?.bonusCorrect || 0,
      questions: mandatoryCompleted
        ? topic.questions
        : topic.questions.map(q => ({
            question: q.question,
            options: q.options,
            isMandatory: q.isMandatory
          }))
    });
  } catch (error) {
    console.error('Error getting topic:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit mandatory question
router.post('/:topicId/submit-mandatory', async (req, res) => {
  try {
    console.log('MANDATORY SUBMISSION STARTED');
    console.log('User ID:', req.user._id);
    console.log('Topic ID:', req.params.topicId);
    console.log('Answer:', req.body.answer);

    const { answer } = req.body;
    const topicId = req.params.topicId;

    const topic = await Topic.findById(topicId);
    if (!topic) {
      console.log('Topic not found');
      return res.status(404).json({ message: 'Topic not found' });
    }

    console.log('Topic found:', topic.title);

    const user = await User.findById(req.user._id);
    console.log('User found:', user.username);
    console.log('Current XP:', user.xp);
    console.log('Current Level:', user.level);
    console.log('Current badges:', user.badges.length);
    console.log('Current completed topics:', user.completedTopics.length);

    const mandatoryQuestion = topic.questions[0];
    const isCorrect = answer === mandatoryQuestion.correctAnswer;

    console.log('Mandatory question:', mandatoryQuestion.question);
    console.log('Correct answer index:', mandatoryQuestion.correctAnswer);
    console.log('User answer index:', answer);
    console.log('Is correct?', isCorrect);

    if (!isCorrect) {
      console.log('Answer incorrect, sending failure response');
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

    console.log('Existing completion:', completion);

    if (!completion) {
      console.log(' First time completion - adding to completedTopics');
      
      user.completedTopics.push({
        topicId,
        mandatoryCompleted: true,
        bonusCompleted: false,
        bonusCorrect: 0
      });

      console.log('Adding 100 XP...');
      user.xp += 100;
      user.level = Math.floor(Math.sqrt(user.xp / 100)) + 1;

      console.log('New XP:', user.xp);
      console.log('New Level:', user.level);

      if (topic.badgeImage) {
        console.log('Badge image found:', topic.badgeImage);
        const hasBadge = user.badges.some(
          b => b.topicId && b.topicId.toString() === topicId
        );
        
        console.log('User already has this badge?', hasBadge);
        
        if (!hasBadge) {
          console.log('Adding badge...');
          user.badges.push({
            topicId,
            badgeName: topic.badgeName || topic.title,
            badgeImage: topic.badgeImage
          });
          console.log('Badge added');
        }
      } else {
        console.log(' No badge image for this topic');
      }

      console.log('Saving user...');
      const savedUser = await user.save();
      console.log(' User saved successfully');
      console.log('Saved XP:', savedUser.xp);
      console.log('Saved Level:', savedUser.level);
      console.log('Saved badges:', savedUser.badges.length);
      console.log('Saved completed topics:', savedUser.completedTopics.length);

      await logActivity(user._id, 'quiz_completed', { 
        topicId, 
        stage: 'mandatory',
        passed: true,
        xpEarned: 100
      }, req);

      const responseData = {
        passed: true,
        correctAnswer: true,
        firstTime: true,
        xpEarned: 100,
        newLevel: savedUser.level,
        newXP: savedUser.xp,
        badgeEarned: topic.badgeName || topic.title,
        badgeImage: topic.badgeImage
      };

      console.log('Sending response:', responseData);

      res.json(responseData);
    } else {
      console.log('Already completed');
      res.json({
        passed: true,
        correctAnswer: true,
        firstTime: false,
        message: 'Already completed'
      });
    }
  } catch (error) {
    console.error(' ERROR submitting mandatory:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit bonus questions
router.post('/:topicId/submit-bonus', async (req, res) => {
  try {
    console.log('BONUS SUBMISSION STARTED');
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

    let correctCount = 0;
    for (let i = 1; i <= 4; i++) {
      if (answers[i] === topic.questions[i].correctAnswer) {
        correctCount++;
      }
    }

    console.log('Bonus correct:', correctCount, '/ 4');

    const bonusXP = correctCount * 50;
    completion.bonusCompleted = true;
    completion.bonusCorrect = correctCount;

    user.xp += bonusXP;
    user.level = Math.floor(Math.sqrt(user.xp / 100)) + 1;

    console.log('Adding bonus XP:', bonusXP);
    console.log('New total XP:', user.xp);
    console.log('New level:', user.level);

    await user.save();

    await logActivity(user._id, 'quiz_completed', { 
      topicId, 
      stage: 'bonus',
      correctCount,
      xpEarned: bonusXP
    }, req);

    console.log('Bonus saved successfully');

    res.json({
      passed: true,
      correctCount,
      totalBonus: 4,
      xpEarned: bonusXP,
      newLevel: user.level,
      newXP: user.xp
    });
  } catch (error) {
    console.error('Error submitting bonus:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;