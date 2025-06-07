import axios from 'axios';

const AUTH_API_BASE_URL = import.meta.env.VITE_API_USER_ENDPOINT || 'https://backend-auth-system-production.up.railway.app/api';

export const api = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - เพิ่ม Authorization header
api.interceptors.request.use(
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

// Response Interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // สำหรับ 401 error ไม่ต้องทำอะไรเพิ่ม เพราะจะให้ useAuth handle
    if (error.response?.status === 401) {
      // อาจจะ clear token ที่นี่ก็ได้
      // localStorage.removeItem('token');
    }
    
    return Promise.reject(error);
  }
);

export default api;