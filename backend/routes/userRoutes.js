import express from 'express';
import { getProfile, updateProfile, setRole } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All user routes are authenticated
router.use(verifyToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/role', setRole);

export default router;
