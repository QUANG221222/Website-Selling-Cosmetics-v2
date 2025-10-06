import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from "next/image"
export interface CartItem {
  id: string;
  cosmetic: {
    id: string;
    name: string;
    price: number;
    image: string;
    brand?: string;
  };
  quantity: number;
  variant?: string;
}

interface ShoppingCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

const ShoppingCart =({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onProceedToCheckout,
  onContinueShopping 
}: ShoppingCartProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.cosmetic.price * item.quantity), 0);
  const shipping = subtotal > 500000 ? 0 : 30000; // Free shipping over 500k VND
  const total = subtotal + shipping;

  const handleQuantityChange = (itemId: string, delta: number) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-inter text-foreground mb-8">
          Giỏ Hàng Của Bạn
        </h1>
        
        <Card className="text-center py-12 border-border">
          <CardContent className="space-y-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-inter font-medium text-foreground">
                Giỏ hàng của bạn đang trống
              </h3>
              <p className="text-muted-foreground font-inter">
                Hãy thêm một số sản phẩm yêu thích vào giỏ hàng của bạn.
              </p>
            </div>
            <Button
              onClick={onContinueShopping}
              className="bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins"
            >
              Tiếp tục mua sắm
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-inter text-foreground mb-8">
        Giỏ Hàng Của Bạn
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-inter text-foreground">
                Sản phẩm ({cartItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-inter">Sản phẩm</TableHead>
                        <TableHead className="font-inter">Giá</TableHead>
                        <TableHead className="font-inter">Số lượng</TableHead>
                        <TableHead className="font-inter">Tổng</TableHead>
                        <TableHead className="font-inter"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 overflow-hidden rounded-lg border border-border">
                                <Image
                                  src={item.cosmetic.image}
                                  alt={item.cosmetic.name}
                                  width={120}
                                  height={60}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-inter font-medium text-foreground">
                                  {item.cosmetic.name}
                                </h4>
                                {item.cosmetic.brand && (
                                  <p className="text-muted-foreground font-inter">
                                    {item.cosmetic.brand}
                                  </p>
                                )}
                                {item.variant && (
                                  <Badge variant="outline" className="border-brand-pink text-brand-deep-pink font-poppins">
                                    {item.variant}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-poppins font-medium text-brand-deep-pink">
                              {formatPrice(item.cosmetic.price)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleQuantityChange(item.id, -1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 border-border"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-poppins font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="h-8 w-8 border-border"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-poppins font-medium text-brand-deep-pink">
                              {formatPrice(item.cosmetic.price * item.quantity)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onRemoveItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {cartItems.map((item) => (
                    <Card key={item.id} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex space-x-4">
                          <div className="w-20 h-20 overflow-hidden rounded-lg border border-border">
                            <Image
                              src={item.cosmetic.image}
                                width={120}
                                height={60}
                              alt={item.cosmetic.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <h4 className="font-inter font-medium text-foreground">
                                  {item.cosmetic.name}
                                </h4>
                                {item.cosmetic.brand && (
                                  <p className="text-muted-foreground font-inter">
                                    {item.cosmetic.brand}
                                  </p>
                                )}
                                {item.variant && (
                                  <Badge variant="outline" className="border-brand-pink text-brand-deep-pink font-poppins">
                                    {item.variant}
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemoveItem(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                  className="h-8 w-8 border-border"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="font-poppins font-medium w-8 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  className="h-8 w-8 border-border"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <span className="font-poppins font-medium text-brand-deep-pink">
                                {formatPrice(item.cosmetic.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-border sticky top-24">
            <CardHeader>
              <CardTitle className="font-inter text-foreground">
                Tóm Tắt Đơn Hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-inter">Tạm tính:</span>
                  <span className="font-poppins font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-inter">Phí vận chuyển:</span>
                  <span className="font-poppins font-medium">
                    {shipping === 0 ? (
                      <span className="text-brand-gold">Miễn phí</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-brand-gold font-inter text-sm">
                    🎉 Bạn được miễn phí vận chuyển!
                  </p>
                )}
                {shipping > 0 && (
                  <p className="text-muted-foreground font-inter text-sm">
                    Mua thêm {formatPrice(500000 - subtotal)} để được miễn phí vận chuyển
                  </p>
                )}
              </div>
              
              <div className="border-t border-border pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-inter font-medium text-foreground">Tổng cộng:</span>
                  <span className="font-poppins font-bold text-brand-deep-pink text-xl">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={onProceedToCheckout}
                  className="w-full bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins py-3"
                  size="lg"
                >
                  Tiến hành thanh toán
                </Button>
                <Button
                  onClick={onContinueShopping}
                  variant="outline"
                  className="w-full border-brand-pink text-brand-deep-pink hover:bg-brand-pink hover:text-foreground font-poppins"
                >
                  Tiếp tục mua sắm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default ShoppingCart;