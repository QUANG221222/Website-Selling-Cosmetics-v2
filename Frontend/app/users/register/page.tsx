"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputField from "@/components/forms/InputField";
import { useForm, SubmitHandler } from "react-hook-form";
import FooterLink from "@/components/forms/FooterLink";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import axios from "axios";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const { username, email, password } = data;
      // Sử dụng authApi.register thay vì registerApi
      await authApi.register({ username, email, password });
      toast.success("Đăng ký thành công!");
      toast.success("Vui lòng kiểm tra email của bạn để xác minh tài khoản.");
      router.push("/users/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Đăng ký thất bại!");
      } else {
        toast.error("Đăng ký thất bại!");
      }
      console.error(error);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="border-border">
          <CardHeader className="text-center mt-1">
            <CardTitle className="font-inter text-foreground">
              Đăng ký tài khoản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                name="username"
                label="Username"
                placeholder="Jake123"
                register={register}
                error={errors.username}
                validation={{
                  required: "Username là bắt buộc",
                  pattern: {
                    value: /^[a-zA-Z0-9_]{3,30}$/,
                    message:
                      "Username phải có độ dài từ 3-30 ký tự và chỉ chứa chữ cái, số và dấu gạch dưới",
                  },
                }}
              />
              <InputField
                name="email"
                label="Email"
                placeholder="abc@gmail.com"
                register={register}
                error={errors.email}
                validation={{
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/,
                    message: "Địa chỉ email không hợp lệ",
                  },
                }}
              />
              <InputField
                name="password"
                label="Password"
                placeholder="Nhập mật khẩu của bạn..."
                type="password"
                register={register}
                error={errors.password}
                validation={{
                  required: "Mật khẩu là bắt buộc",
                  minLength: 6,
                  pattern: {
                    value:
                      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).+$/,
                    message:
                      "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa, 1 số, 1 ký tự đặc biệt và có độ dài tối thiểu 6 ký tự",
                  },
                }}
              />
              <InputField
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Nhập lại mật khẩu của bạn..."
                type="password"
                register={register}
                error={errors.confirmPassword}
                validation={{
                  required: "Vui lòng xác nhận mật khẩu của bạn",
                  validate: (value: string, formValues: SignUpFormData) =>
                    value === formValues.password || "Mật khẩu không khớp",
                }}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins"
              >
                {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </form>

            <FooterLink
              text="Bạn đã có tài khoản?"
              linkText="Đăng nhập"
              href="/users/login"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
