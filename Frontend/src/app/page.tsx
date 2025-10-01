import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Categories } from "../components/Categories";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { ProductGrid } from "../components/ProductGrid";
import { Newsletter } from "../components/Newsletter";
import { Cart } from "../components/Cart";
import { Footer } from "../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        
        {/* All Products Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-4">Tất cả sản phẩm</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Khám phá bộ sưu tập đầy đủ các sản phẩm mỹ phẩm cao cấp
              </p>
            </div>
            <ProductGrid limit={8} />
          </div>
        </section>
        
        <Newsletter />
      </main>
      
      <Footer />
      <Cart />
    </div>
  );
}