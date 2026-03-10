import { request, setSession, printOutput, formToPayload, getDefaultHomePath } from './api.js';

const output = document.getElementById('output');

const handleAuth = async (event, endpoint) => {
  event.preventDefault();
  try {
    const payload = formToPayload(event.target);
    const data = await request(endpoint, { method: 'POST', body: payload });
    setSession({ token: data.token, user: data.user });
    printOutput(output, data);
    window.location.href = getDefaultHomePath(data.user?.role);
  } catch (error) {
    printOutput(output, { error: error.message });
  }
};

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

if (registerForm) {
  registerForm.addEventListener('submit', (event) => handleAuth(event, '/api/auth/register'));
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => handleAuth(event, '/api/auth/login'));
}
