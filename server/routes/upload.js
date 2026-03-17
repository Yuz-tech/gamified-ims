import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure directories exist
const badgeDir = path.join(__dirname, '../uploads/badges');
const avatarDir = path.join(__dirname, '../uploads/avatars');

if (!fs.existsSync(badgeDir)) {
  fs.mkdirSync(badgeDir, { recursive: true });
}
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

// Badge Storage 
const badgeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, badgeDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'badge-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Avatar storage
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadBadge = multer({
  storage: badgeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }
});

// Upload badge
router.post('/badge', authenticateToken, isAdmin, uploadBadge.single('badge'), (req,res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/badges/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.filename });
  } catch (error) {
    console.error('Badge upload error: ', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Upload Avatar
router.post('/avatar', authenticateToken, uploadAvatar.single('avatar'), (req,res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/avatars/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.filename });
  } catch (error) {
    console.error('Avatar upload error: ', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Delete Badge 
router.delete('/badge/:filename', authenticateToken, isAdmin, (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(badgeDir, filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ message: 'Badge deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

export default router;