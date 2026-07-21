import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    business: { type: String, default: '' },
    budget: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, enum: ['unread', 'contacted'], default: 'unread' }
  },
  { timestamps: true }
);

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);
