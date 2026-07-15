import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Thêm Token vào Header tự động
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Xử lý lỗi tập trung và Refresh Token
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const backendMessage = error.response?.data?.message || error.response?.data?.error;

    if (
      error.response?.status === 401 && 
      window.location.pathname !== '/login' && 
      originalRequest.url !== '/auth/refresh-token'
    ) {
      if (!originalRequest._retry) {
        if (isRefreshing) {
          try {
            const token = await new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
              originalRequest.headers.set('Authorization', `Bearer ${token}`);
            } else {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Sử dụng axios thuần để tránh Circular Dependency và Interceptor Loop
          const rs = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          const newAccessToken = rs.data?.data?.accessToken;

          if (!newAccessToken) throw new Error("No new access token received");

          localStorage.setItem('token', newAccessToken);
          useAuthStore.setState({ token: newAccessToken });
          
          processQueue(null, newAccessToken);
          
          if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
            originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
          } else {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        } catch (_error) {
          console.error("REFRESH TOKEN ERROR FE:", _error);
          processQueue(_error, null);
          localStorage.removeItem('token');
          // window.location.href = '/login';
          return Promise.reject(_error);
        } finally {
          isRefreshing = false;
        }
      } else {
        localStorage.removeItem('token');
        // window.location.href = '/login';
      }
    }

    // Nếu đã ở trang /login mà sai pass thì backendMessage sẽ được lấy và ném ra
    if (backendMessage) {
      return Promise.reject(new Error(backendMessage));
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
