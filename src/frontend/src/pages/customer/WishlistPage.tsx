import { Heart } from 'lucide-react';
import ProductGrid from '../../components/ProductGrid';
import { useGetWishlist, useGetProducts } from '../../hooks/useQueries';

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

      {wishlist.length === 0 && !wishlistLoading ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">Your wishlist is empty</p>
        </div>
      ) : (
        <ProductGrid products={wishlistProducts} isLoading={wishlistLoading || productsLoading} />
      )}
    </div>
  );
}
