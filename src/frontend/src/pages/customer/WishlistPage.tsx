import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetWishlist, useGetProducts } from '../../hooks/useQueries';
import { Link } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getAvailabilityStatus } from '../../utils/statusStyles';

export default function WishlistPage() {
  const { data: wishlist = [], isLoading: wishlistLoading } = useGetWishlist();
  const { data: allProducts = [], isLoading: productsLoading } = useGetProducts('name');

  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">My Wishlist</h1>
      </div>

      {wishlistLoading || productsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistProducts.map((product) => {
            const imageUrl = product.images[0]?.getDirectURL();
            const discount = product.discount ? Number(product.discount) : 0;
            const price = Number(product.price);
            const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
            const availabilityStatus = getAvailabilityStatus(Number(product.stock));

            return (
              <Link key={product.id} to="/product/$productId" params={{ productId: product.id }}>
                <Card className="group hover:shadow-soft-lg transition-all h-full flex flex-col border-2 hover:border-primary/30 hover-tint-primary">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
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
                      <Badge className="absolute top-2 left-2 bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground shadow-lg border-2 border-card">
                        -{discount}%
                      </Badge>
                    )}
                    {Number(product.stock) < 10 && (
                      <Badge className={`absolute top-2 right-2 ${availabilityStatus.className} shadow-lg border-2 border-card text-xs`}>
                        {availabilityStatus.text}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-3 flex-1">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">${finalPrice.toFixed(2)}</span>
                      {discount > 0 && (
                        <span className="text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
