import { request, setSession, getUser } from './api.js';

const output = document.getElementById('output');
const user = getUser();
if (user) {
  document.getElementById('session').textContent = `Last login: ${user.name} (${user.role})`;
}

const print = (value) => {
  output.textContent = JSON.stringify(value, null, 2);
};

document.getElementById('register-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.target).entries());
  try {
    const data = await request('/api/auth/register', { method: 'POST', body: payload });
    setSession(data.user, data.token);
    window.location.href = '/dashboard.html';
  } catch (error) {
    print({ error: error.message });
  }
});

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.target).entries());
  try {
    const data = await request('/api/auth/login', { method: 'POST', body: payload });
    setSession(data.user, data.token);
    window.location.href = '/dashboard.html';
  } catch (error) {
    print({ error: error.message });
  }
});
