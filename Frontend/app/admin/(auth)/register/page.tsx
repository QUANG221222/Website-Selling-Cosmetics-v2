"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Shield, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/api/axios";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      
      await axiosInstance.post('admin/register', {
        secretKey,
        adminName,
        email,
        password
      });
      
      toast.success('Admin account created! Please check your email to verify.');
      router.push("/admin/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Registration failed!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Registration</CardTitle>
          <CardDescription>
            Create a new admin account (Secret key required)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              You need a valid secret key to register as an admin
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secretKey">Secret Key *</Label>
              <Input
                id="secretKey"
                type="password"
                placeholder="Enter admin secret key"
                {...register("secretKey", {
                  required: "Secret key is required",
                })}
                className={errors.secretKey ? "border-red-500" : ""}
              />
              {errors.secretKey && (
                <p className="text-sm text-red-500">{errors.secretKey.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminName">Admin Username *</Label>
              <Input
                id="adminName"
                type="text"
                placeholder="adminuser"
                {...register("adminName", {
                  required: "Admin username is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_]{3,30}$/,
                    message: "Username must be 3-30 characters (letters, numbers, underscores)",
                  },
                })}
                className={errors.adminName ? "border-red-500" : ""}
              />
              {errors.adminName && (
                <p className="text-sm text-red-500">{errors.adminName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
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
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter strong password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Password must contain uppercase, lowercase, number and special character",
                  },
                })}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Admin Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an admin account?{" "}
              <a href="/admin/login" className="text-primary hover:underline font-medium">
                Sign In
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRegister;