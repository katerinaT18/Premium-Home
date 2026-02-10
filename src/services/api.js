/**
 * API Service Layer
 * Handles all API calls to the backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const authData = localStorage.getItem('adminAuth');
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      return parsed.token;
    } catch (error) {
      return null;
    }
  }
  return null;
};

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, create a meaningful error
        errorData = { 
          error: `Server error: ${response.status} ${response.statusText}`,
          message: `The server returned an error (${response.status}). Please check if the backend is running correctly.`
        };
      }
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Handle network errors (server not running, CORS, etc.)
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error(`Cannot connect to server at ${API_BASE_URL}. Please make sure the backend is running.`);
    }
    // Re-throw other errors
    throw error;
  }
};

/**
 * Auth API
 */
export const authAPI = {
  login: async (username, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  register: async (username, password, agentData = {}) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, ...agentData }),
    });
  },

  verify: async () => {
    return apiRequest('/auth/verify');
  },
};

/**
 * Properties API
 */
export const propertiesAPI = {
  getAll: async () => {
    return apiRequest('/properties');
  },

  getById: async (id) => {
    return apiRequest(`/properties/${id}`);
  },

  create: async (propertyData) => {
    return apiRequest('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  update: async (id, propertyData) => {
    return apiRequest(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/properties/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Agents API
 */
export const agentsAPI = {
  getAll: async () => {
    try {
      return await apiRequest('/agents');
    } catch (error) {
      console.error('Agents API error:', error);
      // Return empty array on error instead of throwing
      return [];
    }
  },

  getById: async (id) => {
    return apiRequest(`/agents/${id}`);
  },

  create: async (agentData) => {
    return apiRequest('/agents', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  },

  update: async (id, agentData) => {
    return apiRequest(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agentData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/agents/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Upload API
 */
export const uploadAPI = {
  uploadImage: async (file) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Failed to upload image');
    }

    const data = await response.json();
    // Return full URL (backend serves uploads at /uploads)
    const baseUrl = API_BASE_URL.replace('/api', '');
    return `${baseUrl}${data.url}`;
  },

  uploadImages: async (files) => {
    const token = getAuthToken();
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_BASE_URL}/upload/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Failed to upload images');
    }

    const data = await response.json();
    // Return full URLs
    const baseUrl = API_BASE_URL.replace('/api', '');
    return data.images.map(img => `${baseUrl}${img.url}`);
  },
};
