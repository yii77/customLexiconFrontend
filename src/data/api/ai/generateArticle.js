import { API_ENDPOINTS } from '../api';

export async function generateArticle(payload) {
  console.log(payload);
  const res = await fetch(API_ENDPOINTS.generateArticle, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) throw new Error({ status: res.status, error: result.error });

  return result;
}
