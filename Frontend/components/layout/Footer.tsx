import { Facebook, Instagram, Mail, Phone } from 'lucide-react';    

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="font-playfair text-brand-deep-pink">
              Beautify
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Mang đến những sản phẩm mỹ phẩm an toàn, chất lượng, giúp bạn tự tin tỏa sáng.
            </p>
            {/* Social Media
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="hover:text-brand-deep-pink">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-brand-deep-pink">
                <Instagram className="h-5 w-5" />
              </Button>
            </div> */}
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-inter font-medium text-foreground">
              Liên Hệ
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@beautify.vn</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>090xxxxxxx</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-inter font-medium text-foreground">
              Liên Kết Nhanh
            </h4>
            <div className="space-y-2">
             
                <button
                  className="block text-muted-foreground hover:text-brand-deep-pink transition-colors text-left"
                >
                    Chính sách đổi trả
                </button>
                <button
                  className="block text-muted-foreground hover:text-brand-deep-pink transition-colors text-left"
                >
                    Hướng dẫn mua hàng
                </button>
                <button
                  className="block text-muted-foreground hover:text-brand-deep-pink transition-colors text-left"
                >
                    Về chúng tôi
                </button>
              
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Beautify. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
  
}

export default Footer
