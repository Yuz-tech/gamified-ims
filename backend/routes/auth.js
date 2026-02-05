const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register user
router.post('/register', [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['employee', 'admin'])
], async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ 
                errors: [{ 
                    msg: user.email === email ? 'Email already exists' : 'Username already exists' 
                }] 
            });
        }

        // Create user
        user = new User({
            username,
            email,
            password,
            role: role || 'employee'
        });

        await user.save();

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                username: user.username
            }
        };

        // Sign token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        xp: user.xp,
                        level: user.level
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('password').exists().withMessage('Password is required')
], async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ username }).select('+password');
        if (!user) {
            return res.status(400).json({ 
                errors: [{ msg: 'Invalid credentials' }] 
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ 
                errors: [{ msg: 'Invalid credentials' }] 
            });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                username: user.username
            }
        };

        // Sign token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        xp: user.xp,
                        level: user.level
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;