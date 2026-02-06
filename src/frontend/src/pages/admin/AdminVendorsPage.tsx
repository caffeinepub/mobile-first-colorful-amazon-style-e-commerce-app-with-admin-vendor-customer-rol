import { useState } from 'react';
import { Users, CheckCircle, XCircle, Power, FileText, Eye, Download, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetVendors, useApproveVendor, useRejectVendor, useSetVendorOutletStatus, useGetVendorDocuments, useMarkVendorAsPaid } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { formatInr } from '../../utils/formatInr';
import { extractErrorMessage } from '../../utils/errors';
import { OutletStatus } from '../../backend';
import type { Vendor } from '../../backend';
import { Principal } from '@dfinity/principal';
import AdminNav from '../../components/admin/AdminNav';
import { ExternalBlob } from '../../backend';

export default function AdminVendorsPage() {
  const { data: vendors = [], isLoading } = useGetVendors();
  const approveVendor = useApproveVendor();
  const rejectVendor = useRejectVendor();
  const setOutletStatus = useSetVendorOutletStatus();
  const markAsPaid = useMarkVendorAsPaid();
  
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);
  const { data: documents = [], isLoading: documentsLoading } = useGetVendorDocuments(
    selectedVendor?.principal || Principal.anonymous()
  );

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

  const handleReject = async (vendorPrincipal: Principal) => {
    if (!confirm('Are you sure you want to reject this vendor? This action cannot be undone.')) return;
    
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
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted rounded animate-pulse"></div>
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
        <div className="text-center py-16">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">No vendors yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {vendors.map((vendor) => {
            const isEnabled = vendor.outletStatus === OutletStatus.enabled;
            const isVerified = vendor.verified;
            const walletDue = Number(vendor.walletDue);

            return (
              <Card key={vendor.principal.toString()} className="border-2 hover:border-primary/30 hover:shadow-soft-lg transition-all">
                <CardHeader className="surface-primary-tint rounded-t-xl">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{vendor.name || 'Unnamed Vendor'}</CardTitle>
                      {vendor.outletName && (
                        <p className="text-sm text-muted-foreground">Outlet: {vendor.outletName}</p>
                      )}
                      <p className="text-xs text-muted-foreground font-mono break-all mt-1">
                        {vendor.principal.toString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={isVerified ? 'default' : 'secondary'} className="gap-1">
                        {isVerified ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {isVerified ? 'Approved' : 'Pending'}
                      </Badge>
                      <Badge variant={isEnabled ? 'default' : 'secondary'} className="gap-1">
                        <Power className="h-3 w-3" />
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Wallet Due</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatInr(walletDue)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Documents</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocuments(vendor)}
                        className="w-full mt-1"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Documents ({vendor.documents.length})
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!isVerified && (
                      <>
                        <Button
                          onClick={() => handleApprove(vendor.principal)}
                          disabled={approveVendor.isPending}
                          variant="default"
                          size="sm"
                          className="flex-1 min-w-[120px]"
                        >
                          {approveVendor.isPending ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Approving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleReject(vendor.principal)}
                          disabled={rejectVendor.isPending}
                          variant="destructive"
                          size="sm"
                          className="flex-1 min-w-[120px]"
                        >
                          {rejectVendor.isPending ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Rejecting...
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </>
                          )}
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => handleToggleOutletStatus(vendor)}
                      disabled={setOutletStatus.isPending}
                      variant={isEnabled ? 'outline' : 'default'}
                      size="sm"
                      className="flex-1 min-w-[120px]"
                    >
                      {setOutletStatus.isPending ? (
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
                    {walletDue > 0 && (
                      <Button
                        onClick={() => handleMarkAsPaid(vendor)}
                        disabled={markAsPaid.isPending}
                        variant="default"
                        size="sm"
                        className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700"
                      >
                        {markAsPaid.isPending ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={documentsDialogOpen} onOpenChange={setDocumentsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Vendor Documents - {selectedVendor?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {documentsLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No documents uploaded yet</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {documents.map((doc, index) => {
                  const docUrl = doc.getDirectURL();
                  return (
                    <Card key={index} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-primary" />
                            <div>
                              <p className="font-medium">Document {index + 1}</p>
                              <p className="text-xs text-muted-foreground">Vendor submission</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(docUrl, '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = docUrl;
                                link.download = `vendor-document-${index + 1}`;
                                link.click();
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
