import { request, ensureAuth, getUser, parseValue } from './api.js';

ensureAuth();
const output = document.getElementById('output');
const rows = document.getElementById('rows');
const user = getUser();
document.getElementById('whoami').textContent = `${user.name} (${user.role})`;

const moduleName = document.body.dataset.module;
const config = {
  students: { path: '/api/students', fields: ['admissionNumber', 'firstName', 'lastName', 'classLevel', 'section', 'guardianName', 'guardianPhone'] },
  teachers: { path: '/api/teachers', fields: ['employeeId', 'firstName', 'lastName', 'department', 'subjects', 'phone', 'qualification'] },
  classes: { path: '/api/classes', fields: ['name', 'academicYear', 'roomNumber', 'subjects'] },
  attendance: { path: '/api/attendance', fields: ['student', 'classRoom', 'date', 'status', 'remarks'] },
  grades: { path: '/api/grades', fields: ['student', 'classRoom', 'subject', 'examType', 'score', 'maxScore', 'gradeLetter', 'comments'] },
  fees: { path: '/api/fees', fields: ['student', 'term', 'academicYear', 'tuition', 'transport', 'books', 'miscellaneous', 'paidAmount', 'dueDate', 'status'] },
  announcements: { path: '/api/announcements', fields: ['title', 'message', 'audience', 'publishDate', 'expiresAt', 'priority'] }
}[moduleName];

const print = (value) => {
  output.textContent = JSON.stringify(value, null, 2);
};

const renderForm = () => {
  const form = document.getElementById('create-form');
  config.fields.forEach((field) => {
    const label = document.createElement('label');
    label.textContent = field;

    const input = document.createElement('input');
    input.name = field;
    input.placeholder = ['subjects', 'audience'].includes(field) ? `${field} (comma-separated)` : field;
    if (field === 'date' || field.includes('Date') || field === 'dueDate' || field === 'expiresAt') input.type = 'date';

    label.appendChild(input);
    form.insertBefore(label, form.querySelector('button'));
  });
};

const refreshList = async () => {
  try {
    const data = await request(config.path);
    rows.innerHTML = data
      .slice(0, 12)
      .map((item) => `<tr><td>${item._id}</td><td>${Object.values(item).find((v) => typeof v === 'string') || '-'}</td></tr>`)
      .join('');
    print({ count: data.length, data: data.slice(0, 3) });
  } catch (error) {
    print({ error: error.message });
  }
};

document.getElementById('create-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = {};
  for (const [key, value] of new FormData(event.target).entries()) {
    if (value) payload[key] = parseValue(key, value);
  }
  try {
    const data = await request(config.path, { method: 'POST', body: payload });
    print(data);
    event.target.reset();
    refreshList();
  } catch (error) {
    print({ error: error.message });
  }
});

document.getElementById('list-btn').addEventListener('click', refreshList);
document.getElementById('delete-btn').addEventListener('click', async () => {
  const id = document.getElementById('delete-id').value;
  if (!id) return print({ error: 'Enter id' });
  try {
    await request(`${config.path}/${id}`, { method: 'DELETE' });
    print({ deleted: id });
    document.getElementById('delete-id').value = '';
    refreshList();
  } catch (error) {
    print({ error: error.message });
  }
});

renderForm();
refreshList();
