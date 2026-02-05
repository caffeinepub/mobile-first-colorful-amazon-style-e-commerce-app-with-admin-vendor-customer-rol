import { Link } from '@tanstack/react-router';
import { ArrowRight, Tag, TrendingUp } from 'lucide-react';
import HeroBannerSlider from '../components/HeroBannerSlider';
import ProductGrid from '../components/ProductGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetProducts, useGetCategories } from '../hooks/useQueries';

export default function HomePage() {
  const { data: products = [], isLoading: productsLoading } = useGetProducts('name');
  const { data: categories = [] } = useGetCategories();

  const featuredProducts = products.filter((p) => p.active).slice(0, 8);
  const dealsProducts = products.filter((p) => p.discount && Number(p.discount) > 0).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Hero Banner */}
      <HeroBannerSlider />

      {/* Top Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link to="/categories">
            <Button variant="ghost" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {categories.slice(0, 8).map((category) => (
            <Link key={category.id} to="/categories/$categoryId" params={{ categoryId: category.id }}>
              <Card className="hover:shadow-soft transition-shadow cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <img
                      src={category.image.getDirectURL()}
                      alt={category.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-center line-clamp-2">{category.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals Section */}
      {dealsProducts.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-6 w-6 text-destructive" />
            <h2 className="text-2xl font-bold">Hot Deals</h2>
          </div>
          <ProductGrid products={dealsProducts} isLoading={productsLoading} />
        </section>
      )}

      {/* Featured Products */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Featured Products</h2>
        </div>
        <ProductGrid products={featuredProducts} isLoading={productsLoading} />
      </section>
    </div>
  );
}
