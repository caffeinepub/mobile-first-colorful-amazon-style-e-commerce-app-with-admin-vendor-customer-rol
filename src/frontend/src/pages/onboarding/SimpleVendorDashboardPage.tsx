import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, CheckCircle, MapPin, Phone, CreditCard, FileText } from 'lucide-react';
import { getVendorLoginData, getOutletDetailsData } from '@/utils/onboardingStorage';

export default function SimpleVendorDashboardPage() {
  const navigate = useNavigate();
  const vendorData = getVendorLoginData();
  const outletData = getOutletDetailsData();

  if (!vendorData || !outletData) {
    navigate({ to: '/vendor-login' });
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
          Vendor Dashboard
        </h1>
        <p className="text-muted-foreground">Welcome, {vendorData.name}!</p>
      </div>

      <div className="space-y-6">
        {/* Success Message */}
        <Card className="shadow-soft-lg border-2 border-success/30 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center border-2 border-success/30 flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Registration Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  Your outlet has been registered successfully. You can now start managing your business.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outlet Information */}
        <Card className="shadow-soft-lg border-2">
          <CardHeader className="surface-accent-tint">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border-2 border-accent/30">
                <Store className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-2xl">{outletData.outletName}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {outletData.photoPreviewUrl && (
              <div className="rounded-xl overflow-hidden border-2">
                <img
                  src={outletData.photoPreviewUrl}
                  alt="Outlet"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs text-muted-foreground mb-1">Location</p>
                  <p className="text-sm">{vendorData.area}, {vendorData.city} - {vendorData.pinCode}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs text-muted-foreground mb-1">Contact</p>
                  <p className="text-sm">Personal: {vendorData.mobile}</p>
                  <p className="text-sm">Outlet: {outletData.outletMobile}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border">
                <CreditCard className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs text-muted-foreground mb-1">Aadhar Number</p>
                  <p className="text-sm">{outletData.aadharNumber}</p>
                </div>
              </div>

              {outletData.gst && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border">
                  <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-xs text-muted-foreground mb-1">GST Number</p>
                    <p className="text-sm">{outletData.gst}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => navigate({ to: '/' })}
            variant="outline"
            className="flex-1 h-12"
          >
            Go to Home
          </Button>
          <Button
            onClick={() => navigate({ to: '/vendor-login' })}
            className="flex-1 h-12 gradient-primary-cta"
          >
            Register Another Outlet
          </Button>
        </div>
      </div>
    </div>
  );
}
