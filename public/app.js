const output = document.getElementById('output');
const sessionInfo = document.getElementById('session-info');
const moduleActions = document.getElementById('module-actions');

let authToken = '';
let currentUser = null;

const modules = {
  students: {
    path: '/api/students',
    fields: ['admissionNumber', 'firstName', 'lastName', 'classLevel', 'section', 'guardianName', 'guardianPhone']
  },
  teachers: {
    path: '/api/teachers',
    fields: ['employeeId', 'firstName', 'lastName', 'department', 'subjects', 'phone', 'qualification']
  },
  classes: {
    path: '/api/classes',
    fields: ['name', 'academicYear', 'roomNumber', 'subjects']
  },
  attendance: {
    path: '/api/attendance',
    fields: ['student', 'classRoom', 'date', 'status', 'remarks']
  },
  grades: {
    path: '/api/grades',
    fields: ['student', 'classRoom', 'subject', 'examType', 'score', 'maxScore', 'gradeLetter', 'comments']
  },
  fees: {
    path: '/api/fees',
    fields: ['student', 'term', 'academicYear', 'tuition', 'transport', 'books', 'miscellaneous', 'paidAmount', 'dueDate', 'status']
  },
  announcements: {
    path: '/api/announcements',
    fields: ['title', 'message', 'audience', 'publishDate', 'expiresAt', 'priority']
  }
};

const print = (payload) => {
  output.textContent = JSON.stringify(payload, null, 2);
};

const parseValue = (key, value) => {
  if (!value) return value;
  if (['score', 'maxScore', 'tuition', 'transport', 'books', 'miscellaneous', 'paidAmount'].includes(key)) {
    return Number(value);
  }
  if (['subjects', 'audience'].includes(key)) {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return value;
};

const request = async (url, { method = 'GET', body } = {}) => {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  if (response.status === 204) {
    return { ok: true, status: 204 };
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
};

const setSession = (user, token) => {
  currentUser = user;
  authToken = token;
  sessionInfo.textContent = user ? `Logged in as ${user.name} (${user.role})` : 'Not logged in.';
};

const addModuleCard = (name, config) => {
  const card = document.createElement('article');
  card.className = 'module-card';

  const title = document.createElement('h3');
  title.textContent = name[0].toUpperCase() + name.slice(1);

  const form = document.createElement('form');
  form.dataset.module = name;

  config.fields.forEach((field) => {
    const input = document.createElement('input');
    input.name = field;
    input.placeholder = `${field}${['subjects', 'audience'].includes(field) ? ' (comma-separated)' : ''}`;
    if (field.includes('Date') || field === 'date' || field === 'dueDate' || field === 'expiresAt' || field === 'publishDate') {
      input.type = 'date';
    }
    form.appendChild(input);
  });

  const createBtn = document.createElement('button');
  createBtn.type = 'submit';
  createBtn.textContent = `Create ${name.slice(0, -1)}`;

  const listBtn = document.createElement('button');
  listBtn.type = 'button';
  listBtn.textContent = `List ${name}`;
  listBtn.className = 'secondary-btn';

  const deleteInput = document.createElement('input');
  deleteInput.placeholder = `${name.slice(0, -1)} id to delete`;

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.textContent = 'Delete by ID';
  deleteBtn.className = 'danger-btn';

  form.append(createBtn, listBtn, deleteInput, deleteBtn);
  card.append(title, form);
  moduleActions.appendChild(card);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const payload = {};
      const formData = new FormData(form);
      for (const [key, value] of formData.entries()) {
        if (value) payload[key] = parseValue(key, value);
      }
      const data = await request(config.path, { method: 'POST', body: payload });
      print({ action: `created ${name}`, data });
    } catch (error) {
      print({ error: error.message });
    }
  });

  listBtn.addEventListener('click', async () => {
    try {
      const data = await request(config.path);
      print({ action: `list ${name}`, count: data.length, data });
    } catch (error) {
      print({ error: error.message });
    }
  });

  deleteBtn.addEventListener('click', async () => {
    try {
      if (!deleteInput.value) {
        throw new Error('Enter a record id before deleting.');
      }
      await request(`${config.path}/${deleteInput.value}`, { method: 'DELETE' });
      print({ action: `deleted ${name.slice(0, -1)}`, id: deleteInput.value });
      deleteInput.value = '';
    } catch (error) {
      print({ error: error.message });
    }
  });
};

document.getElementById('register-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.target).entries());
  try {
    const data = await request('/api/auth/register', { method: 'POST', body: payload });
    if (data.token) setSession(data.user, data.token);
    print(data);
  } catch (error) {
    print({ error: error.message });
  }
});

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.target).entries());
  try {
    const data = await request('/api/auth/login', { method: 'POST', body: payload });
    if (data.token) setSession(data.user, data.token);
    print(data);
  } catch (error) {
    print({ error: error.message });
  }
});

document.getElementById('dashboard-btn').addEventListener('click', async () => {
  try {
    const data = await request('/api/dashboard');
    print(data);
  } catch (error) {
    print({ error: error.message });
  }
});

Object.entries(modules).forEach(([name, config]) => addModuleCard(name, config));
