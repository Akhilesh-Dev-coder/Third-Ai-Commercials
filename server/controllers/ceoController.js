import CEO from '../models/CEO.js';
import { uploadMediaToCloudinary, deleteMediaFromCloudinary } from '../services/cloudinaryService.js';

export const getCEOs = async (req, res, next) => {
  try {
    const ceos = await CEO.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: ceos.length, data: ceos });
  } catch (error) {
    next(error);
  }
};

export const createCEO = async (req, res, next) => {
  try {
    const { name, position, bio, linkedin, order, image } = req.body;
    let finalImage = image || '';
    let publicId = '';

    if (req.file) {
      const uploaded = await uploadMediaToCloudinary(req.file.path, 'third-ai/ceos', 'image');
      finalImage = uploaded.secure_url;
      publicId = uploaded.public_id;
    }

    const ceo = await CEO.create({
      name,
      position,
      bio,
      linkedin,
      order: Number(order) || 0,
      image: finalImage,
      imagePublicId: publicId
    });

    res.status(201).json({ success: true, data: ceo });
  } catch (error) {
    next(error);
  }
};

export const updateCEO = async (req, res, next) => {
  try {
    let ceo = await CEO.findById(req.params.id);
    if (!ceo) return res.status(404).json({ success: false, message: 'CEO profile not found' });

    const { name, position, bio, linkedin, order, image } = req.body;

    if (name) ceo.name = name;
    if (position) ceo.position = position;
    if (bio) ceo.bio = bio;
    if (linkedin !== undefined) ceo.linkedin = linkedin;
    if (order !== undefined) ceo.order = Number(order);
    if (image) ceo.image = image;

    if (req.file) {
      if (ceo.imagePublicId) {
        await deleteMediaFromCloudinary(ceo.imagePublicId, 'image');
      }
      const uploaded = await uploadMediaToCloudinary(req.file.path, 'third-ai/ceos', 'image');
      ceo.image = uploaded.secure_url;
      ceo.imagePublicId = uploaded.public_id;
    }

    await ceo.save();
    res.json({ success: true, data: ceo });
  } catch (error) {
    next(error);
  }
};

export const deleteCEO = async (req, res, next) => {
  try {
    const ceo = await CEO.findById(req.params.id);
    if (!ceo) return res.status(404).json({ success: false, message: 'CEO profile not found' });

    if (ceo.imagePublicId) {
      await deleteMediaFromCloudinary(ceo.imagePublicId, 'image');
    }

    await ceo.deleteOne();
    res.json({ success: true, message: 'CEO deleted successfully' });
  } catch (error) {
    next(error);
  }
};
