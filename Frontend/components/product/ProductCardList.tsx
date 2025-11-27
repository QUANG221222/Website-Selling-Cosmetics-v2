"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Cosmetic } from "@/lib/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

interface ProductProps {
  cosmetics: Cosmetic[];
  onAddToCart: (cosmetic: Cosmetic) => void;
  onViewDetail: (cosmetic: Cosmetic) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
};

const ProductCardList = ({
  cosmetics,
  onAddToCart,
  onViewDetail,
}: ProductProps) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Show first 10 items immediately
    const initialVisible = new Set(
      Array.from({ length: Math.min(5, cosmetics.length) }, (_, i) => i)
    );
    setVisibleItems(initialVisible);

    // Observe remaining items
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleItems((prev) => new Set([...prev, index]));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref, index) => {
      if (ref && index >= 5) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [cosmetics.length]);

  return (
    <>
      {cosmetics.map((cosmetic, index) => {
        const isOutOfStock = !cosmetic.quantity || cosmetic.quantity <= 0;

        return (
          <Card
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            data-index={index}
            className={`group hover:shadow-lg border-border bg-white overflow-hidden cursor-pointer flex flex-col transition-all duration-700 ease-out 
                      ${
                        index < 5
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      }
                      ${
                        visibleItems.has(index)
                          ? "opacity-100 translate-y-0"
                          : ""
                      }
                      ${isOutOfStock ? "opacity-75" : ""}
                  `}
            key={cosmetic._id}
          >
            <div className="relative w-full overflow-hidden rounded-t-lg">
              <div
                className="relative w-full h-56 md:h-64 lg:h-72 cursor-pointer"
                onClick={() => onViewDetail(cosmetic)}
              >
                <Image
                  src={cosmetic?.image || ""}
                  alt={cosmetic.nameCosmetic}
                  width={400}
                  height={400}
                  priority={index < 5}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                    isOutOfStock ? "grayscale" : ""
                  }`}
                />

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Badge className="bg-destructive text-white font-poppins text-base px-4 py-2">
                      Hết hàng
                    </Badge>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 space-y-2">
                {cosmetic.isNew && !isOutOfStock && (
                  <Badge className="bg-brand-gold text-foreground font-poppins">
                    Mới
                  </Badge>
                )}
                {cosmetic.isSaleOff &&
                  !isOutOfStock &&
                  (cosmetic.originalPrice
                    ? Math.round(
                        ((cosmetic.originalPrice - cosmetic.discountPrice) /
                          cosmetic.originalPrice) *
                          100
                      )
                    : 0) > 0 && (
                    <Badge className="bg-brand-deep-pink text-white font-poppins">
                      -
                      {cosmetic.originalPrice
                        ? Math.round(
                            ((cosmetic.originalPrice - cosmetic.discountPrice) /
                              cosmetic.originalPrice) *
                              100
                          )
                        : 0}
                      %
                    </Badge>
                  )}
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-2">
                {/* Brand */}
                {cosmetic.brand && (
                  <p className="text-muted-foreground font-inter text-sm">
                    {cosmetic.brand}
                  </p>
                )}

                {/* cosmetic Name */}
                <h3
                  className="font-inter font-medium text-foreground line-clamp-2 cursor-pointer hover:text-brand-deep-pink transition-colors"
                  onClick={() => onViewDetail(cosmetic)}
                >
                  {cosmetic.nameCosmetic}
                </h3>

                {/* Category */}
                <p className="text-muted-foreground font-inter text-sm">
                  {cosmetic.classify}
                </p>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="font-poppins font-semibold text-brand-deep-pink">
                    {formatPrice(cosmetic.discountPrice)}
                  </span>
                  {cosmetic.originalPrice && (
                    <span className="text-muted-foreground line-through font-poppins text-sm">
                      {formatPrice(cosmetic.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                {isOutOfStock && (
                  <p className="text-destructive font-inter text-sm font-medium">
                    Sản phẩm tạm hết hàng
                  </p>
                )}

                {/* Rating */}
                {cosmetic.rating && (
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(cosmetic.rating!)
                              ? "text-brand-gold"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-muted-foreground font-inter text-sm">
                      ({cosmetic.rating})
                    </span>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto">
              <div className="w-full space-y-2">
                <Button
                  onClick={() => !isOutOfStock && onAddToCart(cosmetic)}
                  disabled={isOutOfStock}
                  className={`w-full font-poppins ${
                    isOutOfStock
                      ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                      : "bg-brand-deep-pink hover:bg-brand-deep-pink/90 cursor-pointer"
                  } text-white`}
                >
                  {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onViewDetail(cosmetic)}
                  className="w-full border-brand-pink text-brand-deep-pink hover:bg-brand-pink hover:text-foreground font-poppins cursor-pointer"
                >
                  Xem chi tiết
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
};
export default ProductCardList;
