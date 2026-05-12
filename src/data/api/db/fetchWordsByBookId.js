import { API_ENDPOINTS } from '../api';

export async function fetchWordsByBookId(bookId, signal) {
  const res = await fetch(`${API_ENDPOINTS.downloadBook}/${bookId}`, {
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
