import { useState } from 'react';
import { Plus, Trash2, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useGetVendors } from '../../hooks/useQueries';
import { useActor } from '../../hooks/useActor';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';
import type { Vendor } from '../../backend';
import { OutletStatus } from '../../backend';
import PrimaryCtaButton from '../../components/buttons/PrimaryCtaButton';

export default function AdminVendorsPage() {
  const { data: vendors = [] } = useGetVendors();
  const { actor } = useActor();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    principal: '',
    name: '',
    verified: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;

    try {
      const vendorPrincipal = Principal.fromText(formData.principal);
      const vendorData: Vendor = {
        principal: vendorPrincipal,
        name: formData.name,
        verified: formData.verified,
        outletName: '',
        outletStatus: OutletStatus.enabled,
        walletDue: 0n,
      };

      await actor.addVendor(vendorPrincipal, vendorData);
      toast.success('Vendor added successfully!');
      setIsDialogOpen(false);
      setFormData({ principal: '', name: '', verified: true });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add vendor');
    }
  };

  const handleRemove = async (vendorPrincipal: Principal) => {
    if (!actor) return;
    if (!confirm('Are you sure you want to remove this vendor?')) return;

    try {
      await actor.removeVendor(vendorPrincipal);
      toast.success('Vendor removed!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove vendor');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Vendors</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <PrimaryCtaButton className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vendor
            </PrimaryCtaButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="principal">Principal ID *</Label>
                <Input
                  id="principal"
                  value={formData.principal}
                  onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                  placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Vendor Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Vendor name"
                  required
                />
              </div>
              <PrimaryCtaButton type="submit" className="w-full">
                Add Vendor
              </PrimaryCtaButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {vendors.length === 0 ? (
        <div className="text-center py-16">
          <UserCheck className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">No vendors yet. Add your first vendor!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor) => (
            <Card key={vendor.principal.toString()}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold">{vendor.name}</h3>
                  {vendor.verified && (
                    <Badge variant="secondary" className="gap-1">
                      <UserCheck className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-mono mb-4 break-all">
                  {vendor.principal.toString()}
                </p>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemove(vendor.principal)}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove Vendor
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
