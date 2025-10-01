'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail, CheckCircle } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    setIsLoading(false);
    setEmail("");
    
    // Reset after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-600">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4">
            Đăng ký nhận tin khuyến mãi
          </h2>
          
          <p className="text-lg opacity-90 mb-8">
            Nhận thông tin về sản phẩm mới, ưu đãi độc quyền và các mẹo làm đẹp hữu ích trước tiên
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-2 bg-white/20 rounded-full px-6 py-3 max-w-md mx-auto">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Đăng ký thành công!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-white text-purple-600 hover:bg-gray-100 font-medium px-8"
              >
                {isLoading ? "Đang gửi..." : "Đăng ký"}
              </Button>
            </form>
          )}

          <p className="text-sm opacity-75 mt-4">
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <a href="#" className="underline hover:no-underline">
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a href="#" className="underline hover:no-underline">
              Chính sách bảo mật
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}