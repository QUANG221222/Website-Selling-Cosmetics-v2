import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axios";
import { toast } from "sonner";
import { RootState } from "../store";
// Add proper types
interface LoginData {
  email: string;
  password: string;
}

interface User {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  phone: string;
  role: string;
  isActive: boolean;
}

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

// Declare initial state in userSlice
const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

// Use createAsyncThunk to handle async actions
export const loginUserApi = createAsyncThunk(
  "user/loginUserApi",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("users/login", data);
      const userData = response.data.data || response.data;

      if (!userData || !userData._id) {
        console.error("❌ Invalid user data:", userData);
        throw new Error("No valid user data received from server");
      }

      toast.success("Login successful!");
      return userData;
    } catch (error: any) {
      console.error("❌ Login error:", error);
      const message =
        error?.response?.data?.message || error.message || "Login failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const logoutUserApi = createAsyncThunk(
  "user/logoutApi",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("users/logout");
      toast.success("Logout successful!");
      return null;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Logout failed";
      return rejectWithValue(message);
    }
  }
);

// Thêm thunk để fetch current user từ session
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      // Add header to skip auth redirect for this silent check
      const response = await axiosInstance.get("users/me", {
        headers: {
          "X-Skip-Auth-Redirect": "true",
        },
      });
      const userData = response.data.data || response.data;

      if (!userData || !userData._id) {
        return null; // Không có user, trả về null thay vì reject
      }

      return userData;
    } catch (error: any) {
      console.log("❌ Not logged in or session expired");
      return rejectWithValue(null);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Thêm action để set user manually nếu cần
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  // Extra reducers: handle asynchronous actions
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUserApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserApi.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(loginUserApi.rejected, (state, action) => {
        state.loading = false;
        state.currentUser = null;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUserApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUserApi.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.error = null;
      })
      .addCase(logoutUserApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        console.log("✅ Current user fetched:", action.payload);
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.currentUser = null;
      });
  },
});

// Actions
export const { clearError, setCurrentUser } = userSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.user?.currentUser;
export const selectUserLoading = (state: RootState) => state.user?.loading;
export const selectUserError = (state: RootState) => state.user?.error;
// Reducer
export const userReducer = userSlice.reducer;
