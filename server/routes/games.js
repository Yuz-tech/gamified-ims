import express from 'express';
import Game from '../models/Game.js';
import User from '../models/User.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

// Get all games 
router.get('/admin/all', authenticateToken, isAdmin, async (req, res) => {
    try {
        const games = (await Game.find()).toSorted({ createdAt: -1 });
        res.json(games);
    } catch (error) {
        console.error('Error fetching all games: ', error);
        res.status(500).json({ message: 'Server error'});
    }
});

// Create game
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

// Update game 
router.put('/admin/:gameId', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { gameId } = req.params;
        const { title, description, gameType, difficulty, maxXP, timeLimit, content, isActive } = req.body;

        const game = await Game.findByIdAndUpdate(
            gameId,
            {
                title,
                description,
                gameType,
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

// Delete game
router.delete('/admin/:gameId', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { gameId } = req.params;
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

// Get all active games
router.get('/', authenticateToken, async (req,res) => {
    try {
        const games = await Game.find({ isActive: true })
            .select('title description gameType difficulty maxXP timeLimit')
            .sort({ createdAt: -1 });
        
        res.json(games);
    } catch (error) {
        console.error('Error fetching games: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get game by ID
router.get('/:gameId', authenticateToken, async (req, res) => {
    try {
        const { gameId } = req.params;

        const game = await Game.findOne({ _id: gameId, isActive: true });

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.json(game);
    } catch (error) {
        console.error('Error fetching game: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit game
router.post('/submit-score', authenticateToken, async (req, res) => {
    try {
        const { gameId, gameType, score, timeSpent } = req.body;
        const userId = req.user._id;

        if (typeof score !== 'number' || score < 0) {
            return res.status(400).json({ message: 'Invalid score' });
        }

        let game;
        if (gameId) {
            game = await Game.findById(gameId);
            if (!game) {
                return res.status(404).json({ message: 'Game not found' });
            }
        }

        const maxXP = game ? game.maxXP : 100;
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

        await logActivity(userId, 'game_completed', {
            gameId: gameId || null,
            gameType,
            score: cappedScore,
            timeSpent,
            leveledUp
        }, req);

        res.json({
            xpEarned: cappedScore,
            totalXP: user.xp,
            leveledUp,
            newLevel: user.level
        });
    } catch (error) {
        console.error('Error submitting game score: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;