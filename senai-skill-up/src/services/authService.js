import api from './api';

export const login = (email, password) => api.post('/login', { email, password });

export const register = (userData) => api.post('/register', userData);

export const getProfile = () => api.get('/profile'); 