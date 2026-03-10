import { withAuthGuard, mountShell, request, printOutput, clearSession } from './api.js';

withAuthGuard();
document.body.innerHTML = mountShell('dashboard');

document.getElementById('page-content').innerHTML = `
  <section class="hero">
    <h1>Welcome to your school operations center</h1>
    <p>Track users, academics, attendance, grades, fees, announcements, and key KPIs from dedicated pages.</p>
  </section>
  <section class="grid">
    <article class="card"><h3>Active Students</h3><div class="kpi" id="kpi-students">-</div></article>
    <article class="card"><h3>Active Teachers</h3><div class="kpi" id="kpi-teachers">-</div></article>
    <article class="card"><h3>Classes</h3><div class="kpi" id="kpi-classes">-</div></article>
    <article class="card"><h3>Outstanding Fees</h3><div class="kpi" id="kpi-fees">-</div></article>
  </section>
  <section class="card" style="margin-top:1rem;">
    <h3>Latest Output</h3>
    <pre id="output" class="output">Click refresh to load dashboard stats.</pre>
    <button id="refresh-dashboard">Refresh dashboard</button>
  </section>
`;

const output = document.getElementById('output');
const refresh = async () => {
  try {
    const data = await request('/api/dashboard');
    document.getElementById('kpi-students').textContent = data.students ?? 0;
    document.getElementById('kpi-teachers').textContent = data.teachers ?? 0;
    document.getElementById('kpi-classes').textContent = data.classes ?? 0;
    const outstanding = (data.feeStats || []).reduce((sum, item) => sum + (item.outstanding || 0), 0);
    document.getElementById('kpi-fees').textContent = `₹${outstanding.toLocaleString()}`;
    printOutput(output, data);
  } catch (error) {
    printOutput(output, { error: error.message });
  }
};

document.getElementById('refresh-dashboard').addEventListener('click', refresh);
document.getElementById('logout-link').addEventListener('click', (event) => {
  event.preventDefault();
  clearSession();
  window.location.href = '/login.html';
});

refresh();
