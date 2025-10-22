"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Minus, Plus, Star } from "lucide-react";
import {
  fetchCosmeticById,
  selectCosmeticLoading,
  selectSelectedCosmetic,
} from "@/lib/redux/cosmetic/cosmeticSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch } from "@/lib/redux/store";
import { Cosmetic } from "@/lib/types";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
} from "@/lib/redux/cart/cartSlice";
import Link from "next/link";
import Image from "next/image";

import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth";
import { fetchCurrentUser, selectCurrentUser } from "@/lib/redux/user/userSlice";

const cosmeticDetail = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(selectCurrentUser);
  const { requireUserAuth } = useAuth();

  const cosmetic = useSelector(selectSelectedCosmetic);
  const loading = useSelector(selectCosmeticLoading);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);


    // ✅ Fetch user từ session khi component mount
    useEffect(() => {
        if (!currentUser) {
        dispatch(fetchCurrentUser());
        }
    }, [dispatch, currentUser]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };
  // Fetch cosmetic details
  useEffect(() => {
    if (params.id) {
      dispatch(fetchCosmeticById(params.id as string));
    }
  }, [params.id, dispatch]);

  // Update selected image when cosmetic changes
  useEffect(() => {
    if (cosmetic) {
      setSelectedImage(0);
    }
  }, [cosmetic]);

  const handleAddToCart = (cosmetic: Cosmetic) => {
    if (!cosmetic) return;

    requireUserAuth(() => {
        dispatch(addToCart({
            cosmeticId: cosmetic._id,
            quantity: quantity, // Sử dụng state quantity
        }));
        toast.success('added to cart!');
    })
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityIncrease = () => {
    if (quantity < cosmetic?.quantity!) {
      // Kiểm tra không vượt quá số lượng trong kho
      setQuantity((prev) => prev + 1);
    } else {
      toast.error("Số lượng đã đạt giới hạn trong kho!");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-deep-pink"></div>
      </div>
    );
  }

  // Not found state
  if (!cosmetic && !loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Không tìm thấy sản phẩm
        </h2>
        <Button onClick={() => router.push("/product")} variant="outline">
          Quay lại danh sách sản phẩm
        </Button>
      </div>
    );
  }

  if (!cosmetic) return null;

  const discountPercentage = cosmetic?.originalPrice
    ? Math.round(
        ((cosmetic.originalPrice - cosmetic.discountPrice) /
          cosmetic.originalPrice) *
          100
      )
    : 0;

  const cosmeticDetails = {
    description:
      "Son dưỡng môi với chiết xuất từ thiên nhiên, phù hợp cho mọi loại da. Công thức độc đáo giúp dưỡng ẩm và bảo vệ môi khỏi khô nẻ.",
    ingredients: [
      "Dầu dừa hữu cơ",
      "Sáp ong tự nhiên",
      "Vitamin E",
      "Chiết xuất hoa hồng",
      "Dầu jojoba",
    ],
    usage: [
      "Làm sạch môi trước khi sử dụng",
      "Thoa đều một lớp mỏng lên môi",
      "Có thể sử dụng nhiều lần trong ngày",
      "Bảo quản nơi khô ráo, thoáng mát",
    ],
    returnPolicy: [
      "Đổi trả trong vòng 30 ngày",
      "Sản phẩm còn nguyên vẹn, chưa sử dụng",
      "Có hóa đơn mua hàng",
      "Liên hệ hotline để được hỗ trợ",
    ],
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/" className="mb-6 font-poppins flex items-center text-white bg-brand-deep-pink px-4 py-2 rounded-md hover:underline w-fit cursor-pointer">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* cosmetic Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border border-border relative w-full h-126 md:h-124 lg:h-122 cursor-pointer">
            <Image
              src={cosmetic?.image || ""}
              alt={cosmetic?.nameCosmetic || "cosmetic Image"}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* cosmetic Info */}
        <div className="space-y-6">
          {/* Brand */}
          {cosmetic?.brand && (
            <p className="text-muted-foreground font-inter">{cosmetic.brand}</p>
          )}

          {/* cosmetic Name */}
          <h1 className="font-inter text-foreground">
            {cosmetic?.nameCosmetic}
          </h1>

          {/* Rating */}
          {cosmetic?.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(cosmetic.rating!)
                        ? "text-brand-gold fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground font-inter">
                ({cosmetic.rating}) • 127 đánh giá
              </span>
            </div>
          )}

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="font-poppins font-bold text-brand-deep-pink text-2xl">
                {formatPrice(cosmetic?.discountPrice || 0)}
              </span>
              {cosmetic?.originalPrice && (
                <>
                  <span className="text-muted-foreground line-through font-poppins text-lg">
                    {formatPrice(cosmetic.originalPrice)}
                  </span>
                  <Badge className="bg-brand-deep-pink text-white font-poppins">
                    -{discountPercentage}%
                  </Badge>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground font-inter leading-relaxed">
            {cosmeticDetails.description}
          </p>

          {/* Quantity */}
          <div className="space-y-3">
            <label className="font-inter font-medium text-foreground">
              Số lượng
            </label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handleQuantityDecrease}
                disabled={quantity <= 1}
                className="border-border"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-poppins font-medium text-xl w-12 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleQuantityIncrease}
                disabled={quantity >= cosmetic?.quantity!}
                className="border-border"
              >
                <Plus className="h-4 w-4" />
              </Button>
              {quantity >= cosmetic?.quantity! && (
                <span className="text-sm text-red-500 ml-2">
                  Đã đạt giới hạn trong kho
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => handleAddToCart(cosmetic as Cosmetic)}
              className="w-full bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins py-3"
              size="lg"
            >
              Thêm vào giỏ hàng
            </Button>
            <Button
              variant="outline"
              className="w-full border-brand-deep-pink text-brand-deep-pink hover:bg-brand-deep-pink hover:text-white font-poppins py-3"
              size="lg"
            >
              Mua ngay
            </Button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {cosmetic?.isNew && (
              <Badge className="bg-brand-gold text-foreground font-poppins">
                Sản phẩm mới
              </Badge>
            )}
            <Badge
              variant="outline"
              className="border-brand-pink text-brand-deep-pink font-poppins"
            >
              Miễn phí vận chuyển
            </Badge>
            <Badge
              variant="outline"
              className="border-brand-pink text-brand-deep-pink font-poppins"
            >
              Đổi trả 30 ngày
            </Badge>
          </div>
        </div>
      </div>

      {/* cosmetic Details Accordion */}
      <div className="mt-16">
        <Card className="border-border">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ingredients">
                <AccordionTrigger className="font-inter font-medium text-foreground">
                  Thành phần
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {cosmeticDetails.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-brand-gold mt-2">•</span>
                        <span className="text-muted-foreground font-inter">
                          {ingredient}
                        </span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="usage">
                <AccordionTrigger className="font-inter font-medium text-foreground">
                  Hướng dẫn sử dụng
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="space-y-2">
                    {cosmeticDetails.usage.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="text-brand-deep-pink font-poppins font-medium mt-1">
                          {index + 1}.
                        </span>
                        <span className="text-muted-foreground font-inter">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="return-policy">
                <AccordionTrigger className="font-inter font-medium text-foreground">
                  Chính sách đổi trả
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {cosmeticDetails.returnPolicy.map((policy, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-brand-gold mt-2">•</span>
                        <span className="text-muted-foreground font-inter">
                          {policy}
                        </span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default cosmeticDetail;
