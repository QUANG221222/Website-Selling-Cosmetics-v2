import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { orderApi, CreateOrderData, UpdateOrderData } from "@/lib/api/order";
import { Order } from "@/lib/types";
import { toast } from "sonner";

// ===== STATE INTERFACE =====
interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  createLoading: false,
};

// ===== ASYNC THUNKS =====

// Create new order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (data: CreateOrderData, { rejectWithValue }) => {
    try {
      const response = await orderApi.createOrder(data);
      toast.success("Đơn hàng đã được tạo thành công!");
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Không thể tạo đơn hàng";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Fetch all user orders
export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getUserOrders();
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Không thể tải danh sách đơn hàng";
      return rejectWithValue(message);
    }
  }
);

// Fetch order by ID
export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderById(orderId);
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Không thể tải thông tin đơn hàng";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Update order
export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async (
    { orderId, data }: { orderId: string; data: UpdateOrderData },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderApi.updateOrder(orderId, data);
      toast.success("Đơn hàng đã được cập nhật");
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Không thể cập nhật đơn hàng";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await orderApi.cancelOrder(orderId);
      toast.success("Đơn hàng đã được hủy");
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Không thể hủy đơn hàng";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Delete order
export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (orderId: string, { rejectWithValue }) => {
    try {
      await orderApi.deleteOrder(orderId);
      toast.success("Đơn hàng đã được xóa");
      return orderId;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Không thể xóa đơn hàng";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ===== SLICE =====
export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createLoading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload as string;
      })

      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
        if (state.currentOrder?._id === action.payload) {
          state.currentOrder = null;
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ===== ACTIONS =====
export const { clearError, clearCurrentOrder } = orderSlice.actions;

// ===== BASE SELECTORS =====
const selectOrderState = (state: { order: OrderState }) => state.order;

// ===== MEMOIZED SELECTORS =====
export const selectOrders = createSelector(
  [selectOrderState],
  (orderState) => orderState.orders
);

export const selectCurrentOrder = createSelector(
  [selectOrderState],
  (orderState) => orderState.currentOrder
);

export const selectOrderLoading = createSelector(
  [selectOrderState],
  (orderState) => orderState.loading
);

export const selectCreateOrderLoading = createSelector(
  [selectOrderState],
  (orderState) => orderState.createLoading
);

export const selectOrderError = createSelector(
  [selectOrderState],
  (orderState) => orderState.error
);

// Select orders by status
export const selectOrdersByStatus = (status: string) =>
  createSelector([selectOrders], (orders) =>
    orders.filter((order) => order.status === status)
  );

// Select pending orders
export const selectPendingOrders = createSelector([selectOrders], (orders) =>
  orders.filter((order) => order.status === "pending")
);

// Select completed orders
export const selectCompletedOrders = createSelector([selectOrders], (orders) =>
  orders.filter((order) => order.status === "completed")
);

// ===== REDUCER =====
export const orderReducer = orderSlice.reducer;
