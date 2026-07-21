import express from 'express';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleHideReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post(protect, upload.single('customerImage'), createReview);

router.route('/:id')
  .put(protect, upload.single('customerImage'), updateReview)
  .delete(protect, deleteReview);

router.put('/:id/toggle-hide', protect, toggleHideReview);

export default router;
