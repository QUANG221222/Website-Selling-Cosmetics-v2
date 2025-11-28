"use client";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItemSelected,
  selectCartItems,
  selectCartItemsSelected,
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
import { useEffect, useMemo, useState } from "react";
import { CreateOrderData } from "@/lib/api/order";
import { toast } from "sonner";
import { AddressSelect } from "@/components/address/AddressSelect";
import { Address } from "@/lib/api/address";
import PaymentModal from "@/components/PaymentModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Thêm import Dialog

const Checkout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const selectedCartItems = useSelector(selectCartItemsSelected);
  const selectedTotalPrice = useSelector(selectCartTotalPrice);
  const createLoading = useSelector(selectCreateOrderLoading);
  const [showPayment, setShowPayment] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [pendingOrder, setPendingOrder] = useState<CreateOrderData | null>(
    null
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrderData>({
    defaultValues: {
      receiverName: "",
      receiverPhone: "",
      receiverAddress: "",
      orderNotes: "",
      paymentMethod: "COD",
    },
  });

  useEffect(() => {
    if (selectedCartItems.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán!");
      router.push("/cart");
    }
  }, [selectedCartItems, router]);

  useEffect(() => {
    if (selectedAddress) {
      setValue("receiverName", selectedAddress.name);
      setValue("receiverPhone", selectedAddress.phone);
      setValue("receiverAddress", selectedAddress.addressDetail);
    }
  }, [selectedAddress, setValue]);

  const handleAddressChange = (address: Address | null, index: number) => {
    setSelectedAddress(address);
  };

  const onSubmit = async (data: CreateOrderData) => {
    if (data.paymentMethod === "BANK") {
      setPendingOrder(data);
      setShowPayment(true);
      return;
    }
    await handleOrder(data);
  };

  const handleOrder = async (data: CreateOrderData) => {
    try {
      console.log("Checkout Data:", data);

      const orderData = {
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        receiverAddress: data.receiverAddress,
        orderNotes: data.orderNotes,
        paymentMethod: data.paymentMethod,
        items: selectedCartItems
          .filter(
            (item) =>
              item.cosmetic?._id && item.cosmetic?.discountPrice !== undefined
          )
          .map((item) => ({
            cosmeticId: item.cosmetic!._id,
            quantity: item.quantity,
            price: item.cosmetic!.discountPrice,
          })),
        // totalAmount: total,
      };

      // Dispatch create order action
      await dispatch(createOrder(orderData)).unwrap();

      toast.success("Đặt hàng thành công!");
      // Redirect to order success page
      router.push("/");
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast.error(error?.message || "Đặt hàng thất bại!");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  const shipping = useMemo(
    () =>
      selectedTotalPrice > 500000 ? 0 : selectedTotalPrice > 0 ? 30000 : 0,
    [selectedTotalPrice]
  );

  const total = useMemo(
    () => selectedTotalPrice + shipping,
    [selectedTotalPrice, shipping]
  );
  // Nếu không có sản phẩm, hiển thị loading hoặc redirect
  if (selectedCartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}

      <Link
        href="/cart"
        className="mb-6 font-poppins flex items-center text-white bg-brand-deep-pink px-4 py-2 rounded-md hover:underline w-fit cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Link>

      <h1 className="font-inter text-foreground mb-8">Thanh Toán Đơn Hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Information */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-inter text-foreground flex items-center pt-3">
                  <Truck className="h-5 w-5 mr-2" />
                  Thông Tin Giao Hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pb-3">
                <AddressSelect onAddressChange={handleAddressChange} />
                <Separator className="my-4" />

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
                <CardTitle className="font-inter text-foreground flex items-center pt-3">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Phương Thức Thanh Toán
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
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
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer">
                        <RadioGroupItem
                          value="COD"
                          id="cod"
                          className="cursor-pointer"
                        />
                        <Label htmlFor="cod" className="flex-1">
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

                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer">
                        <RadioGroupItem
                          value="BANK"
                          id="bank"
                          className="cursor-pointer"
                        />
                        <Label htmlFor="bank" className="flex-1">
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
              disabled={
                isSubmitting || createLoading || selectedCartItems.length === 0
              }
              className="w-full bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins py-3 cursor-pointer"
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
        {/* Xóa nút Thanh toán bằng QR Code ở đây */}
        {/* Dialog PaymentModal */}
        <Dialog open={showPayment} onOpenChange={setShowPayment}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thanh toán chuyển khoản</DialogTitle>
            </DialogHeader>
            <PaymentModal
              amount={total}
              onClose={() => setShowPayment(false)}
              onPaid={async () => {
                setShowPayment(false);
                if (pendingOrder) {
                  await handleOrder(pendingOrder);
                  setPendingOrder(null);
                }
              }}
            />
          </DialogContent>
        </Dialog>
        {/* ...existing code... */}
        <div className="lg:col-span-1">
          <Card className="border-border sticky top-24">
            <CardHeader>
              <CardTitle className="font-inter text-foreground pt-3">
                Đơn Hàng Của Bạn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-3">
              {/* Order Items */}
              <div className="space-y-4">
                {selectedCartItems.map((item) => (
                  <div key={item.cosmetic?._id} className="flex space-x-3">
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
                            (item.cosmetic?.discountPrice || 0) * item.quantity
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
                    {formatPrice(selectedTotalPrice)}
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
