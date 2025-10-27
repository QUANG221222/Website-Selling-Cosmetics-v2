import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axios";
import { toast } from "sonner";
import { RootState } from "../store";
import { User } from "@/lib/types";
// Add proper types
interface LoginData {
  email: string;
  password: string;
}

// interface UserState {
//   currentUser: User | null;
//   loading: boolean;
//   error: string | null;
//   allUsers?: User[];
// }
interface UserState {
  users: {
    items: User[]; // Mảng users
    totalCount: 0; // Tổng số users
    currentPage: 1; // Trang hiện tại
    pageSize: 20; // Số items/trang
    filters: {}; // Bộ lọc (role, status, etc.)
    sortBy: "createdAt"; // Sắp xếp theo
    sortOrder: "desc"; // Thứ tự sắp xếp
  };
  loading: boolean; // Trạng thái loading
  error: string | null; // Lỗi nếu có
  selectedUser: User | null; // User đang được chọn
}

// Declare initial state in userSlice
const initialState: UserState = {
  users: {
    items: [],
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
    filters: {},
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  loading: false,
  error: null,
  selectedUser: null,
};

// Use createAsyncThunk to handle async actions
export const loginUserApi = createAsyncThunk(
  "user/loginUserApi",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("users/login", data);
      const userData = response.data.data || response.data;

      if (!userData || !userData._id) {
        console.error("❌ Dữ liệu không hợp lệ:", userData);
        throw new Error(
          "Không nhận được dữ liệu người dùng hợp lệ sau khi đăng nhập"
        );
      }

      return userData;
    } catch (error: any) {
      console.error("❌ Đăng nhập thất bại:", error);
      const message =
        error?.response?.data?.message || error.message || "Đăng nhập thất bại";
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
      toast.success("Đăng xuất thành công!");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Đăng xuất thất bại";
      return rejectWithValue(message);
    }
  }
);

export const createNewUser = createAsyncThunk(
    "user/createNewUser",
    async (data: { 
            username: string; 
            email: string; 
            password: string; 
            fullName: string; 
            role: string 
        }, 
            { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("users", data);
            const userData = response.data.data || response.data;
            toast.success("User created successfully!");
            return userData;
        } catch (error: any) {
            console.error("❌ Create user error:", error);
            const message =
                error?.response?.data?.message || error.message || "Create user failed";
            toast.error(message);
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

export const fetchALlUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("users/");
      return response.data?.data ?? response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Fetch all users failed";
      return rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`users/${userId}`);
      toast.success("User deleted successfully!");
      return userId;
    } catch (error: any) {
      const message =
        error?.reponse?.data?.message || error.message || "Delete user failed";
      toast.error(message);
      return rejectWithValue(message);
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
      state.selectedUser = action.payload;
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
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(loginUserApi.rejected, (state, action) => {
        state.loading = false;
        state.selectedUser = null;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUserApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUserApi.fulfilled, (state) => {
        state.loading = false;
        state.selectedUser = null;
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
        state.selectedUser = action.payload;
        console.log("✅ Current user fetched:", action.payload);
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.selectedUser = null;
      })
      // Fetch all users
      .addCase(fetchALlUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchALlUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users.items = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.items ?? [];
      })
      .addCase(fetchALlUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
    })
        // Create new user
    .addCase(createNewUser.pending, (state) => {
        state.loading = true;
    })
    .addCase(createNewUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.items.push(action.payload);
    })
    .addCase(createNewUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
    })
    // Delete user
    .addCase(deleteUser.pending, (state) => {
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.items = state.users.items.filter(
          (user) => user._id !== action.payload
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearError, setCurrentUser } = userSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.user?.selectedUser;
export const selectUserLoading = (state: RootState) => state.user?.loading;
export const selectUserError = (state: RootState) => state.user?.error;
export const selectAllUsers = (state: RootState) =>
  state.user?.users.items ?? [];
// Reducer
export const userReducer = userSlice.reducer;
