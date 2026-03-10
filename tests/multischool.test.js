import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.PORT = '4000';
process.env.MONGODB_URI = 'mongodb://example.test/db';
process.env.JWT_SECRET = 'test-secret';

const { createApp } = await import('../src/app.js');

test('scoped API route exists and is protected', async () => {
  const app = createApp();
  const response = await request(app).get('/api/demo-school/students');

  assert.equal(response.status, 401);
  assert.equal(response.body.message, 'Authorization token missing.');
});
