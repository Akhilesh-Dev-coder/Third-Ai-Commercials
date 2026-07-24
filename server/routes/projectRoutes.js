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
import cloudinary from '../config/cloudinary.js';
import { generatePresignedUrl } from '../services/r2Service.js';

const router = express.Router();

router.get('/cloudinary-config', protect, (req, res) => {
  res.json({
    success: true,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || ''
  });
});

router.get('/cloudinary-signature', protect, (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        upload_preset: 'third_ai_preset'
      },
      process.env.CLOUDINARY_API_SECRET
    );
    res.json({
      success: true,
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });
  } catch (error) {
    console.error('Signature Generation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate upload signature.' });
  }
});

router.post('/presigned-url', protect, async (req, res) => {
  const { fileName, fileType } = req.body;
  if (!fileName || !fileType) {
    return res.status(400).json({ success: false, message: 'fileName and fileType are required.' });
  }

  try {
    const data = await generatePresignedUrl(fileName, fileType);
    res.json({
      success: true,
      presignedUrl: data.presignedUrl,
      publicUrl: data.publicUrl,
      fileKey: data.fileKey
    });
  } catch (error) {
    console.error('Presigned URL Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to generate presigned upload URL.' });
  }
});

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
