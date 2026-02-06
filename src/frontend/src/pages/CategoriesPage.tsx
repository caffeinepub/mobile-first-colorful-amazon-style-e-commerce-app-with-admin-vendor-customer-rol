import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Sparkles, ShoppingCart } from 'lucide-react';
import { StoreCategory } from '../backend';
import { getStoreCategorySlug } from '../constants/storeCategories';

export default function CategoriesPage() {
  const storeCategories = [
    {
      category: StoreCategory.clothStore,
      label: 'Cloth Store',
      icon: ShoppingBag,
      gradient: 'bg-gradient-to-br from-primary/80 to-primary/40',
    },
    {
      category: StoreCategory.cosmeticStore,
      label: 'Cosmetic Store',
      icon: Sparkles,
      gradient: 'bg-gradient-to-br from-secondary/80 to-secondary/40',
    },
    {
      category: StoreCategory.groceryStore,
      label: 'Grocery Store',
      icon: ShoppingCart,
      gradient: 'bg-gradient-to-br from-accent/80 to-accent/40',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        Store Categories
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {storeCategories.map(({ category, label, icon: Icon, gradient }) => {
          const slug = getStoreCategorySlug(category);
          return (
            <Link key={category} to="/store-category/$storeCategory" params={{ storeCategory: slug }}>
              <Card className="marketplace-card cursor-pointer h-full group tap-scale">
                <div className="aspect-square overflow-hidden rounded-t-2xl relative bg-gradient-to-br from-background to-muted/30">
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div
                      className={`w-full h-full rounded-2xl ${gradient} flex items-center justify-center shadow-soft-lg group-hover:scale-105 transition-transform duration-300`}
                    >
                      <Icon className="w-24 h-24 text-white drop-shadow-lg" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="font-extrabold text-lg group-hover:text-primary transition-colors">
                    {label}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
