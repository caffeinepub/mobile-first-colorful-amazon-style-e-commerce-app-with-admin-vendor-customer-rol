import { Link, useLocation } from '@tanstack/react-router';
import { LayoutDashboard, Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/admin', label: 'Control Panel', icon: LayoutDashboard },
    { path: '/admin/vendors', label: 'Vendors', icon: Users },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="mb-6 border-b border-border pb-2">
      <Tabs value={currentPath} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <TabsTrigger
                  value={item.path}
                  className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </TabsTrigger>
              </Link>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}
