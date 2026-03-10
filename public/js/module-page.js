import {
  withAuthGuard,
  mountShell,
  moduleConfigs,
  request,
  printOutput,
  formToPayload,
  clearSession,
  getSession,
  canAccessPage,
  getDefaultHomePath
} from './api.js';

withAuthGuard();
const pageKey = document.body.dataset.page;
const config = moduleConfigs[pageKey];
const session = getSession();
const role = session?.user?.role;

if (!canAccessPage(role, pageKey)) {
  window.location.href = getDefaultHomePath(role);
}

document.body.innerHTML = mountShell(pageKey);

const renderField = (field) => {
  if (field.type === 'textarea') {
    return `<label>${field.label}<textarea name="${field.name}" ${field.required ? 'required' : ''}></textarea></label>`;
  }

  if (field.type === 'select') {
    return `<label>${field.label}<select name="${field.name}" ${field.required ? 'required' : ''}>${field.options
      .map((option) => `<option value="${option}">${option}</option>`)
      .join('')}</select></label>`;
  }

  if (field.type === 'lookup') {
    return `
      <label>${field.label}
        <input type="search" data-lookup-input="${field.name}" placeholder="Search ${field.label}" ${field.required ? 'required' : ''}/>
        <input type="hidden" name="${field.name}" data-lookup-hidden="${field.name}" ${field.required ? 'required' : ''}/>
        <div class="lookup-results" data-lookup-results="${field.name}"></div>
      </label>
    `;
  }

  if (field.type === 'lookup-multi') {
    return `
      <label>${field.label}
        <input type="search" data-lookup-input="${field.name}" placeholder="Search ${field.label}" />
        <input type="hidden" name="${field.name}" data-lookup-hidden="${field.name}" />
        <div class="lookup-results" data-lookup-results="${field.name}"></div>
        <small class="muted" data-lookup-selected="${field.name}">No selection</small>
      </label>
    `;
  }

  return `<label>${field.label}<input name="${field.name}" type="${field.type || 'text'}" ${field.required ? 'required' : ''} /></label>`;
};

const mountLookup = (field, form) => {
  const input = form.querySelector(`[data-lookup-input="${field.name}"]`);
  const hidden = form.querySelector(`[data-lookup-hidden="${field.name}"]`);
  const results = form.querySelector(`[data-lookup-results="${field.name}"]`);
  const selectedNode = form.querySelector(`[data-lookup-selected="${field.name}"]`);
  const selectedValues = [];

  if (!input || !hidden || !results) return;

  const minSearch = field.lookup?.minSearch ?? 0;

  const renderResults = (items) => {
    results.innerHTML = items
      .map((item) => `<button type="button" data-id="${item.id}" data-label="${item.label}" class="secondary">${item.label}</button>`)
      .join('');
  };

  input.addEventListener('input', async () => {
    const term = input.value.trim();
    if (term.length < minSearch) {
      results.innerHTML = '';
      return;
    }

    try {
      const items = await request(`${field.lookup.endpoint}?search=${encodeURIComponent(term)}`);
      renderResults(items);
    } catch {
      results.innerHTML = '';
    }
  });

  results.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-id]');
    if (!button) return;

    const { id, label } = button.dataset;

    if (field.type === 'lookup-multi') {
      if (!selectedValues.some((entry) => entry.id === id)) {
        selectedValues.push({ id, label });
      }
      hidden.value = selectedValues.map((entry) => entry.id).join(',');
      if (selectedNode) {
        selectedNode.textContent = selectedValues.map((entry) => entry.label).join(', ');
      }
      input.value = '';
      results.innerHTML = '';
      return;
    }

    hidden.value = id;
    input.value = label;
    results.innerHTML = '';
  });
};

if (!config) {
  document.getElementById('page-content').innerHTML = '<div class="card"><h3>Unknown module.</h3></div>';
} else {
  const fields = config.fields.map(renderField).join('');

  document.getElementById('page-content').innerHTML = `
    <section class="hero">
      <h1>${config.title}</h1>
      <p>Manage IRAGyan records with typed forms and relational lookup fields.</p>
    </section>
    <section class="grid">
      <article class="card">
        <h3>Create new record</h3>
        <form id="create-form">${fields}<button type="submit">Create</button></form>
      </article>
      <article class="card">
        <h3>Actions</h3>
        <div class="inline-actions">
          <button id="list-btn" class="secondary" type="button">List all</button>
          <button id="delete-btn" class="danger" type="button">Delete by ID</button>
        </div>
        <input id="search-term" placeholder="Search records" />
        <button id="search-btn" class="secondary" type="button">Search</button>
        <input id="delete-id" placeholder="Enter record ID to delete" />
      </article>
    </section>
    <section class="card" style="margin-top:1rem;">
      <h3>Output</h3>
      <pre id="output" class="output">No actions yet.</pre>
    </section>
  `;

  const form = document.getElementById('create-form');
  const output = document.getElementById('output');

  config.fields.filter((field) => field.type === 'lookup' || field.type === 'lookup-multi').forEach((field) => mountLookup(field, form));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const payload = formToPayload(event.target, config.fields);
      const data = await request(config.path, { method: 'POST', body: payload });
      printOutput(output, data);
      event.target.reset();
      form.querySelectorAll('[data-lookup-results]').forEach((node) => {
        node.innerHTML = '';
      });
      form.querySelectorAll('[data-lookup-selected]').forEach((node) => {
        node.textContent = 'No selection';
      });
    } catch (error) {
      printOutput(output, { error: error.message });
    }
  });

  document.getElementById('list-btn').addEventListener('click', async () => {
    try {
      const data = await request(config.path);
      printOutput(output, data);
    } catch (error) {
      printOutput(output, { error: error.message });
    }
  });

  document.getElementById('search-btn').addEventListener('click', async () => {
    const search = document.getElementById('search-term').value.trim();
    try {
      const query = search ? `?search=${encodeURIComponent(search)}&limit=20` : '';
      const data = await request(`${config.path}${query}`);
      printOutput(output, data);
    } catch (error) {
      printOutput(output, { error: error.message });
    }
  });

  document.getElementById('delete-btn').addEventListener('click', async () => {
    const id = document.getElementById('delete-id').value.trim();
    if (!id) {
      printOutput(output, { error: 'Provide record ID to delete.' });
      return;
    }
    try {
      await request(`${config.path}/${id}`, { method: 'DELETE' });
      printOutput(output, { message: 'Record deleted.', id });
      document.getElementById('delete-id').value = '';
    } catch (error) {
      printOutput(output, { error: error.message });
    }
  });
}

document.getElementById('logout-link').addEventListener('click', (event) => {
  event.preventDefault();
  clearSession();
  window.location.href = '/login.html';
});
