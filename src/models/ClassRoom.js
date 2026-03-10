import mongoose from 'mongoose';

const classRoomSchema = new mongoose.Schema(
  {
    schoolId: { type: String, index: true },
    name: { type: String, required: true },
    academicYear: { type: String, required: true },
    roomNumber: { type: String, default: '' },
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    schedule: [
      {
        day: String,
        period: Number,
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        startTime: String,
        endTime: String
      }
    ]
  },
  { timestamps: true }
);

export const ClassRoom = mongoose.model('ClassRoom', classRoomSchema);
