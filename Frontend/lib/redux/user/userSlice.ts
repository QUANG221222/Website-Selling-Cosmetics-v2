import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '@/lib/api/axios'
import { toast } from 'sonner'

// Add proper types
interface LoginData {
  email: string
  password: string
}

interface UserState {
  currentUser: any | null
}

// Declare initial state in userSlice
const initialState: UserState = {
  currentUser: null
}

// Use createAsyncThunk to handle async actions
export const loginUserApi = createAsyncThunk(
  'user/loginUserApi',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
       "users/login",
        data
      )
      toast.success('Login successful!')
      return response.data
    } catch (error: any) {
      // Return error message of API
      const message =
        error?.response?.data?.message || error.message || 'Login failed'
      return rejectWithValue(message)
    }
  }
)

export const logoutUserApi = createAsyncThunk(
  'user/logoutApi',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.delete("users/logout")
      toast.success('Logout successful!')
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || 'Logout failed'
      return rejectWithValue(message)
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Reducers: handle synchronous actions
  reducers: {},
  // Extra reducers: handle asynchronous actions
  extraReducers: (builder) => {
    builder
      .addCase(loginUserApi.fulfilled, (state, action) => {
        //action.payload is response.data in loginUserApi
        state.currentUser = action.payload
      })
      .addCase(loginUserApi.rejected, (state, action) => {
        // Xử lý khi login thất bại
        state.currentUser = null
        // Có thể hiển thị toast error ở đây nếu muốn
        toast.error(action.payload as string)
      })
      .addCase(logoutUserApi.fulfilled, (state) => {
        state.currentUser = null
      })
  }
})

// Selector: get the current user by hook useSelector()
export const selectCurrentUser = (state: { user: UserState }) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer