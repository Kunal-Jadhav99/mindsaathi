import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Route Imports
import userRoutes from './routes/userRoutes.js';
import checkinRoutes from './routes/checkinRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mounting Routes
app.use('/api/users', userRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/admin', adminRoutes);

// Part B Routes (Teammate's scope - mounted here for completeness)
app.use('/api/forum', forumRoutes);
app.use('/api/chat', chatRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong.'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 MindSaathi server running on port ${PORT}`);
});
