import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ||  'http://localhost:8080/v1/users',
  headers: { 'Content-Type': 'application/json' },
});


export const login = async (credentials: { email: string; password: string }) => {
  const response = await api.post('login', credentials);
  return response.data.data;
};

export const register = async (userData: { username: string; email: string; password: string }) => {
  const response = await api.post('/register', userData); // Nếu baseURL đã là /v1/users
  return response.data.data;
};

export default api;