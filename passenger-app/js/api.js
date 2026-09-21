// TransitNow API Client
// Automatically uses current origin, or custom backend URL if deployed separately (e.g. Vercel + Render/Railway)
const API_BASE = window.TRANSITNOW_API_URL || localStorage.getItem('transitnow_backend_url') || '';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('transitnow_passenger_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || data.message || `Request failed (${res.status})`);
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}
