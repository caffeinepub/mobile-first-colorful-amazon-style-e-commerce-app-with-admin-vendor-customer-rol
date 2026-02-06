import { User, Store, CheckCircle, XCircle, MapPin, Phone, CreditCard, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCallerVendor } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { OutletStatus, City } from '../../backend';
import VendorTabs from '../../components/vendor/VendorTabs';
import EditOutletDialog from '../../components/vendor/EditOutletDialog';
import { maskAadhaar } from '../../utils/maskAadhaar';
import { getStoreCategoryLabel } from '../../constants/storeCategories';

export default function VendorProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: vendor, isLoading } = useGetCallerVendor();

  const isOutletEnabled = vendor?.outletStatus === OutletStatus.enabled;

  const getCityLabel = (city: City) => {
    switch (city) {
      case City.kanpur:
        return 'Kanpur';
      case City.unnao:
        return 'Unnao';
      case City.other:
        return 'Other';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20">
          <User className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Profile</h1>
      </div>

      <VendorTabs />

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Vendor Info Card */}
          <Card className="shadow-soft-lg rounded-2xl border-2 border-secondary/20 bg-gradient-to-br from-secondary/10 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-secondary" />
                Vendor Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Vendor Name</p>
                <p className="text-xl font-bold">{vendor?.name || 'Not Set'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Principal ID</p>
                <p className="text-sm font-mono bg-muted px-3 py-2 rounded-lg break-all">
                  {identity?.getPrincipal().toString() || 'Not Available'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Verification Status</p>
                <Badge className={vendor?.verified ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}>
                  {vendor?.verified ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Not Verified
                    </>
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Outlet Profile Card */}
          <Card className="shadow-soft-lg rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Store className="h-6 w-6 text-primary" />
                Outlet Profile
              </CardTitle>
              {vendor && <EditOutletDialog vendor={vendor} />}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Outlet Photo */}
              {vendor?.outletPhoto && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" />
                    Outlet Photo
                  </p>
                  <img
                    src={vendor.outletPhoto.getDirectURL()}
                    alt="Outlet"
                    className="w-full h-48 object-cover rounded-xl border-2"
                  />
                </div>
              )}

              {/* Outlet Name */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Outlet Name</p>
                <p className="text-xl font-bold">{vendor?.outletName || 'Not Set'}</p>
              </div>

              {/* Store Category */}
              {vendor?.storeCategory && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Store Category</p>
                  <Badge className="bg-primary text-primary-foreground text-base px-3 py-1">
                    {getStoreCategoryLabel(vendor.storeCategory)}
                  </Badge>
                </div>
              )}

              {/* Mobile */}
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Mobile Number
                </p>
                <p className="text-lg font-semibold">{vendor?.mobile || 'Not Set'}</p>
              </div>

              {/* Location */}
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Location
                </p>
                <div className="space-y-1">
                  <p className="text-lg font-semibold">
                    {vendor?.city ? getCityLabel(vendor.city) : 'Not Set'}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {vendor?.area || 'Area not set'}
                  </p>
                </div>
              </div>

              {/* Aadhaar (Masked) */}
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  Aadhaar Number
                </p>
                <p className="text-lg font-mono font-semibold">
                  {vendor?.aadhaar ? maskAadhaar(vendor.aadhaar) : 'Not Set'}
                </p>
              </div>

              {/* GST (Optional) */}
              {vendor?.gst && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">GST Number</p>
                  <p className="text-lg font-mono font-semibold">{vendor.gst}</p>
                </div>
              )}

              {/* Outlet Status */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Outlet Status</p>
                <Badge className={isOutletEnabled ? 'bg-accent text-accent-foreground' : 'bg-destructive text-destructive-foreground'}>
                  {isOutletEnabled ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Disabled
                    </>
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
