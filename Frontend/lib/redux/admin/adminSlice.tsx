import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axios";
import { toast } from "sonner";

interface AdminLoginData {
  email: string;
  password: string;
}

interface AdminState {
  currentAdmin: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  currentAdmin: null,
  loading: false,
  error: null,
};

// Admin Login
export const loginAdminApi = createAsyncThunk(
  "admin/loginAdminApi",
  async (data: AdminLoginData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("admin/login", data);
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

// Admin Logout
export const logoutAdminApi = createAsyncThunk(
  "admin/logoutApi",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("admin/logout");
      toast.success("Đăng xuất thành công!");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Đăng xuất thất bại";
      return rejectWithValue(message);
    }
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdminApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdminApi.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAdmin = action.payload;
      })
      .addCase(loginAdminApi.rejected, (state, action) => {
        state.loading = false;
        state.currentAdmin = null;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Logout
      .addCase(logoutAdminApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAdminApi.fulfilled, (state) => {
        state.loading = false;
        state.currentAdmin = null;
      })
      .addCase(logoutAdminApi.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;

// Selectors
export const selectCurrentAdmin = (state: { admin: AdminState }) =>
  state.admin.currentAdmin;
export const selectAdminLoading = (state: { admin: AdminState }) =>
  state.admin.loading;
export const selectAdminError = (state: { admin: AdminState }) =>
  state.admin.error;

export const adminReducer = adminSlice.reducer;
