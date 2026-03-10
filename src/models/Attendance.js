import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    schoolId: { type: String, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    classRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassRoom', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
    remarks: { type: String, default: '' },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
  },
  { timestamps: true }
);

attendanceSchema.index({ student: 1, subject: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
