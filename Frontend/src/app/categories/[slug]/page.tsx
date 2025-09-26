import { Header } from "../../../components/Header";
import { ProductGrid } from "../../../components/ProductGrid";
import { Newsletter } from "../../../components/Newsletter";
import { Cart } from "../../../components/Cart";
import { Footer } from "../../../components/Footer";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../../../components/ui/breadcrumb";
import { Suspense } from "react";
import { ProductGridSkeleton } from "../../../components/ProductGridSkeleton";
import { notFound } from "next/navigation";

// Mock categories for static generation
const categories = [
  { slug: 'makeup', name: 'Makeup', description: 'Son môi, phấn, mascara và các sản phẩm trang điểm cao cấp' },
  { slug: 'skincare', name: 'Skincare', description: 'Các sản phẩm chăm sóc da mặt chuyên nghiệp' },
  { slug: 'fragrance', name: 'Nước hoa', description: 'Hương thơm quyến rũ và sang trọng' },
  { slug: 'tools', name: 'Dụng cụ', description: 'Cọ trang điểm và các dụng cụ làm đẹp chuyên nghiệp' },
];

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = categories.find(cat => cat.slug === params.slug);
  
  if (!category) {
    return {
      title: 'Danh mục không tồn tại - BeautyShop',
    };
  }

  return {
    title: `${category.name} - BeautyShop`,
    description: category.description,
  };
}

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories.find(cat => cat.slug === params.slug);
  
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Breadcrumb */}
        <section className="py-6 bg-muted/20">
          <div className="container mx-auto px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/products">Sản phẩm</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{category.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>

        {/* Category Header */}
        <section className="py-12 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4">{category.name}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid categorySlug={params.slug} />
            </Suspense>
          </div>
        </section>
        
        <Newsletter />
      </main>
      
      <Footer />
      <Cart />
    </div>
  );
}