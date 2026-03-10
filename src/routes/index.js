import { Router } from 'express';
import authRoutes from './authRoutes.js';
import lookupRoutes from './lookupRoutes.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { buildCrudController } from '../controllers/crudController.js';
import { buildCrudRouter } from './crudRouter.js';
import { Student } from '../models/Student.js';
import { Teacher } from '../models/Teacher.js';
import { ClassRoom } from '../models/ClassRoom.js';
import { Subject } from '../models/Subject.js';
import { Attendance } from '../models/Attendance.js';
import { Grade } from '../models/Grade.js';
import { Fee } from '../models/Fee.js';
import { Announcement } from '../models/Announcement.js';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);

router.use(authenticate);

router.get('/dashboard', authorize('admin', 'finance', 'staff'), getDashboardStats);
router.use('/lookups', authorize('admin', 'staff', 'teacher', 'finance'), lookupRoutes);

router.use(
  '/students',
  authorize('admin', 'staff'),
  buildCrudRouter(buildCrudController(Student, { populate: 'user', searchableFields: ['firstName', 'lastName', 'admissionNumber'] }))
);
router.use(
  '/teachers',
  authorize('admin', 'staff'),
  buildCrudRouter(buildCrudController(Teacher, { populate: 'user subjects', searchableFields: ['firstName', 'lastName', 'employeeId'] }))
);
router.use(
  '/classes',
  authorize('admin', 'staff', 'teacher'),
  buildCrudRouter(buildCrudController(ClassRoom, { populate: 'classTeacher subjects', searchableFields: ['name', 'academicYear'] }))
);
router.use(
  '/subjects',
  authorize('admin', 'staff', 'teacher'),
  buildCrudRouter(buildCrudController(Subject, { populate: 'classRoom teacher', searchableFields: ['name', 'code'] }))
);
router.use(
  '/attendance',
  authorize('admin', 'staff', 'teacher'),
  buildCrudRouter(buildCrudController(Attendance, { populate: 'student classRoom subject markedBy' }))
);
router.use('/grades', authorize('admin', 'teacher'), buildCrudRouter(buildCrudController(Grade, { populate: 'student classRoom teacher' })));
router.use('/fees', authorize('admin', 'finance'), buildCrudRouter(buildCrudController(Fee, { populate: 'student' })));
router.use('/announcements', authorize('admin', 'staff'), buildCrudRouter(buildCrudController(Announcement, { populate: 'createdBy' })));

export default router;
