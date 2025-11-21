"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/dist/client/components/navigation";
import { useSelector } from "react-redux";
import { Suspense, useEffect } from "react";
import {
  fetchAllCosmetics,
  selectAllCosmetics,
} from "@/lib/redux/cosmetic/cosmeticSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { Cosmetic } from "@/lib/types";
import ProductCardList from "../product/ProductCardList";
import { addToCart } from "@/lib/redux/cart/cartSlice";
import SkeletonProductCardList from "../product/SkeletonProductCardList";
import { toast } from "sonner";
import { selectCurrentUser } from "@/lib/redux/user/userSlice";

const HomePage = () => {
  const router = useRouter();
  const cosmetics = useSelector(selectAllCosmetics);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(fetchAllCosmetics());
  }, [dispatch]);
  // Handle view product detail
  const handleViewProduct = (cosmetic: Cosmetic) => {
    // Navigate to product detail page
    router.push(`/product/${cosmetic._id}`);
  };
  // Handle add to cart
  const handleAddToCart = (
    cosmetic: Cosmetic,
    quantity: number = 1,
    variant?: string
  ) => {
    if(user == null) {
        setTimeout(() => {
            router.push('users/login')
            toast.error("Please login to add to cart!")
        }, 500);
        return;
    }
    dispatch(
      addToCart({
        cosmeticId: cosmetic._id,
        quantity,
        variant,
      })
    );
    toast.success("Add to cart success!")
  };
  const handleDirect = () => {
    router.push("/product");
  };
  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden rounded-lg">
        <div className="absolute inset-0 z-0">
          <Image
            src="/background.webp"
            alt="Beauty Model"
            width={1440}
            height={1000}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl font-playfair text-brand-deep-pink">
              Khám Phá Vẻ Đẹp Tự Nhiên Của Bạn
            </h1>
            <p className="font-inter text-foreground text-lg leading-relaxed">
              Mỹ phẩm an toàn, chất lượng từ thiên nhiên
            </p>
            <Button
              onClick={handleDirect}
              className="bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins px-8 py-3 cursor-pointer"
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
          <Suspense fallback={<SkeletonProductCardList />}>
            <ProductCardList
              cosmetics={cosmetics}
              onAddToCart={handleAddToCart}
              onViewDetail={handleViewProduct}
            />
          </Suspense>
        </div>

        <div className="text-center">
          <Button
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
              <h2 className="font-inter text-foreground">Về Chúng Tôi</h2>
              <p className="text-muted-foreground font-inter text-lg leading-relaxed">
                Chúng tôi mang đến những sản phẩm mỹ phẩm an toàn, chất lượng,
                giúp bạn tự tin tỏa sáng.
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
                variant="outline"
                className="border-brand-deep-pink text-brand-deep-pink hover:bg-brand-deep-pink hover:text-white font-poppins"
              >
                Tìm Hiểu Thêm
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src="/product0.webp"
                    alt="Skincare Products"
                    width={500}
                    height={48}
                    className="w-full h-48 object-cover"
                  />
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src="/product1.webp"
                    alt="Pink Makeup"
                    width={500}
                    height={48}
                    className="w-full h-48 object-cover"
                  />
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
                Tất cả sản phẩm đều được chiết xuất từ thiên nhiên, không chứa
                chất độc hại.
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
                Sản phẩm được kiểm nghiệm chặt chẽ và có chứng nhận chất lượng
                quốc tế.
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
};
export default HomePage;
