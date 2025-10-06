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
  withCredentials: true
});


// Interceptor response
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.data?.statusCode === 401) {
      toast.error('Session expired. Please log in again.')
      axiosReduxStore.dispatch(logoutUserApi())
    }
    // Handle 429 Too Many Requests
    if (error.response?.status === 429) {
      // Optionally, you can implement a retry mechanism or show a user-friendly message
      toast.error('Too many requests. Please try again later.')
    }
    if (error.response?.status !== 401 && error.response?.status !== 429) {
      // Handle other errors
      let errorMessage = error?.message
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      if (errorMessage) {
        toast.error(errorMessage)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance;