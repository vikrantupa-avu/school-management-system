import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema(
  {
    schoolId: { type: String, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    term: { type: String, required: true },
    academicYear: { type: String, required: true },
    tuition: { type: Number, required: true },
    transport: { type: Number, default: 0 },
    books: { type: Number, default: 0 },
    miscellaneous: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    dueDate: Date,
    status: { type: String, enum: ['paid', 'partial', 'unpaid'], default: 'unpaid' }
  },
  { timestamps: true }
);

export const Fee = mongoose.model('Fee', feeSchema);
