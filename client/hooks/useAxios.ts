import { useEffect } from 'react';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axiosInstance from '@/config/axiosInstance';
import { useAuth } from '@/contexts/AuthContext';

const useAxios = () => {
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (isAuthenticated && user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        
        if (error.response?.status === 401 && !originalRequest?._retry) {
          originalRequest._retry = true;
          
          try {
            // Attempt to refresh token
            const refreshResponse = await axiosInstance.post('/api/v1/auth/refresh-token', {}, {
              withCredentials: true
            });
            
            if (refreshResponse.status === 200) {
              // Update the token and retry original request
              const newToken = refreshResponse.data.data.accessToken;
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            await logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [isAuthenticated, user?.accessToken, logout]);

  return axiosInstance;
};

export default useAxios;