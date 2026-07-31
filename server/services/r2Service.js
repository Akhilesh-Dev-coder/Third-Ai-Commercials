import { 
  S3Client, 
  PutObjectCommand,
  GetObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand 
} from '@aws-sdk/client-s3';
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

const checkConfig = () => {
  if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('Cloudflare R2 is not fully configured on the server. Please check your .env variables.');
  }
};

/**
 * Generates an S3 Presigned URL for uploading a file directly to Cloudflare R2 in a single request.
 */
export const generatePresignedUrl = async (fileName, fileType) => {
  checkConfig();

  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileKey = `videos/${Date.now()}_${sanitizedName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || 'third-ai-commercials',
    Key: fileKey,
    ContentType: fileType
  });

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

  const bucketPublicUrl = process.env.R2_PUBLIC_URL || '';
  const cleanPublicUrl = bucketPublicUrl.endsWith('/') ? bucketPublicUrl.slice(0, -1) : bucketPublicUrl;
  const publicUrl = `${cleanPublicUrl}/${fileKey}`;

  return { presignedUrl, publicUrl, fileKey };
};

/**
 * Initializes a multipart upload session.
 */
export const startMultipartUpload = async (fileName, fileType) => {
  checkConfig();

  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileKey = `videos/${Date.now()}_${sanitizedName}`;

  const command = new CreateMultipartUploadCommand({
    Bucket: process.env.R2_BUCKET_NAME || 'third-ai-commercials',
    Key: fileKey,
    ContentType: fileType
  });

  const response = await s3.send(command);

  const bucketPublicUrl = process.env.R2_PUBLIC_URL || '';
  const cleanPublicUrl = bucketPublicUrl.endsWith('/') ? bucketPublicUrl.slice(0, -1) : bucketPublicUrl;
  const publicUrl = `${cleanPublicUrl}/${fileKey}`;

  return {
    uploadId: response.UploadId,
    key: fileKey,
    publicUrl
  };
};

/**
 * Generates a presigned URL for a single part of a multipart upload.
 */
export const getMultipartPresignedUrl = async (key, uploadId, partNumber) => {
  checkConfig();

  const command = new UploadPartCommand({
    Bucket: process.env.R2_BUCKET_NAME || 'third-ai-commercials',
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber
  });

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return presignedUrl;
};

/**
 * Completes the multipart upload session.
 */
export const completeMultipartUpload = async (key, uploadId, parts) => {
  checkConfig();

  const sortedParts = parts.sort((a, b) => a.PartNumber - b.PartNumber);

  const command = new CompleteMultipartUploadCommand({
    Bucket: process.env.R2_BUCKET_NAME || 'third-ai-commercials',
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: sortedParts
    }
  });

  const response = await s3.send(command);
  return response;
};

import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execPromise = util.promisify(exec);

/**
 * Downloads a video from R2, transcodes its audio stream to AAC (copying video stream),
 * and uploads it back to R2, overwriting the original file.
 */
export const transcodeAudioToAAC = async (key) => {
  if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    console.warn('[Transcode Warning] Cloudflare R2 is not fully configured. Skipping audio transcode.');
    return;
  }

  // Verify if ffmpeg is installed
  try {
    await execPromise('ffmpeg -version');
  } catch (err) {
    console.warn('[Transcode Warning] ffmpeg is not installed on this system. Audio transcoding will be skipped.');
    return;
  }

  const bucketName = process.env.R2_BUCKET_NAME || 'third-ai-commercials';
  const tempInPath = path.join(os.tmpdir(), `in_${Date.now()}_${path.basename(key)}`);
  const tempOutPath = path.join(os.tmpdir(), `out_${Date.now()}_${path.basename(key)}`);

  try {
    // 1. Download file from R2
    console.log(`[Transcode] Downloading original R2 video key: ${key}`);
    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });
    const s3Response = await s3.send(getCommand);

    const { pipeline } = await import('stream/promises');
    await pipeline(s3Response.Body, fs.createWriteStream(tempInPath));

    // 2. Transcode audio only (copy video stream, encode audio to AAC, and enable faststart for fast web playback)
    console.log(`[Transcode] Starting audio transcoding for R2 key: ${key}`);
    await execPromise(`ffmpeg -y -i "${tempInPath}" -c:v copy -c:a aac -movflags +faststart "${tempOutPath}"`);
    console.log(`[Transcode] Successfully transcoded audio for key: ${key}`);

    // 3. Upload the transcoded file back to R2 (overwrite)
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fs.createReadStream(tempOutPath),
      ContentType: 'video/mp4'
    });
    await s3.send(putCommand);
    console.log(`[Transcode] Uploaded transcoded video back to R2 key: ${key}`);
  } catch (error) {
    console.error(`[Transcode Error] failed to transcode key ${key}:`, error);
  } finally {
    // Clean up temp files
    try {
      if (fs.existsSync(tempInPath)) fs.unlinkSync(tempInPath);
      if (fs.existsSync(tempOutPath)) fs.unlinkSync(tempOutPath);
    } catch (cleanupErr) {
      console.warn('[Transcode Warning] Temp file cleanup failed:', cleanupErr.message);
    }
  }
};
