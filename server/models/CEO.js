import mongoose from 'mongoose';

const ceoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.CEO || mongoose.model('CEO', ceoSchema);
