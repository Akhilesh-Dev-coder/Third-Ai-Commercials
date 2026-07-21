import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

const cpUpload = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

router.route('/')
  .get(getProjects)
  .post(protect, cpUpload, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(protect, cpUpload, updateProject)
  .delete(protect, deleteProject);

export default router;
