import { useState, useMemo } from 'react';
import { useParams } from '@tanstack/react-router';
import { SlidersHorizontal } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetProducts, useGetCategories } from '../hooks/useQueries';

export default function CategoryListingPage() {
  const { categoryId } = useParams({ from: '/categories/$categoryId' });
  const { data: allProducts = [], isLoading } = useGetProducts('name');
  const { data: categories = [] } = useGetCategories();
  const [sortBy, setSortBy] = useState('name');

  const category = categories.find((c) => c.id === categoryId);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((p) => p.category === categoryId && p.active);

    if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'discount') {
      filtered = [...filtered].sort((a, b) => Number(b.discount || 0) - Number(a.discount || 0));
    }

    return filtered;
  }, [allProducts, categoryId, sortBy]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{category?.name || 'Products'}</h1>
          <p className="text-muted-foreground">{filteredProducts.length} products</p>
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="discount">Discount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredProducts.length === 0 && !isLoading ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">No products found in this category</p>
          <Button onClick={() => setSortBy('name')}>Clear Filters</Button>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} isLoading={isLoading} />
      )}
    </div>
  );
}
