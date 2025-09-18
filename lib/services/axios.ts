import axios, { AxiosRequestConfig } from 'axios';
// Removed next-auth getSession

const axiosServices = axios.create({ baseURL: process.env.NEXT_APP_API_URL });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

/**
 * Request interceptor to add Authorization token to request
 */

import { authService } from './auth.service';

axiosServices.interceptors.request.use(
  (config) => {
    // Get token from authService
    try {
      const session = authService.getSession();
      if (session?.accessToken) {
        config.headers['Authorization'] = `Bearer ${session.accessToken}`;
      }
    } catch (e) {
      // Redirect to login if session retrieval fails
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && !window.location.href.includes('/login')) {
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.post(url, { ...config });

  return res.data;
};
