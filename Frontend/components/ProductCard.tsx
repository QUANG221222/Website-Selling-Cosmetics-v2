import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const ProductCard = () => {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-white overflow-hidden">
      <div className="relative overflow-hidden">
        <div 
          className="cursor-pointer"
        >
          {/* <Image
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          /> */}
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 space-y-2">
          {/* {product.isNew && (
            <Badge className="bg-brand-gold text-foreground font-poppins">
              Mới
            </Badge>
          )}
          {product.isSaleOff && discountPercentage > 0 && (
            <Badge className="bg-brand-deep-pink text-white font-poppins">
              -{discountPercentage}%
            </Badge>
          )} */}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Brand */}
          {/* {product.brand && (
            <p className="text-muted-foreground font-inter">
              {product.brand}
            </p>
          )}
           */}
          {/* Product Name */}
          <h3 
            className="font-inter font-medium text-foreground line-clamp-2 cursor-pointer hover:text-brand-deep-pink transition-colors"
          >
            {/* {product.name} */}
          </h3>
          
          {/* Category */}
          <p className="text-muted-foreground font-inter">
            {/* {product.category} */}
          </p>
          
          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="font-poppins font-semibold text-brand-deep-pink">
              {/* {formatPrice(product.price)} */}
            </span>
            {/* {product.originalPrice && (
              <span className="text-muted-foreground line-through font-poppins">
                {formatPrice(product.originalPrice)}
              </span>
            )} */}
          </div>
          
          {/* Rating */}
          {/* {product.rating && (
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < Math.floor(product.rating!)
                        ? 'text-brand-gold'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-muted-foreground font-inter">
                ({product.rating})
              </span>
            </div>
          )} */}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full space-y-2">
          <Button
            className="w-full bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins"
          >
            Thêm vào giỏ hàng
          </Button>
          <Button
            variant="outline"
            className="w-full border-brand-pink text-brand-deep-pink hover:bg-brand-pink hover:text-foreground font-poppins"
          >
            Xem chi tiết
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;

