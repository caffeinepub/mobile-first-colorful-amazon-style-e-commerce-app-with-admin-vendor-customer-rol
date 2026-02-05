import { type ReactNode } from 'react';
import { useGetCallerUserRole, useIsVendor } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import AccessDeniedScreen from './AccessDeniedScreen';
import { Skeleton } from '@/components/ui/skeleton';

interface RequireRoleProps {
  children: ReactNode;
  requiredRole: 'admin' | 'vendor' | 'user';
}

export default function RequireRole({ children, requiredRole }: RequireRoleProps) {
  const { identity } = useInternetIdentity();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();
  const { data: isVendor, isLoading: vendorLoading } = useIsVendor();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <AccessDeniedScreen message="Please sign in to access this page" />;
  }

  if (roleLoading || vendorLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Check admin role
  if (requiredRole === 'admin' && userRole !== 'admin') {
    return <AccessDeniedScreen message="Admin access required" />;
  }

  // Check vendor role
  if (requiredRole === 'vendor' && !isVendor) {
    return <AccessDeniedScreen message="Vendor access required" />;
  }

  // Check user role (any authenticated user)
  if (requiredRole === 'user' && userRole === 'guest') {
    return <AccessDeniedScreen message="Please complete your profile to continue" />;
  }

  return <>{children}</>;
}
