import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Store } from 'lucide-react';
import { saveVendorLoginData } from '@/utils/onboardingStorage';

export default function VendorLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    city: '',
    area: '',
    pinCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = 'Pin code is required';
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = 'Pin code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      saveVendorLoginData(formData);
      navigate({ to: '/outlet-details' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="mb-4 hover:bg-accent/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="shadow-soft-lg border-2">
          <CardHeader className="surface-accent-tint rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border-2 border-accent/30">
                <Store className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-2xl">Vendor Login</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 text-base"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-base">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="h-12 text-base"
                />
                {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-base">City</Label>
                <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                  <SelectTrigger id="city" className="h-12 text-base">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kanpur">Kanpur</SelectItem>
                    <SelectItem value="Unnao">Unnao</SelectItem>
                  </SelectContent>
                </Select>
                {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="area" className="text-base">Area</Label>
                <Input
                  id="area"
                  placeholder="Enter your area"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="h-12 text-base"
                />
                {errors.area && <p className="text-sm text-destructive">{errors.area}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pinCode" className="text-base">Pin Code</Label>
                <Input
                  id="pinCode"
                  placeholder="Enter 6-digit pin code"
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  className="h-12 text-base"
                />
                {errors.pinCode && <p className="text-sm text-destructive">{errors.pinCode}</p>}
              </div>

              <Button type="submit" className="w-full h-12 text-base gradient-primary-cta">
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
