"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotalPrice,
} from "@/lib/redux/cart/cartSlice";
import {
  createOrder,
  selectCreateOrderLoading,
} from "@/lib/redux/order/orderSlice";
import Link from "next/link";
import InputFieldCheckout from "@/components/forms/InputFieldCheckout";
import { Controller, useForm } from "react-hook-form";
import { AppDispatch } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { useMemo } from "react";

const Checkout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const createLoading = useSelector(selectCreateOrderLoading);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      receiverName: "",
      receiverPhone: "",
      receiverAddress: "",
      orderNotes: "",
      paymentMethod: "COD",
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      console.log("Checkout Data:", data);

      const orderData = {
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        receiverAddress: data.receiverAddress,
        orderNotes: data.orderNotes,
        paymentMethod: data.paymentMethod,
        items: cartItems.map((item) => ({
          cosmeticId: item.cosmetic._id,
          quantity: item.quantity,
          price: item.cosmetic.discountPrice,
        })),
        // totalAmount: total,
      };

      // Dispatch create order action
      await dispatch(createOrder(orderData)).unwrap();

      // Redirect to order success page
      router.push("/");
    } catch (error: any) {
      console.error("Order creation error:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.subtotal, 0),
    [cartItems]
  );
  const shipping = useMemo(() => (subtotal > 500000 ? 0 : 30000), [subtotal]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}

      <Link href="/cart" className="mb-6 font-poppins">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại giỏ hàng
      </Link>

      <h1 className="font-inter text-foreground mb-8">Thanh Toán Đơn Hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Information */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-inter text-foreground flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Thông Tin Giao Hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <InputFieldCheckout
                      label="Họ và tên"
                      name="receiverName"
                      type="text"
                      placeholder="Nguyen Van A"
                      register={register}
                      error={errors.receiverName}
                      validation={{
                        required: "Họ và tên là bắt buộc",
                        minLength: 8,
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <InputFieldCheckout
                      label="Số điện thoại"
                      name="receiverPhone"
                      type="tel"
                      placeholder="0123456789"
                      register={register}
                      error={errors.receiverPhone}
                      validation={{
                        required: "Số điện thoại là bắt buộc",
                        minLength: 10,
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Số điện thoại không hợp lệ",
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <InputFieldCheckout
                    label="Địa chỉ giao hàng"
                    name="receiverAddress"
                    type="text"
                    placeholder="123 Đường ABC, Quận 1, TP.HCM"
                    register={register}
                    error={errors.receiverAddress}
                    validation={{
                      required: "Địa chỉ giao hàng là bắt buộc",
                      minLength: 8,
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <InputFieldCheckout
                    label="Ghi chú (tùy chọn)"
                    name="orderNotes"
                    type="text"
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                    register={register}
                    error={errors.orderNotes}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-inter text-foreground flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Phương Thức Thanh Toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="paymentMethod"
                  control={control}
                  rules={{ required: "Vui lòng chọn phương thức thanh toán" }}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                        <RadioGroupItem value="COD" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="space-y-1">
                            <p className="font-inter font-medium text-foreground">
                              Thanh toán khi nhận hàng (COD)
                            </p>
                            <p className="text-muted-foreground font-inter text-sm">
                              Thanh toán bằng tiền mặt khi nhận hàng
                            </p>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                        <RadioGroupItem value="BANK" id="bank" />
                        <Label htmlFor="bank" className="flex-1 cursor-pointer">
                          <div className="space-y-1">
                            <p className="font-inter font-medium text-foreground">
                              Chuyển khoản ngân hàng
                            </p>
                            <p className="text-muted-foreground font-inter text-sm">
                              Chuyển khoản trước khi giao hàng
                            </p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.paymentMethod && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || createLoading || cartItems.length === 0}
              className="w-full bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins py-3"
              size="lg"
            >
              {isSubmitting || createLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white mr-2"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Xác nhận đơn hàng"
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-border sticky top-24">
            <CardHeader>
              <CardTitle className="font-inter text-foreground">
                Đơn Hàng Của Bạn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.cosmetic._id} className="flex space-x-3">
                    <div className="w-16 h-16 overflow-hidden rounded-lg border border-border">
                      <Image
                        width={64}
                        height={64}
                        src={item.cosmetic?.image || ""}
                        alt={item.cosmetic?.nameCosmetic || ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-inter font-medium text-foreground line-clamp-2">
                        {item.cosmetic?.nameCosmetic || ""}
                      </h4>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-inter">
                          x{item.quantity}
                        </span>
                        <span className="font-poppins font-medium text-brand-deep-pink">
                          {formatPrice(
                            item.cosmetic.discountPrice * item.quantity
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Pricing Summary */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-inter">
                    Tạm tính:
                  </span>
                  <span className="font-poppins font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-inter">
                    Phí vận chuyển:
                  </span>
                  <span className="font-poppins font-medium">
                    {shipping === 0 ? (
                      <span className="text-brand-gold">Miễn phí</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-inter font-medium text-foreground">
                  Tổng cộng:
                </span>
                <span className="font-poppins font-bold text-brand-deep-pink text-xl">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Security Notice */}
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-muted-foreground font-inter text-sm">
                  🔒 Thông tin của bạn được bảo mật an toàn. Chúng tôi cam kết
                  không chia sẻ thông tin cá nhân với bên thứ ba.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
