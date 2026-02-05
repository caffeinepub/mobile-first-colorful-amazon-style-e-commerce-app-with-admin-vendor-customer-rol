import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCart, useGetProducts, useCreateOrder, useClearCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import PrimaryCtaButton from '../components/buttons/PrimaryCtaButton';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: cart = [] } = useGetCart();
  const { data: allProducts = [] } = useGetProducts('name');
  const createOrder = useCreateOrder();
  const clearCart = useClearCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const cartWithProducts = cart
    .map((item) => ({
      ...item,
      product: allProducts.find((p) => p.id === item.productId),
    }))
    .filter((item) => item.product);

  const total = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = Number(item.product.price);
    const discount = Number(item.product.discount || 0);
    const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
    return sum + finalPrice * Number(item.quantity);
  }, 0);

  const handlePlaceOrder = async () => {
    if (!identity) {
      toast.error('Please sign in to place an order');
      return;
    }

    if (cartWithProducts.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    try {
      const orderId = `order-${Date.now()}`;
      const vendor = cartWithProducts[0].product?.vendor || identity.getPrincipal();

      await createOrder.mutateAsync({
        id: orderId,
        customer: identity.getPrincipal(),
        vendor,
        items: cartWithProducts.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: BigInt(Math.round(Number(item.product!.price))),
        })),
        total: BigInt(Math.round(total)),
        status: { pending: null } as any,
        timestamp: BigInt(Date.now() * 1000000),
      });

      await clearCart.mutateAsync();
      toast.success('Order placed successfully!');
      navigate({ to: '/orders' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Checkout</h1>

      <Card className="mb-6 border-2 border-secondary/20 shadow-soft-lg">
        <CardHeader className="surface-secondary-tint rounded-t-xl">
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartWithProducts.map((item) => {
            if (!item.product) return null;
            const price = Number(item.product.price);
            const discount = Number(item.product.discount || 0);
            const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

            return (
              <div key={item.productId} className="flex justify-between hover:bg-muted/30 p-2 rounded-lg transition-colors">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity.toString()}</p>
                </div>
                <p className="font-semibold">${(finalPrice * Number(item.quantity)).toFixed(2)}</p>
              </div>
            );
          })}
          <div className="border-t pt-4 flex justify-between text-lg font-bold surface-primary-tint rounded-lg p-3">
            <span>Total</span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-2 border-accent/20">
        <CardHeader className="surface-accent-tint rounded-t-xl">
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a demo checkout. No actual payment will be processed.
          </p>
        </CardContent>
      </Card>

      <PrimaryCtaButton size="lg" className="w-full shadow-lg hover:shadow-xl" onClick={handlePlaceOrder} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Place Order'}
      </PrimaryCtaButton>
    </div>
  );
}
