import { useState } from 'react';
import { Package, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllOrders, useGetOrdersByCity, useUpdateOrderStatus } from '../../hooks/useQueries';
import { toast } from 'sonner';
import OrderStatusBadge from '../../components/status/OrderStatusBadge';
import { getOrderStatusText } from '../../utils/statusStyles';
import { City } from '../../backend';
import AdminNav from '../../components/admin/AdminNav';

export default function AdminOrdersPage() {
  const [selectedCity, setSelectedCity] = useState<'all' | City>('all');
  
  const { data: allOrders = [], isLoading: allOrdersLoading } = useGetAllOrders();
  const { data: kanpurOrders = [], isLoading: kanpurLoading } = useGetOrdersByCity(City.kanpur);
  const { data: unnaoOrders = [], isLoading: unnaoLoading } = useGetOrdersByCity(City.unnao);
  
  const updateStatus = useUpdateOrderStatus();

  // Determine which orders to display based on selected city
  const orders = selectedCity === 'all' 
    ? allOrders 
    : selectedCity === City.kanpur 
    ? kanpurOrders 
    : unnaoOrders;

  const isLoading = selectedCity === 'all' 
    ? allOrdersLoading 
    : selectedCity === City.kanpur 
    ? kanpurLoading 
    : unnaoLoading;

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

  const getCityLabel = (city: any): string => {
    if (!city) return 'Unknown';
    const cityValue = typeof city === 'string' ? city : (city as any).__kind__;
    return cityValue === 'kanpur' ? 'Kanpur' : cityValue === 'unnao' ? 'Unnao' : 'Other';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <AdminNav />
        <h1 className="text-3xl font-bold mb-6">Orders Panel</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <AdminNav />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
          <Package className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Orders Panel
        </h1>
      </div>

      <Card className="mb-6 border-2">
        <CardHeader className="surface-secondary-tint rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filter Orders by City
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Select
            value={selectedCity}
            onValueChange={(value) => setSelectedCity(value as 'all' | City)}
          >
            <SelectTrigger className="w-full md:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value={City.kanpur}>Kanpur</SelectItem>
              <SelectItem value={City.unnao}>Unnao</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-2">
            Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
            {selectedCity !== 'all' && ` in ${getCityLabel(selectedCity)}`}
          </p>
        </CardContent>
      </Card>

      {orders.length === 0 ? (
        <div className="empty-state-container">
          <Package className="h-16 w-16 mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground text-lg">
            No orders found
            {selectedCity !== 'all' && ` in ${getCityLabel(selectedCity)}`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const currentStatus = getOrderStatusText(order.status).toLowerCase();
            return (
              <Card key={order.id} className="border-2 hover:border-primary/30 hover:shadow-soft-lg transition-all">
                <CardHeader className="surface-primary-tint rounded-t-xl">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Number(order.timestamp) / 1000000).toLocaleDateString()} • {getCityLabel(order.city)}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
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
                      <p className="text-sm">
                        <span className="font-semibold">City:</span> {getCityLabel(order.city)}
                      </p>
                      <p className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
                        Total: ${Number(order.total).toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2 surface-secondary-tint rounded-lg p-4">
                      <label className="text-sm font-semibold">Update Status:</label>
                      <Select
                        value={currentStatus}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-secondary/20">
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
