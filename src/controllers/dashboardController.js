import { Student } from '../models/Student.js';
import { Teacher } from '../models/Teacher.js';
import { ClassRoom } from '../models/ClassRoom.js';
import { Fee } from '../models/Fee.js';
import { Announcement } from '../models/Announcement.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [students, teachers, classes, feeStats, announcements] = await Promise.all([
    Student.countDocuments({ active: true }),
    Teacher.countDocuments({ active: true }),
    ClassRoom.countDocuments(),
    Fee.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: 1 },
          outstanding: { $sum: { $subtract: [{ $add: ['$tuition', '$transport', '$books', '$miscellaneous'] }, '$paidAmount'] } }
        }
      }
    ]),
    Announcement.find().sort({ createdAt: -1 }).limit(5)
  ]);

  res.json({ students, teachers, classes, feeStats, announcements });
});
