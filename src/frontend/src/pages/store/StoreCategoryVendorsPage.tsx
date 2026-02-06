import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Store, MapPin, Phone, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { parseStoreCategory, getStoreCategoryLabel, getStoreCategorySlug } from '@/constants/storeCategories';
import { useGetOutletsByStoreCategory } from '@/hooks/useQueries';

export default function StoreCategoryVendorsPage() {
  const { storeCategory: categoryParam } = useParams({ strict: false });
  const navigate = useNavigate();

  // Parse and validate the category from route params
  const storeCategory = categoryParam ? parseStoreCategory(categoryParam) : null;

  const { data: vendors = [], isLoading, isError } = useGetOutletsByStoreCategory(
    storeCategory || ('clothStore' as any) // Fallback to prevent query error
  );

  // Handle invalid category
  if (!storeCategory) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="mb-4 hover:bg-accent/10 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <Card className="rounded-2xl shadow-soft-lg border-2 border-destructive/20 bg-destructive/5">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Invalid Category</h2>
            <p className="text-muted-foreground mb-4">
              The store category you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate({ to: '/' })} className="rounded-xl">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryLabel = getStoreCategoryLabel(storeCategory);
  const categorySlug = getStoreCategorySlug(storeCategory);

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-4 hover:bg-accent/10 rounded-xl"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
          <Store className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {categoryLabel}
        </h1>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Card className="rounded-2xl shadow-soft-lg border-2 border-destructive/20 bg-destructive/5">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Error Loading Vendors</h2>
            <p className="text-muted-foreground">
              Failed to load vendors. Please try again later.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !isError && vendors.length === 0 && (
        <Card className="rounded-2xl shadow-soft-lg border-2 border-muted">
          <CardContent className="p-8 text-center">
            <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Vendors Found</h2>
            <p className="text-muted-foreground mb-4">
              There are no vendors in the {categoryLabel} category yet.
            </p>
            <Button onClick={() => navigate({ to: '/' })} className="rounded-xl">
              Browse Other Categories
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Vendor Cards */}
      {!isLoading && !isError && vendors.length > 0 && (
        <div className="space-y-4">
          {vendors.map((vendor) => (
            <Card
              key={vendor.principal.toString()}
              className="rounded-2xl shadow-soft-lg border-2 hover:shadow-soft-xl transition-all card-lift cursor-pointer"
              onClick={() => navigate({ to: `/store-category/${categorySlug}/shop/${vendor.principal.toString()}` })}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Outlet Photo */}
                  {vendor.outletPhoto && (
                    <div className="sm:w-48 h-48 flex-shrink-0">
                      <img
                        src={vendor.outletPhoto.getDirectURL()}
                        alt={vendor.outletName}
                        className="w-full h-full object-cover rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
                      />
                    </div>
                  )}

                  {/* Vendor Info */}
                  <div className="flex-1 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{vendor.outletName}</h3>
                        <p className="text-sm text-muted-foreground">{vendor.name}</p>
                      </div>
                      {vendor.verified && (
                        <div className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full border border-accent/20">
                          Verified
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span>
                          {vendor.area}, {vendor.city === 'kanpur' ? 'Kanpur' : vendor.city === 'unnao' ? 'Unnao' : 'Other'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span>{vendor.mobile}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {vendor.outletStatus === 'enabled' ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full border border-accent/20">
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                          Open Now
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground text-sm font-semibold rounded-full">
                          Currently Closed
                        </div>
                      )}
                      <Button variant="ghost" size="sm" className="rounded-xl">
                        View Shop →
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
