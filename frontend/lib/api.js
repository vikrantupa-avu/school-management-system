export const API_BASE = '/api';

export const withSchool = (path, schoolId) => (schoolId ? `${API_BASE}/${schoolId}${path}` : `${API_BASE}${path}`);

export const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  if (response.status === 204) return null;
  return response.json();
};

export const buildPagedUrl = (base, { page = 1, pageSize = 10, search = '' } = {}) => {
  const params = new URLSearchParams();
  params.set('limit', String(pageSize));
  if (search) params.set('search', search);
  params.set('page', String(page));
  return `${base}?${params.toString()}`;
};
