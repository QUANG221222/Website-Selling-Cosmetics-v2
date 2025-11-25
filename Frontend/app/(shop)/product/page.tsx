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

const ProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const cosmetics = useSelector(selectAllCosmetics);
  const user = useSelector(selectCurrentUser);
  
  const loading = useSelector(selectCosmeticLoading);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: "",
    max: "",
  });

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchAllCosmetics());
  }, [dispatch]);

  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
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
    if(user == null) {
        setTimeout(() => {
            router.push('users/login')
            toast.error("Hãy đăng nhập để thêm sản phẩm vào giỏ hàng!")
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
    // Navigate to product detail page
    router.push(`/product/${cosmetic._id}`);
  };

  const filteredProducts = cosmetics.filter((cosmetic) => {
    // Search filter
    if (
      searchQuery &&
      !cosmetic.nameCosmetic.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(cosmetic.classify)
    ) {
      return false;
    }

    // Brand filter
    if (
      selectedBrands.length > 0 &&
      cosmetic.brand &&
      !selectedBrands.includes(cosmetic.brand)
    ) {
      return false;
    }

    // Price filter
    if (priceRange.min && cosmetic.discountPrice < parseInt(priceRange.min)) {
      return false;
    }
    if (priceRange.max && cosmetic.discountPrice > parseInt(priceRange.max)) {
      return false;
    }

    return true;
  });

  // Sort products
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <h1 className="font-inter text-foreground">Danh Mục Sản Phẩm</h1>
        <p className="text-muted-foreground font-inter text-lg">
          Tìm kiếm sản phẩm phù hợp với nhu cầu làm đẹp của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-border sticky top-24">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-inter font-medium text-foreground">
                  Bộ Lọc
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="font-inter font-medium text-foreground">
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
                  <label className="font-inter font-medium text-foreground">
                    Danh mục
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) =>
                            handleCategoryChange(category, !!checked)
                          }
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="text-muted-foreground font-inter cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                {brands.length > 0 && (
                  <div className="space-y-3">
                    <label className="font-inter font-medium text-foreground">
                      Thương hiệu
                    </label>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <div
                          key={brand}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`brand-${brand}`}
                            checked={selectedBrands.includes(brand!)}
                            onCheckedChange={(checked) =>
                              handleBrandChange(brand!, !!checked)
                            }
                          />
                          <label
                            htmlFor={`brand-${brand}`}
                            className="text-muted-foreground font-inter cursor-pointer"
                          >
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="font-inter font-medium text-foreground">
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
            </CardContent>
          </Card>
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          {/* Sort and Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground font-inter">
              Hiển thị sản phẩm
            </p>
            <Select>
              <SelectTrigger className="w-48 bg-input-background border-border">
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
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Suspense fallback={<SkeletonProductCardList />}>
                <ProductCardList
                cosmetics={sortedProducts}
                onAddToCart={handleAddToCart}
                onViewDetail={handleViewProduct}
                />
          </Suspense>
            </div>
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
