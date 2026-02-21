import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

const signToken = (user) =>
  jwt.sign({ sub: user._id, email: user.email, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ email });

  if (existing) {
    return res.status(409).json({ message: 'User already exists.' });
  }

  const user = await User.create({ name, email, password, role });
  const token = signToken(user);

  return res.status(201).json({ token, user: { id: user.id, name, email, role: user.role } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = signToken(user);

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});
