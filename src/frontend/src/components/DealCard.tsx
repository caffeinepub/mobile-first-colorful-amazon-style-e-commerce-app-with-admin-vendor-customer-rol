import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '../backend';
import { Link } from '@tanstack/react-router';

interface DealCardProps {
  product: Product;
  dealType?: 'hot' | 'new' | 'sale';
  offerText?: string;
}

export default function DealCard({ product, dealType = 'hot', offerText }: DealCardProps) {
  const imageUrl = product.images[0]?.getDirectURL();
  const discount = product.discount ? Number(product.discount) : 0;
  const price = Number(product.price);
  const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

  return (
    <Link to="/product/$productId" params={{ productId: product.id }}>
      <Card className="card-lift cursor-pointer border-2 rounded-2xl shadow-soft hover:shadow-soft-xl bg-card relative overflow-hidden">
        {offerText && (
          <div className="offer-ribbon">
            {offerText}
          </div>
        )}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
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
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`tag-colorful tag-${dealType}`}>
              {dealType === 'hot' ? '🔥 HOT' : dealType === 'new' ? '✨ NEW' : '💰 SALE'}
            </Badge>
          </div>
          <h3 className="font-bold text-base line-clamp-2 mb-2">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">₹{finalPrice.toFixed(2)}</span>
            {discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">₹{price.toFixed(2)}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
