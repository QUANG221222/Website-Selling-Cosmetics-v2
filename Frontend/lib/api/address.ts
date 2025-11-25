import { ApiResponse } from "../types";
import axiosInstance from "./axios";

export interface Address {
  name: string;
  phone: string;
  addressDetail: string;
  isDefault: boolean;
}

export interface AddressResponse {
  _id: string;
  userId: string;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CreateAddressData {
  name: string;
  phone: string;
  addressDetail: string;
  isDefault?: boolean;
}

export interface UpdateAddressData {
  name?: string;
  phone?: string;
  addressDetail?: string;
  isDefault?: boolean;
}

export const addressApi = {
  // Get all addresses
  getAddresses: async (): Promise<ApiResponse<Address[]>> => {
    const response = await axiosInstance.get("/addresses");
    return response.data;
  },

  // Get default address
  getDefaultAddress: async (): Promise<ApiResponse<Address>> => {
    const response = await axiosInstance.get("/addresses/default");
    return response.data;
  },

  // Get address by index
  getAddressById: async (index: number): Promise<ApiResponse<Address>> => {
    const response = await axiosInstance.get(`/addresses/${index}`);
    return response.data;
  },

  // Create new address
  createAddress: async (
    data: CreateAddressData
  ): Promise<ApiResponse<AddressResponse>> => {
    const response = await axiosInstance.post("/addresses", data);
    return response.data;
  },

  // Update address
  updateAddress: async (
    index: number,
    data: UpdateAddressData
  ): Promise<ApiResponse<Address>> => {
    const response = await axiosInstance.put(`/addresses/${index}`, data);
    return response.data;
  },

  // Delete address
  deleteAddress: async (index: number): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete(`/addresses/${index}`);
    return response.data;
  },

  // Set default address
  setDefaultAddress: async (
    index: number
  ): Promise<ApiResponse<Address>> => {
    const response = await axiosInstance.put(`/addresses/${index}/default`);
    return response.data;
  },
};