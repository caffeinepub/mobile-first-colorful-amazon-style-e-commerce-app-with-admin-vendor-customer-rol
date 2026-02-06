import { Wallet, TrendingUp, AlertCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCallerVendor, useGetVendorOrders } from '../../hooks/useQueries';
import { formatInr } from '../../utils/formatInr';
import { OutletStatus } from '../../backend';
import VendorTabs from '../../components/vendor/VendorTabs';

export default function VendorWalletPage() {
  const { data: vendor, isLoading: vendorLoading } = useGetCallerVendor();
  const { data: orders = [], isLoading: ordersLoading } = useGetVendorOrders();

  const isLoading = vendorLoading || ordersLoading;

  const walletDue = vendor?.walletDue ? Number(vendor.walletDue) : 0;
  const isOutletDisabled = vendor?.outletStatus === OutletStatus.disabled;
  const isNearLimit = walletDue >= 800;
  const isAtLimit = walletDue >= 1000;

  // Calculate total sales
  const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const totalCommission = Math.floor(totalSales * 0.1);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-highlight to-primary shadow-soft">
          <Wallet className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">Wallet</h1>
      </div>

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
        <div className="space-y-6">
          <Skeleton className="h-52 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Wallet Balance Card */}
          <Card className={`marketplace-card ${
            isAtLimit 
              ? 'bg-gradient-to-br from-destructive/15 to-destructive/5 border-destructive/30' 
              : isNearLimit 
              ? 'bg-gradient-to-br from-yellow-500/15 to-yellow-500/5 border-yellow-500/30'
              : 'bg-gradient-to-br from-highlight/15 to-highlight/5 border-highlight/30'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className={`h-6 w-6 ${
                  isAtLimit ? 'text-destructive' : isNearLimit ? 'text-yellow-600 dark:text-yellow-500' : 'text-highlight'
                }`} />
                Wallet Due
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-5xl font-extrabold mb-4 ${
                isAtLimit ? 'text-destructive' :
                isNearLimit ? 'text-yellow-600 dark:text-yellow-500' :
                'text-highlight'
              }`}>
                {formatInr(walletDue)}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Commission Rate:</span>
                  <span className="font-bold">10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Limit:</span>
                  <span className="font-bold">{formatInr(1000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Remaining Credit:</span>
                  <span className="font-bold text-accent">
                    {formatInr(Math.max(0, 1000 - walletDue))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sales Summary Card */}
          <Card className="marketplace-card bg-gradient-to-br from-accent/15 to-accent/5 border-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-6 w-6 text-accent" />
                Sales Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-semibold">Total Sales</p>
                  <p className="text-3xl font-extrabold text-accent">{formatInr(totalSales)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-semibold">Total Commission (10%)</p>
                  <p className="text-2xl font-extrabold text-secondary">{formatInr(totalCommission)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-semibold">Total Orders</p>
                  <p className="text-xl font-extrabold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="marketplace-card">
            <CardHeader>
              <CardTitle className="text-base">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-medium">
                A 10% commission is automatically added to your wallet for each delivered order. When your balance reaches ₹1,000, your outlet will be automatically disabled until payment is settled. Contact the admin to arrange payment and reactivate your outlet.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
