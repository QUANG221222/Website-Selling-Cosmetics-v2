import axios, { AxiosError, AxiosInstance } from 'axios';
import { toast } from "sonner"
import { logoutUserApi } from '../redux/user/userSlice';

//Inject store to import redux store in non-component
let axiosReduxStore: any

export const injectStore = (mainStore: any) => {
  axiosReduxStore = mainStore
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ||  'http://localhost:8080/v1/',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 1000 * 60 * 30
});


// Interceptor response
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    console.log('❌ Axios interceptor - ERROR:', error.response?.status, error.response?.data); // Debug
    // Handle 401 Unauthorized - ONLY for authentication errors
    if (error.response?.status === 401) {
      toast.error('Session expired. Please log in again!');
      
      // Clear user data in Redux store
      if (axiosReduxStore) {
        axiosReduxStore.dispatch({ type: 'user/logoutUserApi/fulfilled' });
      }
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('persist:root');
        sessionStorage.clear();
        window.location.href = '/users/login';
      }
      return Promise.reject(error);
    }
    
    // Handle 429 Too Many Requests
    if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later.');
      return Promise.reject(error);
    }
    
    // Handle other errors (400, 403, 404, 500, etc.)
    if (error.response?.status && error.response.status !== 401) {
      let errorMessage = error.message;
      
      if (error.response?.data) {
        const data = error.response.data as any;
        errorMessage = data.message || data.error || errorMessage;
      }

      // Only show toast for errors that aren't handled elsewhere
      if (errorMessage && !error.config?.headers?.['X-No-Toast']) {
        toast.error(errorMessage);
      }
    }
    
    return Promise.reject(error);
  }
)

export default axiosInstance;