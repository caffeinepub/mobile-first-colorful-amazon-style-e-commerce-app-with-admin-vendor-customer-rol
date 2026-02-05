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
    { to: '/', icon: Home, label: 'Home', color: 'primary' },
    { to: '/categories', icon: Grid3x3, label: 'Categories', color: 'secondary' },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartItemCount, color: 'accent' },
    { to: '/profile', icon: User, label: 'Profile', color: 'primary' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t shadow-soft-lg">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = currentPath === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all relative ${
                isActive 
                  ? `text-${item.color} font-semibold` 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isActive && (
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-${item.color} to-${item.color} rounded-b-full`} />
              )}
              <div className={`relative transition-all ${isActive ? 'scale-110' : ''}`}>
                <div className={`${isActive ? `bg-${item.color}/10 p-2 rounded-xl` : ''}`}>
                  <Icon className="h-6 w-6" />
                </div>
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-br from-primary to-secondary border-2 border-card">
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
