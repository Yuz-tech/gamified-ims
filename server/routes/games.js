import express from 'express';
import Game from '../models/Game.js';
import GameProgress from '../models/GameProgress';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { logActivity } from '../utils/logger.js';
import { calculateLevel } from '../utils/levelSystem.js';

const router = express.Router();

router.use(authenticateToken);

// GET all games
router.get('/', async (req,res) => {
    try {
        const games = await Game.find({ isActive: true }).populate('relatedTopics', 'title');

        const userId = req.user._id;
        const progressRecords = await GameProgress.find({ userId });

        const gamesWithProgress = games.map(game => {
            const progress = progressRecords.find(p => p.gameId.toString() === game._id.toString());
            return {
                ...game.toObject(),
                userProgress: progress ? {
                    completed: progress.completed,
                    bestScore: progress.bestScore,
                    attempts: progress.attempts,
                    xpEarned: progress.xpEarned
                } : null
            };
        });

        res.json(gamesWithProgress);
    } catch (error) {
        console.error('Error fetching games: ', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET single game
router.get('/:gameId', async(req,res) => {
    try {
        const game = await Game.findById(req.params.gameId).populate('relatedTopics', 'title');
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        const progress = await GameProgress.findOne({
            userId: req.user._id,
            gameId: game._id
        });

        res.json({
            ...game.toObject(),
            userProgress: progress || null
        });
    } catch (error) {
        console.error('Error fetching game: ', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Submit Game result
router.post('/:gameId/submit', async (req,res) => {
    try {
        const { score, timeSpent, completed } = req.body;
        const gameId = req.params.gameId;
        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        const user = await User.findById(req.user._id);

        let progress = await GameProgress.findOne({
            userId: user._id,
            gameId: game._id
        });

        const isNewCompletion = !progress || !progress.completed;
        const isNewBestScore = !progress || score > progress.bestScore;

        if (!progress) {
            progress = new GameProgress ({
                userId: user._id,
                gameId: game._id,
                score,
                timeSpent,
                completed,
                attempts: 1,
                bestScore: score
            });
        } else {
            progress.score = score;
            progress.timeSpent += timeSpent;
            progress.attempts += 1;
            progress.lastPlayedAt = new Date();
            if (score > progress.bestScore) {
                progress.bestScore = score;
            }
            if (completed && !progress.completed) {
                progress.completed = true;
            }
        }

        let xpEarned = 0;
        if (isNewCompletion && completed) {
            xpEarned = game.xpReward;
        } else if (isNewBestScore && completed) {
            xpEarned = Math.floor(game.xpReward * 0.25);
        } else if (completed) {
            // If inulit yung game, 10% of base XP lang ang reward
            xpEarned = Math.floor(game.xpReward * 0.1);
        }

        if (xpEarned > 0) {
            user.xp += xpEarned;
            user.level = calculateLevel(user.xp);
            await user.save();

            progress.xpEarned += xpEarned;
        }

        await progress.save();

        game.playCount += 1;
        const allProgress = await GameProgress.find({ gameId: game._id, completed: true });
        if (allProgress.length > 0) {
            game.averageScore = allProgress.reduce((sum,p) => sum + p.bestScore, 0) / allProgress.length;
        }
        await game.save();

        await logActivity(user._id, 'game_played', {
            gameId: game._id,
            gameTitle: game.title,
            score,
            xpEarned,
            completed
        }, req);

        res.json({
            success: true,
            xpEarned,
            newXP: user.xp,
            newLevel: user.level,
            bestScore: progress.bestScore,
            isNewBest: isNewBestScore,
            isFirstCompletion: isNewCompletion
        });
    } catch (error) {
        console.error('Error submitting game: ', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET leaderboard for a game
router.get('/:gameId/leaderboard', async(req,res) => {
    try {
        const leaderboard = await GameProgress.find({
            gameId: req.params.gameId,
            completed: true
        })
        .populate('userId', 'username avatar level')
        .sort({ bestScore: -1 })
        .limit(10);

        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard: ', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;