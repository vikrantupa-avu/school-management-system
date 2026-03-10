import { Router } from 'express';
import { Student } from '../models/Student.js';
import { Subject } from '../models/Subject.js';
import { ClassRoom } from '../models/ClassRoom.js';
import { Teacher } from '../models/Teacher.js';

const router = Router({ mergeParams: true });

const withSchoolFilter = (req, filter) => (req.params.schoolId ? { ...filter, schoolId: req.params.schoolId } : filter);

const lookupBuilders = {
  students: {
    Model: Student,
    filter: (search) => ({
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } }
      ]
    }),
    label: (record) => `${record.firstName} ${record.lastName} (${record.admissionNumber})`
  },
  subjects: {
    Model: Subject,
    filter: (search) => ({
      $or: [{ name: { $regex: search, $options: 'i' } }, { code: { $regex: search, $options: 'i' } }]
    }),
    label: (record) => `${record.name} (${record.code})`
  },
  classes: {
    Model: ClassRoom,
    filter: (search) => ({
      $or: [{ name: { $regex: search, $options: 'i' } }, { academicYear: { $regex: search, $options: 'i' } }]
    }),
    label: (record) => `${record.name} - ${record.academicYear}`
  },
  teachers: {
    Model: Teacher,
    filter: (search) => ({
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ]
    }),
    label: (record) => `${record.firstName} ${record.lastName} (${record.employeeId})`
  }
};

router.get('/:entity', async (req, res) => {
  const { entity } = req.params;
  const { search = '' } = req.query;
  const lookup = lookupBuilders[entity];

  if (!lookup) {
    return res.status(404).json({ message: 'Lookup entity not found.' });
  }

  const filter = withSchoolFilter(req, lookup.filter(search));
  const records = await lookup.Model.find(filter).limit(10).sort({ createdAt: -1 });
  return res.json(records.map((record) => ({ id: record._id, label: lookup.label(record) })));
});

export default router;
