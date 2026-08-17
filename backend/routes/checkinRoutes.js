import express from 'express';
import { getCheckins, createCheckin } from '../controllers/checkinController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getCheckins);
router.post('/', createCheckin);

export default router;
