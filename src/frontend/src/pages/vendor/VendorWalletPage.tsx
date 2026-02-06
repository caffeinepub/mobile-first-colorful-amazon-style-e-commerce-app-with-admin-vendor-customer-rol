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
        <div className="p-2 rounded-xl bg-highlight/10 border border-highlight/20">
          <Wallet className="h-8 w-8 text-highlight" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">Wallet</h1>
      </div>

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
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Wallet Balance Card */}
          <Card className={`shadow-soft-lg rounded-2xl border-2 ${
            isAtLimit 
              ? 'border-destructive bg-gradient-to-br from-destructive/10 to-destructive/5' 
              : isNearLimit 
              ? 'border-yellow-500 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5'
              : 'border-highlight/20 bg-gradient-to-br from-highlight/10 to-highlight/5'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className={`h-6 w-6 ${
                  isAtLimit ? 'text-destructive' : isNearLimit ? 'text-yellow-600 dark:text-yellow-500' : 'text-highlight'
                }`} />
                Wallet Due
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-5xl font-bold mb-4 ${
                isAtLimit ? 'text-destructive' :
                isNearLimit ? 'text-yellow-600 dark:text-yellow-500' :
                'text-highlight'
              }`}>
                {formatInr(walletDue)}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commission Rate:</span>
                  <span className="font-semibold">10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Limit:</span>
                  <span className="font-semibold">{formatInr(1000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining Credit:</span>
                  <span className="font-semibold text-accent">
                    {formatInr(Math.max(0, 1000 - walletDue))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sales Summary Card */}
          <Card className="shadow-soft-lg rounded-2xl border-2 border-accent/20 bg-gradient-to-br from-accent/10 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-accent" />
                Sales Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
                  <p className="text-3xl font-bold text-accent">{formatInr(totalSales)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Commission (10%)</p>
                  <p className="text-2xl font-bold text-secondary">{formatInr(totalCommission)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                  <p className="text-xl font-bold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="shadow-soft rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A 10% commission is automatically added to your wallet for each delivered order. When your balance reaches ₹1,000, your outlet will be automatically disabled until payment is settled. Contact the admin to arrange payment and reactivate your outlet.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
