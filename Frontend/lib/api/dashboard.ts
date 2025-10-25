import { ApiResponse } from "@/lib/types/index";
import axiosInstance from "@/lib/api/axios";

const getRevenueByYear = async (year: number): Promise<number> => {
  try {
    const response = await axiosInstance.get(`/dashboard/revenue/${year}`);
    return response.data.revenue;
  } catch (error) {
    throw error;
  }
};

const getRevenueByMonth = async (
  year: number,
  month: number
): Promise<number> => {
  try {
    const response = await axiosInstance.get(
      `/dashboard/revenue/${year}/${month}`
    );
    return response.data.revenue;
  } catch (error) {
    throw error;
  }
};

const getTotalOrders = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get(`/dashboard/total-orders`);
    return response.data.total;
  } catch (error) {
    throw error;
  }
};

const getTotalOrdersByMonth = async (
  year: number,
  month: number
): Promise<number> => {
  try {
    const response = await axiosInstance.get(
      `/dashboard/total-orders-by-month/${year}/${month}`
    );
    return response.data.total;
  } catch (error) {
    throw error;
  }
};

const getTotalOrdersSuccess = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get(`/dashboard/total-orders-success`);
    return response.data.total;
  } catch (error) {
    throw error;
  }
};

const getTotalOrdersPending = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get(`/dashboard/total-orders-pending`);
    return response.data.total;
  } catch (error) {
    throw error;
  }
};

const getTotalOrdersProcessing = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get(
      `/dashboard/total-orders-processing`
    );
    return response.data.total;
  } catch (error) {
    throw error;
  }
};

const getTotalOrdersCancelled = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get(
      `/dashboard/total-orders-cancelled`
    );
    return response.data.total;
  } catch (error) {
    throw error;
  }
};

const getTotalUsers = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get(`/dashboard/total-users`);
    return response.data.total;
  } catch (error) {
    throw error;
  }
};

const getTotalProducts = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get(`/dashboard/total-products`);
    return response.data.total;
  } catch (error) {
    throw error;
  }
};

export const dashboardApi = {
  getRevenueByYear,
  getTotalOrders,
  getTotalOrdersSuccess,
  getTotalOrdersPending,
  getTotalOrdersProcessing,
  getTotalOrdersCancelled,
  getTotalUsers,
  getTotalProducts,
  getTotalOrdersByMonth,
  getRevenueByMonth,
};
