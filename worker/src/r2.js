import { 
  S3Client, 
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

let s3ClientInstance = null;

function getS3Client(env) {
  if (s3ClientInstance) return s3ClientInstance;
  
  if (!env.CLOUDFLARE_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
    throw new Error('Cloudflare R2 is not fully configured in environment variables');
  }

  s3ClientInstance = new S3Client({
    endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY
    },
    region: 'auto',
    signatureVersion: 'v4'
  });
  return s3ClientInstance;
}

export const generatePresignedUrl = async (fileName, fileType, env) => {
  const s3 = getS3Client(env);
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileKey = `videos/${Date.now()}_${sanitizedName}`;

  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME || 'third-ai-commercials',
    Key: fileKey,
    ContentType: fileType
  });

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  const bucketPublicUrl = env.R2_PUBLIC_URL || '';
  const cleanPublicUrl = bucketPublicUrl.endsWith('/') ? bucketPublicUrl.slice(0, -1) : bucketPublicUrl;
  const publicUrl = `${cleanPublicUrl}/${fileKey}`;

  return { presignedUrl, publicUrl, fileKey };
};

export const startMultipartUpload = async (fileName, fileType, env) => {
  const s3 = getS3Client(env);
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileKey = `videos/${Date.now()}_${sanitizedName}`;

  const command = new CreateMultipartUploadCommand({
    Bucket: env.R2_BUCKET_NAME || 'third-ai-commercials',
    Key: fileKey,
    ContentType: fileType
  });

  const response = await s3.send(command);
  const bucketPublicUrl = env.R2_PUBLIC_URL || '';
  const cleanPublicUrl = bucketPublicUrl.endsWith('/') ? bucketPublicUrl.slice(0, -1) : bucketPublicUrl;
  const publicUrl = `${cleanPublicUrl}/${fileKey}`;

  return {
    uploadId: response.UploadId,
    key: fileKey,
    publicUrl
  };
};

export const getMultipartPresignedUrl = async (key, uploadId, partNumber, env) => {
  const s3 = getS3Client(env);

  const command = new UploadPartCommand({
    Bucket: env.R2_BUCKET_NAME || 'third-ai-commercials',
    Key: key,
    UploadId: uploadId,
    PartNumber: Number(partNumber)
  });

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return presignedUrl;
};

export const completeMultipartUpload = async (key, uploadId, parts, env) => {
  const s3 = getS3Client(env);
  const sortedParts = parts.sort((a, b) => a.PartNumber - b.PartNumber);

  const command = new CompleteMultipartUploadCommand({
    Bucket: env.R2_BUCKET_NAME || 'third-ai-commercials',
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: sortedParts
    }
  });

  const response = await s3.send(command);
  return response;
};
