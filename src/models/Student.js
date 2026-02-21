import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema(
  {
    name: String,
    relationship: String,
    phone: String
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    admissionNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: Date,
    classLevel: { type: String, required: true },
    section: String,
    guardianName: String,
    guardianPhone: String,
    address: String,
    emergencyContact: emergencyContactSchema,
    transportRequired: { type: Boolean, default: false },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Student = mongoose.model('Student', studentSchema);
