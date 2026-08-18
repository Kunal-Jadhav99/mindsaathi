import express from 'express';
import { getDeptStats, getWeeklyTrends, getAlerts, updateAlertStatus, getSummary, seedMockData } from '../controllers/adminController.js';
import { verifyToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Require both authentication and counsellor/admin role
router.use(verifyToken);
router.use(requireAdmin);

router.get('/summary', getSummary);               // GET /api/admin/summary
router.get('/dept-stats', getDeptStats);           // GET /api/admin/dept-stats
router.get('/weekly-trends', getWeeklyTrends);     // GET /api/admin/weekly-trends
router.get('/alerts', getAlerts);                   // GET /api/admin/alerts
router.put('/alerts/:id', updateAlertStatus);       // PUT /api/admin/alerts/:id
router.post('/seed', seedMockData);                 // POST /api/admin/seed

export default router;

