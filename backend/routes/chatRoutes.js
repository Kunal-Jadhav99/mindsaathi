import express from 'express';

const router = express.Router();

// Placeholder routes for Person B
router.get('/', (req, res) => {
  res.json({ message: 'Chat placeholder endpoint' });
});

export default router;
