import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addressApi,
  Address,
  CreateAddressData,
  UpdateAddressData,
} from "@/lib/api/address";
import { toast } from "sonner";
import { RootState } from "../store";

interface AddressState {
  addresses: Address[];
  defaultAddress: Address | null;
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  defaultAddress: null,
  loading: false,
  error: null,
};

// Fetch all addresses
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressApi.getAddresses();
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Không thể tải danh sách địa chỉ";
      return rejectWithValue(message);
    }
  }
);

// Fetch default address
export const fetchDefaultAddress = createAsyncThunk(
  "address/fetchDefaultAddress",
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressApi.getDefaultAddress();
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Không thể tải địa chỉ mặc định";
      return rejectWithValue(message);
    }
  }
);

// Create new address
export const createAddress = createAsyncThunk(
  "address/createAddress",
  async (data: CreateAddressData, { rejectWithValue }) => {
    try {
      const response = await addressApi.createAddress(data);
      toast.success("Thêm địa chỉ thành công!");
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Không thể thêm địa chỉ";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Update address
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async (
    { index, data }: { index: number; data: UpdateAddressData },
    { rejectWithValue }
  ) => {
    try {
      const response = await addressApi.updateAddress(index, data);
      toast.success("Cập nhật địa chỉ thành công!");
      return { index, data: response.data };
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Không thể cập nhật địa chỉ";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Delete address
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (index: number, { rejectWithValue }) => {
    try {
      await addressApi.deleteAddress(index);
      toast.success("Xóa địa chỉ thành công!");
      return index;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Không thể xóa địa chỉ";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Set default address
export const setDefaultAddress = createAsyncThunk(
  "address/setDefaultAddress",
  async (index: number, { rejectWithValue }) => {
    try {
      const response = await addressApi.setDefaultAddress(index);
      toast.success("Đặt địa chỉ mặc định thành công!");
      return { index, data: response.data };
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Không thể đặt địa chỉ mặc định";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch addresses
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch default address
    builder
      .addCase(fetchDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.defaultAddress = action.payload;
      })
      .addCase(fetchDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create address
    builder
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload.addresses;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update address
    builder
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const { index, data } = action.payload;
        state.addresses[index] = data;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete address
    builder
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.splice(action.payload, 1);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Set default address
    builder
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        const { index, data } = action.payload;
        // Reset all isDefault to false
        state.addresses.forEach((addr) => (addr.isDefault = false));
        // Set selected as default
        state.addresses[index] = data;
        state.defaultAddress = data;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = addressSlice.actions;

// Selectors
export const selectAddresses = (state: RootState) => state.address.addresses;
export const selectDefaultAddress = (state: RootState) =>
  state.address.defaultAddress;
export const selectAddressLoading = (state: RootState) =>
  state.address.loading;
export const selectAddressError = (state: RootState) => state.address.error;

export const addressReducer = addressSlice.reducer;