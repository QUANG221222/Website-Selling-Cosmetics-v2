import axiosInstance from "@/lib/api/axios"
import { ApiResponse, User } from "../types"
import { toast } from "sonner"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  fullName: string
}
interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
  }
}


export const authApi = {
    // User login
    login: async (credentials: LoginCredentials)=> {
        const response = await axiosInstance.post(
            '/users/login',
            credentials
        )
        return response.data;
    },
    logout: async () => {
        const response = await axiosInstance.post('/users/logout');
        toast.success('Logout successful!')
        return response.data;
    },
     register: async (data: { username: string; email: string; password: string }) => {
        const response = await axiosInstance.post('/users/register', data);
        return response.data;
    },  
    // Fetch current user
    getCurrentUser: async (): Promise<ApiResponse<User>> => {
        const response = await axiosInstance.get('/users/me');
        return response.data;
    },
    //Fetch all users
    getAllUsers: async (): Promise<ApiResponse<User[]>> => {
        const response = await axiosInstance.get('/users');
        return response.data;
    },
    deleteUser: async (userId: string) : Promise<ApiResponse<null>> => {
        const response = await axiosInstance.delete(`/users/${userId}`);
        return response.data;
    }
    
}

export const verifyEmail = async (data: { email: string; token: string }) => {
  const response = await axiosInstance.put("users/verify", data)
  toast.success('Your verified successfully! Now you can login to enjoy our services! Have a good day!')
  return response.data
}

