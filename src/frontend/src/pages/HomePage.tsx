import { Link } from '@tanstack/react-router';
import { ArrowRight, Tag, TrendingUp, Sparkles } from 'lucide-react';
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="section-header-accent">
              <Sparkles className="h-4 w-4" />
              Shop by Category
            </span>
          </div>
          <Link to="/categories">
            <Button variant="ghost" className="gap-2 hover:bg-secondary/10 hover:text-secondary focus-ring-secondary">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {categories.slice(0, 8).map((category) => (
            <Link key={category.id} to="/categories/$categoryId" params={{ categoryId: category.id }}>
              <Card className="hover:shadow-soft-lg hover-tint-primary transition-all cursor-pointer group">
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-primary/20">
                    <img
                      src={category.image.getDirectURL()}
                      alt={category.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-center line-clamp-2 group-hover:text-primary transition-colors">{category.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals Section */}
      {dealsProducts.length > 0 && (
        <section className="surface-accent-tint rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-destructive/10 border border-destructive/20">
              <Tag className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Hot Deals</h2>
          </div>
          <ProductGrid products={dealsProducts} isLoading={productsLoading} />
        </section>
      )}

      {/* Featured Products */}
      <section className="surface-secondary-tint rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Featured Products</h2>
        </div>
        <ProductGrid products={featuredProducts} isLoading={productsLoading} />
      </section>
    </div>
  );
}
