'use client';

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../types";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Search, Filter } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface ProductGridProps {
  categorySlug?: string;
  searchQuery?: string;
  limit?: number;
}

export function ProductGrid({ categorySlug, searchQuery, limit }: ProductGridProps) {
  const { products, getProductsByCategory, searchProducts, loading } = useProducts();
  const [sortBy, setSortBy] = useState<string>("featured");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  let filteredProducts: Product[] = [];

  if (categorySlug) {
    filteredProducts = getProductsByCategory(categorySlug);
  } else if (searchQuery || localSearchQuery) {
    filteredProducts = searchProducts(searchQuery || localSearchQuery);
  } else {
    filteredProducts = products;
  }

  // Apply price filter
  if (priceRange !== "all") {
    const [min, max] = priceRange.split("-").map(Number);
    filteredProducts = filteredProducts.filter(product => {
      if (max) {
        return product.price >= min && product.price <= max;
      } else {
        return product.price >= min;
      }
    });
  }

  // Apply sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default:
        return (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
    }
  });

  if (limit) {
    filteredProducts = filteredProducts.slice(0, limit);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 space-y-4">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị {filteredProducts.length} sản phẩm
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Nổi bật</SelectItem>
              <SelectItem value="price-low">Giá thấp</SelectItem>
              <SelectItem value="price-high">Giá cao</SelectItem>
              <SelectItem value="rating">Đánh giá</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
            </SelectContent>
          </Select>

          {/* Price Range */}
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="0-500000">Dưới 500k</SelectItem>
              <SelectItem value="500000-1000000">500k - 1M</SelectItem>
              <SelectItem value="1000000-2000000">1M - 2M</SelectItem>
              <SelectItem value="2000000">Trên 2M</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-muted-foreground text-sm">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}