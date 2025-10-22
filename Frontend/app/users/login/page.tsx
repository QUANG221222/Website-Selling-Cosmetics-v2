"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import FooterLink from "@/components/forms/FooterLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authApi } from "@/lib/api/auth";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/lib/redux/store";
import { loginUserApi } from "@/lib/redux/user/userSlice";
import { useDispatch } from "react-redux";
const SignIn = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
} = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    try {
        await dispatch(loginUserApi(data)).unwrap();

         toast.success('Đăng nhập thành công!');
         router.push("/")
    } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Đăng nhập thất bại!');
            } else {
                toast.error('Đăng nhập thất bại!');
            }
            console.error(error);
        }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="border-border">
          <CardHeader className="text-center">
            <CardTitle className="font-inter text-foreground">Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <InputField
                name="email"
                label="Email"
                placeholder="abc@gmail.com"
                register={register}
                error={errors.email}
                validation={{
                  required: "Email is required",
                  pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                }}
              />

              <InputField
                name="password"
                label="Password"
                placeholder="Enter your password..."
                type="password"
                register={register}
                error={errors.password}
                validation={{ required: "Password is required", minLength: 8 }}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <FooterLink
                text="Don't have an account?"
                linkText="Register"
                href="/users/register"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default SignIn;
