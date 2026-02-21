const output = document.getElementById('output');
let authToken = '';

const print = (payload) => {
  output.textContent = JSON.stringify(payload, null, 2);
};

const post = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
    },
    body: JSON.stringify(body)
  });

  return response.json();
};

document.getElementById('register-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  const data = await post('/api/auth/register', payload);
  if (data.token) authToken = data.token;
  print(data);
});

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  const data = await post('/api/auth/login', payload);
  if (data.token) authToken = data.token;
  print(data);
});

document.getElementById('dashboard-btn').addEventListener('click', async () => {
  const response = await fetch('/api/dashboard', {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
  });
  const data = await response.json();
  print(data);
});
