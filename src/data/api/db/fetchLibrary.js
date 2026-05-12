import { API_ENDPOINTS } from '../api';

export async function fetchLibrary(signal) {
  const res = await fetch(API_ENDPOINTS.viewLibrary, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });
  const result = await res.json();
  if (!res.ok) throw new Error({ status: res.status, detail: result.error });
  return result;
}
