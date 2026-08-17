import express from 'express';
import { getJournals, getJournalById, createJournal, updateJournal, deleteJournal } from '../controllers/journalController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getJournals);           // GET /api/journals
router.get('/:id', getJournalById);     // GET /api/journals/:id
router.post('/', createJournal);         // POST /api/journals
router.put('/:id', updateJournal);       // PUT /api/journals/:id
router.delete('/:id', deleteJournal);    // DELETE /api/journals/:id

export default router;
