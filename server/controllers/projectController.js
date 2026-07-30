import Project from '../models/Project.js';
import { uploadMediaToCloudinary, deleteMediaFromCloudinary } from '../services/cloudinaryService.js';
import mongoose from 'mongoose';
import { fallback } from '../utils/fallbackDb.js';
import { transcodeAudioToAAC } from '../services/r2Service.js';

const extractR2Key = (url) => {
  const publicUrl = process.env.R2_PUBLIC_URL || '';
  const cleanPublicUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
  if (url && url.startsWith(cleanPublicUrl)) {
    return url.replace(cleanPublicUrl + '/', '');
  }
  return null;
};

export const getProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    if (!process.env.MONGO_URI) {
      const projects = fallback.getProjects(category, featured);
      return res.json({ success: true, count: projects.length, data: projects });
    }

    let query = {};
    if (category && category !== 'All') query.category = category;
    if (featured === 'true') query.featured = true;

    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    if (!process.env.MONGO_URI) {
      const project = fallback.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      return res.json({ success: true, data: project });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { title, description, category, client, technology, featured, liveUrl, githubUrl, videoUrl, thumbnailUrl } = req.body;

    let finalVideoUrl = videoUrl || '';
    let videoPublicId = '';
    let finalThumbnailUrl = thumbnailUrl || '';
    let thumbnailPublicId = '';

    if (req.files) {
      if (req.files.video && req.files.video[0]) {
        const uploadedVid = await uploadMediaToCloudinary(req.files.video[0].path, 'third-ai/projects', 'video');
        finalVideoUrl = uploadedVid.secure_url;
        videoPublicId = uploadedVid.public_id;
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const uploadedThumb = await uploadMediaToCloudinary(req.files.thumbnail[0].path, 'third-ai/projects', 'image');
        finalThumbnailUrl = uploadedThumb.secure_url;
        thumbnailPublicId = uploadedThumb.public_id;
      }
    }

    const techArray = Array.isArray(technology)
      ? technology
      : typeof technology === 'string'
      ? technology.split(',').map((t) => t.trim())
      : [];

    const r2Key = extractR2Key(finalVideoUrl);
    if (r2Key) {
      transcodeAudioToAAC(r2Key).catch((err) => {
        console.error('[Transcode Trigger Error] Failed to start transcode in background:', err);
      });
    }

    if (!process.env.MONGO_URI) {
      const project = fallback.createProject({
        title,
        description,
        category,
        client,
        technology: techArray,
        featured: featured === 'true' || featured === true,
        liveUrl,
        githubUrl,
        videoUrl: finalVideoUrl,
        videoPublicId,
        thumbnailUrl: finalThumbnailUrl,
        thumbnailPublicId
      });
      return res.status(201).json({ success: true, data: project });
    }

    const project = await Project.create({
      title,
      description,
      category,
      client,
      technology: techArray,
      featured: featured === 'true' || featured === true,
      liveUrl,
      githubUrl,
      videoUrl: finalVideoUrl,
      videoPublicId,
      thumbnailUrl: finalThumbnailUrl,
      thumbnailPublicId
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { title, description, category, client, technology, featured, liveUrl, githubUrl, videoUrl, thumbnailUrl } = req.body;

    if (!process.env.MONGO_URI) {
      let project = fallback.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      let updateData = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (category) updateData.category = category;
      if (client) updateData.client = client;
      if (liveUrl !== undefined) updateData.liveUrl = liveUrl;
      if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
      if (featured !== undefined) updateData.featured = featured === 'true' || featured === true;
      if (videoUrl) updateData.videoUrl = videoUrl;
      if (thumbnailUrl) updateData.thumbnailUrl = thumbnailUrl;

      if (technology) {
        updateData.technology = Array.isArray(technology)
          ? technology
          : typeof technology === 'string'
          ? technology.split(',').map((t) => t.trim())
          : project.technology;
      }

      if (req.files) {
        if (req.files.video && req.files.video[0]) {
          const uploadedVid = await uploadMediaToCloudinary(req.files.video[0].path, 'third-ai/projects', 'video');
          updateData.videoUrl = uploadedVid.secure_url;
          updateData.videoPublicId = uploadedVid.public_id;
        }
        if (req.files.thumbnail && req.files.thumbnail[0]) {
          const uploadedThumb = await uploadMediaToCloudinary(req.files.thumbnail[0].path, 'third-ai/projects', 'image');
          updateData.thumbnailUrl = uploadedThumb.secure_url;
          updateData.thumbnailPublicId = uploadedThumb.public_id;
        }
      }

      const updatedProject = fallback.updateProject(req.params.id, updateData);

      // Trigger background audio transcoding if hosted on Cloudflare R2
      const r2Key = extractR2Key(updatedProject.videoUrl);
      if (r2Key) {
        transcodeAudioToAAC(r2Key).catch((err) => {
          console.error('[Transcode Trigger Error] Failed to start transcode in background:', err);
        });
      }

      return res.json({ success: true, data: updatedProject });
    }

    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (client) project.client = client;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (featured !== undefined) project.featured = featured === 'true' || featured === true;
    if (videoUrl) project.videoUrl = videoUrl;
    if (thumbnailUrl) project.thumbnailUrl = thumbnailUrl;

    if (technology) {
      project.technology = Array.isArray(technology)
        ? technology
        : typeof technology === 'string'
        ? technology.split(',').map((t) => t.trim())
        : project.technology;
    }

    if (req.files) {
      if (req.files.video && req.files.video[0]) {
        if (project.videoPublicId) await deleteMediaFromCloudinary(project.videoPublicId, 'video');
        const uploadedVid = await uploadMediaToCloudinary(req.files.video[0].path, 'third-ai/projects', 'video');
        project.videoUrl = uploadedVid.secure_url;
        project.videoPublicId = uploadedVid.public_id;
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        if (project.thumbnailPublicId) await deleteMediaFromCloudinary(project.thumbnailPublicId, 'image');
        const uploadedThumb = await uploadMediaToCloudinary(req.files.thumbnail[0].path, 'third-ai/projects', 'image');
        project.thumbnailUrl = uploadedThumb.secure_url;
        project.thumbnailPublicId = uploadedThumb.public_id;
      }
    }

    // Trigger background audio transcoding if hosted on Cloudflare R2
    const r2Key = extractR2Key(project.videoUrl);
    if (r2Key) {
      transcodeAudioToAAC(r2Key).catch((err) => {
        console.error('[Transcode Trigger Error] Failed to start transcode in background:', err);
      });
    }

    await project.save();
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    if (!process.env.MONGO_URI) {
      const project = fallback.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      fallback.deleteProject(req.params.id);
      return res.json({ success: true, message: 'Project deleted successfully' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.videoPublicId) await deleteMediaFromCloudinary(project.videoPublicId, 'video');
    if (project.thumbnailPublicId) await deleteMediaFromCloudinary(project.thumbnailPublicId, 'image');

    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
