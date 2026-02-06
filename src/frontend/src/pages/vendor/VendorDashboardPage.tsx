import { Link } from '@tanstack/react-router';
import { Package, ShoppingBag, TrendingUp, Store, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetVendorProducts, useGetVendorOrders, useGetVendors } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import PrimaryCtaButton from '../../components/buttons/PrimaryCtaButton';
import { formatInr } from '../../utils/formatInr';
import { OutletStatus } from '../../backend';

export default function VendorDashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: products = [] } = useGetVendorProducts();
  const { data: orders = [] } = useGetVendorOrders();
  const { data: vendors = [] } = useGetVendors();

  // Find current vendor's data
  const currentVendor = identity 
    ? vendors.find(v => v.principal.toString() === identity.getPrincipal().toString())
    : null;

  const isOutletDisabled = currentVendor?.outletStatus === OutletStatus.disabled;
  const walletDue = currentVendor?.walletDue ? Number(currentVendor.walletDue) : 0;
  const outletName = currentVendor?.outletName || 'Not Set';

  // Calculate total sales from orders
  const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        Vendor Dashboard
      </h1>

      {isOutletDisabled && (
        <Alert variant="destructive" className="mb-6 rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your outlet is currently disabled due to outstanding balance. Please contact admin to resolve this issue.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Wallet Card - Green Gradient */}
        <Card className="gradient-wallet-card shadow-soft-lg rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-accent">Wallet Due</CardTitle>
            <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
              <Package className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold highlight-due-amount">{formatInr(walletDue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Limit: {formatInr(1000)}</p>
          </CardContent>
        </Card>

        {/* Sales Card - Blue Gradient */}
        <Card className="gradient-sales-card shadow-soft-lg rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-secondary">Total Sales</CardTitle>
            <div className="p-2 rounded-lg bg-secondary/20 border border-secondary/30">
              <TrendingUp className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{formatInr(totalSales)}</div>
          </CardContent>
        </Card>

        {/* Outlet Name */}
        <Card className="border-2 border-primary/20 hover:shadow-soft-lg transition-all rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 surface-primary-tint rounded-t-2xl">
            <CardTitle className="text-sm font-medium">Outlet Name</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Store className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary truncate">{outletName}</div>
          </CardContent>
        </Card>

        {/* Outlet Status */}
        <Card className="border-2 border-secondary/20 hover:shadow-soft-lg transition-all rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 surface-secondary-tint rounded-t-2xl">
            <CardTitle className="text-sm font-medium">Outlet Status</CardTitle>
            <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
              <AlertCircle className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <Badge
              className={`text-sm font-semibold ${
                isOutletDisabled 
                  ? 'bg-destructive text-destructive-foreground' 
                  : 'bg-accent text-accent-foreground'
              }`}
            >
              {isOutletDisabled ? 'Disabled' : 'Enabled'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-2 border-primary/20 hover:shadow-soft-lg transition-all rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 surface-primary-tint rounded-t-2xl">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{products.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary/20 hover:shadow-soft-lg transition-all rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 surface-secondary-tint rounded-t-2xl">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
              <ShoppingBag className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{orders.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-primary/20 shadow-soft-lg rounded-2xl">
          <CardHeader className="surface-primary-tint rounded-t-2xl">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/vendor/products">
              <PrimaryCtaButton className="w-full shadow-md hover:shadow-lg rounded-xl">Manage Products</PrimaryCtaButton>
            </Link>
            <Link to="/vendor/orders">
              <Button variant="outline" className="w-full hover:bg-secondary/10 hover:text-secondary hover:border-secondary focus-ring-secondary rounded-xl">
                View Orders
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary/20 shadow-soft-lg rounded-2xl">
          <CardHeader className="surface-secondary-tint rounded-t-2xl">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {orders.length > 0
                ? `Latest order: ${orders[0].id}`
                : 'No recent orders'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
