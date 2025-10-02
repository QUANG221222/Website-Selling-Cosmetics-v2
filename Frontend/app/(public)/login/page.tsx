'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


const SignIn = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: SignInFormData) => {
        try {  
            console.error('Login', data);
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
                    Đăng nhập
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <InputField
                        name="email"
                        label="Email"
                        placeholder="abc@gmail.com"
                        register={register}
                        error={errors.email}
                        validation={{ required: 'Email là bắt buộc', pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/}}
                    />

                    <InputField
                        name="password"
                        label="Password"
                        placeholder="Nhập mật khẩu..."
                        type="password"
                        register={register}
                        error={errors.password}
                        validation={{ required: 'Mật khẩu là bắt buộc', minLength: 8 }}
                    />

                    <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins">
                        {isSubmitting ? 'Đang đăng nhập' : 'Đăng nhập'}
                    </Button>

                    <FooterLink text="Không có tài khoản" linkText="Tạo tài khoản" href="/register" />
                </form>
                

                </CardContent>
            </Card>
            </div>
      </div>

            
 
    );
};
export default SignIn;