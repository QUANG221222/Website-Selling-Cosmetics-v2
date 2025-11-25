"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Address, CreateAddressData } from "@/lib/api/address";

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateAddressData) => void;
  address?: Address;
  mode: "create" | "edit";
  loading?: boolean;
}

export function AddressDialog({
  open,
  onOpenChange,
  onSubmit,
  address,
  mode,
  loading = false,
}: AddressDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAddressData>({
    defaultValues: {
      name: "",
      phone: "",
      addressDetail: "",
      isDefault: false,
    },
  });

  const isDefault = watch("isDefault");

  useEffect(() => {
    if (address && mode === "edit") {
      reset({
        name: address.name,
        phone: address.phone,
        addressDetail: address.addressDetail,
        isDefault: address.isDefault,
      });
    } else {
      reset({
        name: "",
        phone: "",
        addressDetail: "",
        isDefault: false,
      });
    }
  }, [address, mode, reset]);

  const handleFormSubmit = (data: CreateAddressData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-inter">
            {mode === "create" ? "Thêm địa chỉ mới" : "Cập nhật địa chỉ"}
          </DialogTitle>
          <DialogDescription className="font-inter">
            {mode === "create"
              ? "Nhập thông tin địa chỉ giao hàng của bạn"
              : "Cập nhật thông tin địa chỉ giao hàng"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-inter">
              Họ và tên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name", {
                required: "Họ và tên là bắt buộc",
                minLength: {
                  value: 2,
                  message: "Họ và tên phải có ít nhất 2 ký tự",
                },
              })}
              placeholder="Nguyễn Văn A"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="font-inter">
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              {...register("phone", {
                required: "Số điện thoại là bắt buộc",
                pattern: {
                  value: /^(\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              })}
              placeholder="0901234567"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressDetail" className="font-inter">
              Địa chỉ chi tiết <span className="text-red-500">*</span>
            </Label>
            <Input
              id="addressDetail"
              {...register("addressDetail", {
                required: "Địa chỉ chi tiết là bắt buộc",
                minLength: {
                  value: 10,
                  message: "Địa chỉ phải có ít nhất 10 ký tự",
                },
              })}
              placeholder="123 Đường ABC, Quận 1, TP.HCM"
            />
            {errors.addressDetail && (
              <p className="text-sm text-red-500">
                {errors.addressDetail.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={isDefault}
              onCheckedChange={(checked) =>
                setValue("isDefault", checked as boolean)
              }
            />
            <Label
              htmlFor="isDefault"
              className="font-inter text-sm cursor-pointer"
            >
              Đặt làm địa chỉ mặc định
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : mode === "create" ? (
                "Thêm địa chỉ"
              ) : (
                "Cập nhật"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}