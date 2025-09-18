import axios from 'axios';
import { showErrorDialog } from '../ui/errorDialogBridge';

// Lightweight, safe error handler. Replace with your UI dialog when available.
const handleError = (message: string) => {
  try {
    // Prefer console.error in headless contexts; apps can replace this implementation.
    // If you have a global error modal, call it here.
    // Example replacement: import showDialog from 'components/ErrorDialog'; showDialog(message);
    console.error('[API ERROR]', message);
  } catch (e) {
    // swallow
  }
};

// Request interceptor: attach tokens when present.
axios.interceptors.request.use(
  (config: any) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        // Ensure headers object exists
        if (!config.headers) config.headers = {};
        // Some backends expect custom header name; add both
        config.headers['access-token'] = `${token}`;
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      // non-fatal
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error: any) => {
    const errorMsg = error?.response?.data?.message || error?.message || 'An unexpected error occurred.';
    try {
      // Use the UI bridge so a modal appears. Provide a short title.
      showErrorDialog('Request failed', String(errorMsg));
    } catch (e) {
      // ignore
    }
    return Promise.reject(error);
  }
);
