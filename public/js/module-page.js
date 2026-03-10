import { withAuthGuard, mountShell, moduleConfigs, request, printOutput, formToPayload, clearSession } from './api.js';

withAuthGuard();
const pageKey = document.body.dataset.page;
const config = moduleConfigs[pageKey];

document.body.innerHTML = mountShell(pageKey);

if (!config) {
  document.getElementById('page-content').innerHTML = '<div class="card"><h3>Unknown module.</h3></div>';
} else {
  const fields = config.fields
    .map((field) => {
      if (field === 'message' || field === 'comments' || field === 'remarks' || field === 'address') {
        return `<textarea name="${field}" placeholder="${field}"></textarea>`;
      }
      const isDate = field.toLowerCase().includes('date');
      return `<input name="${field}" type="${isDate ? 'date' : 'text'}" placeholder="${field}${field === 'subjects' || field === 'audience' ? ' (comma separated)' : ''}" />`;
    })
    .join('');

  document.getElementById('page-content').innerHTML = `
    <section class="hero">
      <h1>${config.title}</h1>
      <p>Use this page to create, list, and delete records for ${pageKey}.</p>
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
        <input id="delete-id" placeholder="Enter record ID to delete" />
      </article>
    </section>
    <section class="card" style="margin-top:1rem;">
      <h3>Output</h3>
      <pre id="output" class="output">No actions yet.</pre>
    </section>
  `;

  const output = document.getElementById('output');

  document.getElementById('create-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const payload = formToPayload(event.target);
      const data = await request(config.path, { method: 'POST', body: payload });
      printOutput(output, data);
      event.target.reset();
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
