import { API_ENDPOINTS } from '../api';

export async function fetchDistractorVersion() {
  const res = await fetch(`${API_ENDPOINTS.getDistractor}/version`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await res.json();

  if (!res.ok) throw new Error({ status: res.status, detail: result.error });
  return result;
}

export async function fetchDistractorDownload() {
  return fetchPracticeSourceDownload(API_ENDPOINTS.getDistractor);
}

export async function fetchWordVersion() {
  const res = await fetch(`${API_ENDPOINTS.getWord}/version`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await res.json();

  if (!res.ok) throw new Error({ status: res.status, detail: result.error });

  return result;
}

export async function fetchWordDownload() {
  return fetchPracticeSourceDownload(API_ENDPOINTS.getWord);
}

async function fetchPracticeSourceDownload(endpoint) {
  const limit = 20000;
  let page = 1;
  let allList = [];

  while (true) {
    const res = await fetch(`${endpoint}/download?page=${page}&limit=${limit}`);
    const result = await res.json();

    if (!res.ok) throw new Error({ status: res.status, detail: result.error });

    const list = Array.isArray(result.data) ? result.data : [];
    allList = [...allList, ...list];
    if (list.length < limit) {
      break;
    }

    page++;
  }

  return allList;
}
