import { Users, Wallet, Power } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetVendors, useUpdateVendor } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { formatInr } from '../../utils/formatInr';
import { OutletStatus } from '../../backend';
import type { Vendor } from '../../backend';

export default function AdminDashboardPage() {
  const { data: vendors = [], isLoading } = useGetVendors();
  const updateVendor = useUpdateVendor();

  const handleToggleOutletStatus = async (vendor: Vendor) => {
    try {
      const newStatus = vendor.outletStatus === OutletStatus.enabled 
        ? OutletStatus.disabled 
        : OutletStatus.enabled;

      const updatedVendor: Vendor = {
        ...vendor,
        outletStatus: newStatus,
      };

      await updateVendor.mutateAsync({
        vendorPrincipal: vendor.principal,
        vendor: updatedVendor,
      });

      toast.success(
        `Vendor outlet ${newStatus === OutletStatus.enabled ? 'enabled' : 'disabled'}`,
        {
          description: `${vendor.name}'s outlet is now ${newStatus === OutletStatus.enabled ? 'enabled' : 'disabled'}.`,
        }
      );
    } catch (error: any) {
      toast.error('Failed to update vendor status', {
        description: error.message || 'Please try again.',
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {vendors.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">No vendors yet. Add your first vendor!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Vendor Management</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((vendor) => {
              const isEnabled = vendor.outletStatus === OutletStatus.enabled;
              const walletDue = Number(vendor.walletDue);

              return (
                <Card key={vendor.principal.toString()} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{vendor.name || 'Unnamed Vendor'}</CardTitle>
                      <Badge variant={isEnabled ? 'default' : 'secondary'} className="gap-1">
                        <Power className="h-3 w-3" />
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono break-all mt-1">
                      {vendor.principal.toString()}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {vendor.outletName && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Outlet:</span>
                        <span className="font-medium">{vendor.outletName}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Wallet className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Wallet Due</p>
                        <p className="text-lg font-bold text-primary">
                          {formatInr(walletDue)}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleToggleOutletStatus(vendor)}
                      disabled={updateVendor.isPending}
                      variant={isEnabled ? 'destructive' : 'default'}
                      className="w-full"
                      size="sm"
                    >
                      {updateVendor.isPending ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Power className="h-4 w-4 mr-2" />
                          {isEnabled ? 'Disable Outlet' : 'Enable Outlet'}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
