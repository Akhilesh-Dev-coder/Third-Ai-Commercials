import express from 'express';
import { getContacts, createContact, markAsContacted, deleteContact } from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getContacts)
  .post(createContact);

router.put('/:id/status', protect, markAsContacted);
router.delete('/:id', protect, deleteContact);

export default router;
