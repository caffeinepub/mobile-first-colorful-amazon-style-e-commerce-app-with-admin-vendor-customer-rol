import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetProduct, useAddToCart, useAddToWishlist, useAddReview } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import PrimaryCtaButton from '../components/buttons/PrimaryCtaButton';

export default function ProductPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const { data: product, isLoading } = useGetProduct(productId);
  const { identity } = useInternetIdentity();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const addReview = useAddReview();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState('5');
  const [reviewComment, setReviewComment] = useState('');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-96 w-full mb-6" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/">
          <PrimaryCtaButton>Go to Home</PrimaryCtaButton>
        </Link>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [];
  const discount = product.discount ? Number(product.discount) : 0;
  const price = Number(product.price);
  const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
  const averageRating =
    product.ratings.length > 0
      ? product.ratings.reduce((sum, r) => sum + Number(r.rating), 0) / product.ratings.length
      : 0;

  const handleAddToCart = async () => {
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: BigInt(quantity) });
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist.mutateAsync(product.id);
      toast.success('Added to wishlist!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to wishlist');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error('Please sign in to leave a review');
      return;
    }
    try {
      await addReview.mutateAsync({
        productId: product.id,
        review: {
          reviewer: identity.getPrincipal(),
          rating: BigInt(reviewRating),
          comment: reviewComment,
        },
      });
      toast.success('Review submitted!');
      setReviewComment('');
      setReviewRating('5');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Image Carousel */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-soft-lg mb-4">
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentImageIndex].getDirectURL()}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
                      onClick={() =>
                        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
                      }
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    idx === currentImageIndex ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={img.getDirectURL()} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="font-semibold">{averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({product.ratings.length} reviews)</span>
              </div>
              {discount > 0 && (
                <Badge variant="destructive" className="text-base px-3 py-1">
                  {discount}% OFF
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary">${finalPrice.toFixed(2)}</span>
            {discount > 0 && (
              <span className="text-xl text-muted-foreground line-through">${price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Stock:</span>{' '}
              {Number(product.stock) > 0 ? `${product.stock} available` : 'Out of stock'}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Vendor:</span> {product.vendor.toString().slice(0, 10)}...
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label>Quantity:</Label>
              <Select value={quantity.toString()} onValueChange={(v) => setQuantity(Number(v))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: Math.min(10, Number(product.stock)) }, (_, i) => i + 1).map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <PrimaryCtaButton
              size="lg"
              className="flex-1 gap-2"
              onClick={handleAddToCart}
              disabled={Number(product.stock) === 0 || addToCart.isPending}
            >
              <ShoppingCart className="h-5 w-5" />
              {Number(product.stock) === 0 ? 'Out of Stock' : 'Add to Cart'}
            </PrimaryCtaButton>
            <Button size="lg" variant="outline" onClick={handleAddToWishlist}>
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {product.ratings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {product.ratings.map((review, idx) => (
                <div key={idx} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Number(review.rating) ? 'fill-primary text-primary' : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {review.reviewer.toString().slice(0, 10)}...
                    </span>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {identity && (
            <form onSubmit={handleSubmitReview} className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Write a Review</h3>
              <div className="space-y-2">
                <Label>Rating</Label>
                <Select value={reviewRating} onValueChange={setReviewRating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} Star{n > 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Comment</Label>
                <Textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <PrimaryCtaButton type="submit" disabled={addReview.isPending}>
                {addReview.isPending ? 'Submitting...' : 'Submit Review'}
              </PrimaryCtaButton>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
