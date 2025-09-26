import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-pink-600 uppercase tracking-wider text-sm font-medium">
                Bộ sưu tập mới 2024
              </p>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Khám phá
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  {" "}vẻ đẹp{" "}
                </span>
                tự nhiên của bạn
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-md">
              Những sản phẩm mỹ phẩm cao cấp được tuyển chọn để làm nổi bật vẻ đẹp tự nhiên và sự tự tin của bạn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                Mua sắm ngay
              </Button>
              <Button variant="outline" size="lg">
                Xem bộ sưu tập
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8">
              <div>
                <p className="text-2xl font-bold">500+</p>
                <p className="text-sm text-muted-foreground">Sản phẩm</p>
              </div>
              <div>
                <p className="text-2xl font-bold">50+</p>
                <p className="text-sm text-muted-foreground">Thương hiệu</p>
              </div>
              <div>
                <p className="text-2xl font-bold">10k+</p>
                <p className="text-sm text-muted-foreground">Khách hàng</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1645017324547-0ae2822147b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGFwcGx5aW5nJTIwbWFrZXVwJTIwYmVhdXR5fGVufDF8fHx8MTc1ODc4MDUyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Beauty Model"
                className="rounded-2xl shadow-2xl w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-pink-200 rounded-full blur-xl opacity-60"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-purple-200 rounded-full blur-xl opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
}