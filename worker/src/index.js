import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign, verify } from 'hono/jwt';
import { ObjectId } from 'mongodb';
import { getCollection, setGlobalEnv } from './db.js';
import { 
  startMultipartUpload, 
  getMultipartPresignedUrl, 
  completeMultipartUpload 
} from './r2.js';
import { 
  uploadToCloudinary, 
  deleteFromCloudinary 
} from './cloudinary.js';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const app = new Hono();

// Bind environment variables to global database configuration on each request
app.use('*', async (c, next) => {
  setGlobalEnv(c.env);
  await next();
});

// CORS configuration matching express configuration
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}));

// Error handling middleware
app.onError((err, c) => {
  console.error('[Worker Error]', err);
  return c.json({
    success: false,
    message: err.message || 'Internal Server Error'
  }, 500);
});

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Third AI Commercials API (Cloudflare Worker)'
  });
});

// Authentication middleware helper
const getJwtSecret = (env) => env.JWT_SECRET || 'third_ai_commercials_jwt_secret_key_2026_luxury_agency';

async function auth(c, next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, message: 'Not authorized, no token provided' }, 401);
  }
  const token = authHeader.split(' ')[1];
  try {
    const secret = getJwtSecret(c.env);
    const decoded = await verify(token, secret);
    c.set('user', decoded);
    await next();
  } catch (err) {
    return c.json({ success: false, message: 'Not authorized, invalid token' }, 401);
  }
}

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) {
    return c.json({ success: false, message: 'Please provide email and password' }, 400);
  }

  const adminEmail = c.env.ADMIN_EMAIL || 'admin@thirdai.com';
  const adminPassword = c.env.ADMIN_PASSWORD || 'admin123';

  if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
    const secret = getJwtSecret(c.env);
    const token = await sign({ id: 'env_admin_user', role: 'admin' }, secret);
    
    return c.json({
      success: true,
      user: {
        id: 'env_admin_user',
        name: 'Third AI Admin',
        email: adminEmail,
        role: 'admin'
      },
      token
    });
  }

  // Fallback check in MongoDB users database
  const usersCol = await getCollection(c.env.MONGO_URI, 'users');
  const user = await usersCol.findOne({ email: email.toLowerCase() });
  
  if (user) {
    const bcrypt = await import('bcryptjs');
    if (bcrypt.compareSync(password, user.password)) {
      const secret = getJwtSecret(c.env);
      const token = await sign({ id: user._id.toString(), role: user.role }, secret);
      return c.json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    }
  }

  return c.json({ success: false, message: 'Invalid credentials' }, 401);
});

