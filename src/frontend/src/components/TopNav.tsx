import { Link, useNavigate } from '@tanstack/react-router';
import { Search, ShoppingCart, Menu, User, Package, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import LoginButton from './auth/LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCart, useGetCallerRole, useIsVendor, useIsAdmin } from '../hooks/useQueries';
import { useState } from 'react';

export default function TopNav() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: cart } = useGetCart();
  const { data: role } = useGetCallerRole();
  const { data: isVendor } = useIsVendor();
  const { data: isAdmin } = useIsAdmin();
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = cart?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;
  
  // Determine user role from the new three-role system
  const roleValue = role ? (typeof role === 'string' ? role : (role as any).__kind__) : null;
  const isAdminUser = isAdmin === true || roleValue === 'admin';
  const isVendorUser = isVendor === true || roleValue === 'vendor';
  const isCustomer = identity && !isAdminUser && !isVendorUser;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/categories', search: { q: searchQuery } });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b shadow-soft-lg backdrop-blur-sm">
      {/* Colorful gradient header background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-95" />
      <div className="container mx-auto px-2 md:px-4 relative">
        {/* Desktop & Mobile Grid Layout */}
        <div className="grid grid-cols-[1fr_auto_1fr] md:grid-cols-[1fr_auto_1fr] min-h-[72px] md:min-h-[80px] items-center gap-2 md:gap-4 py-2">
          {/* Left Section - Desktop Search */}
          <div className="hidden md:flex justify-start">
            <form onSubmit={handleSearch} className="w-full max-w-2xl">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 rounded-full border-2 border-white/30 bg-white/95 focus:border-white focus:ring-2 focus:ring-white/40 transition-all h-11 text-base placeholder:text-muted-foreground/70"
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full rounded-full hover:bg-white/20 text-foreground transition-colors"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>

          {/* Left Section - Mobile (empty spacer) */}
          <div className="md:hidden" />

          {/* Center Section - Logo */}
          <Link to="/" className="flex items-center gap-2 focus-ring-primary rounded-lg shrink-0 justify-self-center">
            <img 
              src="/assets/generated/quickbazar-logo.dim_512x512.png" 
              alt="QuickBazar logo" 
              className="h-14 w-14 object-contain shrink-0 md:h-16 md:w-16 drop-shadow-lg"
            />
            <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              QuickBazar
            </div>
          </Link>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 shrink-0 justify-end">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {isCustomer && (
                <>
                  <Link to="/about">
                    <Button variant="ghost" className="text-white hover:bg-white/20 focus-ring-secondary transition-colors">About</Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="ghost" className="text-white hover:bg-white/20 focus-ring-accent transition-colors">Contact</Button>
                  </Link>
                  <Link to="/cart">
                    <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20 focus-ring-primary transition-colors">
                      <ShoppingCart className="h-5 w-5" />
                      {cartItemCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground border-2 border-white font-bold">
                          {cartItemCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 focus-ring-accent transition-colors">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                </>
              )}
              {isVendorUser && (
                <>
                  <Link to="/vendor">
                    <Button variant="ghost" className="text-white hover:bg-white/20 focus-ring-primary transition-colors">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/vendor/products">
                    <Button variant="ghost" className="text-white hover:bg-white/20 focus-ring-secondary transition-colors">
                      <Package className="h-4 w-4 mr-2" />
                      Products
                    </Button>
                  </Link>
                  <Link to="/vendor/orders">
                    <Button variant="ghost" className="text-white hover:bg-white/20 focus-ring-accent transition-colors">
                      Orders
                    </Button>
                  </Link>
                </>
              )}
              {isAdminUser && (
                <>
                  <Link to="/admin">
                    <Button variant="ghost" className="text-white hover:bg-white/20 focus-ring-primary transition-colors">
                      Admin Dashboard
                    </Button>
                  </Link>
                  <Link to="/admin/products">
                    <Button variant="ghost" className="text-white hover:bg-white/20 focus-ring-secondary transition-colors">
                      Products
                    </Button>
                  </Link>
                  <Link to="/admin/vendors">
                    <Button variant="ghost" className="text-white hover:bg-white/20 focus-ring-accent transition-colors">
                      Vendors
                    </Button>
                  </Link>
                  <Link to="/admin/orders">
                    <Button variant="ghost" className="text-white hover:bg-white/20 focus-ring-chart-3 transition-colors">
                      Orders
                    </Button>
                  </Link>
                </>
              )}
              {!identity && (
                <>
                  <Link to="/about">
                    <Button variant="ghost" className="text-white hover:bg-white/20 focus-ring-secondary transition-colors">About</Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="ghost" className="text-white hover:bg-white/20 focus-ring-accent transition-colors">Contact</Button>
                  </Link>
                </>
              )}
              <LoginButton />
            </nav>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-4 mt-8">
                  {isCustomer && (
                    <>
                      <Link to="/about">
                        <Button variant="ghost" className="w-full justify-start hover:bg-secondary/10 hover:text-secondary">
                          About
                        </Button>
                      </Link>
                      <Link to="/contact">
                        <Button variant="ghost" className="w-full justify-start hover:bg-accent/10 hover:text-accent">
                          Contact
                        </Button>
                      </Link>
                    </>
                  )}
                  {isVendorUser && (
                    <>
                      <Link to="/vendor">
                        <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary">
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link to="/vendor/products">
                        <Button variant="ghost" className="w-full justify-start hover:bg-secondary/10 hover:text-secondary">
                          <Package className="h-4 w-4 mr-2" />
                          Products
                        </Button>
                      </Link>
                      <Link to="/vendor/orders">
                        <Button variant="ghost" className="w-full justify-start hover:bg-accent/10 hover:text-accent">
                          Orders
                        </Button>
                      </Link>
                    </>
                  )}
                  {isAdminUser && (
                    <>
                      <Link to="/admin">
                        <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary">
                          Admin Dashboard
                        </Button>
                      </Link>
                      <Link to="/admin/products">
                        <Button variant="ghost" className="w-full justify-start hover:bg-secondary/10 hover:text-secondary">
                          Products
                        </Button>
                      </Link>
                      <Link to="/admin/vendors">
                        <Button variant="ghost" className="w-full justify-start hover:bg-accent/10 hover:text-accent">
                          Vendors
                        </Button>
                      </Link>
                      <Link to="/admin/orders">
                        <Button variant="ghost" className="w-full justify-start hover:bg-chart-3/10 hover:text-chart-3">
                          Orders
                        </Button>
                      </Link>
                    </>
                  )}
                  {!identity && (
                    <>
                      <Link to="/about">
                        <Button variant="ghost" className="w-full justify-start hover:bg-secondary/10 hover:text-secondary">
                          About
                        </Button>
                      </Link>
                      <Link to="/contact">
                        <Button variant="ghost" className="w-full justify-start hover:bg-accent/10 hover:text-accent">
                          Contact
                        </Button>
                      </Link>
                    </>
                  )}
                  <div className="pt-4 border-t">
                    <LoginButton />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 rounded-full border-2 border-white/30 bg-white/95 focus:ring-2 focus:ring-white/40 h-11 text-base placeholder:text-muted-foreground/70"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full rounded-full hover:bg-primary/10 text-foreground"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </header>
  );
}
