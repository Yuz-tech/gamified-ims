import express from 'express';
import Game from '../models/Game.js';
import User from '../models/User.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

// GET all games 
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { gameType, difficulty, isActive } = req.query;
        const filter = {};
        if (gameType) filter.gameType = gameType;
        if (difficulty) filter.difficulty = difficulty;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const games = await Game.find(filter);
        res.json(games);
    } catch (error) {
        console.error('Error fetching games: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET single game 
router.get('/play/:id', authenticateToken, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        res.json(game);
    } catch (error) {
        console.error('Error fetching game: ', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Mark completion
router.post('/:id/complete', authenticateToken, async (req, res) => {
    try {
        const { userId, score, timeSpent } = req.body;
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ error: 'Game not found' });

        await game.addCompletion(userId, score, timeSpent);
        res.json({ message: 'Completion recorded', game });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// user completion check
router.get('/:id/completed/:userId', authenticateToken, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ error: 'Game not found' });

        const completed = game.hasUserCompleted(req.params.userId);
        res.json({ completed });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        const game = new Game(req.body);
        await game.save();
        res.status(201).json(game);
    } catch (error) {
        console.error('Error creating game: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE game
router.put('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!game) return res.status(404).json({ error: 'Game not found' });
        res.json(game);
    } catch (error) {
        console.error('Error updating game: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE game
router.delete('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        res.json({ message: 'Game deleted' });
    } catch (error) {
        console.error('Error deleting game: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id).populate('completions.userId', 'username');
        if (!game) return res.status(404).json({ error: 'Game not found' });
        res.json(game.completions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;