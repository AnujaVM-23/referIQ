// client/src/services/api.js - Axios instance + all API calls
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = 'Network error. Please check your connection or server status.';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (email, password, role) =>
    api.post('/auth/register', { email, password, role }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  verifyEmail: (code) => api.post('/auth/verify-email', { code }),
};

// Profile endpoints
export const profileAPI = {
  getProfile: (id) => api.get(`/profiles/${id}`),
  updateProfile: (id, data) => api.put(`/profiles/${id}`, data),
  searchProfiles: (params) => api.get('/profiles/search', { params }),
  revealProfile: (referralId) =>
    api.post('/profiles/reveal', { referralId }),
};

// Referral endpoints
export const referralAPI = {
  createReferral: (data) => api.post('/referrals', data),
  getReferral: (id) => api.get(`/referrals/${id}`),
  updateStatus: (id, newStatus, note) =>
    api.patch(`/referrals/${id}/status`, { newStatus, note }),
  getSentReferrals: (params) =>
    api.get('/referrals/my/sent', { params }),
  getReceivedReferrals: (params) =>
    api.get('/referrals/my/received', { params }),
  reportReferral: (referralId, reason) =>
    api.post(`/referrals/${referralId}/report`, { reason }),
};

// Match endpoints
export const matchAPI = {
  getMatchingReferrers: (params) =>
    api.get('/match/referrers', { params }),
  getMatchingCandidates: (params) =>
    api.get('/match/candidates', { params }),
  scoreMatch: (candidateId, referrerId) =>
    api.post('/match/score', { candidateId, referrerId }),
};

// Score endpoints
export const scoreAPI = {
  getScore: (userId) => api.get(`/scores/${userId}`),
  getLeaderboard: (params) =>
    api.get('/scores/leaderboard', { params }),
  recordEvent: (userId, eventType) =>
    api.post('/scores/event', { userId, eventType }),
};

export default api;
