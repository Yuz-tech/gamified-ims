import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import Game from '../models/Game.js';

const router = express.Router();

// GET /api/games - Public: Get active games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find({ isActive: true })
      .populate('configs.topicId', 'name')
      .lean();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/games/:slug - Public: Play game
router.get('/:slug', async (req, res) => {
  try {
    const game = await Game.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    })
      .populate('configs.topicId', 'name')
      .lean();
    
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/games/type/:gameType - Public
router.get('/type/:gameType', async (req, res) => {
  try {
    const games = await Game.find({ 
      'configs.gameType': req.params.gameType,
      isActive: true 
    })
      .populate('configs.topicId', 'name')
      .lean();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN ROUTES
// POST /api/games - Admin only
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    const populated = await Game.findById(game._id)
      .populate('configs.topicId', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/games/:id - Admin only
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    )
      .populate('configs.topicId', 'name');
    res.json(game);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/games/:id - Admin only
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ message: 'Game deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;