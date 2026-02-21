import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    department: { type: String, required: true },
    subjects: [{ type: String }],
    phone: String,
    qualification: String,
    joiningDate: Date,
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Teacher = mongoose.model('Teacher', teacherSchema);
