import { Link, useNavigate } from '@tanstack/react-router';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetCart, useUpdateCartQuantity, useRemoveFromCart, useGetProducts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import PrimaryCtaButton from '../components/buttons/PrimaryCtaButton';

export default function CartPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: cart = [], isLoading } = useGetCart();
  const { data: allProducts = [] } = useGetProducts('name');
  const updateQuantity = useUpdateCartQuantity();
  const removeItem = useRemoveFromCart();

  const cartWithProducts = cart
    .map((item) => ({
      ...item,
      product: allProducts.find((p) => p.id === item.productId),
    }))
    .filter((item) => item.product);

  const subtotal = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = Number(item.product.price);
    const discount = Number(item.product.discount || 0);
    const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
    return sum + finalPrice * Number(item.quantity);
  }, 0);

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity.mutateAsync({ productId, quantity: BigInt(newQuantity) });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeItem.mutateAsync(productId);
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const handleCheckout = () => {
    if (!identity) {
      toast.error('Please sign in to checkout');
      return;
    }
    navigate({ to: '/checkout' });
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your cart</h1>
        <Link to="/">
          <PrimaryCtaButton>Continue Shopping</PrimaryCtaButton>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (cartWithProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link to="/">
          <PrimaryCtaButton>Start Shopping</PrimaryCtaButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cartWithProducts.map((item) => {
            if (!item.product) return null;
            const imageUrl = item.product.images[0]?.getDirectURL();
            const price = Number(item.product.price);
            const discount = Number(item.product.discount || 0);
            const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

            return (
              <Card key={item.productId}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Link
                      to="/product/$productId"
                      params={{ productId: item.product.id }}
                      className="flex-shrink-0"
                    >
                      <div className="w-24 h-24 rounded-lg overflow-hidden">
                        {imageUrl ? (
                          <img src={imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to="/product/$productId" params={{ productId: item.product.id }}>
                        <h3 className="font-semibold mb-1 hover:text-primary">{item.product.name}</h3>
                      </Link>
                      <p className="text-lg font-bold text-primary mb-2">${finalPrice.toFixed(2)}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.productId, Number(item.quantity) - 1)}
                          disabled={Number(item.quantity) <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{item.quantity.toString()}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.productId, Number(item.quantity) + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 ml-auto text-destructive"
                          onClick={() => handleRemove(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${subtotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <PrimaryCtaButton size="lg" className="w-full" onClick={handleCheckout}>
                Proceed to Checkout
              </PrimaryCtaButton>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
