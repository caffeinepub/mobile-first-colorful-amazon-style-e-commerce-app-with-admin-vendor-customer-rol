import { useNavigate } from '@tanstack/react-router';
import { UserCircle, Store } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Welcome
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose how you'd like to continue
          </p>
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          {/* Customer Login Card */}
          <Card
            className="cursor-pointer transition-all duration-300 hover:shadow-soft-xl hover-tint-primary border-2 hover:border-primary/40 group"
            onClick={() => navigate({ to: '/customer-login' })}
          >
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-primary/30">
                  <UserCircle className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                    Customer Login
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Browse vendors and shop
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Login Card */}
          <Card
            className="cursor-pointer transition-all duration-300 hover:shadow-soft-xl hover-tint-accent border-2 hover:border-accent/40 group"
            onClick={() => navigate({ to: '/vendor-login' })}
          >
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-accent/30">
                  <Store className="h-8 w-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1 group-hover:text-accent transition-colors">
                    Vendor Login
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your outlet
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>© 2026. Built with ❤️ using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">caffeine.ai</a></p>
        </div>
      </div>
    </div>
  );
}
