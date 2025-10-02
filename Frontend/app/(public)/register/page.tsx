"use client";
import React from 'react'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputField from '@/components/forms/InputField';
import { useForm, SubmitHandler  } from "react-hook-form"
import FooterLink from '@/components/forms/FooterLink';
import { register as registerApi } from '@/lib/api';
const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
    defaultValues: {
        username: '',
        email: '',
        password: '',
    },
    mode: 'onBlur',
  })

   const onSubmit = async (data: SignUpFormData) => {
    try {
        const res = await registerApi(data);
        console.log(data);
    } catch (e) {
        console.error(e);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="border-border">
            <CardHeader className="text-center">
              <CardTitle className="font-inter text-foreground">
                Đăng ký
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
                    validation={{ required: 'Username is required',minLength: 2 }}

                />
                <InputField 
                    name="email"
                    label="Email"
                    placeholder="abc@gmail.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Email is required', pattern: { value: /^\w+@\w+\.\w+$/, message: 'Invalid email address' }}}

                />
                <InputField 
                    name="password"
                    label="Password"
                    placeholder="Enter a strong password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'password is required',minLength: 8 }}
                />
                  <Button
                    type="submit"
                    disabled={isSubmitting} 
                    className="w-full bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins"
                  >
                    {isSubmitting ? 'Bắt đầu trải nghiệm mua hàng': 'Đăng ký'}
                  </Button>
            </form>
    
            <FooterLink text="Đã có tài khoản" linkText="Đăng nhập" href="/login" />
            

            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

export default Register;
