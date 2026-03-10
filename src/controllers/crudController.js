import { asyncHandler } from '../utils/asyncHandler.js';

const getSchoolFilter = (req) => (req.params.schoolId ? { schoolId: req.params.schoolId } : {});

export const buildCrudController = (Model, { populate = '', searchableFields = [] } = {}) => ({
  create: asyncHandler(async (req, res) => {
    const payload = { ...req.body };
    if (req.params.schoolId && !payload.schoolId) {
      payload.schoolId = req.params.schoolId;
    }

    const record = await Model.create(payload);
    res.status(201).json(record);
  }),
  list: asyncHandler(async (req, res) => {
    const { search = '', limit } = req.query;
    const queryFilter = { ...getSchoolFilter(req) };

    if (search && searchableFields.length) {
      queryFilter.$or = searchableFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' }
      }));
    }

    const query = Model.find(queryFilter);
    if (populate) query.populate(populate);
    if (limit) query.limit(Number(limit));

    const records = await query.sort({ createdAt: -1 });
    res.json(records);
  }),
  getById: asyncHandler(async (req, res) => {
    const query = Model.findOne({ _id: req.params.id, ...getSchoolFilter(req) });
    if (populate) query.populate(populate);
    const record = await query;
    if (!record) {
      return res.status(404).json({ message: 'Record not found.' });
    }

    return res.json(record);
  }),
  update: asyncHandler(async (req, res) => {
    const record = await Model.findOneAndUpdate({ _id: req.params.id, ...getSchoolFilter(req) }, req.body, {
      new: true,
      runValidators: true
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found.' });
    }

    return res.json(record);
  }),
  remove: asyncHandler(async (req, res) => {
    const record = await Model.findOneAndDelete({ _id: req.params.id, ...getSchoolFilter(req) });
    if (!record) {
      return res.status(404).json({ message: 'Record not found.' });
    }

    return res.status(204).send();
  })
});
