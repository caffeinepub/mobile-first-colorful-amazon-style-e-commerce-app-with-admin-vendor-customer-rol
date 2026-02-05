import { Link } from '@tanstack/react-router';
import { ShoppingCart, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '../backend';
import { useAddToCart, useAddToWishlist, useGetWishlist } from '../hooks/useQueries';
import { toast } from 'sonner';
import PrimaryCtaButton from './buttons/PrimaryCtaButton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const { data: wishlist = [] } = useGetWishlist();

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    try {
      await addToCart.mutateAsync({ productId, quantity: BigInt(1) });
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    try {
      await addToWishlist.mutateAsync(productId);
      toast.success('Added to wishlist!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to wishlist');
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="aspect-square w-full" />
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
      <div className="text-center py-16">
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
        const isInWishlist = wishlist.includes(product.id);

        return (
          <Link key={product.id} to="/product/$productId" params={{ productId: product.id }}>
            <Card className="group hover:shadow-soft-lg transition-shadow h-full flex flex-col">
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
                {discount > 0 && (
                  <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                    -{discount}%
                  </Badge>
                )}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleAddToWishlist(e, product.id)}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
                </Button>
              </div>
              <CardContent className="p-3 flex-1">
                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">${finalPrice.toFixed(2)}</span>
                  {discount > 0 && (
                    <span className="text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <PrimaryCtaButton
                  size="sm"
                  className="w-full gap-2"
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
