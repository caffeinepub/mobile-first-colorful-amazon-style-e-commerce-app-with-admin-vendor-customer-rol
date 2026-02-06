import { useState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useUpdateOutletProfile } from '../../hooks/useQueries';
import { City, ExternalBlob, StoreCategory } from '../../backend';
import type { Vendor } from '../../backend';
import { STORE_CATEGORIES } from '../../constants/storeCategories';

interface EditOutletDialogProps {
  vendor: Vendor;
}

export default function EditOutletDialog({ vendor }: EditOutletDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(vendor.name);
  const [outletName, setOutletName] = useState(vendor.outletName);
  const [mobile, setMobile] = useState(vendor.mobile);
  const [city, setCity] = useState<City>(vendor.city);
  const [area, setArea] = useState(vendor.area);
  const [gst, setGst] = useState(vendor.gst || '');
  const [storeCategory, setStoreCategory] = useState<StoreCategory>(vendor.storeCategory);
  const [outletPhoto, setOutletPhoto] = useState<ExternalBlob | null>(vendor.outletPhoto);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    vendor.outletPhoto ? vendor.outletPhoto.getDirectURL() : null
  );
  const [uploadProgress, setUploadProgress] = useState(0);

  const updateOutletMutation = useUpdateOutletProfile();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(vendor.outletPhoto ? vendor.outletPhoto.getDirectURL() : null);
    setOutletPhoto(vendor.outletPhoto);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !outletName.trim() || !mobile.trim() || !area.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let finalPhoto = outletPhoto;

      // Upload new photo if selected
      if (photoFile) {
        const arrayBuffer = await photoFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        finalPhoto = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      if (!finalPhoto) {
        toast.error('Outlet photo is required');
        return;
      }

      await updateOutletMutation.mutateAsync({
        name: name.trim(),
        outletName: outletName.trim(),
        mobile: mobile.trim(),
        area: area.trim(),
        outletPhoto: finalPhoto,
        city,
        gst: gst.trim() || null,
        storeCategory,
      });

      toast.success('Outlet profile updated successfully');
      setOpen(false);
      setUploadProgress(0);
    } catch (error: any) {
      console.error('Failed to update outlet profile:', error);
      toast.error(error.message || 'Failed to update outlet profile');
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl">
          Edit Outlet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Outlet Profile</DialogTitle>
          <DialogDescription>
            Update your outlet information. All fields except GST are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Vendor Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Vendor Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter vendor name"
                className="rounded-xl"
                required
              />
            </div>

            {/* Outlet Name */}
            <div className="space-y-2">
              <Label htmlFor="outletName">Outlet Name *</Label>
              <Input
                id="outletName"
                value={outletName}
                onChange={(e) => setOutletName(e.target.value)}
                placeholder="Enter outlet name"
                className="rounded-xl"
                required
              />
            </div>

            {/* Store Category */}
            <div className="space-y-2">
              <Label htmlFor="storeCategory">Store Category *</Label>
              <Select
                value={storeCategory}
                onValueChange={(value) => setStoreCategory(value as StoreCategory)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select store category" />
                </SelectTrigger>
                <SelectContent>
                  {STORE_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                className="rounded-xl"
                required
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Select
                value={city}
                onValueChange={(value) => setCity(value as City)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={City.kanpur}>Kanpur</SelectItem>
                  <SelectItem value={City.unnao}>Unnao</SelectItem>
                  <SelectItem value={City.other}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Area */}
            <div className="space-y-2">
              <Label htmlFor="area">Area *</Label>
              <Input
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Enter area/locality"
                className="rounded-xl"
                required
              />
            </div>

            {/* GST (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="gst">GST Number (Optional)</Label>
              <Input
                id="gst"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                placeholder="Enter GST number"
                className="rounded-xl"
              />
            </div>

            {/* Outlet Photo */}
            <div className="space-y-2">
              <Label htmlFor="photo">Outlet Photo *</Label>
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Outlet preview"
                    className="w-full h-48 object-cover rounded-xl border-2"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full"
                    onClick={removePhoto}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-xl p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload outlet photo
                  </p>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="photo"
                    className="cursor-pointer text-primary hover:underline"
                  >
                    Choose File
                  </Label>
                </div>
              )}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updateOutletMutation.isPending}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateOutletMutation.isPending || (uploadProgress > 0 && uploadProgress < 100)}
              className="rounded-xl gradient-primary-cta"
            >
              {updateOutletMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
