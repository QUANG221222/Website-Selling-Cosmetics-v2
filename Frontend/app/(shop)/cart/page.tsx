"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/lib/redux/store";
import {
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  selectCartItems,
  selectCartLoading,
  selectCartTotalPrice,
  fetchCart,
} from "@/lib/redux/cart/cartSlice";

const ShoppingCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const loading = useSelector(selectCartLoading);

  // Fetch cart when component mounts
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show empty cart state
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <ShoppingBag className="w-16 h-16 text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-700">Giỏ hàng trống</h2>
        <p className="text-gray-500">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
        <Button onClick={() => router.push("/")} className="mt-4 bg-brand-deep-pink text-white">
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  const shipping = totalPrice > 500000 ? 0 : 30000;
  const finalTotal = totalPrice + shipping;

  const handleRemoveItem = (itemId: string) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      dispatch(removeFromCart(itemId));
    }
  };
  const handleContinueShopping = () => {
    router.push("/product");
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const handleClearCart = () => {
    if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
      dispatch(clearCart());
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-inter text-foreground mb-8 text-3xl font-bold">
          Giỏ Hàng Của Bạn
        </h1>

        <Card className="text-center py-12 border-border">
          <CardContent className="space-y-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-inter font-medium text-foreground text-xl">
                Giỏ hàng của bạn đang trống
              </h3>
              <p className="text-muted-foreground font-inter">
                Hãy thêm một số sản phẩm yêu thích vào giỏ hàng của bạn.
              </p>
            </div>
            <Button
              onClick={handleContinueShopping}
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-inter text-foreground text-3xl font-bold">
          Giỏ Hàng Của Bạn
        </h1>
        <Button
          variant="outline"
          onClick={handleClearCart}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa tất cả
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardContent className="p-6">
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
                      <TableRow key={item.cosmetic._id}>
                        <TableCell>
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 overflow-hidden rounded-lg border border-border relative">
                              {item.cosmetic?.image ? (
                                <Image
                                  src={item.cosmetic.image}
                                  alt={item.cosmetic.nameCosmetic}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <span className="text-xs">No image</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-inter font-medium text-foreground">
                                {item.cosmetic?.nameCosmetic}
                              </h4>
                              {item.cosmetic?.brand && (
                                <p className="text-sm text-muted-foreground font-inter">
                                  {item.cosmetic?.brand}
                                </p>
                              )}
                              {/* {item.variant && (
                                <p className="text-sm text-muted-foreground">
                                  Biến thể: {item.variant}
                                </p>78
                              )} */}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-poppins font-medium">
                            {formatPrice(item.cosmetic.discountPrice)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                dispatch(decrementQuantity(item.cosmetic._id))
                              }
                              className="h-8 w-8"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-poppins font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                dispatch(incrementQuantity(item.cosmetic._id))
                              }
                              className="h-8 w-8"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-poppins font-medium text-brand-deep-pink">
                            {formatPrice(item.cosmetic.discountPrice * item.quantity)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.cosmetic._id)}
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
                  <Card key={item.cosmetic._id} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <div className="w-20 h-20 overflow-hidden rounded-lg border border-border relative">
                          {item.cosmetic?.image ? (
                            <Image
                              src={item.cosmetic.image}
                              alt={item.cosmetic.nameCosmetic}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h4 className="font-inter font-medium text-foreground">
                                {item.cosmetic?.nameCosmetic}
                              </h4>
                              {item.cosmetic?.brand && (
                                <p className="text-sm text-muted-foreground font-inter">
                                  {item.cosmetic.brand}
                                </p>
                              )}
                              {/* {item.variant && (
                                <p className="text-xs text-muted-foreground">
                                  Biến thể: {item.variant}
                                </p>
                              )} */}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.cosmetic._id)}
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
                                onClick={() =>
                                  dispatch(decrementQuantity(item.cosmetic._id))
                                }
                                className="h-8 w-8"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-poppins font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  dispatch(incrementQuantity(item.cosmetic._id))
                                }
                                className="h-8 w-8"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-poppins font-medium text-brand-deep-pink">
                              {formatPrice(item.cosmetic.discountPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-border sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-inter font-medium text-foreground text-xl">
                Tóm Tắt Đơn Hàng
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-inter">
                    Tạm tính:
                  </span>
                  <span className="font-poppins font-medium">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-inter">
                    Phí vận chuyển:
                  </span>
                  <span className="font-poppins font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-green-600 font-inter text-sm">
                    🎉 Bạn được miễn phí vận chuyển!
                  </p>
                )}
                {shipping > 0 && (
                  <p className="text-muted-foreground font-inter text-sm">
                    Mua thêm {formatPrice(500000 - totalPrice)} để được miễn phí
                    vận chuyển
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-inter font-medium text-foreground">
                    Tổng cộng:
                  </span>
                  <span className="font-poppins font-bold text-brand-deep-pink text-xl">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins py-3"
                  size="lg"
                >
                  Tiến hành thanh toán
                </Button>
                <Button
                  onClick={handleContinueShopping}
                  variant="outline"
                  className="w-full font-poppins"
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
};

export default ShoppingCart;
