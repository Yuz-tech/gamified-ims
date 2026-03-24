import express from 'express';
import Game from '../models/Game.js';
import GameProgress from '../models/GameProgress.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

router.use(authenticateToken);

// GET all games
router.get('/', async (req, res) => {
    try {
        const games = await Game.find()
          .select('title type difficulty xpReward')
          .sort({ difficulty: 1, title: 1 });

        const userProgress = await GameProgress.find({ userId: req.user._id });
        const completedGameIds = userProgress.map(p => p.gameId.toString());

        const gamesWithProgress = games.map(game => ({
            ...game.toObject(),
            completed: completedGameIds.includes(game._id.toString()),
            lastPlayed: userProgress.find(p => p.gameId.toString() === game._id.toString())?.lastPlayed
        }));

        res.json(gamesWithProgress);
    } catch (error) {
        console.error('Error fetching games: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:gameId', async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.json(game);
    } catch (error) {
        console.error('Error fetching game: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit answers
router.post('/:gameId/submit', async (req,res) => {
    try {
        const { gameId } = req.params;
        const { answers } = req.body;
        const userId = req.user._id;

        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        let correctCount = 0;
        let totalQuestions = game.questions.length;

        game.questions.forEach((question, index) => {
            const userAnswer = answers[index];

            if (game.type === 'crossword' || game.type === 'word_scramble') {
                if (userAnswer && userAnswer.toUpperCase() === question.answer.toUpperCase()) {
                    correctCount++;
                }
            }
        });

        const percentage = (correctCount / totalQuestions) * 100;
        const score = Math.round((percentage / 100) * game.xpReward);

        await GameProgress.findOneAndUpdate(
            { userId, gameId },
            { 
                score: percentage,
                completed: true,
                lastPlayed: new Date()
            },
            { upsert: true, new: true }
        );

        const user = await User.findById(userId);
        const oldLevel = user.level;
        const oldXP = user.xp;
        
        user.xp += score;

        const { calculateLevel } = await import('../utils/levelSystem.js');
        const newLevel = calculateLevel(user.xp);
        const leveledUp = newLevel > oldLevel;

        if (leveledUp) {
            user.level = newLevel;
        }

        await user.save();

        await logActivity(userId, 'game_completed', {
            gameId,
            gameTitle: game.title,
            score: percentage,
            xpEarned: score,
            correctAnswers: correctCount,
            totalQuestions
        }, req);

        res.json({
            score,
            percentage: Math.round(percentage),
            correctCount,
            totalQuestions,
            xpEarned: score,
            leveledUp,
            newLevel: user.level,
            newXP: user.xp
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;