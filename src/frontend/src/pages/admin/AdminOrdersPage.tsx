import { useState } from 'react';
import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useGetAllOrders, useUpdateOrderStatus } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useGetAllOrders();
  const updateStatus = useUpdateOrderStatus();

  const getStatusColor = (status: any) => {
    if ('delivered' in status) return 'bg-success text-success-foreground';
    if ('shipped' in status) return 'bg-secondary text-secondary-foreground';
    if ('cancelled' in status) return 'bg-destructive text-destructive-foreground';
    if ('processing' in status) return 'bg-chart-2 text-white';
    return 'bg-muted text-muted-foreground';
  };

  const getStatusText = (status: any) => {
    if ('delivered' in status) return 'Delivered';
    if ('shipped' in status) return 'Shipped';
    if ('processing' in status) return 'Processing';
    if ('cancelled' in status) return 'Cancelled';
    return 'Pending';
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const statusMap: Record<string, any> = {
        pending: { pending: null },
        processing: { processing: null },
        shipped: { shipped: null },
        delivered: { delivered: null },
        cancelled: { cancelled: null },
      };

      await updateStatus.mutateAsync({ orderId, status: statusMap[newStatus] });
      toast.success('Order status updated!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">All Orders</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Package className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">All Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const currentStatus = getStatusText(order.status).toLowerCase();
            return (
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
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold">Customer:</span>{' '}
                        {order.customer.toString().slice(0, 10)}...
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Vendor:</span> {order.vendor.toString().slice(0, 10)}...
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Items:</span> {order.items.length}
                      </p>
                      <p className="text-lg font-bold text-primary mt-2">
                        Total: ${Number(order.total).toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Update Status:</label>
                      <Select
                        value={currentStatus}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
