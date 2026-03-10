const output = document.getElementById('output');
const dashboardSummary = document.getElementById('dashboard-summary');
const sessionInfo = document.getElementById('session-info');

let authToken = '';
let currentUser = null;

const modulePermissions = {
  admin: ['students', 'teachers', 'classes', 'attendance', 'grades', 'fees', 'announcements', 'dashboard'],
  staff: ['students', 'teachers', 'classes', 'attendance', 'announcements', 'dashboard'],
  teacher: ['classes', 'attendance', 'grades'],
  finance: ['fees', 'dashboard'],
  parent: [],
  student: []
};

const print = (payload) => {
  output.textContent = JSON.stringify(payload, null, 2);
};

const toBool = (value) => value === 'on' || value === true;
const toNumber = (value) => (value === '' || value == null ? undefined : Number(value));
const toStringArray = (value) =>
  value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const getAllowedModules = () => {
  if (!currentUser) return [];
  return modulePermissions[currentUser.role] || [];
};

const updateRoleUI = () => {
  const allowed = new Set(getAllowedModules());
  document.querySelectorAll('.module').forEach((moduleCard) => {
    const module = moduleCard.dataset.module;
    moduleCard.classList.toggle('hidden', !allowed.has(module));
  });

  const dashboardCard = document.getElementById('dashboard-card');
  dashboardCard.classList.toggle('hidden', !allowed.has('dashboard'));

  if (currentUser) {
    sessionInfo.textContent = `Logged in as ${currentUser.name} (${currentUser.role})`;
  } else {
    sessionInfo.textContent = 'Not logged in.';
    dashboardSummary.innerHTML = '';
  }
};

const apiRequest = async (url, { method = 'GET', body } = {}) => {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload;
};

const buildPayload = (module, formData) => {
  const raw = Object.fromEntries(formData.entries());

  if (module === 'students') {
    return {
      admissionNumber: raw.admissionNumber,
      firstName: raw.firstName,
      lastName: raw.lastName,
      classLevel: raw.classLevel,
      section: raw.section || undefined,
      guardianName: raw.guardianName || undefined,
      guardianPhone: raw.guardianPhone || undefined,
      address: raw.address || undefined,
      transportRequired: toBool(raw.transportRequired)
    };
  }

  if (module === 'teachers') {
    return {
      employeeId: raw.employeeId,
      firstName: raw.firstName,
      lastName: raw.lastName,
      department: raw.department,
      subjects: toStringArray(raw.subjects),
      phone: raw.phone || undefined,
      qualification: raw.qualification || undefined
    };
  }

  if (module === 'classes') {
    let schedule = [];
    if (raw.schedule?.trim()) {
      schedule = JSON.parse(raw.schedule);
    }

    return {
      name: raw.name,
      academicYear: raw.academicYear,
      roomNumber: raw.roomNumber || undefined,
      subjects: toStringArray(raw.subjects),
      schedule
    };
  }

  if (module === 'attendance') {
    return {
      student: raw.student,
      classRoom: raw.classRoom,
      date: raw.date,
      status: raw.status,
      remarks: raw.remarks || undefined
    };
  }

  if (module === 'grades') {
    return {
      student: raw.student,
      classRoom: raw.classRoom,
      subject: raw.subject,
      examType: raw.examType,
      score: toNumber(raw.score),
      maxScore: toNumber(raw.maxScore),
      gradeLetter: raw.gradeLetter || undefined,
      comments: raw.comments || undefined
    };
  }

  if (module === 'fees') {
    return {
      student: raw.student,
      term: raw.term,
      academicYear: raw.academicYear,
      tuition: toNumber(raw.tuition),
      transport: toNumber(raw.transport) || 0,
      books: toNumber(raw.books) || 0,
      miscellaneous: toNumber(raw.miscellaneous) || 0,
      paidAmount: toNumber(raw.paidAmount) || 0,
      status: raw.status
    };
  }

  if (module === 'announcements') {
    return {
      title: raw.title,
      message: raw.message,
      audience: toStringArray(raw.audience),
      priority: raw.priority
    };
  }

  return raw;
};

document.getElementById('register-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const payload = Object.fromEntries(new FormData(event.target).entries());
    const data = await apiRequest('/api/auth/register', { method: 'POST', body: payload });
    authToken = data.token || '';
    currentUser = data.user || null;
    updateRoleUI();
    print({ message: 'User registered', ...data });
  } catch (error) {
    print({ error: error.message });
  }
});

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const payload = Object.fromEntries(new FormData(event.target).entries());
    const data = await apiRequest('/api/auth/login', { method: 'POST', body: payload });
    authToken = data.token || '';
    currentUser = data.user || null;
    updateRoleUI();
    print({ message: 'Login successful', ...data });
  } catch (error) {
    print({ error: error.message });
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  authToken = '';
  currentUser = null;
  updateRoleUI();
  print({ message: 'Logged out.' });
});

document.getElementById('dashboard-btn').addEventListener('click', async () => {
  try {
    const data = await apiRequest('/api/dashboard');
    dashboardSummary.innerHTML = `
      <article><strong>Active Students</strong><span>${data.students ?? 0}</span></article>
      <article><strong>Active Teachers</strong><span>${data.teachers ?? 0}</span></article>
      <article><strong>Classes</strong><span>${data.classes ?? 0}</span></article>
      <article><strong>Fee Status Buckets</strong><span>${(data.feeStats || []).length}</span></article>
      <article><strong>Recent Announcements</strong><span>${(data.announcements || []).length}</span></article>
    `;
    print(data);
  } catch (error) {
    print({ error: error.message });
  }
});

document.querySelectorAll('[data-create]').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const module = form.dataset.create;
    try {
      const payload = buildPayload(module, new FormData(form));
      const data = await apiRequest(`/api/${module}`, { method: 'POST', body: payload });
      print({ message: `Created ${module.slice(0, -1)} record`, data });
      form.reset();
    } catch (error) {
      print({ error: error.message, module });
    }
  });
});

document.querySelectorAll('[data-list]').forEach((button) => {
  button.addEventListener('click', async () => {
    const module = button.dataset.list;
    try {
      const data = await apiRequest(`/api/${module}`);
      print({ module, total: data.length ?? 0, data });
    } catch (error) {
      print({ error: error.message, module });
    }
  });
});

updateRoleUI();
