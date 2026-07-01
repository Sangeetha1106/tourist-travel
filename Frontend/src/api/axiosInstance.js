import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to automatically add the JWT token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors like 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      } else if (error.response.status === 403) {
        alert('You do not have permission to access this resource.');
      } else if (error.response.status >= 500) {
        alert('A server error occurred. Please try again later.');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
