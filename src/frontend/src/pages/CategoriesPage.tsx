import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCategories } from '../hooks/useQueries';
import { getCategoryColor } from '../utils/categoryColors';

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useGetCategories();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Categories</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="rounded-2xl">
              <Skeleton className="aspect-square w-full rounded-t-2xl" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">All Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const colorClass = getCategoryColor(category.id);
          return (
            <Link key={category.id} to="/categories/$categoryId" params={{ categoryId: category.id }}>
              <Card className="card-lift cursor-pointer h-full group border-2 rounded-2xl shadow-soft hover:shadow-soft-xl bg-card">
                <div className="aspect-square overflow-hidden rounded-t-2xl relative">
                  {/* Circular colorful icon background */}
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className={`w-32 h-32 rounded-full ${colorClass} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <img
                        src={category.image.getDirectURL()}
                        alt={category.name}
                        className="w-20 h-20 object-contain drop-shadow-lg"
                      />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
