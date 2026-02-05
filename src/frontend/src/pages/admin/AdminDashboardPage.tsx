import { Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAnalytics } from '../../hooks/useQueries';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
  const { data: analytics } = useGetAnalytics();

  const chartData = [
    { name: 'Products', value: Number(analytics?.totalProducts || 0) },
    { name: 'Orders', value: Number(analytics?.totalOrders || 0) },
    { name: 'Vendors', value: Number(analytics?.totalVendors || 0) },
  ];

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
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{analytics?.totalProducts.toString() || '0'}</div>
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
            <div className="text-2xl font-bold text-secondary">{analytics?.totalOrders.toString() || '0'}</div>
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
            <div className="text-2xl font-bold text-accent">${Number(analytics?.totalRevenue || 0).toFixed(2)}</div>
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
            <div className="text-2xl font-bold text-chart-3">{analytics?.totalVendors.toString() || '0'}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/20 shadow-soft-lg">
        <CardHeader className="surface-primary-tint rounded-t-xl">
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
