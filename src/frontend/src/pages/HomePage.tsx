import { useNavigate } from '@tanstack/react-router';
import { UserCircle, Store, ShoppingBag, Sparkles, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PrimaryCtaButton from '@/components/buttons/PrimaryCtaButton';
import HeroBannerSlider from '@/components/HeroBannerSlider';
import DealCard from '@/components/DealCard';
import { useGetProducts } from '../hooks/useQueries';
import { STORE_CATEGORIES, getStoreCategorySlug } from '../constants/storeCategories';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: products = [] } = useGetProducts('name');

  // Get first 4 products for deals section
  const dealProducts = products.slice(0, 4);

  // Category card colors and icons
  const categoryStyles = [
    { 
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-100 to-pink-100',
      icon: ShoppingBag,
      image: '/assets/generated/clothing-tile-illustration-colorful.dim_800x500.png'
    },
    { 
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-100 to-rose-100',
      icon: Sparkles,
      image: '/assets/generated/cosmetics-tile-illustration-colorful.dim_800x500.png'
    },
    { 
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-100 to-emerald-100',
      icon: Package,
      image: '/assets/generated/grocery-tile-illustration-colorful.dim_800x500.png'
    },
  ];

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
            className="w-full bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-white font-extrabold py-5 px-6 rounded-2xl shadow-soft-lg transition-all duration-200 flex items-center justify-center gap-3 text-lg tap-scale"
          >
            <UserCircle className="w-7 h-7" />
            Customer Login
          </button>

          {/* Vendor Login Button */}
          <PrimaryCtaButton
            onClick={() => navigate({ to: '/vendor-login' })}
            className="w-full py-5 px-6 rounded-2xl shadow-soft-lg text-lg gap-3"
          >
            <Store className="w-7 h-7" />
            Vendor Login
          </PrimaryCtaButton>
        </div>

        {/* Store Categories Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {STORE_CATEGORIES.map((category, index) => {
              const style = categoryStyles[index];
              const Icon = style.icon;
              return (
                <Card
                  key={category.value}
                  className="marketplace-card cursor-pointer overflow-hidden tap-scale"
                  onClick={() => navigate({ to: `/store-category/${getStoreCategorySlug(category.value)}` })}
                >
                  <div className={`relative h-44 bg-gradient-to-br ${style.bgGradient}`}>
                    <img
                      src={style.image}
                      alt={category.label}
                      className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-soft-lg border-2 border-white/30`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold text-white drop-shadow-lg">{category.label}</h3>
                          <p className="text-sm text-white/95 drop-shadow font-semibold">Browse vendors</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Deals Section */}
        {dealProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Today's Deals
              </h2>
              <button
                onClick={() => navigate({ to: '/categories' })}
                className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
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
          <h2 className="text-2xl font-extrabold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Why Shop With Us
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Feature Card 1 - Vast Collection */}
            <Card className="marketplace-card tap-scale">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-3 shadow-soft">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="font-extrabold text-base mb-1">Vast Collection</h3>
                <p className="text-xs text-muted-foreground font-medium">Thousands of products</p>
              </CardContent>
            </Card>

            {/* Feature Card 2 - Best Prices */}
            <Card className="marketplace-card tap-scale">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-highlight to-primary flex items-center justify-center mb-3 shadow-soft">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-extrabold text-base mb-1">Best Prices</h3>
                <p className="text-xs text-muted-foreground font-medium">Unbeatable deals</p>
              </CardContent>
            </Card>

            {/* Feature Card 3 - Fast Delivery */}
            <Card className="marketplace-card tap-scale">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-3 shadow-soft">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-extrabold text-base mb-1">Fast Delivery</h3>
                <p className="text-xs text-muted-foreground font-medium">Quick shipping</p>
              </CardContent>
            </Card>

            {/* Feature Card 4 - Secure Payment */}
            <Card className="marketplace-card tap-scale">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center mb-3 shadow-soft">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-extrabold text-base mb-1">Secure Payment</h3>
                <p className="text-xs text-muted-foreground font-medium">100% protected</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-6 pb-4">
          <p>© 2026. Built with ❤️ using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">caffeine.ai</a></p>
        </div>
      </div>
    </div>
  );
}
