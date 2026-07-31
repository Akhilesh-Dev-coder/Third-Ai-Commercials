import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

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
  const fileExt = filename.split('.').pop().toLowerCase();
  
  if (resourceType === 'video' || ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(fileExt)) {
    const tempCompressedPath = filePath.replace(/\.[^/.]+$/, "") + "_compressed.mp4";
    try {
      console.log(`[Video Optimizer] Compressing local video fallback: ${filePath} -> ${tempCompressedPath}...`);
      // Run ffmpeg compression: h264, crf 26, 96k AAC audio, faststart
      await execPromise(`ffmpeg -y -i "${filePath}" -vcodec libx264 -crf 26 -preset fast -b:a 96k -movflags +faststart "${tempCompressedPath}"`);
      
      // Replace original file with compressed one
      if (fs.existsSync(tempCompressedPath)) {
        fs.unlinkSync(filePath); // delete original large file
        fs.renameSync(tempCompressedPath, filePath); // rename compressed to original path name
        console.log(`[Video Optimizer] Successfully compressed local upload: ${filename}`);
      }
    } catch (err) {
      console.error(`[Video Optimizer Error] FFMPEG compression failed: ${err.message}`);
      if (fs.existsSync(tempCompressedPath)) {
        fs.unlinkSync(tempCompressedPath);
      }
    }
  }

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
