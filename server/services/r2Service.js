import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || ''
  },
  region: 'auto',
  signatureVersion: 'v4'
});

/**
 * Generates an S3 Presigned URL for uploading a file directly to Cloudflare R2.
 * @param {string} fileName Original name of the file
 * @param {string} fileType MIME type of the file (e.g. video/mp4)
 * @returns {Promise<{presignedUrl: string, publicUrl: string, fileKey: string}>}
 */
export const generatePresignedUrl = async (fileName, fileType) => {
  if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('Cloudflare R2 is not fully configured on the server. Please check your .env variables.');
  }

  // Sanitize file name and prepend unique timestamp
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileKey = `videos/${Date.now()}_${sanitizedName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || 'third-ai-commercials',
    Key: fileKey,
    ContentType: fileType
  });

  // Presigned URL expires in 1 hour (3600 seconds)
  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

  // Public access URL
  const bucketPublicUrl = process.env.R2_PUBLIC_URL || '';
  const cleanPublicUrl = bucketPublicUrl.endsWith('/') ? bucketPublicUrl.slice(0, -1) : bucketPublicUrl;
  const publicUrl = `${cleanPublicUrl}/${fileKey}`;

  return { presignedUrl, publicUrl, fileKey };
};
