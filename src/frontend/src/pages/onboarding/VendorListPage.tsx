import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Store, MapPin, Phone } from 'lucide-react';
import { vendors } from '@/data/vendors';

export default function VendorListPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/vendor-list' });
  const city = (search as { city?: string }).city;

  const filteredVendors = city
    ? vendors.filter((v) => v.city.toLowerCase() === city.toLowerCase())
    : [];

  if (!city) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="empty-state-container">
            <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No City Selected</h2>
            <p className="text-muted-foreground mb-6">
              Please select a city to view available vendors
            </p>
            <Button
              onClick={() => navigate({ to: '/customer-login' })}
              className="gradient-primary-cta"
            >
              Go to Customer Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/customer-login' })}
        className="mb-4 hover:bg-primary/10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Vendors in {city}
        </h1>
        <p className="text-muted-foreground">
          {filteredVendors.length} {filteredVendors.length === 1 ? 'vendor' : 'vendors'} available
        </p>
      </div>

      {filteredVendors.length === 0 ? (
        <div className="empty-state-container">
          <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">No Vendors Found</h2>
          <p className="text-muted-foreground">
            There are no vendors available in {city} at the moment
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredVendors.map((vendor) => (
            <Card
              key={vendor.id}
              className="shadow-soft hover:shadow-soft-lg transition-all border-2 hover:border-primary/30"
            >
              <CardHeader className="surface-primary-tint">
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  {vendor.shopName}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span>{vendor.area}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{vendor.mobile}</span>
                </div>
                <Button
                  onClick={() => navigate({ to: '/vendor-shop/$vendorId', params: { vendorId: vendor.id } })}
                  className="w-full mt-4 gradient-primary-cta h-11"
                >
                  View Shop
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
