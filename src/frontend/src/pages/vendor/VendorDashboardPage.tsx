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
      <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        Vendor Dashboard
      </h1>

      <VendorTabs />

      {isAtLimit && (
        <Alert variant="destructive" className="mb-6 rounded-2xl shadow-soft">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-semibold">
            Your outlet has been disabled. Wallet Due: {formatInr(walletDue)} has reached the limit of {formatInr(1000)}. Please contact admin to settle payment and reactivate your outlet.
          </AlertDescription>
        </Alert>
      )}

      {isOutletDisabled && !isAtLimit && (
        <Alert variant="destructive" className="mb-6 rounded-2xl shadow-soft">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-semibold">
            Your outlet is currently disabled. Please contact admin to resolve this issue.
          </AlertDescription>
        </Alert>
      )}

      {isNearLimit && !isAtLimit && (
        <Alert className="mb-6 rounded-2xl border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 shadow-soft">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200 font-semibold">
            Warning: Your commission balance is {formatInr(walletDue)}. Your outlet will be automatically disabled when it reaches {formatInr(1000)}.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Total Products */}
          <Card className="marketplace-card bg-gradient-to-br from-primary/15 to-primary/5 border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-primary">Total Products</CardTitle>
              <div className="p-2.5 rounded-xl bg-primary/20 border-2 border-primary/40 shadow-soft">
                <Package className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-primary">{products.length}</div>
              <p className="text-xs text-muted-foreground mt-1 font-semibold">Active listings</p>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card className="marketplace-card bg-gradient-to-br from-secondary/15 to-secondary/5 border-secondary/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-secondary">Total Orders</CardTitle>
              <div className="p-2.5 rounded-xl bg-secondary/20 border-2 border-secondary/40 shadow-soft">
                <ShoppingBag className="h-5 w-5 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-secondary">{orders.length}</div>
              <p className="text-xs text-muted-foreground mt-1 font-semibold">All time</p>
            </CardContent>
          </Card>

          {/* Total Sales */}
          <Card className="marketplace-card bg-gradient-to-br from-accent/15 to-accent/5 border-accent/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-accent">Total Sales</CardTitle>
              <div className="p-2.5 rounded-xl bg-accent/20 border-2 border-accent/40 shadow-soft">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-accent">{formatInr(totalSales)}</div>
              <p className="text-xs text-muted-foreground mt-1 font-semibold">Revenue earned</p>
            </CardContent>
          </Card>

          {/* Wallet Due */}
          <Card className={`marketplace-card ${
            isAtLimit 
              ? 'bg-gradient-to-br from-destructive/15 to-destructive/5 border-destructive/30' 
              : isNearLimit 
              ? 'bg-gradient-to-br from-yellow-500/15 to-yellow-500/5 border-yellow-500/30'
              : 'bg-gradient-to-br from-highlight/15 to-highlight/5 border-highlight/30'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className={`text-sm font-bold ${
                isAtLimit ? 'text-destructive' : isNearLimit ? 'text-yellow-600 dark:text-yellow-500' : 'text-highlight'
              }`}>
                Wallet Due
              </CardTitle>
              <div className={`p-2.5 rounded-xl shadow-soft border-2 ${
                isAtLimit ? 'bg-destructive/20 border-destructive/40' :
                isNearLimit ? 'bg-yellow-500/20 border-yellow-500/40' :
                'bg-highlight/20 border-highlight/40'
              }`}>
                <WalletIcon className={`h-5 w-5 ${
                  isAtLimit ? 'text-destructive' :
                  isNearLimit ? 'text-yellow-600 dark:text-yellow-500' :
                  'text-highlight'
                }`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-extrabold ${
                isAtLimit ? 'text-destructive' :
                isNearLimit ? 'text-yellow-600 dark:text-yellow-500' :
                'text-highlight'
              }`}>
                {formatInr(walletDue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-semibold">
                Commission Rate: 10% • Limit: {formatInr(1000)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
