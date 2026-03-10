import { request, ensureAuth, getUser, clearSession } from './api.js';

ensureAuth();
const output = document.getElementById('output');
const user = getUser();
document.getElementById('whoami').textContent = `${user.name} (${user.role})`;

const print = (value) => {
  output.textContent = JSON.stringify(value, null, 2);
};

const loadDashboard = async () => {
  try {
    const data = await request('/api/dashboard');
    document.getElementById('student-count').textContent = data.students;
    document.getElementById('teacher-count').textContent = data.teachers;
    document.getElementById('class-count').textContent = data.classes;
    document.getElementById('announcement-count').textContent = data.announcements.length;
    print(data);
  } catch (error) {
    print({ error: error.message });
  }
};

document.getElementById('refresh-btn').addEventListener('click', loadDashboard);
document.getElementById('logout-btn').addEventListener('click', () => {
  clearSession();
  window.location.href = '/index.html';
});

loadDashboard();
