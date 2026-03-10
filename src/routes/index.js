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

const registerAcademicRoutes = (targetRouter) => {
  targetRouter.get('/dashboard', authorize('admin', 'finance', 'staff'), getDashboardStats);
  targetRouter.use('/lookups', authorize('admin', 'staff', 'teacher', 'finance'), lookupRoutes);

  targetRouter.use(
    '/students',
    authorize('admin', 'staff'),
    buildCrudRouter(buildCrudController(Student, { populate: 'user', searchableFields: ['firstName', 'lastName', 'admissionNumber'] }))
  );
  targetRouter.use(
    '/teachers',
    authorize('admin', 'staff'),
    buildCrudRouter(buildCrudController(Teacher, { populate: 'user subjects', searchableFields: ['firstName', 'lastName', 'employeeId'] }))
  );
  targetRouter.use(
    '/classes',
    authorize('admin', 'staff', 'teacher'),
    buildCrudRouter(buildCrudController(ClassRoom, { populate: 'classTeacher subjects', searchableFields: ['name', 'academicYear'] }))
  );
  targetRouter.use(
    '/subjects',
    authorize('admin', 'staff', 'teacher'),
    buildCrudRouter(buildCrudController(Subject, { populate: 'classRoom teacher', searchableFields: ['name', 'code'] }))
  );
  targetRouter.use(
    '/attendance',
    authorize('admin', 'staff', 'teacher'),
    buildCrudRouter(buildCrudController(Attendance, { populate: 'student classRoom subject markedBy' }))
  );
  targetRouter.use('/grades', authorize('admin', 'teacher'), buildCrudRouter(buildCrudController(Grade, { populate: 'student classRoom teacher' })));
  targetRouter.use('/fees', authorize('admin', 'finance'), buildCrudRouter(buildCrudController(Fee, { populate: 'student' })));
  targetRouter.use('/announcements', authorize('admin', 'staff'), buildCrudRouter(buildCrudController(Announcement, { populate: 'createdBy' })));
};

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use(authenticate);

// Existing API pattern remains intact.
registerAcademicRoutes(router);

// Multi-school scoped API pattern (backward compatible addition).
const scopedRouter = Router({ mergeParams: true });
registerAcademicRoutes(scopedRouter);
router.use('/:schoolId', scopedRouter);

export default router;
