import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    audience: [{ type: String, enum: ['all', 'students', 'teachers', 'parents', 'staff'] }],
    publishDate: { type: Date, default: Date.now },
    expiresAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' }
  },
  { timestamps: true }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);
