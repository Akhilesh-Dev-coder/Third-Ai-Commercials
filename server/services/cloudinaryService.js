import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadMediaToCloudinary = async (filePath, folder = 'third-ai-commercials', resourceType = 'auto') => {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: resourceType
      });
      // Clean local file after upload
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return {
        secure_url: result.secure_url,
        public_id: result.public_id
      };
    }
  } catch (error) {
    console.warn(`[Cloudinary Warning] Upload to Cloudinary failed: ${error.message}. Falling back to static URL.`);
  }

  // Fallback to local server static path
  const filename = filePath.split('/').pop().split('\\').pop();
  return {
    secure_url: `/uploads/${filename}`,
    public_id: `local_${Date.now()}`
  };
};

export const deleteMediaFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId || publicId.startsWith('local_')) return true;
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    }
    return true;
  } catch (error) {
    console.warn(`[Cloudinary Warning] Delete failed for ${publicId}: ${error.message}`);
    return false;
  }
};
