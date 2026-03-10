import test from 'node:test';
import assert from 'node:assert/strict';
import { canAccessPage, getAllowedPageKeys, getDefaultHomePath, getVisibleLinks, formToPayload } from '../public/js/api.js';

test('admin has full navigation access', () => {
  const keys = getAllowedPageKeys('admin');
  assert.deepEqual(keys, ['dashboard', 'students', 'teachers', 'classes', 'subjects', 'attendance', 'grades', 'fees', 'announcements']);
  assert.equal(canAccessPage('admin', 'subjects'), true);
  assert.equal(canAccessPage('admin', 'fees'), true);
});

test('teacher only sees teaching modules and default path is classes', () => {
  const keys = getAllowedPageKeys('teacher');
  assert.deepEqual(keys, ['classes', 'subjects', 'attendance', 'grades']);
  assert.equal(canAccessPage('teacher', 'dashboard'), false);
  assert.equal(getDefaultHomePath('teacher'), '/classes.html');
});

test('finance only sees dashboard and fees', () => {
  const labels = getVisibleLinks('finance').map(([, , label]) => label);
  assert.deepEqual(labels, ['Dashboard', 'Fees']);
  assert.equal(getDefaultHomePath('finance'), '/dashboard.html');
});

test('parent has no modules and falls back to dashboard path', () => {
  assert.deepEqual(getAllowedPageKeys('parent'), []);
  assert.equal(getDefaultHomePath('parent'), '/dashboard.html');
});

test('formToPayload preserves plain form fields without field config', () => {
  const formData = new FormData();
  formData.set('name', 'Alice');
  formData.set('email', 'alice@example.com');
  formData.set('password', 'secret');
  formData.set('role', 'teacher');

  assert.deepEqual(formToPayload(formData), {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'secret',
    role: 'teacher'
  });
});
