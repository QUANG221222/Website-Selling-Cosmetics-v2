"use client";

import { useState, useEffect } from "react";
import { generateQRPayment } from "@/lib/api/payment";

export default function PaymentModal({
  amount,
  onClose,
  onPaid,
}: {
  amount: number;
  onClose: () => void;
  onPaid: () => void;
}) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(600); // 10 phút = 600 giây

  // Đếm ngược khi đã có QR code
  useEffect(() => {
    if (!qrCode) {
      setTimer(600);
      return;
    }
    if (timer === 0) {
      setQrCode(null);
      setError("Mã QR đã hết hạn. Vui lòng tạo lại mã mới.");
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [qrCode, timer]);

  const handleGenerateQR = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await generateQRPayment(
        amount,
        `Payment - ${new Date().getTime()}`
      );

      if (response.success) {
        setQrCode(response.data.data.qrDataURL);
      } else {
        setError(response.message || "Lỗi tạo mã QR");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Lỗi kết nối");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div
        className="p-6 md:p-8 rounded-lg shadow-lg max-w-lg w-full"
        style={{
          background: "var(--color-card)",
          color: "var(--color-card-foreground)",
        }}
      >
        <h2 className="text-2xl font-bold mb-4">Quét mã QR để thanh toán</h2>

        <div className="text-center mb-6">
          <p className="text-black">
            Số tiền:{" "}
            <span
              className="font-bold text-lg"
              style={{ color: "var(--color-brand-deep-pink)" }}
            >
              {amount.toLocaleString("vi-VN")} VNĐ
            </span>
          </p>
        </div>

        {qrCode && (
          <div className="text-center mb-5">
            <span
              className="inline-block px-3 py-1 rounded bg-brand-gold text-black font-semibold"
              style={{ background: "var(--color-brand-gold)" }}
            >
              Thời gian còn lại:{" "}
              {Math.floor(timer / 60)
                .toString()
                .padStart(2, "0")}
              :{(timer % 60).toString().padStart(2, "0")}
            </span>
          </div>
        )}

        {!qrCode ? (
          <button
            onClick={handleGenerateQR}
            disabled={loading}
            className="w-full bg-brand-deep-pink text-white hover:bg-brand-deep-pink/80 py-3 rounded-lg font-semibold transition focus-brand"
            style={{
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Đang tạo mã QR..." : "Tạo mã QR"}
          </button>
        ) : (
          <div className="text-center">
            <img
              src={qrCode}
              alt="QR Code"
              className="mx-auto mb-4 w-80 h-96 border-2 p-2"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-input-background)",
              }}
            />
            <p
              className="text-sm mb-4"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              Quét mã QR bằng ứng dụng ngân hàng để thanh toán
            </p>
          </div>
        )}
        {qrCode && (
          <button
            onClick={() => {
              onPaid();
              onClose();
            }}
            className="w-full py-3 rounded-lg font-semibold transition focus-brand hover:opacity-90 text-white cursor-pointer bg-brand-deep-pink"
          >
            Xác nhận thanh toán
          </button>
        )}

        {error && (
          <div
            className="mt-4 p-3 rounded text-sm"
            style={{
              background: "var(--color-destructive)",
              color: "var(--color-destructive-foreground)",
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 rounded-lg font-semibold transition focus-brand bg-foreground text-white cursor-pointer hover:opacity-90"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
