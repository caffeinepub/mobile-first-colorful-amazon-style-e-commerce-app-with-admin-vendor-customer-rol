import { Link, useRouterState } from '@tanstack/react-router';
import { Home, Grid3x3, ShoppingCart, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGetCart } from '../hooks/useQueries';

export default function BottomNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { data: cart } = useGetCart();

  const cartItemCount = cart?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/categories', icon: Grid3x3, label: 'Categories' },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartItemCount },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t shadow-soft-lg">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = currentPath === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
