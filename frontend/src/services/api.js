import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies (refreshToken)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add access token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 or 403 (Unauthorized/Forbidden), clear token and redirect to login
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      // Don't redirect if we're already on login/signup pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  signin: async (credentials) => {
    const response = await api.post('/auth/signin', credentials);
    // Store access token
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  },

  signout: async () => {
    const response = await api.post('/auth/signout');
    localStorage.removeItem('accessToken');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },
};

// User API
export const userAPI = {
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateMe: async (userData) => {
    const response = await api.patch('/users/me', userData);
    return response.data;
  },
};

// Mood API
export const moodAPI = {
  create: async (moodData) => {
    const response = await api.post('/moods', moodData);
    return response.data;
  },

  list: async (params = {}) => {
    const response = await api.get('/moods', { params });
    return response.data;
  },

  listAll: async () => {
    const response = await api.get('/moods/all');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/moods/${id}`);
    return response.data;
  },

  update: async (id, moodData) => {
    const response = await api.patch(`/moods/${id}`, moodData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/moods/${id}`);
    return response.data;
  },

  getStats: async (params = {}) => {
    const response = await api.get('/moods/stats', { params });
    return response.data;
  },
};

// Journal API
export const journalAPI = {
  create: async (journalData) => {
    const response = await api.post('/journals', journalData);
    return response.data;
  },

  list: async (params = {}) => {
    const response = await api.get('/journals', { params });
    return response.data;
  },

  listAll: async () => {
    const response = await api.get('/journals/all');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/journals/${id}`);
    return response.data;
  },

  update: async (id, journalData) => {
    const response = await api.patch(`/journals/${id}`, journalData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/journals/${id}`);
    return response.data;
  },
};

// Habit API
export const habitAPI = {
  create: async (habitData) => {
    const response = await api.post('/habits', habitData);
    return response.data;
  },

  list: async () => {
    const response = await api.get('/habits');
    return response.data;
  },

  listAll: async () => {
    const response = await api.get('/habits/all');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/habits/${id}`);
    return response.data;
  },

  update: async (id, habitData) => {
    const response = await api.patch(`/habits/${id}`, habitData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/habits/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/habits/stats');
    return response.data;
  },

  toggle: async (id, date) => {
    const response = await api.post(`/habits/${id}/toggle`, { date });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/habits/stats');
    return response.data;
  },
};

// Exercise API
export const exerciseAPI = {
  create: async (exerciseData) => {
    const response = await api.post('/exercises', exerciseData);
    return response.data;
  },

  list: async () => {
    const response = await api.get('/exercises');
    return response.data;
  },

  listAll: async () => {
    const response = await api.get('/exercises/all');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/exercises/${id}`);
    return response.data;
  },

  update: async (id, exerciseData) => {
    const response = await api.patch(`/exercises/${id}`, exerciseData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/exercises/${id}`);
    return response.data;
  },
};

// Sleep API
export const sleepAPI = {
  create: async (sleepData) => {
    const response = await api.post('/sleeps', sleepData);
    return response.data;
  },

  list: async (params = {}) => {
    const response = await api.get('/sleeps', { params });
    return response.data;
  },

  listAll: async () => {
    const response = await api.get('/sleeps/all');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/sleeps/${id}`);
    return response.data;
  },

  update: async (id, sleepData) => {
    const response = await api.patch(`/sleeps/${id}`, sleepData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/sleeps/${id}`);
    return response.data;
  },

  getFact: async (category = null) => {
    const params = category ? { category } : {};
    const response = await api.get('/sleeps/fact', { params });
    return response.data;
  },
};

// Overview API
export const overviewAPI = {
  get: async () => {
    const response = await api.get('/overview');
    return response.data;
  },
};

export default api;

