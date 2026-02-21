import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.PORT = '4000';
process.env.MONGODB_URI = 'mongodb://example.test/db';
process.env.JWT_SECRET = 'test-secret';

const { createApp } = await import('../src/app.js');

test('GET /api/health returns ok', async () => {
  const app = createApp();
  const response = await request(app).get('/api/health');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'ok' });
});
