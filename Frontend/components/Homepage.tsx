import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
// import { ProductCard, Product } from './ProductCard';
// import { ImageWithFallback } from './figma/ImageWithFallback';

// interface HomePageProps {
//   featuredProducts: Product[];
//   onAddToCart: (product: Product) => void;
//   onViewProduct: (product: Product) => void;
//   onNavigate: (page: string) => void;
// }

export function HomePage({ featuredProducts, onAddToCart, onViewProduct, onNavigate }: HomePageProps) {
  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden rounded-lg">
        <div className="absolute inset-0 z-0">
          {/* <ImageWithFallback
            src="https://images.unsplash.com/photo-1645143151714-2045a9a3c830?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTMyOTAzMHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Beauty Model"
            className="w-full h-full object-cover"
          /> */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-2xl space-y-6">
            <h1 className="font-playfair text-brand-deep-pink">
              Khám Phá Vẻ Đẹp Tự Nhiên Của Bạn
            </h1>
            <p className="font-inter text-foreground text-lg leading-relaxed">
              Mỹ phẩm an toàn, chất lượng từ thiên nhiên
            </p>
            <Button
              onClick={() => onNavigate('products')}
              className="bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins px-8 py-3"
              size="lg"
            >
              Mua Sắm Ngay
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-inter text-foreground">
            Sản Phẩm Được Yêu Thích
          </h2>
          <p className="text-muted-foreground font-inter text-lg max-w-2xl mx-auto">
            Khám phá những sản phẩm đang dẫn đầu xu hướng làm đẹp.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetail={onViewProduct}
            />
          ))} */}
        </div>
        
        <div className="text-center">
          <Button
            onClick={() => onNavigate('products')}
            variant="outline"
            className="border-brand-pink text-brand-deep-pink hover:bg-brand-pink hover:text-foreground font-poppins px-8"
            size="lg"
          >
            Xem Tất Cả Sản Phẩm
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-inter text-foreground">
                Về Chúng Tôi
              </h2>
              <p className="text-muted-foreground font-inter text-lg leading-relaxed">
                Chúng tôi mang đến những sản phẩm mỹ phẩm an toàn, chất lượng, giúp bạn tự tin tỏa sáng.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mt-3"></div>
                  <p className="text-foreground font-inter">
                    Sản phẩm từ thiên nhiên, an toàn cho mọi loại da
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mt-3"></div>
                  <p className="text-foreground font-inter">
                    Chất lượng được kiểm nghiệm và chứng nhận
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mt-3"></div>
                  <p className="text-foreground font-inter">
                    Dịch vụ chăm sóc khách hàng tận tâm 24/7
                  </p>
                </div>
              </div>
              <Button
                onClick={() => onNavigate('about')}
                variant="outline"
                className="border-brand-deep-pink text-brand-deep-pink hover:bg-brand-deep-pink hover:text-white font-poppins"
              >
                Tìm Hiểu Thêm
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {/* <ImageWithFallback
                    src="https://images.unsplash.com/photo-1618478122572-6f943315c08c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpY3MlMjBza2luY2FyZSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1OTMwNzM1NHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Skincare Products"
                    className="w-full h-48 object-cover"
                  /> */}
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {/* <ImageWithFallback
                    src="https://images.unsplash.com/photo-1725792825878-7f44f8685b5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwbWFrZXVwJTIwY29zbWV0aWNzfGVufDF8fHx8MTc1OTMyOTAyMXww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Pink Makeup"
                    className="w-full h-48 object-cover"
                  /> */}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6 border-border">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="font-inter font-medium text-foreground">
                Thiên Nhiên An Toàn
              </h3>
              <p className="text-muted-foreground font-inter">
                Tất cả sản phẩm đều được chiết xuất từ thiên nhiên, không chứa chất độc hại.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 border-border">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-inter font-medium text-foreground">
                Chất Lượng Đảm Bảo
              </h3>
              <p className="text-muted-foreground font-inter">
                Sản phẩm được kiểm nghiệm chặt chẽ và có chứng nhận chất lượng quốc tế.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 border-border">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="font-inter font-medium text-foreground">
                Dịch Vụ Tận Tâm
              </h3>
              <p className="text-muted-foreground font-inter">
                Chăm sóc khách hàng 24/7, hỗ trợ tư vấn sản phẩm miễn phí.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}