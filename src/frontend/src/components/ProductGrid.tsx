import { Link } from '@tanstack/react-router';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '../backend';
import { useAddToCart } from '../hooks/useQueries';
import { toast } from 'sonner';
import PrimaryCtaButton from './buttons/PrimaryCtaButton';
import { getAvailabilityStatus } from '../utils/statusStyles';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  const addToCart = useAddToCart();

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    try {
      await addToCart.mutateAsync({ productId, quantity: BigInt(1) });
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="rounded-2xl">
            <Skeleton className="aspect-square w-full rounded-t-2xl" />
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state-container">
        <p className="text-muted-foreground text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => {
        const imageUrl = product.images[0]?.getDirectURL();
        const discount = product.discount ? Number(product.discount) : 0;
        const price = Number(product.price);
        const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
        const availabilityStatus = getAvailabilityStatus(Number(product.stock));

        return (
          <Link key={product.id} to="/product/$productId" params={{ productId: product.id }}>
            <Card className="group card-lift h-full flex flex-col border-2 rounded-2xl shadow-soft hover:shadow-soft-xl bg-card">
              <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
                {discount > 0 && (
                  <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground shadow-lg border-2 border-card font-bold text-xs px-2 py-1">
                    -{discount}%
                  </Badge>
                )}
                {Number(product.stock) < 10 && (
                  <Badge className={`absolute top-2 right-2 ${availabilityStatus.className} shadow-lg border-2 border-card text-xs font-semibold`}>
                    {availabilityStatus.text}
                  </Badge>
                )}
              </div>
              <CardContent className="p-3 flex-1">
                <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">₹{finalPrice.toFixed(2)}</span>
                  {discount > 0 && (
                    <span className="text-sm text-muted-foreground line-through">₹{price.toFixed(2)}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <PrimaryCtaButton
                  size="sm"
                  className="w-full gap-2 shadow-md hover:shadow-lg rounded-xl h-10"
                  onClick={(e) => handleAddToCart(e, product.id)}
                  disabled={Number(product.stock) === 0}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {Number(product.stock) === 0 ? 'Out of Stock' : 'Add to Cart'}
                </PrimaryCtaButton>
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
