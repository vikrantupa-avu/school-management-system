import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.PORT = '4000';
process.env.MONGODB_URI = 'mongodb://example.test/db';
process.env.JWT_SECRET = 'test-secret';

const { createApp } = await import('../src/app.js');
const { User } = await import('../src/models/User.js');

test('POST /api/auth/register forces student role regardless of client payload', async () => {
  const app = createApp();

  const originalFindOne = User.findOne;
  const originalCreate = User.create;

  const captured = { createPayload: null };

  User.findOne = async () => null;
  User.create = async (payload) => {
    captured.createPayload = payload;

    return {
      _id: '507f1f77bcf86cd799439011',
      id: '507f1f77bcf86cd799439011',
      name: payload.name,
      email: payload.email,
      role: payload.role
    };
  };

  try {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'user@example.com',
      password: 'password123',
      role: 'admin'
    });

    assert.equal(response.status, 201);
    assert.equal(captured.createPayload.role, 'student');
    assert.equal(response.body.user.role, 'student');
    assert.ok(response.body.token);
  } finally {
    User.findOne = originalFindOne;
    User.create = originalCreate;
  }
});
