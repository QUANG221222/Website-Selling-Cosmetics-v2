import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { orderApi, CreateOrderData, UpdateOrderData } from "@/lib/api/order";
import { Order } from "@/lib/types";
import { toast } from "sonner";

// ===== STATE INTERFACE =====
interface OrderState {
  orders: {
    items: Order[]
    totalCount: number       // Tổng số users
    currentPage: number      // Trang hiện tại
    pageSize: number         // Số items/trang
    filters: {}              // Bộ lọc (role, status, etc.)
    sortBy: 'createdAt'      // Sắp xếp theo
    sortOrder: 'desc'
  }
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
}

const initialState: OrderState = {
  orders: {
    items: [],
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
    filters: {},
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
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
// Fetch All orders (admin)
export const fetchAllOrders = createAsyncThunk(
    "orders/fetchAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderApi.getAllOrders();
            return response.data;
        } catch (error: any) {
            const message =
                error?.response?.data?.message || "Không thể tải danh sách đơn hàng";
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
// Fetch all orders with pagination
export const fetchAllOrdersWithPagination = createAsyncThunk(
  "order/fetchAllOrdersWithPagination",
  async (
    params: {
      page: number;
      limit: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderApi.getAllOrdersWithPagination(params);
      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Không thể tải danh sách đơn hàng";
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
    setPaginationPage: (state, action) => {
      state.orders.currentPage = action.payload;
    },
    setPaginationLimit: (state, action) => {
      state.orders.pageSize = action.payload;
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
        state.orders.items.unshift(action.payload);
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
        state.orders.items = action.payload;
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
        // Fetch all orders (admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.items = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
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
        const index = state.orders.items.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders.items[index] = action.payload;
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
        const index = state.orders.items.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders.items[index] = action.payload;
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
        state.orders.items = state.orders.items.filter(
          (order) => order._id !== action.payload
        );
        if (state.currentOrder?._id === action.payload) {
          state.currentOrder = null;
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllOrdersWithPagination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrdersWithPagination.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.items = action.payload.data ?? [];
        state.orders.totalCount = action.payload.pagination?.totalItems ?? 0;
        state.orders.currentPage = action.payload.pagination?.currentPage ?? 1;
        state.orders.pageSize = action.payload.pagination?.itemsPerPage ?? 20;
      })
      .addCase(fetchAllOrdersWithPagination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.orders.items = []; // Set mảng rỗng khi error
      });
  },
});

// ===== ACTIONS =====
export const { clearError, clearCurrentOrder, setPaginationPage, setPaginationLimit } = orderSlice.actions;

// ===== BASE SELECTORS =====
const selectOrderState = (state: { order: OrderState }) => state.order;

// ===== MEMOIZED SELECTORS =====
export const selectOrders = createSelector(
  [selectOrderState],
  (orderState) => orderState.orders.items ?? []
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


export const selectOrderPagination = createSelector(
  [selectOrderState],
  (orderState) => ({
    currentPage: orderState.orders.currentPage,
    pageSize: orderState.orders.pageSize,
    totalCount: orderState.orders.totalCount,
    totalPages: Math.ceil(orderState.orders.totalCount / orderState.orders.pageSize),
  })
);

// ===== REDUCER =====
export const orderReducer = orderSlice.reducer;
