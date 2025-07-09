// API configuration for different environments
const getApiUrl = () => {
  // In production, use relative URLs (same domain)
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  
  // In development, use localhost
  return 'http://localhost:3000';
};

export const API_BASE_URL = getApiUrl();

// API endpoint helper
export const apiEndpoint = (path) => `${API_BASE_URL}/api${path}`;

// Fetch wrapper with error handling
export const apiFetch = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('/api') ? `${API_BASE_URL}${endpoint}` : endpoint;
  
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Merge options
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete fetchOptions.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, fetchOptions);
    return response;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};

export default { API_BASE_URL, apiEndpoint, apiFetch };
