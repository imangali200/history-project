/**
 * Centralized API Client for QAZHISTORY Frontend
 * Connects directly to the NestJS Backend via Vite proxy or direct URL
 */

const API_BASE_URL =
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:4000/api'
    : (import.meta.env.VITE_API_URL || '/api');

export function getAuthToken() {
  try {
    return localStorage.getItem('qazhistory_token') || '';
  } catch {
    return '';
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem('qazhistory_token', token);
    } else {
      localStorage.removeItem('qazhistory_token');
    }
  } catch {}
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const res = await fetch(url, config);
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = json?.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    // NestJS TransformInterceptor returns { success: true, data: ..., timestamp: ... }
    return json?.data !== undefined ? json.data : json;
  } catch (error) {
    console.warn(`[API] Error on ${options.method || 'GET'} ${url}:`, error.message);
    throw error;
  }
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
