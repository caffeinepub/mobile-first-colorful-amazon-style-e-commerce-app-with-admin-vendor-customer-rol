import { useState } from 'react';
import { Package, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useGetAllOrders, useGetOrdersByCity, useUpdateOrderStatus } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { City, OrderStatus } from '../../backend';
import AdminNav from '../../components/admin/AdminNav';
import { formatInr } from '../../utils/formatInr';

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

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ orderId, status: { [newStatus]: null } });
      toast.success('Order status updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const getCityLabel = (city: any): string => {
    if (!city) return 'Unknown';
    const cityValue = typeof city === 'string' ? city : (city as any).__kind__;
    return cityValue === 'kanpur' ? 'Kanpur' : cityValue === 'unnao' ? 'Unnao' : 'Other';
  };

  const getCurrentStatus = (status: any): OrderStatus => {
    if ('delivered' in status) return OrderStatus.delivered;
    if ('shipped' in status) return OrderStatus.shipped;
    if ('processing' in status) return OrderStatus.processing;
    if ('cancelled' in status) return OrderStatus.cancelled;
    return OrderStatus.pending;
  };

  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.pending: return 'Pending';
      case OrderStatus.processing: return 'Processing';
      case OrderStatus.shipped: return 'Shipped';
      case OrderStatus.delivered: return 'Delivered';
      case OrderStatus.cancelled: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getStatusButtonVariant = (orderStatus: any, buttonStatus: OrderStatus): "default" | "outline" => {
    const current = getCurrentStatus(orderStatus);
    return current === buttonStatus ? "default" : "outline";
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
        <Card className="border-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const currentStatus = getCurrentStatus(order.status);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      {new Date(Number(order.timestamp) / 1000000).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getCityLabel(order.city)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {order.customer.toString().slice(0, 10)}...
                    </TableCell>
                    <TableCell>{order.items.length}</TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatInr(order.total)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Button
                          size="sm"
                          variant={getStatusButtonVariant(order.status, OrderStatus.pending)}
                          disabled={currentStatus === OrderStatus.pending || updateStatus.isPending}
                          onClick={() => handleStatusChange(order.id, OrderStatus.pending)}
                          className="text-xs"
                        >
                          Pending
                        </Button>
                        <Button
                          size="sm"
                          variant={getStatusButtonVariant(order.status, OrderStatus.processing)}
                          disabled={currentStatus === OrderStatus.processing || updateStatus.isPending}
                          onClick={() => handleStatusChange(order.id, OrderStatus.processing)}
                          className="text-xs"
                        >
                          Processing
                        </Button>
                        <Button
                          size="sm"
                          variant={getStatusButtonVariant(order.status, OrderStatus.shipped)}
                          disabled={currentStatus === OrderStatus.shipped || updateStatus.isPending}
                          onClick={() => handleStatusChange(order.id, OrderStatus.shipped)}
                          className="text-xs"
                        >
                          Shipped
                        </Button>
                        <Button
                          size="sm"
                          variant={getStatusButtonVariant(order.status, OrderStatus.delivered)}
                          disabled={currentStatus === OrderStatus.delivered || updateStatus.isPending}
                          onClick={() => handleStatusChange(order.id, OrderStatus.delivered)}
                          className="text-xs"
                        >
                          Delivered
                        </Button>
                        <Button
                          size="sm"
                          variant={getStatusButtonVariant(order.status, OrderStatus.cancelled)}
                          disabled={currentStatus === OrderStatus.cancelled || updateStatus.isPending}
                          onClick={() => handleStatusChange(order.id, OrderStatus.cancelled)}
                          className="text-xs"
                        >
                          Cancelled
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
