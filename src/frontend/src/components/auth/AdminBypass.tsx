import { type ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

interface AdminBypassProps {
  children: ReactNode;
}

/**
 * Simple login-only wrapper for admin routes.
 * Does NOT check roles - only verifies user is authenticated.
 * Redirects to /customer-login if not logged in.
 */
export default function AdminBypass({ children }: AdminBypassProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  useEffect(() => {
    // Only redirect once we know initialization is complete
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: '/customer-login' });
    }
  }, [isInitializing, isAuthenticated, navigate]);

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (redirect will happen via useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated - render children
  return <>{children}</>;
}
