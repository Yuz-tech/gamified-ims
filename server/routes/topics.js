import express from 'express';
import Topic from '../models/Topic.js';
import User from '../models/User.js';
import Badge from '../models/Badge.js';
import { authenticateToken } from '../middleware/auth.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

router.use(authenticateToken);

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
        console.error('Error getting topics: ', error);
        res.status(500).json({ message: 'Server error', error:error.message });
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

        const isVideoWatched = user.watchedVideos.some(
            wv => wv.topicId && wv.topicId.toString() === topic._id.toString()
        );

        // Review 
        res.json({
            ...topic.toObject(),
            isCompleted,
            isVideoWatched,
            questions: isCompleted ? topic.questions : topic.question.map(q => ({
                question: q.question,
                options: q.options,
                points: q.points
            }))
        });
    } catch (error) {
        console.error('Error getting topic: ', error);
        res.status(500).json({ message: 'Server error', error:error.message });
    }
});

{/*TO BE REMOVED OR REVAMPED: Mark Video as Watched */}
router.post('/:topicId/watch-video', async(req,res) => {
    try {
        const user = await User.findById(req.user._id);
        const topicId = req.params.topicId;

        const alreadyWatched = user.watchedVideos.some(
            wv => wv.topicId && wv.topicId.toString() === topicId
        );

        if(!alreadyWatched) {
            user.watchedVideos.push({ topicId });
            await user.save();

            await logActivity(user._id, 'video_watched', { topicId }, req);
        }

        res.json({ message: 'Video marked as watched '});
    } catch (error) {
        console.error('Error marking video as watched: ', error);
        res.status(500).json({ message: 'Server error', error:error.message});
    }
});

//Submit quiz
router.post('/:topicId/submit-quiz', async(req,res) => {
    try {
        const { answers } = req.body;
        const topicId = req.params.topicId;

        const topic = await Topic.findById(topicId);
        if(!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        const user = await User.findById(req.user._id);

        const videoWatched = user.watchedVideos.some(
            wv => wv.topicId && wv.topicId.toString() === topicId
        );

        if(!videoWatched) {
            return res.status(400).json({
                message: 'You must watch the video before taking the quiz'
            });
        }

        const alreadyCompleted = user.completedTopics.some(
            ct => ct.topicId && ct.topicId.toString() === topicId
        );

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

        const scorePercentage = Math.round((earnedPoints/totalPoints) * 100);
        const passed = scorePercentage >= topic.passingScore;

        await logActivity(user._id, 'quiz_completed', {
            topicId,
            score: scorePercentage,
            passed
        }, req);

        if(passed && !alreadyCompleted) {
            user.completedTopics.push({
                topicId,
                score: scorePercentage,
                completedAt: new Date()
            });

            user.xp += topic.xpReward;
            user.level = Math.floor(Math.sqrt(user.xp/100)) + 1;

            const badge = await Badge.findOne({ topicId });

            if (badge) {
                const hasBadge = user.badges.some(
                    b => b.badgeId && b.badgeId.toString() === badge._id.toString()
                );

                if(!hasBadge) {
                    user.badges.push({ badgeId: badge._id });
                    await logActivity(user._id, 'badge_earned', {
                        badgeId: badge._id,
                        badgeName: badge.name
                    }, req);
                }
            }

            await user.save();

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
            res.json({
                passed: true,
                score: scorePercentage,
                correctAnswers,
                totalQuestions: topic.questions.length,
                message: 'Review completed'
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
        console.error('Error submitting quiz: ', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;