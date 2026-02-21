import mongoose from 'mongoose';

const classRoomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    academicYear: { type: String, required: true },
    roomNumber: String,
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    subjects: [{ type: String }],
    schedule: [
      {
        day: String,
        period: Number,
        subject: String,
        startTime: String,
        endTime: String
      }
    ]
  },
  { timestamps: true }
);

export const ClassRoom = mongoose.model('ClassRoom', classRoomSchema);
