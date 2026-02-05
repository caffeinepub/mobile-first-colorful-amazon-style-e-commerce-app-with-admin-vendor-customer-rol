import { Link } from '@tanstack/react-router';
import { Package, ShoppingBag, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetVendorProducts, useGetVendorOrders } from '../../hooks/useQueries';
import PrimaryCtaButton from '../../components/buttons/PrimaryCtaButton';

export default function VendorDashboardPage() {
  const { data: products = [] } = useGetVendorProducts();
  const { data: orders = [] } = useGetVendorOrders();

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Vendor Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-primary/20 hover:shadow-soft-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 surface-primary-tint rounded-t-xl">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{products.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary/20 hover:shadow-soft-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 surface-secondary-tint rounded-t-xl">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
              <ShoppingBag className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{orders.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/20 hover:shadow-soft-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 surface-accent-tint rounded-t-xl">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-primary/20 shadow-soft-lg">
          <CardHeader className="surface-primary-tint rounded-t-xl">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/vendor/products">
              <PrimaryCtaButton className="w-full shadow-md hover:shadow-lg">Manage Products</PrimaryCtaButton>
            </Link>
            <Link to="/vendor/orders">
              <Button variant="outline" className="w-full hover:bg-secondary/10 hover:text-secondary hover:border-secondary focus-ring-secondary">
                View Orders
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary/20 shadow-soft-lg">
          <CardHeader className="surface-secondary-tint rounded-t-xl">
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
