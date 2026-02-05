import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCustomerOrders } from '../../hooks/useQueries';
import OrderStatusBadge from '../../components/status/OrderStatusBadge';

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useGetCustomerOrders();

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
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
          <Package className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state-container">
          <Package className="h-16 w-16 mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-2 hover:border-primary/30 hover:shadow-soft-lg transition-all">
              <CardHeader className="surface-primary-tint rounded-t-xl">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <OrderStatusBadge status={order.status} />
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
                  <p className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Total: ${Number(order.total).toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
