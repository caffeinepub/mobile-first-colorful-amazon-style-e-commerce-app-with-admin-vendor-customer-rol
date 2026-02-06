import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, Package, ShoppingBag, Wallet, User } from 'lucide-react';

export default function VendorTabs() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const tabs = [
    { to: '/vendor', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/vendor/products', label: 'Products', icon: Package },
    { to: '/vendor/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/vendor/wallet', label: 'Wallet', icon: Wallet },
    { to: '/vendor/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex gap-2 min-w-max border-b border-border pb-2">
        {tabs.map((tab) => {
          const isActive = currentPath === tab.to;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-primary-end text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
