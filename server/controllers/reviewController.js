import Review from '../models/Review.js';
import { uploadMediaToCloudinary, deleteMediaFromCloudinary } from '../services/cloudinaryService.js';
import mongoose from 'mongoose';
import { fallback } from '../utils/fallbackDb.js';

export const getReviews = async (req, res, next) => {
  try {
    const { includeHidden } = req.query;
    if (!process.env.MONGO_URI) {
      let reviews = fallback.getReviews();
      if (includeHidden !== 'true') {
        reviews = reviews.filter(r => !r.hidden);
      }
      return res.json({ success: true, count: reviews.length, data: reviews });
    }

    let query = {};
    if (includeHidden !== 'true') {
      query.hidden = { $ne: true };
    }
    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { name, company, rating, review, customerImage } = req.body;
    let finalImage = customerImage || '';
    let publicId = '';

    if (req.file) {
      const uploaded = await uploadMediaToCloudinary(req.file.path, 'third-ai/reviews', 'image');
      finalImage = uploaded.secure_url;
      publicId = uploaded.public_id;
    }

    if (!process.env.MONGO_URI) {
      const newReview = fallback.createReview({
        name,
        company,
        rating: Number(rating) || 5,
        review,
        customerImage: finalImage,
        customerImagePublicId: publicId,
        hidden: false
      });
      return res.status(201).json({ success: true, data: newReview });
    }

    const newReview = await Review.create({
      name,
      company,
      rating: Number(rating) || 5,
      review,
      customerImage: finalImage,
      customerImagePublicId: publicId
    });

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { name, company, rating, review, hidden, customerImage } = req.body;

    if (!process.env.MONGO_URI) {
      let reviewItem = fallback.getReviews().find(r => r._id === req.params.id);
      if (!reviewItem) return res.status(404).json({ success: false, message: 'Review not found' });

      let updateData = {};
      if (name) updateData.name = name;
      if (company) updateData.company = company;
      if (rating) updateData.rating = Number(rating);
      if (review) updateData.review = review;
      if (hidden !== undefined) updateData.hidden = hidden === 'true' || hidden === true;
      if (customerImage) updateData.customerImage = customerImage;

      if (req.file) {
        const uploaded = await uploadMediaToCloudinary(req.file.path, 'third-ai/reviews', 'image');
        updateData.customerImage = uploaded.secure_url;
        updateData.customerImagePublicId = uploaded.public_id;
      }

      const updatedReview = fallback.updateReview(req.params.id, updateData);
      return res.json({ success: true, data: updatedReview });
    }

    let reviewItem = await Review.findById(req.params.id);
    if (!reviewItem) return res.status(404).json({ success: false, message: 'Review not found' });

    if (name) reviewItem.name = name;
    if (company) reviewItem.company = company;
    if (rating) reviewItem.rating = Number(rating);
    if (review) reviewItem.review = review;
    if (hidden !== undefined) reviewItem.hidden = hidden === 'true' || hidden === true;
    if (customerImage) reviewItem.customerImage = customerImage;

    if (req.file) {
      if (reviewItem.customerImagePublicId) {
        await deleteMediaFromCloudinary(reviewItem.customerImagePublicId, 'image');
      }
      const uploaded = await uploadMediaToCloudinary(req.file.path, 'third-ai/reviews', 'image');
      reviewItem.customerImage = uploaded.secure_url;
      reviewItem.customerImagePublicId = uploaded.public_id;
    }

    await reviewItem.save();
    res.json({ success: true, data: reviewItem });
  } catch (error) {
    next(error);
  }
};

export const toggleHideReview = async (req, res, next) => {
  try {
    if (!process.env.MONGO_URI) {
      let reviewItem = fallback.getReviews().find(r => r._id === req.params.id);
      if (!reviewItem) return res.status(404).json({ success: false, message: 'Review not found' });

      const updatedReview = fallback.updateReview(req.params.id, { hidden: !reviewItem.hidden });
      return res.json({ success: true, data: updatedReview, message: `Review ${updatedReview.hidden ? 'hidden' : 'visible'}` });
    }

    const reviewItem = await Review.findById(req.params.id);
    if (!reviewItem) return res.status(404).json({ success: false, message: 'Review not found' });

    reviewItem.hidden = !reviewItem.hidden;
    await reviewItem.save();

    res.json({ success: true, data: reviewItem, message: `Review ${reviewItem.hidden ? 'hidden' : 'visible'}` });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    if (!process.env.MONGO_URI) {
      const reviewItem = fallback.getReviews().find(r => r._id === req.params.id);
      if (!reviewItem) return res.status(404).json({ success: false, message: 'Review not found' });

      fallback.deleteReview(req.params.id);
      return res.json({ success: true, message: 'Review deleted successfully' });
    }

    const reviewItem = await Review.findById(req.params.id);
    if (!reviewItem) return res.status(404).json({ success: false, message: 'Review not found' });

    if (reviewItem.customerImagePublicId) {
      await deleteMediaFromCloudinary(reviewItem.customerImagePublicId, 'image');
    }

    await reviewItem.deleteOne();
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
