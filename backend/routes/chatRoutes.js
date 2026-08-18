import express from 'express';
import { sendMessage } from '../controllers/chatController.js';

const router = express.Router();

// POST /api/chat - Generate AI response from Groq AI service
router.post('/', sendMessage);

export default router;
