const API_BASE_URL = 'https://velop-backend-dzw7.onrender.com/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('velopToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');

  let data = {};

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();

    if (text) {
      data = { message: text };
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('velopToken');
    }

    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
}
