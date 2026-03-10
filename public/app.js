const output = document.getElementById('output');
const moduleTabs = document.getElementById('module-tabs');
const moduleContent = document.getElementById('module-content');
const sessionInfo = document.getElementById('session-info');
const workspaceHelp = document.getElementById('workspace-help');

let authToken = '';
let currentUser = null;
let activeModule = null;

const modules = {
  students: {
    label: 'Students',
    endpoint: '/api/students',
    template: {
      admissionNumber: 'ADM-1001',
      firstName: 'Ada',
      lastName: 'Lovelace',
      classLevel: 'Grade 9',
      section: 'A',
      guardianName: 'Byron',
      guardianPhone: '+1234567890',
      transportRequired: false,
      emergencyContact: { name: 'Jane', relationship: 'Aunt', phone: '+1234000000' }
    }
  },
  teachers: {
    label: 'Teachers',
    endpoint: '/api/teachers',
    template: {
      employeeId: 'EMP-001',
      firstName: 'Grace',
      lastName: 'Hopper',
      department: 'Science',
      subjects: ['Math', 'Physics'],
      phone: '+1230000000',
      qualification: 'M.Ed'
    }
  },
  classes: {
    label: 'Classes & Timetable',
    endpoint: '/api/classes',
    template: {
      name: 'Grade 9A',
      academicYear: '2026',
      roomNumber: 'Block B-3',
      subjects: ['Math', 'English'],
      schedule: [{ day: 'Monday', period: 1, subject: 'Math', startTime: '09:00', endTime: '09:45' }]
    }
  },
  attendance: {
    label: 'Attendance',
    endpoint: '/api/attendance',
    template: {
      student: '<studentId>',
      classRoom: '<classRoomId>',
      date: '2026-01-10',
      status: 'present',
      remarks: 'On time'
    }
  },
  grades: {
    label: 'Grades & Exams',
    endpoint: '/api/grades',
    template: {
      student: '<studentId>',
      classRoom: '<classRoomId>',
      teacher: '<teacherId>',
      subject: 'Math',
      examType: 'quiz',
      score: 45,
      maxScore: 50,
      gradeLetter: 'A',
      comments: 'Excellent work'
    }
  },
  fees: {
    label: 'Fees & Payments',
    endpoint: '/api/fees',
    template: {
      student: '<studentId>',
      term: 'Term 1',
      academicYear: '2026',
      tuition: 2500,
      transport: 200,
      books: 120,
      miscellaneous: 75,
      paidAmount: 1000,
      status: 'partial'
    }
  },
  announcements: {
    label: 'Announcements',
    endpoint: '/api/announcements',
    template: {
      title: 'School Meeting',
      message: 'Parent-teacher meeting this Friday at 2 PM.',
      audience: ['all'],
      priority: 'high'
    }
  }
};

const roleAccess = {
  admin: Object.keys(modules),
  staff: ['students', 'teachers', 'classes', 'attendance', 'announcements'],
  teacher: ['classes', 'attendance', 'grades'],
  finance: ['fees'],
  student: ['announcements'],
  parent: ['announcements']
};

const print = (payload) => {
  output.textContent = JSON.stringify(payload, null, 2);
};

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
};

const getAllowedModules = () => {
  if (!currentUser?.role) return [];
  return roleAccess[currentUser.role] || [];
};

const renderModulePanel = async (moduleKey) => {
  const config = modules[moduleKey];
  if (!config) return;

  moduleContent.innerHTML = `
    <div class="module-panel">
      <h3>${config.label}</h3>
      <p>Create using JSON payload. Replace placeholder IDs like <code>&lt;studentId&gt;</code> with real record IDs.</p>
      <textarea id="payload-editor">${JSON.stringify(config.template, null, 2)}</textarea>
      <div class="actions">
        <button id="create-record-btn" type="button">Create record</button>
        <button id="list-records-btn" type="button" class="secondary">Refresh list</button>
      </div>
      <ul id="records-list"></ul>
    </div>
  `;

  const payloadEditor = document.getElementById('payload-editor');
  const listElement = document.getElementById('records-list');

  const refreshList = async () => {
    try {
      const records = await request(config.endpoint);
      listElement.innerHTML = '';
      records.forEach((record) => {
        const item = document.createElement('li');
        const title = record.title || record.name || record.firstName || record.admissionNumber || record.employeeId || record._id;
        item.innerHTML = `
          <div>
            <strong>${title}</strong><br />
            <small>${record._id}</small>
          </div>
          <button class="danger" data-id="${record._id}" type="button">Delete</button>
        `;
        listElement.appendChild(item);
      });

      if (!records.length) {
        listElement.innerHTML = '<li>No records found yet.</li>';
      }

      print({ module: moduleKey, records });
    } catch (error) {
      print({ module: moduleKey, error: error.message });
    }
  };

  document.getElementById('create-record-btn').addEventListener('click', async () => {
    try {
      const payload = JSON.parse(payloadEditor.value);
      const data = await request(config.endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      print({ module: moduleKey, created: data });
      await refreshList();
    } catch (error) {
      print({ module: moduleKey, error: error.message });
    }
  });

  document.getElementById('list-records-btn').addEventListener('click', refreshList);

  listElement.addEventListener('click', async (event) => {
    if (event.target.tagName !== 'BUTTON') return;
    const id = event.target.dataset.id;
    try {
      await request(`${config.endpoint}/${id}`, { method: 'DELETE' });
      print({ module: moduleKey, deletedId: id });
      await refreshList();
    } catch (error) {
      print({ module: moduleKey, error: error.message });
    }
  });

  await refreshList();
};

const renderModuleTabs = () => {
  const allowed = getAllowedModules();
  moduleTabs.innerHTML = '';
  moduleContent.innerHTML = '';

  if (!allowed.length) {
    workspaceHelp.textContent = 'This role has no editable modules in the current starter UI.';
    return;
  }

  workspaceHelp.textContent = `Role ${currentUser.role} can access: ${allowed.join(', ')}.`;

  allowed.forEach((key) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = modules[key].label;
    button.className = key === activeModule ? 'active' : '';
    button.addEventListener('click', async () => {
      activeModule = key;
      renderModuleTabs();
      await renderModulePanel(key);
    });
    moduleTabs.appendChild(button);
  });

  if (!activeModule || !allowed.includes(activeModule)) {
    activeModule = allowed[0];
  }

  renderModulePanel(activeModule);
};

document.getElementById('register-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  try {
    const data = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data.token) {
      authToken = data.token;
      currentUser = data.user;
      sessionInfo.textContent = `Logged in as ${currentUser.name} (${currentUser.role})`;
      renderModuleTabs();
    }
    print(data);
  } catch (error) {
    print({ error: error.message });
  }
});

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  try {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data.token) {
      authToken = data.token;
      currentUser = data.user;
      sessionInfo.textContent = `Logged in as ${currentUser.name} (${currentUser.role})`;
      renderModuleTabs();
    }
    print(data);
  } catch (error) {
    print({ error: error.message });
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  authToken = '';
  currentUser = null;
  activeModule = null;
  sessionInfo.textContent = 'Not logged in.';
  moduleTabs.innerHTML = '';
  moduleContent.innerHTML = '';
  workspaceHelp.textContent = 'Login to load modules available to your role.';
  print({ message: 'Logged out.' });
});

document.getElementById('dashboard-btn').addEventListener('click', async () => {
  try {
    const data = await request('/api/dashboard');
    print(data);
  } catch (error) {
    print({ error: error.message });
  }
});
