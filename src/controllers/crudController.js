import { asyncHandler } from '../utils/asyncHandler.js';

export const buildCrudController = (Model, { populate = '' } = {}) => ({
  create: asyncHandler(async (req, res) => {
    const record = await Model.create(req.body);
    res.status(201).json(record);
  }),
  list: asyncHandler(async (req, res) => {
    const query = Model.find();
    if (populate) query.populate(populate);
    const records = await query.sort({ createdAt: -1 });
    res.json(records);
  }),
  getById: asyncHandler(async (req, res) => {
    const query = Model.findById(req.params.id);
    if (populate) query.populate(populate);
    const record = await query;
    if (!record) {
      return res.status(404).json({ message: 'Record not found.' });
    }

    return res.json(record);
  }),
  update: asyncHandler(async (req, res) => {
    const record = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found.' });
    }

    return res.json(record);
  }),
  remove: asyncHandler(async (req, res) => {
    const record = await Model.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found.' });
    }

    return res.status(204).send();
  })
});
