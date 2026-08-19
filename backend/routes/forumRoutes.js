import express from 'express';
import { getPosts, createPost, likePost } from '../controllers/forumController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Require auth token for forum interactions
router.use(verifyToken);

router.get('/', getPosts);             // GET /api/forum
router.post('/', createPost);          // POST /api/forum
router.post('/:id/like', likePost);    // POST /api/forum/:id/like

export default router;
