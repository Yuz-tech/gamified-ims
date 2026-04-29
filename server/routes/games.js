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

        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Check if already completed
        if (game.hasUserCompleted(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You have already completed this game' });
        }

        // Verify user session
        const sessionKey = `${req.user._id}-${game._id}`;
        const session = gameSessions.get(sessionKey);

        if (!session) {
            return res.status(403).json({ message: 'No active game session' });
        }

        const actualTimeSpent = Math.floor((Date.now() - session.startedAt) / 1000);
        if (game.timeLimit > 0 && actualTimeSpent > game.timeLimit + 5) {
            gameSessions.delete(sessionKey);
            return res.status(403).json({ message: 'Time limit exceeded' });
        }

        const user = await User.findById(req.user._id);
        if (!game.hasUserCompleted(req.user._id)) {
            user.xp += score;

            const { calculateLevel } = await import('../utils/levelSystem.js');
            user.level = calculateLevel(user.xp);

            await user.save();
        }

        await game.addCompletion(req.user._id, score, actualTimeSpent);

        gameSessions.delete(sessionKey);

        res.json({
            message: 'Score submitted',
            xpAwarded: !game.hasUserCompleted(req.user._id) ? score : 0,
            totalXP: user.xp,
            level: user.level
        });
    } catch (error) {
        console.error('Error submitting score: ', error);
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