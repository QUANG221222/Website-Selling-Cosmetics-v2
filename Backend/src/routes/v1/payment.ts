import express, { Request, Response } from 'express'
import { generateQRCode } from '~/configs/vietqr'

const router = express.Router()

router.post('/generate-qr', async (req: Request, res: Response) => {
  try {
    const { amount, description } = req.body

    const bankAccountNumber = process.env.BANK_ACCOUNT_NUMBER;
    const bankBin = process.env.BANK_BIN;
    const bankAccountName = process.env.BANK_ACCOUNT_NAME;

     // Validate input
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: amount',
      });
    }

    if (!bankAccountNumber || !bankBin || !bankAccountName) {
      return res.status(500).json({
        success: false,
        message: 'Bank information not configured',
      });
    }

    // Validate amount
    if (amount <= 0 || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a valid number greater than 0',
      });
    }

    console.log('Generating QR with:', {
      accountNo: bankAccountNumber,
      accountName: bankAccountName,
      acqId: bankBin,
      amount: amount,
      addInfo: description || 'Payment',
    });

    const qrData = await generateQRCode(
      bankAccountNumber,
      bankBin,
      amount,
      description || 'Payment'
    );

    return res.status(200).json({
      success: true,
      data: qrData,
    });
  } catch (error: any) {
    console.error('Generate QR error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
      error: error.message
    })
  }
})

export const paymentRouter = router;
