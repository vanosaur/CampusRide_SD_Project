import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  // Remove trailing slash if present
  if (url.endsWith('/')) url = url.slice(0, -1);
  // Ensure it ends with /api
  if (!url.endsWith('/api')) url += '/api';
  return url;
};

const api = axios.create({
  baseURL: getBaseURL()
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error: AxiosError) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response: AxiosResponse) => {
  return response;
}, (error: AxiosError) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;
