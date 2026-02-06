import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Store, MapPin, Phone, Plus, Edit, Trash2, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { useGetOutletsByStoreCategory, useGetVendorProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { parseStoreCategory, getStoreCategoryLabel } from '@/constants/storeCategories';
import { toast } from 'sonner';
import type { Product, PublicVendorProfile } from '@/backend';
import { ExternalBlob } from '@/backend';
import { Principal } from '@dfinity/principal';
import PrimaryCtaButton from '@/components/buttons/PrimaryCtaButton';

// Size options for cloth products
const CLOTH_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;

export default function VendorShopPage() {
  const { storeCategory: categoryParam, vendorId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const storeCategory = categoryParam ? parseStoreCategory(categoryParam) : null;
  const { data: vendors = [], isLoading: vendorsLoading } = useGetOutletsByStoreCategory(
    storeCategory || ('clothStore' as any)
  );

  // Find the vendor by principal
  const vendor = vendors.find((v) => v.principal.toString() === vendorId);
  const isOwner = identity && vendor && identity.getPrincipal().toString() === vendor.principal.toString();

  // Fetch vendor products if owner
  const { data: allProducts = [], isLoading: productsLoading } = useGetVendorProducts();
  const vendorProducts = isOwner ? allProducts : [];

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state for cloth products
  const [clothForm, setClothForm] = useState({
    name: '',
    price: '',
    offerPrice: '',
    color: '',
    stock: '',
    selectedSizes: [] as string[],
  });

  // Form state for cosmetic products
  const [cosmeticForm, setCosmeticForm] = useState({
    name: '',
    price: '',
    weightSize: '',
    variant: '',
    stock: '',
    expiry: '',
  });

  const [productImages, setProductImages] = useState<ExternalBlob[]>([]);

  const categoryLabel = storeCategory ? getStoreCategoryLabel(storeCategory) : '';
  const isClothStore = storeCategory === 'clothStore';
  const isCosmeticStore = storeCategory === 'cosmeticStore';

  useEffect(() => {
    if (!isDialogOpen) {
      // Reset forms when dialog closes
      setClothForm({
        name: '',
        price: '',
        offerPrice: '',
        color: '',
        stock: '',
        selectedSizes: [],
      });
      setCosmeticForm({
        name: '',
        price: '',
        weightSize: '',
        variant: '',
        stock: '',
        expiry: '',
      });
      setProductImages([]);
      setEditingProduct(null);
    }
  }, [isDialogOpen]);

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductImages(product.images || []);

      // Parse description to extract product-specific fields
      const desc = product.description;
      
      if (isClothStore) {
        // Parse cloth product description
        const sizeMatch = desc.match(/Sizes?: ([^|]+)/i);
        const colorMatch = desc.match(/Color: ([^|]+)/i);
        const offerMatch = desc.match(/Offer Price: ₹([0-9.]+)/i);

        setClothForm({
          name: product.name,
          price: (Number(product.price) / 100).toFixed(2),
          offerPrice: offerMatch ? offerMatch[1] : '',
          color: colorMatch ? colorMatch[1].trim() : '',
          stock: product.stock.toString(),
          selectedSizes: sizeMatch ? sizeMatch[1].split(',').map(s => s.trim()) : [],
        });
      } else if (isCosmeticStore) {
        // Parse cosmetic product description
        const weightMatch = desc.match(/Weight\/Size: ([^|]+)/i);
        const variantMatch = desc.match(/Variant: ([^|]+)/i);
        const expiryMatch = desc.match(/Expiry: ([^|]+)/i);

        setCosmeticForm({
          name: product.name,
          price: (Number(product.price) / 100).toFixed(2),
          weightSize: weightMatch ? weightMatch[1].trim() : '',
          variant: variantMatch ? variantMatch[1].trim() : '',
          stock: product.stock.toString(),
          expiry: expiryMatch ? expiryMatch[1].trim() : '',
        });
      }
    } else {
      setEditingProduct(null);
      setProductImages([]);
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const newImages: ExternalBlob[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const bytes = new Uint8Array(await file.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          setUploadProgress(Math.round(percentage));
        });
        newImages.push(blob);
      }

      setProductImages([...productImages, ...newImages]);
      toast.success('Images uploaded successfully!');
    } catch (error: any) {
      toast.error('Failed to upload images');
      console.error(error);
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity || !vendor) return;

    try {
      let productData: Product;

      if (isClothStore) {
        // Build description for cloth product
        const description = [
          `Sizes: ${clothForm.selectedSizes.join(', ')}`,
          `Color: ${clothForm.color}`,
          clothForm.offerPrice ? `Offer Price: ₹${clothForm.offerPrice}` : '',
        ].filter(Boolean).join(' | ');

        const discount = clothForm.offerPrice 
          ? Math.round(((parseFloat(clothForm.price) - parseFloat(clothForm.offerPrice)) / parseFloat(clothForm.price)) * 100)
          : 0;

        productData = {
          id: editingProduct?.id || `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: clothForm.name,
          description,
          category: categoryLabel,
          price: BigInt(Math.round(parseFloat(clothForm.price) * 100)),
          stock: BigInt(clothForm.stock),
          discount: discount > 0 ? BigInt(discount) : undefined,
          images: productImages,
          vendor: identity.getPrincipal(),
          ratings: editingProduct?.ratings || [],
          active: true,
        };
      } else if (isCosmeticStore) {
        // Build description for cosmetic product
        const description = [
          `Weight/Size: ${cosmeticForm.weightSize}`,
          `Variant: ${cosmeticForm.variant}`,
          cosmeticForm.expiry ? `Expiry: ${cosmeticForm.expiry}` : '',
        ].filter(Boolean).join(' | ');

        productData = {
          id: editingProduct?.id || `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: cosmeticForm.name,
          description,
          category: categoryLabel,
          price: BigInt(Math.round(parseFloat(cosmeticForm.price) * 100)),
          stock: BigInt(cosmeticForm.stock),
          discount: undefined,
          images: productImages,
          vendor: identity.getPrincipal(),
          ratings: editingProduct?.ratings || [],
          active: true,
        };
      } else {
        toast.error('Invalid store category');
        return;
      }

      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, product: productData });
        toast.success('Product updated successfully!');
      } else {
        await addProduct.mutateAsync(productData);
        toast.success('Product added successfully!');
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success('Product deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const toggleSize = (size: string) => {
    setClothForm({
      ...clothForm,
      selectedSizes: clothForm.selectedSizes.includes(size)
        ? clothForm.selectedSizes.filter((s) => s !== size)
        : [...clothForm.selectedSizes, size],
    });
  };

  if (!storeCategory || !vendorId) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <Card className="rounded-2xl shadow-soft-lg">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Invalid shop page</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (vendorsLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-12 w-48 mb-6" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: `/store-category/${categoryParam}` })}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {categoryLabel}
        </Button>
        <Card className="rounded-2xl shadow-soft-lg">
          <CardContent className="p-8 text-center">
            <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Vendor not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: `/store-category/${categoryParam}` })}
        className="mb-4 hover:bg-accent/10 rounded-xl"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to {categoryLabel}
      </Button>

      {/* Vendor Header */}
      <Card className="rounded-2xl shadow-soft-lg border-2 mb-6">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row gap-4">
            {vendor.outletPhoto && (
              <div className="sm:w-48 h-48 flex-shrink-0">
                <img
                  src={vendor.outletPhoto.getDirectURL()}
                  alt={vendor.outletName}
                  className="w-full h-full object-cover rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
                />
              </div>
            )}
            <div className="flex-1 p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{vendor.outletName}</h1>
                  <p className="text-sm text-muted-foreground">{vendor.name}</p>
                </div>
                {vendor.verified && (
                  <div className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full border border-accent/20">
                    Verified
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>
                    {vendor.area}, {vendor.city === 'kanpur' ? 'Kanpur' : vendor.city === 'unnao' ? 'Unnao' : 'Other'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{vendor.mobile}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Section */}
      {isOwner && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            My Products
          </h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <PrimaryCtaButton onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </PrimaryCtaButton>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="rounded-xl"
                  />
                  {uploadingImage && (
                    <div className="text-sm text-muted-foreground">
                      Uploading... {uploadProgress}%
                    </div>
                  )}
                  {productImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {productImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img.getDirectURL()}
                            alt={`Product ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cloth Store Form */}
                {isClothStore && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={clothForm.name}
                        onChange={(e) => setClothForm({ ...clothForm, name: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={clothForm.price}
                          onChange={(e) => setClothForm({ ...clothForm, price: e.target.value })}
                          required
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="offerPrice">Offer Price (₹)</Label>
                        <Input
                          id="offerPrice"
                          type="number"
                          step="0.01"
                          value={clothForm.offerPrice}
                          onChange={(e) => setClothForm({ ...clothForm, offerPrice: e.target.value })}
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Size Options *</Label>
                      <div className="flex flex-wrap gap-2">
                        {CLOTH_SIZES.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`px-4 py-2 rounded-xl border-2 transition-all ${
                              clothForm.selectedSizes.includes(size)
                                ? 'bg-primary text-white border-primary'
                                : 'bg-background border-border hover:border-primary'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Color *</Label>
                      <Input
                        id="color"
                        value={clothForm.color}
                        onChange={(e) => setClothForm({ ...clothForm, color: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={clothForm.stock}
                        onChange={(e) => setClothForm({ ...clothForm, stock: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>
                  </>
                )}

                {/* Cosmetic Store Form */}
                {isCosmeticStore && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={cosmeticForm.name}
                        onChange={(e) => setCosmeticForm({ ...cosmeticForm, name: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={cosmeticForm.price}
                        onChange={(e) => setCosmeticForm({ ...cosmeticForm, price: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weightSize">Weight/Size *</Label>
                      <Input
                        id="weightSize"
                        placeholder="e.g., 50ml, 100g"
                        value={cosmeticForm.weightSize}
                        onChange={(e) => setCosmeticForm({ ...cosmeticForm, weightSize: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variant">Variant *</Label>
                      <Input
                        id="variant"
                        placeholder="e.g., Matte, Glossy, Natural"
                        value={cosmeticForm.variant}
                        onChange={(e) => setCosmeticForm({ ...cosmeticForm, variant: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={cosmeticForm.stock}
                        onChange={(e) => setCosmeticForm({ ...cosmeticForm, stock: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                      <Input
                        id="expiry"
                        type="date"
                        value={cosmeticForm.expiry}
                        onChange={(e) => setCosmeticForm({ ...cosmeticForm, expiry: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  </>
                )}

                <PrimaryCtaButton
                  type="submit"
                  className="w-full"
                  disabled={addProduct.isPending || updateProduct.isPending || uploadingImage}
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </PrimaryCtaButton>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Products Grid */}
      {isOwner && productsLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      )}

      {isOwner && !productsLoading && vendorProducts.length === 0 && (
        <Card className="rounded-2xl shadow-soft-lg">
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Products Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start adding products to your shop!
            </p>
          </CardContent>
        </Card>
      )}

      {isOwner && !productsLoading && vendorProducts.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendorProducts.map((product) => (
            <Card key={product.id} className="rounded-2xl shadow-soft hover:shadow-soft-lg transition-all card-lift">
              <CardContent className="p-0">
                {/* Product Image */}
                {product.images && product.images.length > 0 && (
                  <div className="h-48 overflow-hidden rounded-t-2xl">
                    <img
                      src={product.images[0].getDirectURL()}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-primary">
                      ₹{(Number(product.price) / 100).toFixed(2)}
                    </span>
                    {product.discount && Number(product.discount) > 0 && (
                      <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-semibold rounded-full">
                        {product.discount.toString()}% OFF
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      Stock: {product.stock.toString()}
                    </span>
                    {Number(product.stock) > 0 ? (
                      <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                        In Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-semibold rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(product)}
                      className="flex-1 rounded-xl"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isOwner && (
        <Card className="rounded-2xl shadow-soft-lg">
          <CardContent className="p-8 text-center">
            <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Shop Coming Soon</h3>
            <p className="text-muted-foreground">
              This vendor hasn't added any products yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
