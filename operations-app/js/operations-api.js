// Operations Dedicated API Client
const API_BASE = window.TRANSITNOW_API_URL || localStorage.getItem('transitnow_backend_url') || '';

export async function opsApiRequest(endpoint, options = {}) {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || data.message || `Operations request failed (${res.status})`);
    }
    return data;
  } catch (err) {
    console.error(`Operations API Error [${endpoint}]:`, err);
    throw err;
  }
}
