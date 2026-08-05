import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    videoPublicId: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    thumbnailPublicId: { type: String, default: '' },
    category: { type: String, required: true },
    client: { type: String, required: true },
    technology: [{ type: String }],
    featured: { type: Boolean, default: false },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
