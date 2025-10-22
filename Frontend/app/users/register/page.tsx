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
import {useRouter} from "next/navigation"

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
            toast.success('Registration successful!');
            router.push("/users/login")   
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Đăng ký thất bại!');
            } else {
                toast.error('Đăng ký thất bại!');
            }
            console.error(error);
        }
   }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="border-border">
          <CardHeader className="text-center">
            <CardTitle className="font-inter text-foreground">
              Register
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
                   required: 'Username is required',
                    pattern: {
                        value: /^[a-zA-Z0-9_]{3,30}$/,
                        message: 'Username must be 3-30 characters and can only contain letters, numbers, and underscores'
                    } 
                }}
              />
              <InputField
                name="email"
                label="Email"
                placeholder="abc@gmail.com"
                register={register}
                error={errors.email}
                validation={{
                  required: "Email is required",
                  pattern: {
                    value: /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                }}
              />
              <InputField  
                name="password"
                label="Password"
                placeholder="Enter a strong password"
                type="password"
                register={register}
                error={errors.password}
                validation={{ 
                    required: "password is required", 
                    minLength: 6,
                    pattern: {
                         value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).+$/,
                        message: "Password must contain at least 1 uppercase letter, 1 number, 1 special character, and at least 6 characters long",   
                    }
                 }}
              />
              <InputField
                name="confirmPassword"
                label="Confirm password"
                placeholder="Re-enter your password..."
                type="password"
                register={register}
                error={errors.confirmPassword}
                validation={{
                  required: "Please confirm your password",
                  validate: (value: string, formValues: SignUpFormData) =>
                    value === formValues.password || "Passwords do not match",
                }}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins"
              >
                {isSubmitting ? "Processing..." : "Register"}
              </Button>
            </form>

            <FooterLink
              text="Already have an account?"
              linkText="Login"
              href="users/login"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
