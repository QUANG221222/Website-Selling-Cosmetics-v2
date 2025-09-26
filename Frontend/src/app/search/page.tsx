import { Header } from "../../components/Header";
import { ProductGrid } from "../../components/ProductGrid";
import { Newsletter } from "../../components/Newsletter";
import { Cart } from "../../components/Cart";
import { Footer } from "../../components/Footer";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../../components/ui/breadcrumb";
import { Suspense } from "react";
import { ProductGridSkeleton } from "../../components/ProductGridSkeleton";
import { Search } from "lucide-react";

export const metadata = {
  title: 'Tìm kiếm sản phẩm - BeautyShop',
  description: 'Tìm kiếm sản phẩm mỹ phẩm theo từ khóa',
};

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

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
                  <BreadcrumbPage>Tìm kiếm</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>

        {/* Search Header */}
        <section className="py-12 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
              <h1>Kết quả tìm kiếm</h1>
            </div>
            {query && (
              <p className="text-center text-muted-foreground">
                Tìm kiếm cho: <span className="font-medium text-foreground">"{query}"</span>
              </p>
            )}
          </div>
        </section>

        {/* Search Results */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid searchQuery={query} />
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