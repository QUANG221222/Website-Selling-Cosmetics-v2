"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/lib/redux/store";
import {
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  selectCartItems,
  selectCartTotalPrice,
  fetchCart,
  selectCartItemsSelected,
  selectCartSelectedTotalPrice,
  toggleItemSelection,
} from "@/lib/redux/cart/cartSlice";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const ShoppingCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const cartItems = useSelector(selectCartItems);
  const selectedCartItems = useSelector(selectCartItemsSelected);
  const selectedTotalPrice = useSelector(selectCartSelectedTotalPrice);

  // Helper function to safely get cosmetic ID
  const getCosmeticId = (item: any) =>
    item.cosmetic?._id || item.cosmeticId || "";

  const shipping = useMemo(
    () => (selectedTotalPrice > 500000 ? 0 : 30000),
    [selectedTotalPrice]
  );
  const finalTotal = useMemo(
    () => selectedTotalPrice + shipping,
    [selectedTotalPrice, shipping]
  );

  // Fetch current user and cart on mount
  useEffect(() => {
    // Fetch cart data
    dispatch(fetchCart());
  }, [dispatch]);

   const handleToggleItem = (itemId: string) => {
    dispatch(toggleItemSelection(itemId));
  };

  const handleToggleAll = () => {
    const allSelected = cartItems.every(item => 
      selectedCartItems.some(selected => 
        getCosmeticId(selected) === getCosmeticId(item)
      )
    );

    cartItems.forEach(item => {
      const itemId = getCosmeticId(item);
      const isCurrentlySelected = selectedCartItems.some(
        selected => getCosmeticId(selected) === itemId
      );
      
      if (allSelected && isCurrentlySelected) {
        dispatch(toggleItemSelection(itemId));
      } else if (!allSelected && !isCurrentlySelected) {
        dispatch(toggleItemSelection(itemId));
      }
    });
  };

  // Show empty cart state
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <ShoppingBag className="w-16 h-16 text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-700">Giỏ hàng trống</h2>
        <p className="text-gray-500">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
        <Button
          onClick={() => router.push("/")}
          className="mt-4 bg-brand-deep-pink text-white"
        >
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  const handleRemoveItem = (itemId: string) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      dispatch(removeFromCart(itemId));
    }
  };
  
  const handleContinueShopping = () => {
    router.push("/product");
  };

  const handleCheckout = () => {
    if (selectedCartItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm!");
      return;
    }

    // Lưu vào sessionStorage để sử dụng ở trang checkout
    sessionStorage.setItem("checkoutItems", JSON.stringify(selectedCartItems));
    router.push("/checkout");
  };

  const handleClearCart = () => {
    if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
      dispatch(clearCart());
    }
  };

  const isItemSelected = (itemId: string) => {
    return selectedCartItems.some(item => getCosmeticId(item) === itemId);
  };

  const allItemsSelected = cartItems.length > 0 && 
    cartItems.every(item => isItemSelected(getCosmeticId(item)));

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
          <Card className="border-border ">
            <CardContent className="p-6 ">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-inter w-[50px]">
                        <Checkbox
                          checked={allItemsSelected}
                          onCheckedChange={handleToggleAll}
                          className="mx-auto"
                        />
                      </TableHead>
                      <TableHead className="font-inter">Sản phẩm</TableHead>
                      <TableHead className="font-inter">Giá</TableHead>
                      <TableHead className="font-inter">Số lượng</TableHead>
                      <TableHead className="font-inter">Tổng</TableHead>
                      <TableHead className="font-inter"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => {
                        const itemId = getCosmeticId(item);
                        return (
                    
                        <TableRow key={itemId}>
                            <TableCell className="text-center align-middle">
                            <Checkbox
                                checked={isItemSelected(itemId)}
                                onCheckedChange={() => handleToggleItem(itemId)}
                                className="mx-auto"
                            />
                          </TableCell>
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
                                {formatPrice(item.cosmetic?.discountPrice || 0)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    dispatch(decrementQuantity(getCosmeticId(item)))
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
                                    dispatch(incrementQuantity(getCosmeticId(item)))
                                  }
                                  className="h-8 w-8"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-poppins font-medium text-brand-deep-pink">
                                {formatPrice(
                                  (item.cosmetic?.discountPrice || 0) *
                                    item.quantity
                                )}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveItem(getCosmeticId(item))
                                }
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                   
                        </TableRow>
                    )})}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {cartItems.map((item) => {
                  const itemId = getCosmeticId(item);
                  return (
                    <Card key={itemId} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={isItemSelected(itemId)}
                            onCheckedChange={() => handleToggleItem(itemId)}
                            className="mt-1"
                          />
                          <div className="flex space-x-4 flex-1">
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
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveItem(itemId)}
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
                                      dispatch(decrementQuantity(itemId))
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
                                      dispatch(incrementQuantity(itemId))
                                    }
                                    className="h-8 w-8"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <span className="font-poppins font-medium text-brand-deep-pink">
                                  {formatPrice(
                                    (item.cosmetic?.discountPrice || 0) *
                                      item.quantity
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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
                    {formatPrice(selectedTotalPrice)}
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
                {selectedTotalPrice > 0 && shipping === 0 && (
                  <p className="text-green-600 font-inter text-sm">
                    🎉 Bạn được miễn phí vận chuyển!
                  </p>
                )}
                {selectedTotalPrice > 0 && shipping > 0 && (
                  <p className="text-muted-foreground font-inter text-sm">
                    Mua thêm {formatPrice(500000 - selectedTotalPrice)} để được miễn phí
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
