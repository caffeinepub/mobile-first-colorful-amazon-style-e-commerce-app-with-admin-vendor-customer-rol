import { Link, useRouterState } from '@tanstack/react-router';
import { Home, Grid3x3, ShoppingCart, User, LayoutDashboard, Package, ShoppingBag, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGetCart, useGetCallerRole, useIsVendor, useIsAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

export default function BottomNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { data: cart } = useGetCart();
  const { data: role } = useGetCallerRole();
  const { data: isVendor } = useIsVendor();
  const { data: isAdmin } = useIsAdmin();
  const { identity } = useInternetIdentity();

  const cartItemCount = cart?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;
  
  // Determine user role from the new three-role system
  const roleValue = role ? (typeof role === 'string' ? role : (role as any).__kind__) : null;
  const isAdminUser = isAdmin === true || roleValue === 'admin';
  const isVendorUser = isVendor === true || roleValue === 'vendor';
  const isCustomer = identity && !isAdminUser && !isVendorUser;

  // Customer navigation
  const customerNavItems: NavItem[] = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/categories', icon: Grid3x3, label: 'Categories' },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartItemCount },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  // Vendor navigation - expanded to 5 items
  const vendorNavItems: NavItem[] = [
    { to: '/vendor', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/vendor/products', icon: Package, label: 'Products' },
    { to: '/vendor/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/vendor/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/vendor/profile', icon: User, label: 'Profile' },
  ];

  // Admin navigation
  const adminNavItems: NavItem[] = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/vendors', icon: User, label: 'Vendors' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  ];

  // Guest navigation
  const guestNavItems: NavItem[] = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/categories', icon: Grid3x3, label: 'Categories' },
  ];

  let navItems: NavItem[] = guestNavItems;
  if (isAdminUser) {
    navItems = adminNavItems;
  } else if (isVendorUser) {
    navItems = vendorNavItems;
  } else if (isCustomer) {
    navItems = customerNavItems;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/98 backdrop-blur-sm border-t shadow-soft-xl">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = currentPath === item.to || (item.to !== '/' && currentPath.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all relative ${
                isActive 
                  ? 'text-primary font-semibold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-b-full" />
              )}
              <div className={`relative transition-all ${isActive ? 'scale-110' : ''}`}>
                <div className={`${isActive ? 'bg-primary/10 p-2 rounded-xl' : ''}`}>
                  <Icon className="h-5 w-5" />
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground border-2 border-card font-bold">
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
