import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    review: { type: String, required: true },
    customerImage: { type: String, default: '' },
    customerImagePublicId: { type: String, default: '' },
    hidden: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
