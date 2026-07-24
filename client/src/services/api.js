import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization header automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('third_ai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Auth API
export const loginAdmin = (credentials) => api.post('/auth/login', credentials);
export const getMe = () => api.get('/auth/me');

// Projects API
export const fetchProjects = (params) => api.get('/projects', { params });
export const fetchProjectById = (id) => api.get(`/projects/${id}`);
export const getCloudinaryConfig = () => api.get('/projects/cloudinary-config');
export const getCloudinarySignature = () => api.get('/projects/cloudinary-signature');
export const getPresignedUrl = (payload) => api.post('/projects/presigned-url', payload);
export const createProject = (formData) => api.post('/projects', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateProject = (id, formData) => api.put(`/projects/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Services API
export const fetchServices = () => api.get('/services');
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);

// Reviews API
export const fetchReviews = (params) => api.get('/reviews', { params });
export const createReview = (formData) => api.post('/reviews', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateReview = (id, formData) => api.put(`/reviews/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const toggleHideReview = (id) => api.put(`/reviews/${id}/toggle-hide`);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

// Contact API
export const submitContactInquiry = (data) => api.post('/contacts', data);
export const fetchContacts = () => api.get('/contacts');
export const updateContactStatus = (id) => api.put(`/contacts/${id}/status`);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);

// CEO API
export const fetchCEOs = () => api.get('/ceos');
export const createCEO = (formData) => api.post('/ceos', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateCEO = (id, formData) => api.put(`/ceos/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteCEO = (id) => api.delete(`/ceos/${id}`);

// Stats API
export const fetchStats = () => api.get('/stats');
export const updateStats = (data) => api.put('/stats', data);

export default api;
