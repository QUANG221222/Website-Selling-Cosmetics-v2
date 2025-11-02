"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Cosmetic } from "@/lib/types";
import Image from "next/image"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


interface ProductProps {
    cosmetics: Cosmetic[];
    onAddToCart: (cosmetic: Cosmetic) => void;
    onViewDetail: (cosmetic: Cosmetic) => void;
}

const formatPrice = (price : number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
}

const ProductCardList = ({cosmetics, onAddToCart, onViewDetail}: ProductProps) => {
  return (
    <>
        {cosmetics.map((cosmetic) => (
            
            <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-white overflow-hidden cursor-pointer flex flex-col" key={cosmetic._id}>
            <div className="relative w-full overflow-hidden rounded-t-lg">
                <div 
                className="relative w-full h-56 md:h-64 lg:h-72 cursor-pointer"
                onClick={() => onViewDetail(cosmetic)}
                >
                <Image
                    src={cosmetic?.image || ''}
                    alt={cosmetic.nameCosmetic}
                    width={400}
                    height={400}
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 space-y-2">
                {cosmetic.isNew && (
                    <Badge className="bg-brand-gold text-foreground font-poppins">
                    Mới
                    </Badge>
                )}
                {cosmetic.isSaleOff && (cosmetic.originalPrice ? Math.round(((cosmetic.originalPrice - cosmetic.discountPrice) / cosmetic.originalPrice) * 100): 0) > 0 
                && (
                    <Badge className="bg-brand-deep-pink text-white font-poppins">
                    -{cosmetic.originalPrice ? Math.round(((cosmetic.originalPrice - cosmetic.discountPrice) / cosmetic.originalPrice) * 100): 0}%
                    </Badge>
                )}
                </div>
            </div>
        
            <CardContent className="p-4">
                <div className="space-y-2">
                {/* Brand */}
                {cosmetic.brand && (
                    <p className="text-muted-foreground font-inter">
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
                <p className="text-muted-foreground font-inter">
                    {cosmetic.classify}
                </p>
                
                {/* Price */}
                <div className="flex items-center space-x-2">
                    <span className="font-poppins font-semibold text-brand-deep-pink">
                    {formatPrice(cosmetic.discountPrice)}
                    </span>
                    {cosmetic.originalPrice && (
                    <span className="text-muted-foreground line-through font-poppins">
                        {formatPrice(cosmetic.originalPrice)}
                    </span>
                    )}
                </div>
                
                {/* Rating */}
                {cosmetic.rating && (
                    <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                        <span
                            key={i}
                            className={`text-sm ${
                            i < Math.floor(cosmetic.rating!)
                                ? 'text-brand-gold'
                                : 'text-gray-300'
                            }`}
                        >
                            ★
                        </span>
                        ))}
                    </div>
                    <span className="text-muted-foreground font-inter">
                        ({cosmetic.rating})
                    </span>
                    </div>
                )}
                </div>
            </CardContent>
        
            <CardFooter className="p-4 pt-0">
                <div className="w-full space-y-2">
                <Button
                    onClick={() => onAddToCart(cosmetic)}
                    className="w-full bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins cursor-pointer"
                >
                    Thêm vào giỏ hàng
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
        ))}
    </>
  )
}
export default ProductCardList