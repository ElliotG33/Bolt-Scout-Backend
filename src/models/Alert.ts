import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    email: { type: String, required: true },
    keywords: [{ type: String, required: true }],
    antiKeywords: [{ type: String }],
    frequency: { type: Number, required: true }, // In hours
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    lastRun: { type: Date },
  },
  { timestamps: true }
);

export const Alert = mongoose.model('Alert', AlertSchema);
