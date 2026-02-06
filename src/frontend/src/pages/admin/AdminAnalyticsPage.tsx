import { TrendingUp, Package, Users, DollarSign, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAdminAnalytics } from '../../hooks/useQueries';
import AdminNav from '../../components/admin/AdminNav';
import { formatInr } from '../../utils/formatInr';

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading, error } = useGetAdminAnalytics();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <AdminNav />
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <AdminNav />
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>
        <p className="text-destructive">Failed to load analytics data</p>
      </div>
    );
  }

  const totalVendors = Number(analytics?.totalVendors || 0);
  const totalOrders = Number(analytics?.totalOrders || 0);
  const totalSales = Number(analytics?.totalSales || 0);
  const totalCommission = Number(analytics?.totalCommission || 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <AdminNav />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
          <TrendingUp className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Analytics
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 hover:border-primary/30 hover:shadow-soft-lg transition-all">
          <CardHeader className="surface-primary-tint rounded-t-xl pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-primary" />
              Total Vendors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {totalVendors}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Registered vendors</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/30 hover:shadow-soft-lg transition-all">
          <CardHeader className="surface-secondary-tint rounded-t-xl pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-5 w-5 text-secondary" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              {totalOrders}
            </p>
            <p className="text-sm text-muted-foreground mt-1">All time orders</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/30 hover:shadow-soft-lg transition-all">
          <CardHeader className="surface-accent-tint rounded-t-xl pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-5 w-5 text-accent" />
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold bg-gradient-to-r from-accent to-highlight bg-clip-text text-transparent">
              {formatInr(totalSales)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Gross revenue</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/30 hover:shadow-soft-lg transition-all">
          <CardHeader className="surface-highlight-tint rounded-t-xl pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Percent className="h-5 w-5 text-highlight" />
              Total Commission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold bg-gradient-to-r from-highlight to-primary bg-clip-text text-transparent">
              {formatInr(totalCommission)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">10% commission earned</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-2">
        <CardHeader className="surface-secondary-tint rounded-t-xl">
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Average Order Value</span>
            <span className="font-semibold">
              {totalOrders > 0 ? formatInr(Math.round(totalSales / totalOrders)) : formatInr(0)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Commission Rate</span>
            <span className="font-semibold">10%</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">Average Commission per Order</span>
            <span className="font-semibold">
              {totalOrders > 0 ? formatInr(Math.round(totalCommission / totalOrders)) : formatInr(0)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
