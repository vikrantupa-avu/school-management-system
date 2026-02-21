import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    classRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassRoom', required: true },
    subject: { type: String, required: true },
    examType: { type: String, enum: ['quiz', 'midterm', 'final', 'assignment', 'project'], required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    gradeLetter: String,
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    comments: String
  },
  { timestamps: true }
);

export const Grade = mongoose.model('Grade', gradeSchema);
