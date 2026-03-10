const TOKEN_KEY = 'sms_token';
const USER_KEY = 'sms_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const setSession = (user, token) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const request = async (url, { method = 'GET', body } = {}) => {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  if (response.status === 204) return null;

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
};

export const ensureAuth = () => {
  if (!getToken()) {
    window.location.href = '/index.html';
  }
};

export const parseValue = (key, value) => {
  if (!value) return value;
  if (['score', 'maxScore', 'tuition', 'transport', 'books', 'miscellaneous', 'paidAmount', 'period'].includes(key)) return Number(value);
  if (['subjects', 'audience'].includes(key)) return value.split(',').map((v) => v.trim()).filter(Boolean);
  return value;
};
