import { useNavigate } from '@tanstack/react-router';
import { UserCircle, Store } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PrimaryCtaButton from '@/components/buttons/PrimaryCtaButton';
import HeroBannerSlider from '@/components/HeroBannerSlider';
import DealCard from '@/components/DealCard';
import { useGetProducts } from '../hooks/useQueries';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: products = [] } = useGetProducts('name');

  // Get first 4 products for deals section
  const dealProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="px-4 pb-24 pt-6">
        {/* Hero Banner Slider */}
        <div className="mb-6">
          <HeroBannerSlider />
        </div>

        {/* Login Buttons */}
        <div className="space-y-3 mb-8">
          {/* Customer Login Button */}
          <button
            onClick={() => navigate({ to: '/customer-login' })}
            className="w-full bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-white font-bold py-4 px-6 rounded-2xl shadow-soft-lg transition-all duration-200 flex items-center justify-center gap-3 text-lg"
          >
            <UserCircle className="w-6 h-6" />
            Customer Login
          </button>

          {/* Vendor Login Button */}
          <button
            onClick={() => navigate({ to: '/vendor-login' })}
            className="w-full gradient-primary-cta py-4 px-6 rounded-2xl shadow-soft-lg transition-all duration-200 flex items-center justify-center gap-3 text-lg"
          >
            <Store className="w-6 h-6" />
            Vendor Login
          </button>
        </div>

        {/* Deals Section */}
        {dealProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Today's Deals
              </h2>
              <button
                onClick={() => navigate({ to: '/categories' })}
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {dealProducts.map((product, index) => (
                <DealCard
                  key={product.id}
                  product={product}
                  dealType={index === 0 ? 'hot' : index === 1 ? 'new' : 'sale'}
                  offerText={index === 0 ? 'BEST SELLER' : index === 1 ? 'JUST IN' : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* Our Features Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Why Shop With Us
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Feature Card 1 - Vast Collection */}
            <Card className="rounded-2xl shadow-soft border-2 hover:shadow-soft-lg transition-all card-lift">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-3 shadow-md">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base mb-1">Vast Collection</h3>
                <p className="text-xs text-muted-foreground">Thousands of products</p>
              </CardContent>
            </Card>

            {/* Feature Card 2 - Best Prices */}
            <Card className="rounded-2xl shadow-soft border-2 hover:shadow-soft-lg transition-all card-lift">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-highlight to-primary flex items-center justify-center mb-3 shadow-md">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base mb-1">Best Prices</h3>
                <p className="text-xs text-muted-foreground">Unbeatable deals</p>
              </CardContent>
            </Card>

            {/* Feature Card 3 - Fast Delivery */}
            <Card className="rounded-2xl shadow-soft border-2 hover:shadow-soft-lg transition-all card-lift">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-3 shadow-md">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base mb-1">Fast Delivery</h3>
                <p className="text-xs text-muted-foreground">Quick shipping</p>
              </CardContent>
            </Card>

            {/* Feature Card 4 - Secure Payment */}
            <Card className="rounded-2xl shadow-soft border-2 hover:shadow-soft-lg transition-all card-lift">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center mb-3 shadow-md">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base mb-1">Secure Payment</h3>
                <p className="text-xs text-muted-foreground">100% protected</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-6 pb-4">
          <p>© 2026. Built with ❤️ using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">caffeine.ai</a></p>
        </div>
      </div>
    </div>
  );
}
