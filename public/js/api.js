const SESSION_KEY = 'sms_session';

export const moduleConfigs = {
  students: {
    title: 'Student Information Management',
    path: '/api/students',
    fields: ['admissionNumber', 'firstName', 'lastName', 'classLevel', 'section', 'guardianName', 'guardianPhone', 'address']
  },
  teachers: {
    title: 'Teacher Management',
    path: '/api/teachers',
    fields: ['employeeId', 'firstName', 'lastName', 'department', 'subjects', 'phone', 'qualification']
  },
  classes: {
    title: 'Class & Timetable Setup',
    path: '/api/classes',
    fields: ['name', 'academicYear', 'roomNumber', 'subjects']
  },
  attendance: {
    title: 'Attendance Tracking',
    path: '/api/attendance',
    fields: ['student', 'classRoom', 'date', 'status', 'remarks']
  },
  grades: {
    title: 'Grades & Exam Records',
    path: '/api/grades',
    fields: ['student', 'classRoom', 'subject', 'examType', 'score', 'maxScore', 'gradeLetter', 'comments']
  },
  fees: {
    title: 'Fee Management',
    path: '/api/fees',
    fields: ['student', 'term', 'academicYear', 'tuition', 'transport', 'books', 'miscellaneous', 'paidAmount', 'dueDate', 'status']
  },
  announcements: {
    title: 'Announcements & Notices',
    path: '/api/announcements',
    fields: ['title', 'message', 'audience', 'publishDate', 'expiresAt', 'priority']
  }
};

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
};

export const setSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const withAuthGuard = () => {
  if (!getSession()) {
    window.location.href = '/login.html';
  }
};

export const printOutput = (node, payload) => {
  node.textContent = JSON.stringify(payload, null, 2);
};

const parseValue = (key, value) => {
  if (['score', 'maxScore', 'tuition', 'transport', 'books', 'miscellaneous', 'paidAmount'].includes(key)) {
    return Number(value);
  }
  if (['subjects', 'audience'].includes(key)) {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return value;
};

export const formToPayload = (form) => {
  const payload = {};
  const data = new FormData(form);
  for (const [key, value] of data.entries()) {
    if (value) payload[key] = parseValue(key, value);
  }
  return payload;
};

export const request = async (url, { method = 'GET', body } = {}) => {
  const session = getSession();
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  if (response.status === 204) return { ok: true, status: 204 };

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
};

export const mountShell = (activePage) => {
  const session = getSession();
  const links = [
    ['dashboard', '/dashboard.html', 'Dashboard'],
    ['students', '/students.html', 'Students'],
    ['teachers', '/teachers.html', 'Teachers'],
    ['classes', '/classes.html', 'Classes'],
    ['attendance', '/attendance.html', 'Attendance'],
    ['grades', '/grades.html', 'Grades'],
    ['fees', '/fees.html', 'Fees'],
    ['announcements', '/announcements.html', 'Announcements']
  ];

  return `
    <div class="page-shell">
      <aside class="sidebar">
        <div class="logo">🏫 School Management</div>
        <nav class="nav-list">
          ${links
            .map(([key, href, label]) => `<a class="nav-link ${activePage === key ? 'active' : ''}" href="${href}">${label}</a>`)
            .join('')}
          <a class="nav-link" href="#" id="logout-link">Logout</a>
        </nav>
      </aside>
      <section class="main">
        <div class="topbar">
          <h2>${activePage[0].toUpperCase() + activePage.slice(1)}</h2>
          <span class="badge">${session?.user?.name || 'Unknown'} · ${session?.user?.role || 'role'}</span>
        </div>
        <div id="page-content"></div>
      </section>
    </div>
  `;
};
