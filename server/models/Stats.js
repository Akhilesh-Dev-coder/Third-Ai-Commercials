import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema(
  {
    businessesServed: { type: Number, default: 150 },
    commercialsCreated: { type: Number, default: 420 },
    viewsGenerated: { type: String, default: '85M+' },
    countriesReached: { type: Number, default: 35 }
  },
  { timestamps: true }
);

export default mongoose.models.Stats || mongoose.model('Stats', statsSchema);
