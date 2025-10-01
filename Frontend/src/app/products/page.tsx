import { Header } from "../../components/Header";
import { ProductGrid } from "../../components/ProductGrid";
import { Newsletter } from "../../components/Newsletter";
import { Cart } from "../../components/Cart";
import { Footer } from "../../components/Footer";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../../components/ui/breadcrumb";
import { Suspense } from "react";
import { ProductGridSkeleton } from "../../components/ProductGridSkeleton";

export const metadata = {
  title: 'Tất cả sản phẩm - BeautyShop',
  description: 'Khám phá bộ sưu tập đầy đủ các sản phẩm mỹ phẩm cao cấp',
};

export default function ProductsPage() {
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
                  <BreadcrumbPage>Sản phẩm</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="mb-4">Tất cả sản phẩm</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Khám phá bộ sưu tập đầy đủ các sản phẩm mỹ phẩm cao cấp với chất lượng tốt nhất
              </p>
            </div>
            
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid />
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