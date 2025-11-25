"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, MapPin, MoreVertical } from "lucide-react";
import { AddressDialog } from "./AddressDialog";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  selectAddresses,
  selectAddressLoading,
} from "@/lib/redux/address/addressSlice";
import { AppDispatch } from "@/lib/redux/store";
import { Address, CreateAddressData } from "@/lib/api/address";

interface AddressSelectProps {
  onAddressChange?: (address: Address | null, index: number) => void;
}

export function AddressSelect({ onAddressChange }: AddressSelectProps) {
  const dispatch = useDispatch<AppDispatch>();
  const addresses = useSelector(selectAddresses);
  const loading = useSelector(selectAddressLoading);

  const [selectedIndex, setSelectedIndex] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    // Auto-select default address
    const defaultIndex = addresses.findIndex((addr) => addr.isDefault);
    if (defaultIndex !== -1 && !selectedIndex) {
      setSelectedIndex(String(defaultIndex));
      onAddressChange?.(addresses[defaultIndex], defaultIndex);
    }
  }, [addresses, selectedIndex, onAddressChange]);

  const handleSelectChange = (value: string) => {
    setSelectedIndex(value);
    const index = parseInt(value);
    onAddressChange?.(addresses[index], index);
  };

  const handleCreateAddress = async (data: CreateAddressData) => {
    await dispatch(createAddress(data));
    setDialogOpen(false);
    // Refresh addresses
    const result = await dispatch(fetchAddresses());
    if (result.meta.requestStatus === "fulfilled") {
      // Select the newly created address if it's default
      const newDefaultIndex = addresses.findIndex((addr) => addr.isDefault);
      if (newDefaultIndex !== -1) {
        setSelectedIndex(String(newDefaultIndex));
        onAddressChange?.(addresses[newDefaultIndex], newDefaultIndex);
      }
    }
  };

  const handleEdit = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDialogMode("edit");
    setEditingAddress(addresses[index]);
    setEditingIndex(index);
    setDialogOpen(true);
  };

  const handleDelete = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingIndex(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingIndex !== null) {
      try {
        await dispatch(deleteAddress(deletingIndex)).unwrap();
        setDeleteDialogOpen(false);
        setDeletingIndex(null);

        // Clear selection if deleted address was selected
        if (selectedIndex === String(deletingIndex)) {
          setSelectedIndex("");
          onAddressChange?.(null, -1);
        }

        // Refresh addresses to get updated list
        await dispatch(fetchAddresses()).unwrap();
      } catch (error) {
        console.error("Delete address error:", error);
      }
    }
  };

  const handleSetDefault = async (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await dispatch(setDefaultAddress(index)).unwrap();
      setSelectedIndex(String(index));
      onAddressChange?.(addresses[index], index);

      // Refresh addresses to get updated default status
      await dispatch(fetchAddresses()).unwrap();
    } catch (error) {
      console.error("Set default address error:", error);
    }
  };

  const handleUpdateAddress = async (data: CreateAddressData) => {
    if (editingIndex !== null) {
      try {
        await dispatch(updateAddress({ index: editingIndex, data })).unwrap();
        setDialogOpen(false);
        setEditingAddress(undefined);
        setEditingIndex(null);

        // Refresh addresses to get updated data
        const result = await dispatch(fetchAddresses()).unwrap();

        // Update selected address if it was the one being edited
        if (selectedIndex === String(editingIndex)) {
          onAddressChange?.(result[editingIndex], editingIndex);
        }
      } catch (error) {
        console.error("Update address error:", error);
      }
    }
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-inter font-medium text-foreground">
            Địa chỉ giao hàng <span className="text-red-500">*</span>
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setDialogMode("create");
              setEditingAddress(undefined);
              setEditingIndex(null);
              setDialogOpen(true);
            }}
            className="text-brand-deep-pink hover:text-brand-deep-pink/80 hover:bg-brand-deep-pink/10"
          >
            <Plus className="h-4 w-4 mr-1" />
            Thêm mới
          </Button>
        </div>

        <Select value={selectedIndex} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-full p-3 h-auto min-h-[60px]">
            {selectedIndex ? (
              <div className="flex items-center gap-2 w-full text-left">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">
                      {addresses[parseInt(selectedIndex)]?.name}
                    </span>
                    {addresses[parseInt(selectedIndex)]?.isDefault && (
                      <span className="text-xs bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded whitespace-nowrap">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {addresses[parseInt(selectedIndex)]?.phone}
                  </p>
                </div>
              </div>
            ) : (
              <SelectValue placeholder="Chọn địa chỉ giao hàng" />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Địa chỉ của bạn</SelectLabel>
              {addresses.map((address, index) => (
                   <div key={index} className="relative">
                  <SelectItem 
                    value={String(index)} 
                    className="p-3 pr-12"
                  >
                    <div className="flex items-center gap-2 min-w-0 w-full">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium truncate">
                            {address.name}
                          </span>
                          {address.isDefault && (
                            <span className="text-xs bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded whitespace-nowrap">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {address.phone}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {address.addressDetail}
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                  
                  {/* ✅ Dropdown menu nằm ngoài SelectItem */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 z-50">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => {
                            setDialogMode("edit");
                            setEditingAddress(addresses[index]);
                            setEditingIndex(index);
                            setDialogOpen(true);
                          }}
                          className="cursor-pointer"
                        >
                          <Edit className="h-3 w-3 mr-2" />
                          Sửa
                        </DropdownMenuItem>
                        {!address.isDefault && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setDeletingIndex(index);
                                setDeleteDialogOpen(true);
                              }}
                              className="cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                await dispatch(setDefaultAddress(index)).unwrap();
                                setSelectedIndex(String(index));
                                onAddressChange?.(addresses[index], index);
                                await dispatch(fetchAddresses()).unwrap();
                              }}
                              className="cursor-pointer text-brand-deep-pink focus:bg-brand-deep-pink/10"
                            >
                              Đặt mặc định
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
              ))}
              {addresses.length === 0 && (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                  Chưa có địa chỉ nào. Nhấn "Thêm mới" để tạo địa chỉ.
                </div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <AddressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={
          dialogMode === "create" ? handleCreateAddress : handleUpdateAddress
        }
        address={editingAddress}
        mode={dialogMode}
        loading={loading}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-inter">
              Xác nhận xóa địa chỉ
            </AlertDialogTitle>
            <AlertDialogDescription className="font-inter">
              Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
