import axios from 'axios';

const vietQRApi = axios.create({
  baseURL: 'https://api.vietqr.io/v2',
  headers: {
    'x-client-id': process.env.VIETQR_CLIENT_ID,
    'x-api-key': process.env.VIETQR_API_KEY,
    'Content-Type': 'application/json',
  },
});

export interface GenerateQRParams {
  bankAccountNumber: string
  bankBin: string
  amount: number
  description?: string
}


export const generateQRCode = async (
  accountNo: string,
  acqId: string,
  amount: number,
  addInfo?: string
): Promise<any> => {
  try {
    const payload = {
      accountNo: String(accountNo),
      accountName: process.env.BANK_ACCOUNT_NAME,   
      acqId: String(acqId),
      amount: Number(amount),
      addInfo: addInfo || 'Payment',
      format: 'text',
      template: 'print'
    }

    console.log('VietQR API Payload:', payload)

   
    const response = await vietQRApi.post('/generate', payload);

    if (response.data.code === '00') {
      return response.data
    } else {
      throw new Error(response.data.desc || 'Failed to generate QR')
    }
  } catch (error: any) {
    console.error('VietQR API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    throw error
  }
}
