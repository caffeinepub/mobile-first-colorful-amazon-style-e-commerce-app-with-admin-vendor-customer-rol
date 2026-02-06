import { Package, ShoppingBag, TrendingUp, Users, AlertCircle, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useGetAnalytics } from '../../hooks/useQueries';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { safeBigIntToNumber, safeFixed, safeToString, sanitizeChartValue } from '../../utils/safeNumbers';

export default function AdminDashboardPage() {
  const { data: analytics, isLoading, isError, error } = useGetAnalytics();
  const [copied, setCopied] = useState(false);

  const handleCopyError = () => {
    const errorText = error ? String(error) : 'Unknown error';
    navigator.clipboard.writeText(errorText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-2 animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-2">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-32"></div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load analytics data. Please try refreshing the page.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyError}
              className="ml-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty/unavailable state - check if analytics is null or undefined
  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Analytics data is currently unavailable. Please check back later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Safely convert analytics values with defensive checks
  const totalProducts = safeBigIntToNumber(analytics.totalProducts);
  const totalOrders = safeBigIntToNumber(analytics.totalOrders);
  const totalRevenue = safeBigIntToNumber(analytics.totalRevenue);
  const totalVendors = safeBigIntToNumber(analytics.totalVendors);

  // Prepare chart data with sanitized values
  const chartData = [
    { name: 'Products', value: sanitizeChartValue(totalProducts) },
    { name: 'Orders', value: sanitizeChartValue(totalOrders) },
    { name: 'Vendors', value: sanitizeChartValue(totalVendors) },
  ];

  // Only render chart if we have valid data (at least one non-zero value)
  const hasChartData = chartData.some(item => item.value > 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 border-primary/20 hover:shadow-soft-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 surface-primary-tint rounded-t-xl">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {safeToString(analytics.totalProducts)}
            </div>
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
            <div className="text-2xl font-bold text-secondary">
              {safeToString(analytics.totalOrders)}
            </div>
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
            <div className="text-2xl font-bold text-accent">
              ${safeFixed(totalRevenue, 2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-chart-3/20 hover:shadow-soft-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-chart-3/10 to-chart-3/5 rounded-t-xl">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <div className="p-2 rounded-lg bg-chart-3/10 border border-chart-3/20">
              <Users className="h-4 w-4 text-chart-3" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">
              {safeToString(analytics.totalVendors)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/20 shadow-soft-lg">
        <CardHeader className="surface-primary-tint rounded-t-xl">
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {hasChartData ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis dataKey="name" stroke="oklch(var(--foreground))" />
                <YAxis stroke="oklch(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'oklch(var(--card))', 
                    border: '1px solid oklch(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="value" fill="oklch(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No data available to display</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
