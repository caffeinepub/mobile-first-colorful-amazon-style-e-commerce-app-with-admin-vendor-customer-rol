import { Link, useNavigate } from '@tanstack/react-router';
import { Search, ShoppingCart, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import LoginButton from './auth/LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCart } from '../hooks/useQueries';
import { useState } from 'react';

export default function TopNav() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: cart } = useGetCart();
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = cart?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/categories', search: { q: searchQuery } });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-card via-card to-card shadow-soft backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 focus-ring-primary rounded-lg">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ShopHub
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 rounded-full border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Link to="/about">
                <Button variant="ghost" className="hover:bg-secondary/10 hover:text-secondary focus-ring-secondary transition-colors">About</Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost" className="hover:bg-accent/10 hover:text-accent focus-ring-accent transition-colors">Contact</Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary focus-ring-primary transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-br from-primary to-secondary border-2 border-card">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              {identity && (
                <Link to="/profile">
                  <Button variant="ghost" size="icon" className="hover:bg-accent/10 hover:text-accent focus-ring-accent transition-colors">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              <LoginButton />
            </nav>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-4 mt-8">
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
              className="w-full pr-10 rounded-full focus:ring-2 focus:ring-primary/20"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full rounded-full hover:bg-primary/10 hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </header>
  );
}
