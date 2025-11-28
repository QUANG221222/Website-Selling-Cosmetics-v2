import axiosInstance from "./axios";

export const generateQRPayment = async (amount: number, description = '') => {
  try {
    const response = await axiosInstance.post('/payment/generate-qr', {
      amount,
      description,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating QR:', error);
    throw error;
  }
};