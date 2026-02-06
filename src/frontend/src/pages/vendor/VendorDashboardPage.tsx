import { Package, ShoppingBag, TrendingUp, Wallet as WalletIcon, AlertCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetVendorProducts, useGetVendorOrders, useGetCallerVendor } from '../../hooks/useQueries';
import { formatInr } from '../../utils/formatInr';
import { OutletStatus } from '../../backend';
import VendorTabs from '../../components/vendor/VendorTabs';

export default function VendorDashboardPage() {
  const { data: products = [], isLoading: productsLoading } = useGetVendorProducts();
  const { data: orders = [], isLoading: ordersLoading } = useGetVendorOrders();
  const { data: vendor, isLoading: vendorLoading } = useGetCallerVendor();

  const isLoading = productsLoading || ordersLoading || vendorLoading;

  const isOutletDisabled = vendor?.outletStatus === OutletStatus.disabled;
  const walletDue = vendor?.walletDue ? Number(vendor.walletDue) : 0;
  const isNearLimit = walletDue >= 800;
  const isAtLimit = walletDue >= 1000;

  // Calculate total sales from orders
  const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        Vendor Dashboard
      </h1>

      <VendorTabs />

      {isAtLimit && (
        <Alert variant="destructive" className="mb-6 rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your outlet has been disabled. Wallet Due: {formatInr(walletDue)} has reached the limit of {formatInr(1000)}. Please contact admin to settle payment and reactivate your outlet.
          </AlertDescription>
        </Alert>
      )}

      {isOutletDisabled && !isAtLimit && (
        <Alert variant="destructive" className="mb-6 rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your outlet is currently disabled. Please contact admin to resolve this issue.
          </AlertDescription>
        </Alert>
      )}

      {isNearLimit && !isAtLimit && (
        <Alert className="mb-6 rounded-xl border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            Warning: Your commission balance is {formatInr(walletDue)}. Your outlet will be automatically disabled when it reaches {formatInr(1000)}.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Total Products */}
          <Card className="shadow-soft-lg rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-primary">Total Products</CardTitle>
              <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                <Package className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{products.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active listings</p>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card className="shadow-soft-lg rounded-2xl border-2 border-secondary/20 bg-gradient-to-br from-secondary/10 to-secondary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-secondary">Total Orders</CardTitle>
              <div className="p-2 rounded-lg bg-secondary/20 border border-secondary/30">
                <ShoppingBag className="h-5 w-5 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{orders.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          {/* Total Sales */}
          <Card className="shadow-soft-lg rounded-2xl border-2 border-accent/20 bg-gradient-to-br from-accent/10 to-accent/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-accent">Total Sales</CardTitle>
              <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{formatInr(totalSales)}</div>
              <p className="text-xs text-muted-foreground mt-1">Revenue earned</p>
            </CardContent>
          </Card>

          {/* Wallet Due */}
          <Card className={`shadow-soft-lg rounded-2xl border-2 ${
            isAtLimit 
              ? 'border-destructive bg-gradient-to-br from-destructive/10 to-destructive/5' 
              : isNearLimit 
              ? 'border-yellow-500 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5'
              : 'border-highlight/20 bg-gradient-to-br from-highlight/10 to-highlight/5'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className={`text-sm font-medium ${
                isAtLimit ? 'text-destructive' : isNearLimit ? 'text-yellow-600 dark:text-yellow-500' : 'text-highlight'
              }`}>
                Wallet Due
              </CardTitle>
              <div className={`p-2 rounded-lg ${
                isAtLimit ? 'bg-destructive/20 border border-destructive/30' :
                isNearLimit ? 'bg-yellow-500/20 border border-yellow-500/30' :
                'bg-highlight/20 border border-highlight/30'
              }`}>
                <WalletIcon className={`h-5 w-5 ${
                  isAtLimit ? 'text-destructive' :
                  isNearLimit ? 'text-yellow-600 dark:text-yellow-500' :
                  'text-highlight'
                }`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${
                isAtLimit ? 'text-destructive' :
                isNearLimit ? 'text-yellow-600 dark:text-yellow-500' :
                'text-highlight'
              }`}>
                {formatInr(walletDue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Commission Rate: 10% • Limit: {formatInr(1000)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
