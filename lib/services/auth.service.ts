import axios from 'axios';
import permissionService from './permission.service';


/// <reference types="vite/client" />
// FIX: Property 'env' does not exist on type 'ImportMeta'.
// Prefer Vite env var for client apps; fallback to process.env.API_URI for other environments
const baseURL =  process.env.VITE_API_KEY || '';
if (!baseURL) {
  console.warn('API base URL is not set. Set VITE_API_KEY in your .env to point to the backend API.');
}
const axiosAuth = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

axiosAuth.interceptors.request.use(
  (config) => {
    try {
      const session = localStorage.getItem('accessToken');
      if (session) {
        config.headers['Authorization'] = `Bearer ${session}`;
        config.headers['access-token'] = `${session}`;
        // Also set standard Authorization header for broader backend compatibility
      }
    } catch (e) {
      // No session, skip
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosAuth;
export const authService = {
  register: async ({ fullname, email, password }: { fullname: string; email: string; password: string }) => {
    const payload = {
      type: 'manual',
      fullname,
      email,
      password
    };
    console.log('Register payload:', payload);
    try {
      const response = await axiosAuth.post('/auth/register', payload);
      console.log('Register response:', response);
      if (response.data?.status === 'success') {
        authService.saveSession(response);
        console.log('Register successful:', response.data);
        return response.data;
      } else {
        console.error('Register failed:', response.data);
        throw new Error(response.data?.message || 'Register failed');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error?.response?.data?.message || error?.message || 'Invalid credentials or server error');
    }
  },
  signup: async ({ email, password }: { email: string; password: string }) => {
    const payload = { type: 'manual', email, password };
    try {
      const response = await axiosAuth.post('/auth/signup', payload);
      if (response.data?.status === 'success') {
        authService.saveSession(response);
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Signup failed');
      }
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || 'Signup error');
    }
  },
  login: async (email: string, password: string) => {
    const payload = {
      type: 'manual',
      email,
      password
    };
    console.log('Login payload:', payload);
    try {
      console.log('Login payload:', payload);
      const response = await axiosAuth.post('/auth/login', payload);
      console.log('Login response:', response);
      if (response.data?.status === 'success') {
        // If user info is not in response.data.data.user, fallback to response.data.data or response.data.user
        authService.saveSession(response);
        console.log('Login successful:', response.data);
        return response.data;
      } else {
        console.error('Login failed:', response.data);
        throw new Error(response.data?.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error?.response?.data?.message || error?.message || 'Invalid credentials or server error');
    }
  },

  /**
   * Save user info and tokens to localStorage for later retrieval
   */
  saveSession: (response: any) => {
    const { accessToken, refreshToken } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    // Decode JWT to get user info
    let user = {};
    try {
      const base64Url = accessToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      user = JSON.parse(jsonPayload);
    } catch (e) {
      user = {};
    }
    localStorage.setItem('user', JSON.stringify(user));
    // Load and cache current user's permission map immediately after saving session
    try {
      // fire-and-forget; keep UX responsive. permissionService will persist to localStorage.
      permissionService.currentUserPermissionList().catch(() => {});
    } catch (e) {
      // ignore
    }
  },

  logout: () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
  },
  /**
   * Get user and token info from localStorage
   */
  getSession: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userRaw = localStorage.getItem('user');
    if (!accessToken) {
      throw new Error('No active session found');
    }
    const user = userRaw ? JSON.parse(userRaw) : 1;
    return { accessToken, refreshToken, user };
  },
  forgetPassword: async (email: string) => {
    try {
      const response = await axiosAuth.post('/auth/forget-password', { email });
      console.log('Forget password response:', response);
      if (response.status === 201) {
        // No accessToken returned for forgot password
        return true;
      } else {
        throw new Error(response.data?.message || 'Failed to send reset password link');
      }
    } catch (error: any) {
      console.error('Forget password error:', error);
      throw new Error(error?.response?.data?.message || error.message || 'Error sending reset password link');
    }
  },
  verifyEmail: async (verificationCode: string) => {
    try {
      const response = await axiosAuth.post('/auth/verify-email', { verificationCode });
      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Email verification failed');
      }
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message || 'Error verifying email');
    }
  },
  verifyPin: async (resetPIN: string, email: string) => {
    try {
      const response = await axiosAuth.post('/auth/verify-pin', { resetPIN, email });
      if (response.data?.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'PIN verification failed');
      }
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message || 'Error verifying PIN');
    }
  },
  resendPin: async (email: string) => {
    try {
      const response = await axiosAuth.post('/auth/resend-pin', { type: 'email', email });
      if (response.data?.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Resend PIN failed');
      }
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message || 'Error resending PIN');
    }
  },
  newPassword: async (email?: string, password?: string, resetPIN?: string) => {
    try {
      const response = await axiosAuth.post('/auth/new-password', { email, password, resetPIN });
      if (response.data?.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'New password failed');
      }
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message || 'Error setting new password');
    }
  },
  renewPassword: async (password: string) => {
    try {
      const response = await axiosAuth.post('/auth/renew-password', { password });
      if (response.data?.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Renew password failed');
      }
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message || 'Error renewing password');
    }
  },
  changePassword: async (oldPassword: string, newPassword: string) => {
    try {
      const response = await axiosAuth.post('/auth/change-password', { oldPassword, newPassword });
      if (response.data?.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Change password failed');
      }
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message || 'Error changing password');
    }
  },
  refreshToken: async () => {
    try {
      const response = await axiosAuth.post('/auth/refresh-token');
      if (response.data?.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Refresh token failed');
      }
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message || 'Error refreshing token');
    }
  }
};

axiosAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && !window.location.href.includes('/login')) {
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data) || error.message || 'Wrong Services');
  }
);