"use client";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  Package,
  AlertTriangle,
  Loader2,
  Upload,
} from "lucide-react";
import { Cosmetic } from "@/lib/types/index";
import {
  createCosmetic,
  deleteCosmetic,
  fetchAllCosmetics,
  getPagination,
  selectAllCosmetics,
  selectCosmeticLoading,
  selectCosmeticPagination,
  updateCosmetic,
} from "@/lib/redux/cosmetic/cosmeticSlice";
import { AppDispatch } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ProductsManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cosmetics = useSelector(selectAllCosmetics);
  const loading = useSelector(selectCosmeticLoading);

  const [selectedProduct, setSelectedProduct] = useState<Cosmetic | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pagination = useSelector(selectCosmeticPagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getPagination({
        page: currentPage,
        limit: pageSize,
        sortBy: "createdAt",
        sortOrder: "desc",
      })
    );
  }, [currentPage, pageSize, dispatch]);
  console.log("pagination: ", pagination);
  // Filter products
  const filteredProducts = cosmetics.filter((product) => {
    const matchesSearch =
      product.nameCosmetic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.classify === categoryFilter;
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "in-stock" && product.quantity > 0) ||
      (stockFilter === "out-of-stock" && product.quantity === 0) ||
      (stockFilter === "low-stock" &&
        product.quantity > 0 &&
        product.quantity <= 10);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProduct = (product: Cosmetic) => {
    setSelectedProduct(product);
    setImagePreview(product.image || "");
    setImageFile(null);
    setIsEditDialogOpen(true);
  };
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi page size
  };

  const handleAddProduct = () => {
    const newProduct: Cosmetic = {
      _id: "",
      brand: "",
      nameCosmetic: "",
      description: "",
      classify: "skincare",
      image: "",
      quantity: 0,
      originalPrice: 0,
      discountPrice: 0,
      rating: 0,
      isNew: false,
      isSaleOff: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSelectedProduct(newProduct);
    setImagePreview("");
    setImageFile(null);
    setIsAddDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct) return;

    //Validation
    if (!selectedProduct.nameCosmetic.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!selectedProduct.brand.trim()) {
      toast.error("Brand is required");
      return;
    }
    if (selectedProduct.quantity < 0) {
      toast.error("Quantity cannot be negative");
      return;
    }
    if (
      selectedProduct.originalPrice < 0 ||
      selectedProduct.discountPrice < 0
    ) {
      toast.error("Prices cannot be negative");
      return;
    }

    // For new products, image is required
    if (isAddDialogOpen && !imageFile) {
      toast.error("Product image is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isAddDialogOpen) {
        // Create new product
        await dispatch(
          createCosmetic({
            data: {
              nameCosmetic: selectedProduct.nameCosmetic,
              brand: selectedProduct.brand,
              classify: selectedProduct.classify,
              quantity: selectedProduct.quantity,
              description: selectedProduct.description || "",
              originalPrice: selectedProduct.originalPrice,
              discountPrice: selectedProduct.discountPrice,
              rating: selectedProduct.rating,
              isNew: selectedProduct.isNew,
              isSaleOff: selectedProduct.isSaleOff,
            },
            imageFile: imageFile!,
          })
        ).unwrap();

        setIsAddDialogOpen(false);
      } else {
        // Update existing product
        await dispatch(
          updateCosmetic({
            id: selectedProduct._id,
            data: {
              nameCosmetic: selectedProduct.nameCosmetic,
              brand: selectedProduct.brand,
              classify: selectedProduct.classify,
              quantity: selectedProduct.quantity,
              description: selectedProduct.description,
              originalPrice: selectedProduct.originalPrice,
              discountPrice: selectedProduct.discountPrice,
              rating: selectedProduct.rating,
              isNew: selectedProduct.isNew,
              isSaleOff: selectedProduct.isSaleOff,
            },
            imageFile: imageFile || undefined,
          })
        ).unwrap();

        setIsEditDialogOpen(false);
      }

      setSelectedProduct(null);
      setImageFile(null);
      setImagePreview("");
    } catch (error) {
      // Error handled by Redux slice
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await dispatch(deleteCosmetic(productId));
    }
  };

  const closeDialog = () => {
    setIsEditDialogOpen(false);
    setIsAddDialogOpen(false);
    setSelectedProduct(null);
    setImageFile(null);
    setImagePreview("");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Hết hàng
        </Badge>
      );
    } else if (quantity <= 10) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Package className="h-3 w-3" />
          Sắp hết
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Package className="h-3 w-3" />
          Còn hàng
        </Badge>
      );
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      skincare: { label: "Chăm sóc da", variant: "default" as const },
      makeup: { label: "Trang điểm", variant: "secondary" as const },
      fragrance: { label: "Nước hoa", variant: "outline" as const },
    };

    const config = categoryConfig[category as keyof typeof categoryConfig] || {
      label: category,
      variant: "outline" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="pt-2">Quản lý sản phẩm</CardTitle>
          <CardDescription>
            Quản lý thông tin sản phẩm, giá cả và tồn kho
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên sản phẩm hoặc thương hiệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="bodycare">Chăm sóc cơ thể</SelectItem>
                <SelectItem value="bodylotion">Kem dưỡng thể</SelectItem>
                <SelectItem value="bodymist">Xịt thơm toàn thân</SelectItem>
                <SelectItem value="bodywash">Sữa tắm</SelectItem>
                <SelectItem value="exfoliation">Tẩy tế bào chết</SelectItem>
                <SelectItem value="giftsets">Bộ quà tặng</SelectItem>
                <SelectItem value="eyecare">Chăm sóc mắt</SelectItem>
                <SelectItem value="haircare">Chăm sóc tóc</SelectItem>
                <SelectItem value="lipcare">Chăm sóc môi</SelectItem>
                <SelectItem value="nailcare">Chăm sóc móng</SelectItem>
                <SelectItem value="cuticlecare">
                  Chăm sóc da xung quanh móng
                </SelectItem>
                <SelectItem value="eyebrow">Chăm sóc lông mày</SelectItem>
                <SelectItem value="footcare">Chăm sóc chân</SelectItem>
                <SelectItem value="antiaging">Chống lão hóa</SelectItem>
                <SelectItem value="brushes">Cọ trang điểm</SelectItem>
                <SelectItem value="contour">Contouring</SelectItem>
                <SelectItem value="cologne">Cologne</SelectItem>
                <SelectItem value="hairoil">Dầu dưỡng tóc</SelectItem>
                <SelectItem value="shampoo">Dầu gội</SelectItem>
                <SelectItem value="conditioner">Dầu xả</SelectItem>
                <SelectItem value="moisturizing">Dưỡng ẩm</SelectItem>
                <SelectItem value="tools">Dụng cụ làm đẹp</SelectItem>
                <SelectItem value="mirrors">Gương trang điểm</SelectItem>
                <SelectItem value="highlighter">Highlighter</SelectItem>
                <SelectItem value="japanese">J-Beauty</SelectItem>
                <SelectItem value="korean">K-Beauty</SelectItem>
                <SelectItem value="foundation">Kem nền</SelectItem>
                <SelectItem value="concealer">Kem che khuyết điểm</SelectItem>
                <SelectItem value="suncare">Kem chống nắng</SelectItem>
                <SelectItem value="handcream">Kem dưỡng tay</SelectItem>
                <SelectItem value="hairspray">Keo xịt tóc</SelectItem>
                <SelectItem value="eyeliner">Kẻ mắt</SelectItem>
                <SelectItem value="lipliner">Chì kẻ môi</SelectItem>
                <SelectItem value="cleansing">Làm sạch</SelectItem>
                <SelectItem value="whitening">Làm trắng da</SelectItem>
                <SelectItem value="deodorant">Lăn khử mùi</SelectItem>
                <SelectItem value="mask">Mặt nạ</SelectItem>
                <SelectItem value="hairmask">Mặt nạ tóc</SelectItem>
                <SelectItem value="organic">Mỹ phẩm organic</SelectItem>
                <SelectItem value="french">Mỹ phẩm Pháp</SelectItem>
                <SelectItem value="mencare">Mỹ phẩm nam</SelectItem>
                <SelectItem value="teenskin">Mỹ phẩm tuổi teen</SelectItem>
                <SelectItem value="sponges">Mút trang điểm</SelectItem>
                <SelectItem value="fragrance">Nước hoa</SelectItem>
                <SelectItem value="perfume">Nước hoa</SelectItem>
                <SelectItem value="toner">Toner/Nước hoa hồng</SelectItem>
                <SelectItem value="tweezers">Nhíp</SelectItem>
                <SelectItem value="blush">Phấn má hồng</SelectItem>
                <SelectItem value="eyeshadow">Phấn mắt</SelectItem>
                <SelectItem value="powder">Phấn phủ</SelectItem>
                <SelectItem value="premiumluxury">Cao cấp/Luxury</SelectItem>
                <SelectItem value="serum">Serum</SelectItem>
                <SelectItem value="lipstick">Son môi</SelectItem>
                <SelectItem value="lipgloss">Son bóng</SelectItem>
                <SelectItem value="nailpolish">Sơn móng tay</SelectItem>
                <SelectItem value="bodywash">Sữa tắm</SelectItem>
                <SelectItem value="nailremover">Tẩy sơn móng</SelectItem>
                <SelectItem value="makeup">Trang điểm</SelectItem>
                <SelectItem value="antiacne">Trị mụn</SelectItem>
                <SelectItem value="sensitiverskin">Da nhạy cảm</SelectItem>
                <SelectItem value="mascara">Mascara</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tồn kho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="in-stock">Còn hàng</SelectItem>
                <SelectItem value="low-stock">Sắp hết</SelectItem>
                <SelectItem value="out-of-stock">Hết hàng</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </div>
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá gốc</TableHead>
                  <TableHead>Giá bán</TableHead>
                  <TableHead>Tồn kho</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.nameCosmetic}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium">
                            {product.nameCosmetic}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {product.brand}
                          </div>
                          <div className="flex gap-1 mt-1">
                            {product.isNew && (
                              <Badge variant="secondary" className="text-xs">
                                Mới
                              </Badge>
                            )}
                            {product.isSaleOff && (
                              <Badge variant="destructive" className="text-xs">
                                Giảm giá
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(product.classify)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          product.isSaleOff
                            ? "line-through text-muted-foreground"
                            : ""
                        }
                      >
                        {formatCurrency(product.originalPrice)}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(product.discountPrice)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.quantity}</span>
                        {getStockBadge(product.quantity)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{product.rating}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Chưa có</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(product.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Hiển thị {filteredProducts.length} / {pagination.totalCount} sản
                phẩm
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(val) => handlePageSizeChange(parseInt(val))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => {
                  // Hiển thị trang gần hiện tại
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < pagination.totalPages)
                        handlePageChange(currentPage + 1);
                    }}
                    className={
                      currentPage === pagination.totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Product Dialog */}
      <Dialog
        open={isEditDialogOpen || isAddDialogOpen}
        onOpenChange={closeDialog}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddDialogOpen ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
            </DialogTitle>
            <DialogDescription>
              {isAddDialogOpen
                ? "Nhập thông tin sản phẩm mới"
                : "Cập nhật thông tin sản phẩm"}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              {/* Image Upload */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                  Hình ảnh{" "}
                  {isAddDialogOpen && <span className="text-red-500">*</span>}
                </Label>
                <div className="col-span-3 space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {imageFile ? "Thay đổi hình ảnh" : "Tải lên hình ảnh"}
                  </Button>
                  {imagePreview && (
                    <div className="relative w-full h-48 border rounded overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nameCosmetic" className="text-right">
                  Tên sản phẩm
                </Label>
                <Input
                  id="nameCosmetic"
                  value={selectedProduct.nameCosmetic}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      nameCosmetic: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="brand" className="text-right">
                  Thương hiệu
                </Label>
                <Input
                  id="brand"
                  value={selectedProduct.brand}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      brand: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  value={selectedProduct.description || ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="classify" className="text-right">
                  Danh mục
                </Label>
                <Select
                  value={selectedProduct.classify}
                  onValueChange={(value) =>
                    setSelectedProduct({ ...selectedProduct, classify: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bodycare">Chăm sóc cơ thể</SelectItem>
                    <SelectItem value="bodylotion">Kem dưỡng thể</SelectItem>
                    <SelectItem value="bodymist">Xịt thơm toàn thân</SelectItem>
                    <SelectItem value="bodywash">Sữa tắm</SelectItem>
                    <SelectItem value="exfoliation">Tẩy tế bào chết</SelectItem>
                    <SelectItem value="giftsets">Bộ quà tặng</SelectItem>
                    <SelectItem value="eyecare">Chăm sóc mắt</SelectItem>
                    <SelectItem value="haircare">Chăm sóc tóc</SelectItem>
                    <SelectItem value="lipcare">Chăm sóc môi</SelectItem>
                    <SelectItem value="nailcare">Chăm sóc móng</SelectItem>
                    <SelectItem value="cuticlecare">
                      Chăm sóc da xung quanh móng
                    </SelectItem>
                    <SelectItem value="eyebrow">Chăm sóc lông mày</SelectItem>
                    <SelectItem value="footcare">Chăm sóc chân</SelectItem>
                    <SelectItem value="antiaging">Chống lão hóa</SelectItem>
                    <SelectItem value="brushes">Cọ trang điểm</SelectItem>
                    <SelectItem value="contour">Contouring</SelectItem>
                    <SelectItem value="cologne">Cologne</SelectItem>
                    <SelectItem value="hairoil">Dầu dưỡng tóc</SelectItem>
                    <SelectItem value="shampoo">Dầu gội</SelectItem>
                    <SelectItem value="conditioner">Dầu xả</SelectItem>
                    <SelectItem value="moisturizing">Dưỡng ẩm</SelectItem>
                    <SelectItem value="tools">Dụng cụ làm đẹp</SelectItem>
                    <SelectItem value="mirrors">Gương trang điểm</SelectItem>
                    <SelectItem value="highlighter">Highlighter</SelectItem>
                    <SelectItem value="japanese">J-Beauty</SelectItem>
                    <SelectItem value="korean">K-Beauty</SelectItem>
                    <SelectItem value="foundation">Kem nền</SelectItem>
                    <SelectItem value="concealer">
                      Kem che khuyết điểm
                    </SelectItem>
                    <SelectItem value="suncare">Kem chống nắng</SelectItem>
                    <SelectItem value="handcream">Kem dưỡng tay</SelectItem>
                    <SelectItem value="hairspray">Keo xịt tóc</SelectItem>
                    <SelectItem value="eyeliner">Kẻ mắt</SelectItem>
                    <SelectItem value="lipliner">Chì kẻ môi</SelectItem>
                    <SelectItem value="cleansing">Làm sạch</SelectItem>
                    <SelectItem value="whitening">Làm trắng da</SelectItem>
                    <SelectItem value="deodorant">Lăn khử mùi</SelectItem>
                    <SelectItem value="mask">Mặt nạ</SelectItem>
                    <SelectItem value="hairmask">Mặt nạ tóc</SelectItem>
                    <SelectItem value="organic">Mỹ phẩm organic</SelectItem>
                    <SelectItem value="french">Mỹ phẩm Pháp</SelectItem>
                    <SelectItem value="mencare">Mỹ phẩm nam</SelectItem>
                    <SelectItem value="teenskin">Mỹ phẩm tuổi teen</SelectItem>
                    <SelectItem value="sponges">Mút trang điểm</SelectItem>
                    <SelectItem value="fragrance">Nước hoa</SelectItem>
                    <SelectItem value="perfume">Nước hoa</SelectItem>
                    <SelectItem value="toner">Toner/Nước hoa hồng</SelectItem>
                    <SelectItem value="tweezers">Nhíp</SelectItem>
                    <SelectItem value="blush">Phấn má hồng</SelectItem>
                    <SelectItem value="eyeshadow">Phấn mắt</SelectItem>
                    <SelectItem value="powder">Phấn phủ</SelectItem>
                    <SelectItem value="premiumluxury">
                      Cao cấp/Luxury
                    </SelectItem>
                    <SelectItem value="serum">Serum</SelectItem>
                    <SelectItem value="lipstick">Son môi</SelectItem>
                    <SelectItem value="lipgloss">Son bóng</SelectItem>
                    <SelectItem value="nailpolish">Sơn móng tay</SelectItem>
                    <SelectItem value="bodywash">Sữa tắm</SelectItem>
                    <SelectItem value="nailremover">Tẩy sơn móng</SelectItem>
                    <SelectItem value="makeup">Trang điểm</SelectItem>
                    <SelectItem value="antiacne">Trị mụn</SelectItem>
                    <SelectItem value="sensitiverskin">Da nhạy cảm</SelectItem>
                    <SelectItem value="mascara">Mascara</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Số lượng
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={selectedProduct.quantity}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="originalPrice" className="text-right">
                  Giá gốc
                </Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={selectedProduct.originalPrice}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      originalPrice: parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discountPrice" className="text-right">
                  Giá bán
                </Label>
                <Input
                  id="discountPrice"
                  type="number"
                  value={selectedProduct.discountPrice}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      discountPrice: parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rating" className="text-right">
                  Đánh giá
                </Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={selectedProduct.rating || ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      rating: parseFloat(e.target.value) || undefined,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isNew" className="text-right">
                  Sản phẩm mới
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="isNew"
                    checked={selectedProduct.isNew || false}
                    onCheckedChange={(checked) =>
                      setSelectedProduct({ ...selectedProduct, isNew: checked })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isSaleOff" className="text-right">
                  Đang giảm giá
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="isSaleOff"
                    checked={selectedProduct.isSaleOff || false}
                    onCheckedChange={(checked) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        isSaleOff: checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleSaveProduct}>
              {isAddDialogOpen ? "Thêm sản phẩm" : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ProductsManagement;
