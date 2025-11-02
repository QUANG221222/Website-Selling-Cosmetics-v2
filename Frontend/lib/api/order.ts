import { ApiResponse, Order } from "../types";
import axiosInstance from "./axios";

// ===== INTERFACES =====
export interface CreateOrderData {
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  orderNotes?: string;
  items: {
    cosmeticId: string;
    quantity: number;
    price: number;
  }[];
  paymentMethod: "COD" | "BANK";
//   totalAmount: number;
}
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  message: string;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UpdateOrderData {
  status?: "pending" | "processing" | "completed" | "cancelled";
  payment?: {
    status?: "unpaid" | "paid" | "failed";
    method?: string;
    paidAt?: Date;
  };
}

// ===== API METHODS =====
export const orderApi = {
  // Create new order
  createOrder: async (data: CreateOrderData): Promise<ApiResponse<Order>> => {
    const response = await axiosInstance.post("/orders", data);
    return response.data;
  },

  // Get all orders for current user
  getUserOrders: async (): Promise<ApiResponse<Order[]>> => {
    const response = await axiosInstance.get("/orders");
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId: string): Promise<ApiResponse<Order>> => {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  },
  
  getAllOrders: async (): Promise<ApiResponse<Order[]>> => {
    const response = await axiosInstance.get("/orders/admin");
    return response.data;
  },
  // Update order
  updateOrder: async (
    orderId: string,
    data: UpdateOrderData
  ): Promise<ApiResponse<Order>> => {
    const response = await axiosInstance.put(`/orders/${orderId}`, data);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
    const response = await axiosInstance.put(`/orders/${orderId}`, {
      status: "cancelled",
    });
    return response.data;
  },

  // Delete order (admin only)
  deleteOrder: async (orderId: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(`/orders/${orderId}`);
    return response.data;
  },
  // Get all orders with pagination (admin)
  getAllOrdersWithPagination: async (
    params: PaginationParams
  ): Promise<PaginatedResponse<Order>> => {
    const response = await axiosInstance.get("/orders/pagination/list", {
      params: {
        page: params.page,
        limit: params.limit,
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc'
      }
    });
    return response.data;
  },
};
