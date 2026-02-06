import { useState } from 'react';
import { Users, CheckCircle, XCircle, FileText, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetVendors, useApproveVendor, useRejectVendor, useSetVendorOutletStatus, useMarkVendorAsPaid } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { formatInr } from '../../utils/formatInr';
import { extractErrorMessage } from '../../utils/errors';
import { OutletStatus } from '../../backend';
import type { Vendor } from '../../backend';
import { Principal } from '@dfinity/principal';
import AdminNav from '../../components/admin/AdminNav';
import VendorDocumentsDialog from '../../components/admin/VendorDocumentsDialog';

export default function AdminVendorsPage() {
  const { data: vendors = [], isLoading } = useGetVendors();
  const approveVendor = useApproveVendor();
  const rejectVendor = useRejectVendor();
  const setOutletStatus = useSetVendorOutletStatus();
  const markAsPaid = useMarkVendorAsPaid();
  
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);
  const [togglingVendor, setTogglingVendor] = useState<string | null>(null);

  const handleApprove = async (vendorPrincipal: Principal) => {
    try {
      await approveVendor.mutateAsync(vendorPrincipal);
      toast.success('Vendor approved successfully!');
    } catch (error: any) {
      toast.error('Failed to approve vendor', {
        description: extractErrorMessage(error),
      });
    }
  };

  const handleReject = async (vendorPrincipal: Principal, vendorName: string) => {
    if (!confirm(`Are you sure you want to reject ${vendorName}? This action cannot be undone.`)) return;
    
    try {
      await rejectVendor.mutateAsync(vendorPrincipal);
      toast.success('Vendor rejected and removed');
    } catch (error: any) {
      toast.error('Failed to reject vendor', {
        description: extractErrorMessage(error),
      });
    }
  };

  const handleToggleOutletStatus = async (vendor: Vendor) => {
    const vendorId = vendor.principal.toString();
    setTogglingVendor(vendorId);
    
    try {
      const newStatus = vendor.outletStatus === OutletStatus.enabled 
        ? OutletStatus.disabled 
        : OutletStatus.enabled;

      await setOutletStatus.mutateAsync({
        vendorPrincipal: vendor.principal,
        status: newStatus,
      });

      toast.success(
        `Outlet ${newStatus === OutletStatus.enabled ? 'enabled' : 'disabled'}`,
        {
          description: `${vendor.name}'s outlet is now ${newStatus === OutletStatus.enabled ? 'enabled' : 'disabled'}.`,
        }
      );
    } catch (error: any) {
      toast.error('Failed to update outlet status', {
        description: extractErrorMessage(error),
      });
    } finally {
      setTogglingVendor(null);
    }
  };

  const handleMarkAsPaid = async (vendor: Vendor) => {
    if (!confirm(`Mark ${vendor.name} as paid? This will reset their wallet to ₹0 and enable their outlet.`)) return;
    
    try {
      await markAsPaid.mutateAsync(vendor.principal);
      toast.success('Payment recorded successfully!', {
        description: `${vendor.name}'s wallet has been reset and outlet enabled.`,
      });
    } catch (error: any) {
      toast.error('Failed to mark vendor as paid', {
        description: extractErrorMessage(error),
      });
    }
  };

  const handleViewDocuments = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDocumentsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <AdminNav />
        <h1 className="text-3xl font-bold mb-6">Vendor Management</h1>
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <AdminNav />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Vendor Management
        </h1>
      </div>

      {vendors.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">No vendors yet</p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Vendor Name</TableHead>
                <TableHead className="font-semibold">Outlet Name</TableHead>
                <TableHead className="font-semibold">Vendor Principal</TableHead>
                <TableHead className="font-semibold">Approval Status</TableHead>
                <TableHead className="font-semibold">Outlet Status</TableHead>
                <TableHead className="font-semibold text-right">Commission Due</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => {
                const isEnabled = vendor.outletStatus === OutletStatus.enabled;
                const isVerified = vendor.verified;
                const walletDue = Number(vendor.walletDue);
                const vendorId = vendor.principal.toString();
                const isToggling = togglingVendor === vendorId;
                const isNearLimit = walletDue >= 800;
                const isAtLimit = walletDue >= 1000;

                return (
                  <TableRow key={vendorId} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{vendor.name || 'Unnamed Vendor'}</TableCell>
                    <TableCell>{vendor.outletName || '-'}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {vendorId.slice(0, 12)}...
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isVerified ? 'default' : 'secondary'} className="gap-1">
                        {isVerified ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {isVerified ? 'Approved' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={() => handleToggleOutletStatus(vendor)}
                          disabled={isToggling || setOutletStatus.isPending}
                        />
                        <span className="text-sm text-muted-foreground">
                          {isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className={`font-semibold ${
                          isAtLimit ? 'text-destructive' : 
                          isNearLimit ? 'text-yellow-600 dark:text-yellow-500' : 
                          'text-primary'
                        }`}>
                          {formatInr(walletDue)}
                        </span>
                        {isNearLimit && (
                          <span className="text-xs text-muted-foreground">
                            Limit: {formatInr(1000)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        {!isVerified && (
                          <>
                            <Button
                              onClick={() => handleApprove(vendor.principal)}
                              disabled={approveVendor.isPending}
                              variant="default"
                              size="sm"
                              title="Approve Vendor"
                            >
                              {approveVendor.isPending ? (
                                <span className="animate-spin">⏳</span>
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              onClick={() => handleReject(vendor.principal, vendor.name)}
                              disabled={rejectVendor.isPending}
                              variant="destructive"
                              size="sm"
                              title="Reject Vendor"
                            >
                              {rejectVendor.isPending ? (
                                <span className="animate-spin">⏳</span>
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                            </Button>
                          </>
                        )}
                        <Button
                          onClick={() => handleViewDocuments(vendor)}
                          variant="outline"
                          size="sm"
                          title="View Documents"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        {walletDue > 0 && (
                          <Button
                            onClick={() => handleMarkAsPaid(vendor)}
                            disabled={markAsPaid.isPending}
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            title="Mark Commission Paid"
                          >
                            {markAsPaid.isPending ? (
                              <span className="animate-spin">⏳</span>
                            ) : (
                              <>
                                <DollarSign className="h-4 w-4" />
                                <span className="ml-1 text-xs">Pay</span>
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <VendorDocumentsDialog
        vendor={selectedVendor}
        open={documentsDialogOpen}
        onOpenChange={setDocumentsDialogOpen}
      />
    </div>
  );
}
