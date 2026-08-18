import { getChatResponse } from '../services/aiService.js';

/**
 * Handles incoming chat messages and responds via Groq AI Service.
 * @route POST /api/chat
 * @param {Object} req.body - { messages: Array<{role: string, content: string}> | string }
 */
export const sendMessage = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: 'Invalid request: "messages" field is required.' });
    }

    // Call Groq AI Service
    const reply = await getChatResponse(messages);

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Error in chatController.sendMessage:', error);
    return res.status(500).json({
      error: 'Failed to process chat message',
      details: error.message,
    });
  }
};
