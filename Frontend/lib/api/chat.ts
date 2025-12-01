import axiosInstance from "@/lib/api/axios";

export const socketApi = {
  fetchChats: async () => {
    const response = await axiosInstance.get(`/chats/admin/all`);
    return response.data;
  },
};
