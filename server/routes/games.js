import express from 'express';
import Game from '../models/Game.js';
import User from '../models/User.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

// GET all games w/ completion status
router.get('/', authenticateToken, async (req, res) => {
    try {
        const games = await Game.find({ isActive: true })
            .select('title description gameType difficulty maxXP timeLimit')
            .sort({ createdAt: -1 });
        
        const gamesWithStatus = games.map(game => {
            const hasCompleted = game.hasUserCompleted(req.user._id);
            return {
                ...game.toObject(),
                hasCompleted,
                canPlay: !hasCompleted
            };
        });

        res.json(gamesWithStatus);
    } catch (error) {
        console.error('Error fetching games: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET single game 
router.get('/play/:id', authenticateToken, async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if (!game.isActive) {
            return res.status(403).json({ message: 'This game is not active' });
        }

        const hasCompleted = game.hasUserCompleted(req.user._id && req.user.role !== 'admin');

        if (hasCompleted) {
            return res.status(403).json({
                message: 'You have already completed this game and earned XP from it',
                hasCompleted: true
            });
        }

        res.json({
            ...game.toObject(),
            hasCompleted: false,
            canPlay: true
        });
    } catch (error) {
        console.error('Error fetching game: ', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Submit score
// Player can only play the game once to avoid XP farming hehe
router.post('/submit-score', authenticateToken, async (req, res) => {
    try {
        const { gameId, gameType, score, timeSpent } = req.body;
        const userId = req.user._id;

        if (typeof score !== 'number' || score < 0) {
            return res.status(400).json({ message: 'Invalid score' });
        }

        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if (game.hasUserCompleted(userId)) {
            return res.status(403).json({ message: 'You have already completed this game', alreadyCompleted: true });
        }

        const maxXP = game.maxXP;
        const cappedScore = Math.min(score, maxXP);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const oldLevel = user.level;
        user.xp += cappedScore;

        const { calculateLevel } = await import('../utils/levelSystem.js');
        const newLevel = calculateLevel(user.xp);
        const leveledUp = newLevel > oldLevel;

        if (leveledUp) {
            user.level = newLevel;
        }

        await user.save();

        await game.addCompletion(userId, cappedScore, timeSpent);

        await logActivity(userId, 'game_completed', {
            gameId: game._id,
            gameType,
            score: cappedScore,
            timeSpent,
            leveledUp
        }, req);

        res.json({
            xpEarned: cappedScore,
            totalXP: user.xp,
            leveledUp,
            newLevel: user.level,
            completed: true
        });
    } catch (error) {
        console.error('Error submitting game score: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ======= ADMIN ROUTES ===========

// GET all
router.get('/admin/all', authenticateToken, isAdmin, async (req, res) => {
    try {
        const games = (await Game.find());

        const gamesWithStats = games.map(game => ({
            ...game.toObject(),
            completionCount: game.completions.length
        }));

        res.json(gamesWithStats);
    } catch (error) {
        console.error('Error fetching all games: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// CREATE game
router.post('/admin/create', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { title, description, gameType, difficulty, maxXP, timeLimit, content } = req.body;

        const game = new Game({
            title,
            description,
            gameType,
            difficulty,
            maxXP,
            timeLimit,
            content
        });

        await game.save();

        await logActivity(req.user._id, 'game_created', {
            gameId: game._id,
            title: game.title,
            gameType: game.gameType
        }, req);

        res.json({
            message: 'Game created successfully',
            game
        });
    } catch (error) {
        console.error('Error creating game: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE game
router.put('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const gameId = req.params.id;
        const { title, description, difficulty, maxXP, timeLimit, content, isActive } = req.body;

        const game = await Game.findByIdAndUpdate(
            gameId,
            {
                title,
                description,
                difficulty,
                maxXP,
                timeLimit,
                content,
                isActive
            },
            { new: true }
        );

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        await logActivity(req.user._id, 'game_updated', {
            gameId: game._id,
            title: game.title
        }, req);

        res.json({
            message: 'Game updated successfully',
            game
        });
    } catch (error) {
        console.error('Error updating game: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE game
router.delete('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const gameId = req.params.id;

        const game = await Game.findByIdAndDelete(gameId);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        await logActivity(req.user._id, 'game_deleted', {
            gameId: game._id,
            title: game.title
        }, req);

        res.json({ message: 'Game deleted successfully' });
    } catch (error) {
        console.error('Error deleting game: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;