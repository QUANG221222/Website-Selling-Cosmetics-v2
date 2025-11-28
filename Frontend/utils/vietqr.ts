import axios from 'axios';

const vietQRApi = axios.create({
  baseURL: 'https://api.vietqr.io/v2',
  headers: {
    'x-client-id': process.env.NEXT_PUBLIC_VIETQR_CLIENT_ID as string,
    'x-api-key': process.env.NEXT_PUBLIC_VIETQR_API_KEY as string,
    'Content-Type': 'application/json',
  },
});

interface GenerateQRCodeParams {
  bankAccountNumber: string;
  bankBin: string;
  amount: number;
  description: string;
}

interface VietQRResponse {
  code: string;
  desc: string;
  data: any; 
}

export const generateQRCode = async ({
  bankAccountNumber,
  bankBin,
  amount,
  description,
}: GenerateQRCodeParams): Promise<VietQRResponse> => {
  try {
    const response = await vietQRApi.post<VietQRResponse>('/generate', {
      accountNumber: bankAccountNumber,
      accountName: 'Your Store Name', // Thay bằng tên cửa hàng của bạn
      acqId: bankBin,
      amount: amount,
      addInfo: description,
      format: 'text', // hoặc 'png' nếu muốn hình ảnh
      template: 'compact', // hoặc 'no_border'
    });

    return response.data;
  } catch (error: any) {
    console.error('Error generating QR code:', error.response?.data || error.message);
    throw error;
  }
};