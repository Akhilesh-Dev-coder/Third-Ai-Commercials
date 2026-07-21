import express from 'express';
import { getStats, updateStats } from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getStats)
  .put(protect, updateStats);

export default router;
