import { useEffect } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import axiosInstance from '@/config/axiosInstance';

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const useAxios = () => {
  useEffect(() => {
    // Request interceptor
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return axiosInstance;
};

export default useAxios;

// useEffect(() => {
//     // Request interceptor
//     const requestInterceptor = axiosInstance.interceptors.request.use(
//       (config) => {
//         // You can add auth token here if needed
//         // const token = getTokenFromStorage();
//         // if (token) {
//         //   config.headers.Authorization = `Bearer ${token}`;
//         // }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     // Response interceptor
//     const responseInterceptor = axiosInstance.interceptors.response.use(
//       (response: AxiosResponse) => response,
//       async (error: AxiosError) => {
//         const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
//         // Handle 401 Unauthorized
//         if (error.response?.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true;
          
//           try {
//             // Attempt to refresh token if needed
//             // const response = await axiosInstance.post('/api/v1/auth/refresh-token');
//             // if (response.status === 200) {
//             //   return axiosInstance(originalRequest);
//             // }
            
//             // If refresh fails, logout user
//             if (isAuthenticated) {
//               await logout();
//               router.push('/login');
//             }
//           } catch (refreshError) {
//             await logout();
//             router.push('/login');
//           }
//         }
        
//         // Handle other errors
//         if (error.response) {
//           // The request was made and the server responded with a status code
//           // that falls out of the range of 2xx
//           console.error('Response error:', error.response.data);
//           console.error('Status:', error.response.status);
//           console.error('Headers:', error.response.headers);
//         } else if (error.request) {
//           // The request was made but no response was received
//           console.error('Request error:', error.request);
//         } else {
//           // Something happened in setting up the request that triggered an Error
//           console.error('Error:', error.message);
//         }
        
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       // Cleanup interceptors when component unmounts
//       axiosInstance.interceptors.request.eject(requestInterceptor);
//       axiosInstance.interceptors.response.eject(responseInterceptor);
//     };
//   }, [isAuthenticated, logout, router]);

//   return axiosInstance;
// };

// export default useAxios;
