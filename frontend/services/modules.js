import { fetchJson, withSchool } from '../lib/api';

export const listModuleRecords = (modulePath, { schoolId, search = '', page = 1, pageSize = 10 } = {}) => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  params.set('page', String(page));
  params.set('limit', String(pageSize));
  return fetchJson(`${withSchool(modulePath, schoolId)}?${params.toString()}`);
};

export const createModuleRecord = (modulePath, payload, { schoolId } = {}) =>
  fetchJson(withSchool(modulePath, schoolId), { method: 'POST', body: JSON.stringify(payload) });

export const deleteModuleRecord = (modulePath, id, { schoolId } = {}) =>
  fetchJson(`${withSchool(modulePath, schoolId)}/${id}`, { method: 'DELETE' });
