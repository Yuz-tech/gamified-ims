import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; 

import authRoutes from './routes/auth.js';
import topicRoutes from './routes/topics.js';
import leaderboardRoutes from './routes/leaderboard.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';
import { startSessionCleanup } from './utils/sessionCleanup.js';
import gamesRoutes from './routes/games.js';
import activityRoutes from './routes/activity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// CORS Config
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://0.0.0.0:3000',
      'http://0.0.0.0:5000',
      'http://0.0.0.0:5173',
      'http://0.0.0.0:27017',
      process.env.FRONTEND_URL,
      '0.0.0.0:3000'
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.set('trust proxy', true);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
    startSessionCleanup();
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));

startSessionCleanup();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/activity', activityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'IMS Training running!',
    timestamp: new Date()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║        IMS AWARENESS TRAINING          ║
  ║                                        ║
  ║   Server running on port ${PORT}          ║
  ║   Environment:${process.env.NODE_ENV || 'development'}              ║
  ║                                        ║
  ╚════════════════════════════════════════╝
  `);
});

export default app;