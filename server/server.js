import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import topicRoutes from './routes/topics.js';
import leaderboardRoutes from './routes/leaderboard.js';  // ← Make sure this is imported
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';
import { startSessionCleanup } from './utils/sessionCleanup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Trust proxy
app.set('trust proxy', true);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('🎮 MongoDB Connected - Game On!');
    startSessionCleanup();
  })
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes - ALL MUST BE HERE
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/leaderboard', leaderboardRoutes);  // ← Make sure this line exists
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

console.log('✅ Routes registered:');
console.log('   - /api/auth');
console.log('   - /api/topics');
console.log('   - /api/leaderboard');
console.log('   - /api/admin');
console.log('   - /api/upload');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '🕹️ IMS Training Arcade is running!',
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
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🎮 IMS TRAINING ARCADE SERVER 🎮    ║
  ║                                        ║
  ║   Server running on port ${PORT}        ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}              ║
  ║                                        ║
  ║   PRESS START TO CONTINUE...          ║
  ╚════════════════════════════════════════╝
  `);
});

export default app;