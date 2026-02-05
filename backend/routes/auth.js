const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
const User = require('../models/User');

router.post('/register', [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 3}).withMessage('Password must be atleast 3 characters'),
    body('role').optional().isIn(['employee', 'admin'])
], async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const {username,email,password,role} = req.body;
    try {
        let user = await user.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({
                errors: [{
                    msg: user.email === email ? 'Email already exists' : 'Username already exists'
                }]
            });
        }
        
        //Create User
        user = new User({
            username,
            email,
            password,
            role: role || 'employee'
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                username: user.username
            }
        };

        jwt.sign(
            payload, process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if(err) throw err;
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
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('password').exists().withMessage('Password is required')
], async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
        //Check if username exists
        let user = await User.findOne({ username }).select('+password');
        if(!user) {
            return res.status(400).json({
                errors: [{ msg: 'Invalid Credentials' }]
            });
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            return res.status(400).json({
                errors: [{ msg: 'Invalid credentials' }]
            });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                username: user.username
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' }, (err, token) => {
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
        res.status(500).send('Server Error');
    }
});

module.exports = router;