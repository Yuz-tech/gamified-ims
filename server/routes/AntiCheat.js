import express from 'express';
import Game from '../models/Game.js';
import User from '../models/User.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// In-memory game sessions
const gameSessions = new Map();

// Clean up expired sessions (> 1 hour)
setInterval(() => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    for (const [key, session] of gameSessions.entries()) {
        if (session.startedAt < oneHourAgo) {
            gameSessions.delete(key);
        }
    }
}, 5 * 60 * 1000); //every 5 minutes

// Get all games with completion status
router.get('/', authenticateToken, async (req, res) => {
    try {
        const games = await Game.find({ isActive: true });

        const gamesWithStatus = games.map(game => {
            const hasCompleted = game.hasUserCompleted(req.user._id);
            return {
                _id: game._id,
                title: game.title,
                description: game.description,
                gameType: game.gameType,
                difficulty: game.difficulty,
                maxXP: game.maxXP,
                timeLimit: game.timeLimit,
                completionCount: game.completionCount,
                hasCompleted
            };
        });

        res.json(gamesWithStatus);
    } catch (error) {
        console.error('Error fetching games: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start/Resume a games session
router.get('/play/:id', authenticateToken, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if (game.hasUserCompleted(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You have already completed this game' });
        }

        const sessionKey = `${req.user._id}-${game._id}`;
        let session = gameSessions.get(sessionKey);

        // Create new session if doesn't exist or new player
        if (!session) {
            session = {
                userId: req.user._id,
                gameId: game._id,
                startedAt: Date.now(),
                timeLimit: game.timeLimit
            };
            gameSessions.set(sessionKey, session);
        }

        const elapsedSeconds = Math.floor((Date.now() - session.startedAt) / 1000);
        const timeRemaining = game.timeLimit > 0 ? Math.max(0, game.timeLimit - elapsedSeconds) : 0;

        // end game pag wala ng oras
        if (game.timeLimit > 0 && timeRemaining === 0) {
            gameSessions.delete(sessionKey);
            return res.status(403).json({
                message: 'Time expired',
                timeExpired: true
            });
        }

        res.json({
            ...game.toObject(),
            session: {
                startedAt: session.startedAt,
                elapsedSeconds,
                timeRemaining
            }
        });
    } catch (error) {
        console.error('Error starting game: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit game score
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

// ADMIN: GET all games
router.get('/admin/all', authenticateToken, isAdmin, async (req, res) => {
    try {
        const games = await Game.find().sort({ createdAt: -1 });
        res.json(games);
    } catch (error) {
        console.error('Error fetching games: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ADMIN: Create game
router.post('/admin', authenticateToken, isAdmin, async (req,res) => {
    try {
        const game = new Game(req.body);
        await game.save();
        res.status(201).json(game);
    } catch (error) {
        console.error('Error creating game: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ADMIN: Update game
router.put('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.json(game);
    } catch (error) {
        console.error('Error updating game: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ADMIN: Delete game
router.delete('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.json({ message: 'Game deleted' });
    } catch (error) {
        console.error('Error deleting game: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;