"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/api/axios";

const UserVerification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const email = searchParams.get("email");
      const token = searchParams.get("token");

      if (!email || !token) {
        setStatus("error");
        setMessage("Thiếu email hoặc mã xác thực");
        return;
      }

      try {
        await axiosInstance.post("/admin/verify", { email, token });
        setStatus("success");
        setMessage(
          "Tài khoản của bạn đã được xác thực thành công. Bây giờ bạn có thể đăng nhập."
        );
        toast.success("Xác thực thành công! Bạn có thể đăng nhập ngay.");
      } catch (error: any) {
        setStatus("error");
        const errorMsg = error?.response?.data?.message;

        if (errorMsg?.includes("already verified")) {
          setMessage("Tài khoản này đã được xác thực.");
        } else {
          setMessage(
            errorMsg ||
              "Xác thực không thành công. Liên kết có thể không hợp lệ hoặc đã hết hạn."
          );
        }
        toast.error("Xác thực không thành công!");
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleNavigateToLogin = () => {
    router.push("/admin/login");
  };

  const handleNavigateToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            {status === "loading" && (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="h-8 w-8 text-green-600" />
            )}
            {status === "error" && <XCircle className="h-8 w-8 text-red-600" />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === "loading" && "Đang Xác Thực Email Của Bạn"}
            {status === "success" && "Xác Thực Email Thành Công!"}
            {status === "error" && "Xác Thực Thất Bại"}
          </CardTitle>
          <CardDescription>
            {status === "loading" &&
              "Vui lòng chờ trong khi chúng tôi xác thực địa chỉ email của bạn..."}
            {status === "success" &&
              "Chào mừng bạn đến với Beauty! Tài khoản của bạn đã sẵn sàng."}
            {status === "error" &&
              "Chúng tôi không thể xác thực địa chỉ email của bạn"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`p-4 rounded-lg ${
              status === "success"
                ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                : status === "error"
                ? "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                : "bg-slate-50 dark:bg-slate-800"
            }`}
          >
            <p
              className={`text-sm text-center ${
                status === "success"
                  ? "text-green-700 dark:text-green-300"
                  : status === "error"
                  ? "text-red-700 dark:text-red-300"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {message}
            </p>
          </div>

          {status === "success" && (
            <div className="space-y-2">
              <Button onClick={handleNavigateToLogin} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Đăng Nhập Vào Tài Khoản Của Bạn
              </Button>
              <Button
                onClick={handleNavigateToHome}
                variant="outline"
                className="w-full"
              >
                Về Trang Chủ
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <Button
                onClick={handleNavigateToLogin}
                className="w-full"
                variant="outline"
              >
                Quay Lại Đăng Nhập
              </Button>
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground">
                  Cần giúp đỡ? Liên hệ với đội ngũ hỗ trợ của chúng tôi
                </p>
                <a
                  href="mailto:support@beauty.com"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  support@beauty.com
                </a>
              </div>
            </div>
          )}

          {status === "loading" && (
            <div className="flex justify-center py-4">
              <div className="animate-pulse text-sm text-muted-foreground">
                Đang Xác Thực Tài Khoản Của Bạn...
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserVerification;
