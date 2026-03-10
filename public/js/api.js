const SESSION_KEY = 'sms_session';

const roleAccess = {
  admin: ['dashboard', 'students', 'teachers', 'classes', 'subjects', 'attendance', 'grades', 'fees', 'announcements'],
  staff: ['dashboard', 'students', 'teachers', 'classes', 'subjects', 'attendance', 'announcements'],
  teacher: ['classes', 'subjects', 'attendance', 'grades'],
  finance: ['dashboard', 'fees'],
  parent: [],
  student: []
};

const allLinks = [
  ['dashboard', '/dashboard.html', 'Dashboard'],
  ['students', '/students.html', 'Students'],
  ['teachers', '/teachers.html', 'Teachers'],
  ['classes', '/classes.html', 'Classes'],
  ['subjects', '/subjects.html', 'Subjects'],
  ['attendance', '/attendance.html', 'Attendance'],
  ['grades', '/grades.html', 'Grades'],
  ['fees', '/fees.html', 'Fees'],
  ['announcements', '/announcements.html', 'Announcements']
];

export const moduleConfigs = {
  students: {
    title: 'Student Records',
    path: '/api/students',
    searchable: true,
    fields: [
      { name: 'admissionNumber', label: 'Admission Number', type: 'text', required: true },
      { name: 'firstName', label: 'First Name', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
      { name: 'classLevel', label: 'Class Level', type: 'text', required: true },
      { name: 'section', label: 'Section', type: 'text' },
      { name: 'guardianName', label: 'Guardian Name', type: 'text' },
      { name: 'guardianPhone', label: 'Guardian Phone', type: 'text' },
      { name: 'address', label: 'Address', type: 'textarea' }
    ]
  },
  teachers: {
    title: 'Teacher Records',
    path: '/api/teachers',
    searchable: true,
    fields: [
      { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
      { name: 'firstName', label: 'First Name', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
      { name: 'department', label: 'Department', type: 'text', required: true },
      {
        name: 'subjects',
        label: 'Subjects',
        type: 'lookup-multi',
        required: false,
        lookup: { endpoint: '/api/lookups/subjects', minSearch: 0 }
      },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'qualification', label: 'Qualification', type: 'text' },
      { name: 'joiningDate', label: 'Joining Date', type: 'date' }
    ]
  },
  classes: {
    title: 'Class Records',
    path: '/api/classes',
    searchable: true,
    fields: [
      { name: 'name', label: 'Class Name', type: 'text', required: true },
      { name: 'academicYear', label: 'Academic Year', type: 'text', required: true },
      { name: 'roomNumber', label: 'Room Number', type: 'text' },
      {
        name: 'classTeacher',
        label: 'Class Teacher',
        type: 'lookup',
        lookup: { endpoint: '/api/lookups/teachers', minSearch: 0 }
      },
      {
        name: 'subjects',
        label: 'Subjects',
        type: 'lookup-multi',
        lookup: { endpoint: '/api/lookups/subjects', minSearch: 0 }
      }
    ]
  },
  subjects: {
    title: 'Subject Records',
    path: '/api/subjects',
    searchable: true,
    fields: [
      { name: 'code', label: 'Subject Code', type: 'text', required: true },
      { name: 'name', label: 'Subject Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      {
        name: 'classRoom',
        label: 'Class',
        type: 'lookup',
        lookup: { endpoint: '/api/lookups/classes', minSearch: 0 }
      },
      {
        name: 'teacher',
        label: 'Teacher',
        type: 'lookup',
        lookup: { endpoint: '/api/lookups/teachers', minSearch: 0 }
      }
    ]
  },
  attendance: {
    title: 'Attendance Records',
    path: '/api/attendance',
    fields: [
      {
        name: 'student',
        label: 'Student',
        type: 'lookup',
        required: true,
        lookup: { endpoint: '/api/lookups/students', minSearch: 1 }
      },
      {
        name: 'classRoom',
        label: 'Class',
        type: 'lookup',
        required: true,
        lookup: { endpoint: '/api/lookups/classes', minSearch: 1 }
      },
      {
        name: 'subject',
        label: 'Subject',
        type: 'lookup',
        required: true,
        lookup: { endpoint: '/api/lookups/subjects', minSearch: 1 }
      },
      { name: 'date', label: 'Attendance Date', type: 'date', required: true },
      { name: 'status', label: 'Status', type: 'select', required: true, options: ['Present', 'Absent', 'Late'] },
      { name: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  grades: {
    title: 'Grades & Exam Records',
    path: '/api/grades',
    fields: [
      { name: 'student', label: 'Student ID', type: 'text' },
      { name: 'classRoom', label: 'Class ID', type: 'text' },
      { name: 'subject', label: 'Subject', type: 'text' },
      { name: 'examType', label: 'Exam Type', type: 'text' },
      { name: 'score', label: 'Score', type: 'number' },
      { name: 'maxScore', label: 'Max Score', type: 'number' },
      { name: 'gradeLetter', label: 'Grade Letter', type: 'text' },
      { name: 'comments', label: 'Comments', type: 'textarea' }
    ]
  },
  fees: {
    title: 'Fee Management',
    path: '/api/fees',
    fields: [
      { name: 'student', label: 'Student ID', type: 'text' },
      { name: 'term', label: 'Term', type: 'text' },
      { name: 'academicYear', label: 'Academic Year', type: 'text' },
      { name: 'tuition', label: 'Tuition', type: 'number' },
      { name: 'transport', label: 'Transport', type: 'number' },
      { name: 'books', label: 'Books', type: 'number' },
      { name: 'miscellaneous', label: 'Miscellaneous', type: 'number' },
      { name: 'paidAmount', label: 'Paid Amount', type: 'number' },
      { name: 'dueDate', label: 'Due Date', type: 'date' },
      { name: 'status', label: 'Status', type: 'text' }
    ]
  },
  announcements: {
    title: 'Announcements & Notices',
    path: '/api/announcements',
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'message', label: 'Message', type: 'textarea' },
      { name: 'audience', label: 'Audience', type: 'text' },
      { name: 'publishDate', label: 'Publish Date', type: 'date' },
      { name: 'expiresAt', label: 'Expires At', type: 'date' },
      { name: 'priority', label: 'Priority', type: 'text' }
    ]
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

export const getAllowedPageKeys = (role) => roleAccess[role] || [];

export const canAccessPage = (role, pageKey) => getAllowedPageKeys(role).includes(pageKey);

export const getDefaultHomePath = (role) => {
  const firstPage = getAllowedPageKeys(role)[0];
  if (!firstPage || firstPage === 'dashboard') return '/dashboard.html';
  return `/${firstPage}.html`;
};

export const getVisibleLinks = (role) => {
  const allowed = new Set(getAllowedPageKeys(role));
  return allLinks.filter(([key]) => allowed.has(key));
};

export const withAuthGuard = () => {
  if (!getSession()) {
    window.location.href = '/login.html';
  }
};

export const printOutput = (node, payload) => {
  node.textContent = JSON.stringify(payload, null, 2);
};

const parseValue = (field, value) => {
  if (field.type === 'number') return Number(value);
  return value;
};

export const formToPayload = (form, fields = []) => {
  const payload = {};
  const data = new FormData(form);
  const fieldMap = new Map(fields.map((field) => [field.name, field]));

  for (const [key, value] of data.entries()) {
    const field = fieldMap.get(key);
    if (!field || value === '') continue;

    if (field.type === 'lookup-multi') {
      const values = value.split(',').map((item) => item.trim()).filter(Boolean);
      payload[key] = values;
      continue;
    }

    payload[key] = parseValue(field, value);
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
  const role = session?.user?.role;
  const links = getVisibleLinks(role);

  return `
    <div class="page-shell">
      <aside class="sidebar">
        <div class="logo">🎓 IRAGyan</div>
        <nav class="nav-list">
          ${links.length
            ? links
                .map(([key, href, label]) => `<a class="nav-link ${activePage === key ? 'active' : ''}" href="${href}">${label}</a>`)
                .join('')
            : '<div class="nav-link">No modules assigned</div>'}
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
