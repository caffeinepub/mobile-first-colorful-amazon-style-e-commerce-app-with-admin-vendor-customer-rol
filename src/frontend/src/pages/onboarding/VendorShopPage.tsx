import { useNavigate, useParams } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Store, MapPin, Phone } from 'lucide-react';
import { vendors } from '@/data/vendors';

export default function VendorShopPage() {
  const navigate = useNavigate();
  const { vendorId } = useParams({ from: '/vendor-shop/$vendorId' });
  const vendor = vendors.find((v) => v.id === vendorId);

  if (!vendor) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="empty-state-container">
            <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Vendor Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The vendor you're looking for doesn't exist
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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/vendor-list', search: { city: vendor.city } })}
        className="mb-4 hover:bg-primary/10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Vendors
      </Button>

      <Card className="shadow-soft-lg border-2">
        <CardHeader className="surface-primary-tint">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center border-2 border-primary/30">
              <Store className="h-7 w-7 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl md:text-3xl">{vendor.shopName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Vendor Details</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border">
              <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm text-muted-foreground mb-1">Location</p>
                <p className="text-base">{vendor.area}, {vendor.city}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border">
              <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm text-muted-foreground mb-1">Contact</p>
                <p className="text-base">{vendor.mobile}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-center text-sm text-muted-foreground">
              Contact the vendor directly for more information
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
