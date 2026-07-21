import express from 'express';
import { getCEOs, createCEO, updateCEO, deleteCEO } from '../controllers/ceoController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCEOs)
  .post(protect, upload.single('image'), createCEO);

router.route('/:id')
  .put(protect, upload.single('image'), updateCEO)
  .delete(protect, deleteCEO);

export default router;
