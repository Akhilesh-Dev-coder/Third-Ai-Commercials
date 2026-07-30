async function sha1(string) {
  const buffer = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function uploadToCloudinary(file, folder, resourceType, env) {
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials are not configured in environment variables');
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signatureParams = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = await sha1(signatureParams);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', apiKey);
  formData.append('signature', signature);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return {
    secure_url: data.secure_url,
    public_id: data.public_id
  };
}

export async function deleteFromCloudinary(publicId, resourceType, env) {
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret || !publicId || publicId.startsWith('local_')) {
    return true;
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signatureParams = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = await sha1(signatureParams);

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', apiKey);
  formData.append('signature', signature);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });

  return res.ok;
}
