import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    schoolId: { type: String, index: true },
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    classRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassRoom' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

subjectSchema.index({ name: 1 });

export const Subject = mongoose.model('Subject', subjectSchema);
