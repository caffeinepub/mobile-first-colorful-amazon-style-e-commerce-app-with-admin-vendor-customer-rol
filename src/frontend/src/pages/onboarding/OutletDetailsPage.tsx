import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Store, Upload, X } from 'lucide-react';
import { saveOutletDetailsData, getVendorLoginData } from '@/utils/onboardingStorage';
import FloatingLabelInput from '@/components/forms/FloatingLabelInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getStoreCategoryLabel } from '@/constants/storeCategories';

export default function OutletDetailsPage() {
  const navigate = useNavigate();
  const vendorData = getVendorLoginData();

  const [formData, setFormData] = useState({
    outletName: '',
    outletMobile: '',
    aadharNumber: '',
    gst: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!vendorData) {
    navigate({ to: '/vendor-login' });
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setErrors({ ...errors, photo: 'Please select an image file' });
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.outletName.trim()) {
      newErrors.outletName = 'Outlet name is required';
    }
    if (!selectedFile) {
      newErrors.photo = 'Outlet photo is required';
    }
    if (!formData.outletMobile.trim()) {
      newErrors.outletMobile = 'Outlet mobile is required';
    } else if (!/^\d{10}$/.test(formData.outletMobile)) {
      newErrors.outletMobile = 'Mobile number must be 10 digits';
    }
    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(formData.aadharNumber)) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      saveOutletDetailsData({
        ...formData,
        photoPreviewUrl: previewUrl,
      });
      navigate({ to: '/vendor-dashboard' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/vendor-login' })}
          className="mb-4 hover:bg-accent/10 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="shadow-soft-xl border-2 rounded-2xl">
          <CardHeader className="surface-accent-tint rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border-2 border-accent/30">
                <Store className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-2xl">Outlet Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            {/* Show selected category as read-only confirmation */}
            <div className="p-4 bg-primary/10 rounded-xl border-2 border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Selected Store Category</p>
              <Badge className="bg-primary text-primary-foreground text-base px-3 py-1">
                {getStoreCategoryLabel(vendorData.storeCategory)}
              </Badge>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <FloatingLabelInput
                  id="outletName"
                  label="Outlet Name"
                  value={formData.outletName}
                  onChange={(e) => setFormData({ ...formData, outletName: e.target.value })}
                />
                {errors.outletName && <p className="text-sm text-destructive">{errors.outletName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo" className="text-base">Outlet Photo</Label>
                <div className="space-y-3">
                  {previewUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-accent/30">
                      <img
                        src={previewUrl}
                        alt="Outlet preview"
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full"
                        onClick={clearFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="photo"
                      className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-accent/30 rounded-2xl cursor-pointer hover:bg-accent/5 transition-colors"
                    >
                      <Upload className="h-10 w-10 text-accent mb-2" />
                      <span className="text-sm text-muted-foreground">Click to upload photo</span>
                    </label>
                  )}
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                {errors.photo && <p className="text-sm text-destructive">{errors.photo}</p>}
              </div>

              <div className="space-y-2">
                <FloatingLabelInput
                  id="outletMobile"
                  label="Outlet Mobile Number"
                  type="tel"
                  value={formData.outletMobile}
                  onChange={(e) => setFormData({ ...formData, outletMobile: e.target.value })}
                />
                {errors.outletMobile && <p className="text-sm text-destructive">{errors.outletMobile}</p>}
              </div>

              <div className="space-y-2">
                <FloatingLabelInput
                  id="aadharNumber"
                  label="Aadhar Number"
                  value={formData.aadharNumber}
                  onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                />
                {errors.aadharNumber && <p className="text-sm text-destructive">{errors.aadharNumber}</p>}
              </div>

              <div className="space-y-2">
                <FloatingLabelInput
                  id="gst"
                  label="GST Number (Optional)"
                  value={formData.gst}
                  onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full h-14 text-base gradient-primary-cta rounded-xl">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