app.get('/api/auth/me', auth, async (c) => {
  const decoded = c.get('user');
  
  if (decoded.id === 'env_admin_user') {
    return c.json({
      success: true,
      user: {
        id: 'env_admin_user',
        name: 'Third AI Admin',
        email: c.env.ADMIN_EMAIL || 'admin@thirdai.com',
        role: 'admin'
      }
    });
  }

  const usersCol = await getCollection(c.env.MONGO_URI, 'users');
  const user = await usersCol.findOne({ _id: new ObjectId(decoded.id) });
  if (!user) {
    return c.json({ success: false, message: 'User not found' }, 404);
  }

  return c.json({
    success: true,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// ----------------------------------------------------
// PROJECT ENDPOINTS
// ----------------------------------------------------

app.get('/api/projects', async (c) => {
  const category = c.req.query('category');
  const featured = c.req.query('featured');

  const projectsCol = await getCollection(c.env.MONGO_URI, 'projects');
  
  let query = {};
  if (category && category !== 'All') query.category = category;
  if (featured === 'true') query.featured = true;

  const projects = await projectsCol.find(query).sort({ createdAt: -1 }).toArray();
  return c.json({ success: true, count: projects.length, data: projects });
});

app.get('/api/projects/:id', async (c) => {
  const id = c.req.param('id');
  const projectsCol = await getCollection(c.env.MONGO_URI, 'projects');
  const project = await projectsCol.findOne({ _id: new ObjectId(id) });
  if (!project) {
    return c.json({ success: false, message: 'Project not found' }, 404);
  }
  return c.json({ success: true, data: project });
});

app.post('/api/projects/multipart/start', auth, async (c) => {
  const { fileName, fileType } = await c.req.json();
  if (!fileName || !fileType) {
    return c.json({ success: false, message: 'fileName and fileType are required' }, 400);
  }
  const result = await startMultipartUpload(fileName, fileType, c.env);
  return c.json({ success: true, ...result });
});

app.post('/api/projects/multipart/presigned-url', auth, async (c) => {
  const { key, uploadId, partNumber } = await c.req.json();
  if (!key || !uploadId || !partNumber) {
    return c.json({ success: false, message: 'key, uploadId, and partNumber are required' }, 400);
  }
  const url = await getMultipartPresignedUrl(key, uploadId, partNumber, c.env);
  return c.json({ success: true, presignedUrl: url });
});

app.post('/api/projects/multipart/complete', auth, async (c) => {
  const { key, uploadId, parts } = await c.req.json();
  if (!key || !uploadId || !parts) {
    return c.json({ success: false, message: 'key, uploadId, and parts are required' }, 400);
  }
  const result = await completeMultipartUpload(key, uploadId, parts, c.env);
  return c.json({ success: true, data: result });
});

app.post('/api/projects', auth, async (c) => {
  const body = await c.req.parseBody();
  const { title, description, category, client, technology, featured, liveUrl, githubUrl, videoUrl, thumbnailUrl, videoPublicId } = body;
  
  if (!title || !category) {
    return c.json({ success: false, message: 'Title and category are required' }, 400);
  }

  let finalThumbnailUrl = thumbnailUrl || '';
  let thumbnailPublicId = '';

  if (body.thumbnail && body.thumbnail instanceof File) {
    const uploaded = await uploadToCloudinary(body.thumbnail, 'third-ai/projects', 'image', c.env);
    finalThumbnailUrl = uploaded.secure_url;
    thumbnailPublicId = uploaded.public_id;
  }

  const techArray = typeof technology === 'string' 
    ? technology.split(',').map((t) => t.trim()).filter(Boolean) 
    : [];

  const projectsCol = await getCollection(c.env.MONGO_URI, 'projects');
  
  const projectData = {
    title,
    description: description || '',
    category,
    client: client || '',
    technology: techArray,
    featured: featured === 'true' || featured === true,
    liveUrl: liveUrl || '',
    githubUrl: githubUrl || '',
    videoUrl: videoUrl || '',
    videoPublicId: videoPublicId || '',
    thumbnailUrl: finalThumbnailUrl,
    thumbnailPublicId,
    createdAt: new Date()
  };

  const result = await projectsCol.insertOne(projectData);
  return c.json({ success: true, data: { ...projectData, _id: result.insertedId } }, 201);
});

app.put('/api/projects/:id', auth, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.parseBody();
  const { title, description, category, client, technology, featured, liveUrl, githubUrl, videoUrl, thumbnailUrl, videoPublicId } = body;

  const projectsCol = await getCollection(c.env.MONGO_URI, 'projects');
  const project = await projectsCol.findOne({ _id: new ObjectId(id) });
  if (!project) {
    return c.json({ success: false, message: 'Project not found' }, 404);
  }

  let updateData = {};
  if (title) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (category) updateData.category = category;
  if (client !== undefined) updateData.client = client;
  if (liveUrl !== undefined) updateData.liveUrl = liveUrl;
  if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
  if (featured !== undefined) updateData.featured = featured === 'true' || featured === true;
  if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
  if (videoPublicId !== undefined) updateData.videoPublicId = videoPublicId;

  if (body.thumbnail && body.thumbnail instanceof File) {
    if (project.thumbnailPublicId) {
      await deleteFromCloudinary(project.thumbnailPublicId, 'image', c.env);
    }
    const uploaded = await uploadToCloudinary(body.thumbnail, 'third-ai/projects', 'image', c.env);
    updateData.thumbnailUrl = uploaded.secure_url;
    updateData.thumbnailPublicId = uploaded.public_id;
  } else if (thumbnailUrl !== undefined) {
    updateData.thumbnailUrl = thumbnailUrl;
  }

  if (technology !== undefined) {
    updateData.technology = typeof technology === 'string'
      ? technology.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
  }

  await projectsCol.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  const updatedProject = await projectsCol.findOne({ _id: new ObjectId(id) });
  return c.json({ success: true, data: updatedProject });
});

app.delete('/api/projects/:id', auth, async (c) => {
  const id = c.req.param('id');
  const projectsCol = await getCollection(c.env.MONGO_URI, 'projects');
  const project = await projectsCol.findOne({ _id: new ObjectId(id) });
  if (!project) {
    return c.json({ success: false, message: 'Project not found' }, 404);
  }

  if (project.thumbnailPublicId) {
    await deleteFromCloudinary(project.thumbnailPublicId, 'image', c.env);
  }

  // Delete video from R2 if R2 credentials exist
  if (project.videoPublicId && c.env.CLOUDFLARE_ACCOUNT_ID && c.env.R2_ACCESS_KEY_ID && c.env.R2_SECRET_ACCESS_KEY) {
    try {
      const s3 = new S3Client({
        endpoint: `https://${c.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: c.env.R2_ACCESS_KEY_ID,
          secretAccessKey: c.env.R2_SECRET_ACCESS_KEY
        },
        region: 'auto',
        signatureVersion: 'v4'
      });
      const deleteCommand = new DeleteObjectCommand({
        Bucket: c.env.R2_BUCKET_NAME || 'third-ai-commercials',
        Key: project.videoPublicId
      });
      await s3.send(deleteCommand);
    } catch (err) {
      console.warn('[R2 Delete Warning] Failed to delete key:', project.videoPublicId, err);
    }
  }

  await projectsCol.deleteOne({ _id: new ObjectId(id) });
  return c.json({ success: true, message: 'Project deleted successfully' });
});

// ----------------------------------------------------
// SERVICE ENDPOINTS
// ----------------------------------------------------

app.get('/api/services', async (c) => {
  const servicesCol = await getCollection(c.env.MONGO_URI, 'services');
  const services = await servicesCol.find().sort({ order: 1, createdAt: -1 }).toArray();
  return c.json({ success: true, count: services.length, data: services });
});

app.post('/api/services', auth, async (c) => {
  const { title, description, icon, cta, order } = await c.req.json();
  const servicesCol = await getCollection(c.env.MONGO_URI, 'services');
  const service = {
    title,
    description,
    icon,
    cta,
    order: Number(order) || 0,
    createdAt: new Date()
  };
  const result = await servicesCol.insertOne(service);
  return c.json({ success: true, data: { ...service, _id: result.insertedId } }, 201);
});

app.put('/api/services/:id', auth, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const servicesCol = await getCollection(c.env.MONGO_URI, 'services');
  
  let updateData = {};
  if (body.title) updateData.title = body.title;
  if (body.description) updateData.description = body.description;
  if (body.icon) updateData.icon = body.icon;
  if (body.cta) updateData.cta = body.cta;
  if (body.order !== undefined) updateData.order = Number(body.order);

  await servicesCol.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  const updated = await servicesCol.findOne({ _id: new ObjectId(id) });
  return c.json({ success: true, data: updated });
});

app.delete('/api/services/:id', auth, async (c) => {
  const id = c.req.param('id');
  const servicesCol = await getCollection(c.env.MONGO_URI, 'services');
  await servicesCol.deleteOne({ _id: new ObjectId(id) });
  return c.json({ success: true, message: 'Service deleted successfully' });
});

// ----------------------------------------------------
// REVIEW ENDPOINTS
// ----------------------------------------------------

app.get('/api/reviews', async (c) => {
  const includeHidden = c.req.query('includeHidden');
  const reviewsCol = await getCollection(c.env.MONGO_URI, 'reviews');
  
  let query = {};
  if (includeHidden !== 'true') {
    query.hidden = { $ne: true };
  }
  const reviews = await reviewsCol.find(query).sort({ createdAt: -1 }).toArray();
  return c.json({ success: true, count: reviews.length, data: reviews });
});

app.post('/api/reviews', auth, async (c) => {
  const body = await c.req.parseBody();
  const { name, company, rating, review, customerImage } = body;

  let finalImage = customerImage || '';
  let publicId = '';

  if (body.customerImageFile && body.customerImageFile instanceof File) {
    const uploaded = await uploadToCloudinary(body.customerImageFile, 'third-ai/reviews', 'image', c.env);
    finalImage = uploaded.secure_url;
    publicId = uploaded.public_id;
  }

  const reviewsCol = await getCollection(c.env.MONGO_URI, 'reviews');
  const newReview = {
    name,
    company,
    rating: Number(rating) || 5,
    review,
    customerImage: finalImage,
    customerImagePublicId: publicId,
    hidden: false,
    createdAt: new Date()
  };

  const result = await reviewsCol.insertOne(newReview);
  return c.json({ success: true, data: { ...newReview, _id: result.insertedId } }, 201);
});

app.put('/api/reviews/:id', auth, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.parseBody();
  const { name, company, rating, review, hidden, customerImage } = body;

  const reviewsCol = await getCollection(c.env.MONGO_URI, 'reviews');
  const reviewItem = await reviewsCol.findOne({ _id: new ObjectId(id) });
  if (!reviewItem) return c.json({ success: false, message: 'Review not found' }, 404);

  let updateData = {};
  if (name) updateData.name = name;
  if (company) updateData.company = company;
  if (rating) updateData.rating = Number(rating);
  if (review) updateData.review = review;
  if (hidden !== undefined) updateData.hidden = hidden === 'true' || hidden === true;

  if (body.customerImageFile && body.customerImageFile instanceof File) {
    if (reviewItem.customerImagePublicId) {
      await deleteFromCloudinary(reviewItem.customerImagePublicId, 'image', c.env);
    }
    const uploaded = await uploadToCloudinary(body.customerImageFile, 'third-ai/reviews', 'image', c.env);
    updateData.customerImage = uploaded.secure_url;
    updateData.customerImagePublicId = uploaded.public_id;
  } else if (customerImage !== undefined) {
    updateData.customerImage = customerImage;
  }

  await reviewsCol.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  const updated = await reviewsCol.findOne({ _id: new ObjectId(id) });
  return c.json({ success: true, data: updated });
});

app.put('/api/reviews/:id/toggle-hide', auth, async (c) => {
  const id = c.req.param('id');
  const reviewsCol = await getCollection(c.env.MONGO_URI, 'reviews');
  const reviewItem = await reviewsCol.findOne({ _id: new ObjectId(id) });
  if (!reviewItem) return c.json({ success: false, message: 'Review not found' }, 404);

  const updatedHidden = !reviewItem.hidden;
  await reviewsCol.updateOne({ _id: new ObjectId(id) }, { $set: { hidden: updatedHidden } });
  
  return c.json({ 
    success: true, 
    data: { ...reviewItem, hidden: updatedHidden }, 
    message: `Review ${updatedHidden ? 'hidden' : 'visible'}` 
  });
});

app.delete('/api/reviews/:id', auth, async (c) => {
  const id = c.req.param('id');
  const reviewsCol = await getCollection(c.env.MONGO_URI, 'reviews');
  const reviewItem = await reviewsCol.findOne({ _id: new ObjectId(id) });
  if (!reviewItem) return c.json({ success: false, message: 'Review not found' }, 404);

  if (reviewItem.customerImagePublicId) {
    await deleteFromCloudinary(reviewItem.customerImagePublicId, 'image', c.env);
  }

  await reviewsCol.deleteOne({ _id: new ObjectId(id) });
  return c.json({ success: true, message: 'Review deleted successfully' });
});

// ----------------------------------------------------
// CONTACT ENDPOINTS
// ----------------------------------------------------

app.get('/api/contacts', auth, async (c) => {
  const contactsCol = await getCollection(c.env.MONGO_URI, 'contacts');
  const contacts = await contactsCol.find().sort({ createdAt: -1 }).toArray();
  return c.json({ success: true, count: contacts.length, data: contacts });
});

app.post('/api/contacts', async (c) => {
  const { name, email, phone, business, budget, message } = await c.req.json();
  if (!name || !email || !message) {
    return c.json({ success: false, message: 'Name, email, and message are required' }, 400);
  }

  const contactsCol = await getCollection(c.env.MONGO_URI, 'contacts');
  const newContact = {
    name,
    email,
    phone: phone || '',
    business: business || '',
    budget: budget || '',
    message,
    status: 'unread',
    createdAt: new Date()
  };

  const result = await contactsCol.insertOne(newContact);
  return c.json({ 
    success: true, 
    message: 'Inquiry submitted successfully! Our AI production team will contact you shortly.',
    data: { ...newContact, _id: result.insertedId } 
  }, 201);
});

app.put('/api/contacts/:id/status', auth, async (c) => {
  const id = c.req.param('id');
  const contactsCol = await getCollection(c.env.MONGO_URI, 'contacts');
  const contact = await contactsCol.findOne({ _id: new ObjectId(id) });
  if (!contact) return c.json({ success: false, message: 'Inquiry not found' }, 404);

  const newStatus = contact.status === 'contacted' ? 'unread' : 'contacted';
  await contactsCol.updateOne({ _id: new ObjectId(id) }, { $set: { status: newStatus } });
  
  return c.json({ success: true, data: { ...contact, status: newStatus } });
});

app.delete('/api/contacts/:id', auth, async (c) => {
  const id = c.req.param('id');
  const contactsCol = await getCollection(c.env.MONGO_URI, 'contacts');
  const result = await contactsCol.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) return c.json({ success: false, message: 'Inquiry not found' }, 404);
  return c.json({ success: true, message: 'Inquiry deleted successfully' });
});

// ----------------------------------------------------
// CEO / TEAM ENDPOINTS
// ----------------------------------------------------

app.get('/api/ceos', async (c) => {
  const ceosCol = await getCollection(c.env.MONGO_URI, 'ceos');
  const ceos = await ceosCol.find().sort({ order: 1, createdAt: 1 }).toArray();
  return c.json({ success: true, count: ceos.length, data: ceos });
});

app.post('/api/ceos', auth, async (c) => {
  const body = await c.req.parseBody();
  const { name, position, bio, linkedin, order, image } = body;

  let finalImage = image || '';
  let publicId = '';

  if (body.ceoImageFile && body.ceoImageFile instanceof File) {
    const uploaded = await uploadToCloudinary(body.ceoImageFile, 'third-ai/ceos', 'image', c.env);
    finalImage = uploaded.secure_url;
    publicId = uploaded.public_id;
  }

  const ceosCol = await getCollection(c.env.MONGO_URI, 'ceos');
  const ceoData = {
    name,
    position,
    bio: bio || '',
    linkedin: linkedin || '',
    order: Number(order) || 0,
    image: finalImage,
    imagePublicId: publicId,
    createdAt: new Date()
  };

  const result = await ceosCol.insertOne(ceoData);
  return c.json({ success: true, data: { ...ceoData, _id: result.insertedId } }, 201);
});

app.put('/api/ceos/:id', auth, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.parseBody();
  const { name, position, bio, linkedin, order, image } = body;

  const ceosCol = await getCollection(c.env.MONGO_URI, 'ceos');
  const ceo = await ceosCol.findOne({ _id: new ObjectId(id) });
  if (!ceo) return c.json({ success: false, message: 'CEO profile not found' }, 404);

  let updateData = {};
  if (name) updateData.name = name;
  if (position) updateData.position = position;
  if (bio) updateData.bio = bio;
  if (linkedin !== undefined) updateData.linkedin = linkedin;
  if (order !== undefined) updateData.order = Number(order);

  if (body.ceoImageFile && body.ceoImageFile instanceof File) {
    if (ceo.imagePublicId) {
      await deleteFromCloudinary(ceo.imagePublicId, 'image', c.env);
    }
    const uploaded = await uploadToCloudinary(body.ceoImageFile, 'third-ai/ceos', 'image', c.env);
    updateData.image = uploaded.secure_url;
    updateData.imagePublicId = uploaded.public_id;
  } else if (image !== undefined) {
    updateData.image = image;
  }

  await ceosCol.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  const updated = await ceosCol.findOne({ _id: new ObjectId(id) });
  return c.json({ success: true, data: updated });
});

app.delete('/api/ceos/:id', auth, async (c) => {
  const id = c.req.param('id');
  const ceosCol = await getCollection(c.env.MONGO_URI, 'ceos');
  const ceo = await ceosCol.findOne({ _id: new ObjectId(id) });
  if (!ceo) return c.json({ success: false, message: 'CEO profile not found' }, 404);

  if (ceo.imagePublicId) {
    await deleteFromCloudinary(ceo.imagePublicId, 'image', c.env);
  }

  await ceosCol.deleteOne({ _id: new ObjectId(id) });
  return c.json({ success: true, message: 'CEO profile deleted successfully' });
});

// ----------------------------------------------------
// STATS ENDPOINTS
// ----------------------------------------------------

app.get('/api/stats', async (c) => {
  const statsCol = await getCollection(c.env.MONGO_URI, 'stats');
  let stats = await statsCol.findOne();
  if (!stats) {
    stats = {
      businessesServed: 180,
      commercialsCreated: 540,
      viewsGenerated: '120M+',
      countriesReached: 42
    };
    const result = await statsCol.insertOne(stats);
    stats._id = result.insertedId;
  }
  return c.json({ success: true, data: stats });
});

app.put('/api/stats', auth, async (c) => {
  const body = await c.req.json();
  const statsCol = await getCollection(c.env.MONGO_URI, 'stats');
  
  let stats = await statsCol.findOne();
  if (!stats) {
    await statsCol.insertOne(body);
  } else {
    await statsCol.updateOne({ _id: stats._id }, { $set: body });
  }

  const updated = await statsCol.findOne();
  return c.json({ success: true, data: updated });
});

export default app;
