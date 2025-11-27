"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Shield, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/api/axios";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

interface AdminRegisterForm {
  secretKey: string;
  adminName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AdminRegister = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdminRegisterForm>();

  const password = watch("password");

  const onSubmit = async (data: AdminRegisterForm) => {
    setIsSubmitting(true);
    try {
      const { secretKey, adminName, email, password } = data;

      await axiosInstance.post("admin/register", {
        secretKey,
        adminName,
        email,
        password,
      });

      toast.success(
        "Tài khoản quản trị viên đã được tạo thành công! Vui lòng xác thực email của bạn."
      );
      router.push("/admin/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Đăng ký không thành công!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-violet-50 ">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-[#E91E63]" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Đăng Ký Quản Trị Viên
          </CardTitle>
          <CardDescription>
            Tạo tài khoản quản trị viên mới (Cần có khóa bí mật)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              Bạn cần một khóa bí mật hợp lệ để đăng ký làm quản trị viên
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secretKey">Khóa Bí Mật *</Label>
              <Input
                id="secretKey"
                type="password"
                placeholder="Nhập khóa bí mật quản trị viên"
                {...register("secretKey", {
                  required: "Khóa bí mật là bắt buộc",
                })}
                className={errors.secretKey ? "border-red-500" : ""}
              />
              {errors.secretKey && (
                <p className="text-sm text-red-500">
                  {errors.secretKey.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminName">Tên Đăng Nhập Quản Trị Viên *</Label>
              <Input
                id="adminName"
                type="text"
                placeholder="adminuser"
                {...register("adminName", {
                  required: "Tên đăng nhập quản trị viên là bắt buộc",
                  pattern: {
                    value: /^[a-zA-Z0-9_]{3,30}$/,
                    message:
                      "Tên đăng nhập phải có 3-30 ký tự (chữ cái, số, dấu gạch dưới)",
                  },
                })}
                className={errors.adminName ? "border-red-500" : ""}
              />
              {errors.adminName && (
                <p className="text-sm text-red-500">
                  {errors.adminName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Địa Chỉ Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật Khẩu *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu mạnh"
                {...register("password", {
                  required: "Mật khẩu là bắt buộc",
                  minLength: {
                    value: 8,
                    message: "Mật khẩu phải có ít nhất 8 ký tự",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt",
                  },
                })}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác Nhận Mật Khẩu *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                {...register("confirmPassword", {
                  required: "Vui lòng xác nhận mật khẩu của bạn",
                  validate: (value) =>
                    value === password || "Mật khẩu không khớp",
                })}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang Tạo Tài Khoản...
                </>
              ) : (
                "Tạo Tài Khoản Quản Trị Viên"
              )}
            </Button>
          </form>

          <div className="mt-3 text-center text-sm pb-3">
            <p className="text-muted-foreground">
              Bạn đã có tài khoản quản trị viên?{" "}
              <Link
                href="/admin/login"
                className="text-[#E91E63] hover:underline font-medium"
              >
                Đăng Nhập
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRegister;
