import express from 'express';

const router = express.Router();

// Placeholder routes for Person B
router.get('/', (req, res) => {
  res.json({ message: 'Forum placeholder endpoint' });
});

export default router;
