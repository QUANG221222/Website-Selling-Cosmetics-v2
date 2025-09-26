'use client';

import { useState, useEffect } from 'react';
import { Product, Category } from '../types';

// Mock data for products
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Luxury Matte Lipstick - Velvet Collection",
    brand: "Dior",
    price: 850000,
    originalPrice: 1200000,
    rating: 4.8,
    reviewCount: 245,
    image: "https://images.unsplash.com/photo-1613255348289-1407e4f2f980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXBzdGljayUyMG1ha2V1cCUyMGJlYXV0eXxlbnwxfHx8fDE3NTg2NjE0MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Hot",
    colors: ["#FF6B6B", "#FF8E53", "#A8E6CF", "#FFD93D"],
    category: "makeup",
    inStock: true,
    description: "Son môi lì cao cấp với công thức lâu trôi và màu sắc rực rỡ."
  },
  {
    id: 2,
    name: "Hydrating Facial Serum with Vitamin C",
    brand: "The Ordinary",
    price: 320000,
    rating: 4.6,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1696671297946-2f9ca4aa537b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3RzJTIwYmVhdXR5fGVufDF8fHx8MTc1ODc3MjQ0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Bán chạy",
    category: "skincare",
    inStock: true,
    description: "Serum dưỡng ẩm chứa Vitamin C giúp làm sáng da và chống lão hóa."
  },
  {
    id: 3,
    name: "Premium Foundation - Full Coverage",
    brand: "Fenty Beauty",
    price: 950000,
    rating: 4.9,
    reviewCount: 356,
    image: "https://images.unsplash.com/photo-1654973433534-1238e06f6b38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb3NtZXRpY3MlMjBtYWtldXB8ZW58MXx8fHwxNzU4NzgwNDk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    colors: ["#F5DEB3", "#DEB887", "#CD853F", "#8B4513", "#654321", "#2F1B14"],
    category: "makeup",
    inStock: true,
    description: "Kem nền cao cấp với độ che phủ hoàn hảo và 40 tông màu đa dạng."
  },
  {
    id: 4,
    name: "Luxury Eau de Parfum - Rose Garden",
    brand: "Chanel",
    price: 2500000,
    originalPrice: 2800000,
    rating: 4.7,
    reviewCount: 127,
    image: "https://images.unsplash.com/photo-1719175936556-dbd05e415913?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwYm90dGxlcyUyMGx1eHVyeXxlbnwxfHx8fDE3NTg3ODA1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Limited",
    category: "fragrance",
    inStock: true,
    description: "Nước hoa cao cấp với hương thơm quyến rũ của hoa hồng."
  },
  {
    id: 5,
    name: "Professional Makeup Brush Set",
    brand: "Morphe",
    price: 680000,
    originalPrice: 850000,
    rating: 4.5,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1758272421251-61be99aaf20b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0YWtldXAlMjBicnVzaGVzJTIwYmVhdXR5JTIwdG9vbHN8ZW58MXx8fHwxNzU4NzE0NjExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "tools",
    inStock: true,
    description: "Bộ cọ trang điểm chuyên nghiệp 12 cây với chất lượng cao cấp."
  },
  {
    id: 6,
    name: "Anti-Aging Night Cream",
    brand: "Olay",
    price: 450000,
    rating: 4.4,
    reviewCount: 167,
    image: "https://images.unsplash.com/photo-1696671297946-2f9ca4aa537b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3RzJTIwYmVhdXR5fGVufDF8fHx8MTc1ODc3MjQ0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "skincare",
    inStock: true,
    description: "Kem dưỡng đêm chống lão hóa với công thức tiên tiến."
  },
  {
    id: 7,
    name: "Waterproof Mascara - Volume & Length",
    brand: "Maybelline",
    price: 280000,
    rating: 4.3,
    reviewCount: 298,
    image: "https://images.unsplash.com/photo-1654973433534-1238e06f6b38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb3NtZXRpY3MlMjBtYWtldXB8ZW58MXx8fHwxNzU4NzgwNDk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "makeup",
    inStock: true,
    description: "Mascara chống nước tạo độ dày và dài cho lông mi."
  },
  {
    id: 8,
    name: "Gentle Cleansing Foam",
    brand: "CeraVe",
    price: 180000,
    rating: 4.2,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1696671297946-2f9ca4aa537b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3RzJTIwYmVhdXR5fGVufDF8fHx8MTc1ODc3MjQ0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "skincare",
    inStock: true,
    description: "Sữa rửa mặt tạo bọt nhẹ nhàng cho mọi loại da."
  }
];

const mockCategories: Category[] = [
  {
    id: 1,
    name: "Makeup",
    description: "Son, phấn, mascara...",
    image: "https://images.unsplash.com/photo-1654973433534-1238e06f6b38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb3NtZXRpY3MlMjBtYWtldXB8ZW58MXx8fHwxNzU4NzgwNDk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-pink-500 to-rose-500",
    slug: "makeup"
  },
  {
    id: 2,
    name: "Skincare",
    description: "Chăm sóc da mặt",
    image: "https://images.unsplash.com/photo-1696671297946-2f9ca4aa537b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3RzJTIwYmVhdXR5fGVufDF8fHx8MTc1ODc3MjQ0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-green-500 to-emerald-500",
    slug: "skincare"
  },
  {
    id: 3,
    name: "Nước hoa",
    description: "Hương thơm quyến rũ",
    image: "https://images.unsplash.com/photo-1719175936556-dbd05e415913?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwYm90dGxlcyUyMGx1eHVyeXxlbnwxfHx8fDE3NTg3ODA1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-purple-500 to-violet-500",
    slug: "fragrance"
  },
  {
    id: 4,
    name: "Tools",
    description: "Dụng cụ trang điểm",
    image: "https://images.unsplash.com/photo-1758272421251-61be99aaf20b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0YWtldXAlMjBicnVzaGVzJTIwYmVhdXR5JTIwdG9vbHN8ZW58MXx8fHwxNzU4NzE0NjExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-amber-500 to-orange-500",
    slug: "tools"
  }
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(mockProducts);
        setCategories(mockCategories);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductsByCategory = (categorySlug: string) => {
    return products.filter(product => product.category === categorySlug);
  };

  const getFeaturedProducts = (limit?: number) => {
    const featured = products.filter(product => product.badge || product.rating >= 4.5);
    return limit ? featured.slice(0, limit) : featured;
  };

  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.brand.toLowerCase().includes(lowercaseQuery) ||
      product.description?.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    products,
    categories,
    loading,
    error,
    getProductsByCategory,
    getFeaturedProducts,
    searchProducts
  };
};