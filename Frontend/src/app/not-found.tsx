import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-4xl font-bold text-white">404</span>
        </div>
        
        <h1 className="mb-4">Trang không tồn tại</h1>
        <p className="text-muted-foreground mb-8">
          Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. 
          Trang có thể đã bị xóa hoặc địa chỉ không chính xác.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Về trang chủ
            </Link>
          </Button>
          
          <Button asChild variant="outline" onClick={() => window.history.back()}>
            <button className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
          </Button>
        </div>
        
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Gợi ý cho bạn:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Kiểm tra lại địa chỉ URL</li>
            <li>• Sử dụng tính năng tìm kiếm</li>
            <li>• Duyệt qua các danh mục sản phẩm</li>
          </ul>
        </div>
      </div>
    </div>
  );
}