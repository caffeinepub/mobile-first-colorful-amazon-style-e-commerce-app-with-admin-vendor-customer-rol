import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetCustomerOrders } from '../../hooks/useQueries';

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useGetCustomerOrders();

  const getStatusColor = (status: any) => {
    if ('delivered' in status) return 'bg-success text-success-foreground';
    if ('shipped' in status) return 'bg-secondary text-secondary-foreground';
    if ('cancelled' in status) return 'bg-destructive text-destructive-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const getStatusText = (status: any) => {
    if ('delivered' in status) return 'Delivered';
    if ('shipped' in status) return 'Shipped';
    if ('processing' in status) return 'Processing';
    if ('cancelled' in status) return 'Cancelled';
    return 'Pending';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Package className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(Number(order.timestamp) / 1000000).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Items:</span> {order.items.length}
                  </p>
                  <p className="text-lg font-bold text-primary">Total: ${Number(order.total).toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
