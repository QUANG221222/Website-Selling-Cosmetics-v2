"use client";
import { Suspense, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter, X } from "lucide-react";
import { Cosmetic } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import {
  fetchAllCosmetics,
  selectAllCosmetics,
  selectCosmeticLoading,
} from "@/lib/redux/cosmetic/cosmeticSlice";
import { addToCart } from "@/lib/redux/cart/cartSlice";
import { useRouter } from "next/navigation";
import SkeletonProductCardList from "@/components/product/SkeletonProductCardList";
import ProductCardList from "@/components/product/ProductCardList";
import { selectCurrentUser } from "@/lib/redux/user/userSlice";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const PRODUCTS_PER_PAGE = 8;

const ProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const cosmetics = useSelector(selectAllCosmetics);
  const user = useSelector(selectCurrentUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: "",
    max: "",
  });
  const [displayedCount, setDisplayedCount] = useState(PRODUCTS_PER_PAGE);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchAllCosmetics());
  }, [dispatch]);

  const [sortBy, setSortBy] = useState("name");

  // Get unique categories and brands
  const categories = Array.from(
    new Set(cosmetics?.map((p) => p.classify) || [])
  );
  const brands = Array.from(
    new Set(cosmetics?.map((p) => p.brand).filter(Boolean) || [])
  );

  // Handle add to cart
  const handleAddToCart = (
    cosmetic: Cosmetic,
    quantity: number = 1,
    variant?: string
  ) => {
    if (user == null) {
      setTimeout(() => {
        router.push("users/login");
        toast.error("Hãy đăng nhập để thêm sản phẩm vào giỏ hàng!");
      }, 500);
      return;
    }
    dispatch(
      addToCart({
        cosmeticId: cosmetic._id,
        quantity,
        variant,
      })
    );
    toast.success("Đã thêm sản phẩm vào giỏ hàng!");
  };

  // Handle view product detail
  const handleViewProduct = (cosmetic: Cosmetic) => {
    router.push(`/product/${cosmetic._id}`);
  };

  const filteredProducts = cosmetics.filter((cosmetic) => {
    if (
      searchQuery &&
      !cosmetic.nameCosmetic.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(cosmetic.classify)
    ) {
      return false;
    }

    if (
      selectedBrands.length > 0 &&
      cosmetic.brand &&
      !selectedBrands.includes(cosmetic.brand)
    ) {
      return false;
    }

    if (priceRange.min && cosmetic.discountPrice < parseInt(priceRange.min)) {
      return false;
    }
    if (priceRange.max && cosmetic.discountPrice > parseInt(priceRange.max)) {
      return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.discountPrice - b.discountPrice;
      case "price-desc":
        return b.discountPrice - a.discountPrice;
      case "name":
        return a.nameCosmetic.localeCompare(b.nameCosmetic);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const displayedProducts = sortedProducts.slice(0, displayedCount);
  const hasMoreProducts = displayedCount < sortedProducts.length;

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + PRODUCTS_PER_PAGE);
  };

  useEffect(() => {
    setDisplayedCount(PRODUCTS_PER_PAGE);
  }, [searchQuery, selectedCategories, selectedBrands, priceRange, sortBy]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category]);
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category));
    }
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands((prev) => [...prev, brand]);
    } else {
      setSelectedBrands((prev) => prev.filter((b) => b !== brand));
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: "", max: "" });
    setSortBy("name");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceRange.min ||
    priceRange.max;

  // Filter Content Component (reusable for desktop and mobile)
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <label className="font-inter font-medium text-foreground text-sm">
          Tìm kiếm
        </label>
        <div className="relative">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="pl-10 bg-input-background border-border"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <label className="font-inter font-medium text-foreground text-sm">
          Danh mục
        </label>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category, !!checked)
                  }
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm text-muted-foreground font-inter cursor-pointer hover:text-foreground transition-colors"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="space-y-3">
          <label className="font-inter font-medium text-foreground text-sm">
            Thương hiệu
          </label>
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand!)}
                    onCheckedChange={(checked) =>
                      handleBrandChange(brand!, !!checked)
                    }
                  />
                  <label
                    htmlFor={`brand-${brand}`}
                    className="text-sm text-muted-foreground font-inter cursor-pointer hover:text-foreground transition-colors"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-3">
        <label className="font-inter font-medium text-foreground text-sm">
          Khoảng giá
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Từ"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange((prev) => ({
                ...prev,
                min: e.target.value,
              }))
            }
            className="bg-input-background border-border"
          />
          <Input
            type="number"
            placeholder="Đến"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange((prev) => ({
                ...prev,
                max: e.target.value,
              }))
            }
            className="bg-input-background border-border"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full border-brand-pink text-brand-deep-pink hover:bg-brand-pink font-poppins"
        >
          <X className="h-4 w-4 mr-2" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <h1 className="font-inter text-foreground text-3xl font-bold">
          Danh Mục Sản Phẩm
        </h1>
        <p className="text-muted-foreground font-inter text-lg">
          Tìm kiếm sản phẩm phù hợp với nhu cầu làm đẹp của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <Card className="border-border sticky top-24">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-inter font-medium text-foreground text-lg">
                  Bộ Lọc
                </h3>
              </div>
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="pr-4">
                  <FilterContent />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button
                size="lg"
                className="bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white shadow-lg rounded-full h-14 w-14 p-0"
              >
                <Filter className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="font-inter">Bộ Lọc Sản Phẩm</SheetTitle>
                <SheetDescription className="font-inter">
                  Tìm kiếm sản phẩm theo danh mục, thương hiệu và giá
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="p-6">
                  <FilterContent />
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          {/* Sort and Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-muted-foreground font-inter">
              Hiển thị {displayedProducts.length} / {sortedProducts.length} sản
              phẩm
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 bg-input-background border-border">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Tên A-Z</SelectItem>
                <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
                <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {displayedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Suspense fallback={<SkeletonProductCardList />}>
                  <ProductCardList
                    cosmetics={displayedProducts}
                    onAddToCart={handleAddToCart}
                    onViewDetail={handleViewProduct}
                  />
                </Suspense>
              </div>

              {/* Load More Button */}
              {hasMoreProducts && (
                <div className="flex justify-center mt-12">
                  <Button
                    onClick={handleLoadMore}
                    className="bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins px-8 py-6 text-base"
                  >
                    Xem thêm sản phẩm
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-inter text-lg">
                Không tìm thấy sản phẩm phù hợp với bộ lọc của bạn.
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4 border-brand-pink text-brand-deep-pink hover:bg-brand-pink font-poppins"
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;