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
        <h1 className="text-3xl font-extrabold mb-6">Analytics</h1>
        <p className="font-semibold">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <AdminNav />
        <h1 className="text-3xl font-extrabold mb-6">Analytics</h1>
        <p className="text-destructive font-semibold">Failed to load analytics data</p>
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
        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-soft">
          <TrendingUp className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Analytics
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="marketplace-card bg-gradient-to-br from-primary/15 to-primary/5 border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <div className="p-2 rounded-xl bg-primary/20 border-2 border-primary/40 shadow-soft">
                <Users className="h-5 w-5 text-primary" />
              </div>
              Total Vendors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-primary">
              {totalVendors}
            </p>
            <p className="text-sm text-muted-foreground mt-1 font-semibold">Registered vendors</p>
          </CardContent>
        </Card>

        <Card className="marketplace-card bg-gradient-to-br from-secondary/15 to-secondary/5 border-secondary/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <div className="p-2 rounded-xl bg-secondary/20 border-2 border-secondary/40 shadow-soft">
                <Package className="h-5 w-5 text-secondary" />
              </div>
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-secondary">
              {totalOrders}
            </p>
            <p className="text-sm text-muted-foreground mt-1 font-semibold">All time orders</p>
          </CardContent>
        </Card>

        <Card className="marketplace-card bg-gradient-to-br from-accent/15 to-accent/5 border-accent/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <div className="p-2 rounded-xl bg-accent/20 border-2 border-accent/40 shadow-soft">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-accent">
              {formatInr(totalSales)}
            </p>
            <p className="text-sm text-muted-foreground mt-1 font-semibold">Gross revenue</p>
          </CardContent>
        </Card>

        <Card className="marketplace-card bg-gradient-to-br from-destructive/15 to-destructive/5 border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <div className="p-2 rounded-xl bg-destructive/20 border-2 border-destructive/40 shadow-soft">
                <Percent className="h-5 w-5 text-destructive" />
              </div>
              Total Commission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-destructive">
              {formatInr(totalCommission)}
            </p>
            <p className="text-sm text-muted-foreground mt-1 font-semibold">10% commission earned</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 marketplace-card">
        <CardHeader className="surface-secondary-tint rounded-t-2xl">
          <CardTitle className="font-extrabold">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground font-semibold">Average Order Value</span>
            <span className="font-extrabold">
              {totalOrders > 0 ? formatInr(Math.round(totalSales / totalOrders)) : formatInr(0)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground font-semibold">Commission Rate</span>
            <span className="font-extrabold">10%</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground font-semibold">Average Commission per Order</span>
            <span className="font-extrabold">
              {totalOrders > 0 ? formatInr(Math.round(totalCommission / totalOrders)) : formatInr(0)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
