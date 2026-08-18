import express from 'express';
import { sendMessage } from '../controllers/chatController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/chat - Generate AI response from Groq AI service (Secured)
router.post('/', verifyToken, sendMessage);

export default router;
