import { type ReactNode, useRef } from 'react';
import { useGetCallerUserRole, useIsVendor, useIsAdmin } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useActorQueryState } from '../../hooks/useActorQueryState';
import { hasParameter } from '../../utils/urlParams';
import AccessDeniedScreen from './AccessDeniedScreen';
import { Skeleton } from '@/components/ui/skeleton';

interface RequireRoleProps {
  children: ReactNode;
  requiredRole: 'admin' | 'vendor' | 'user';
}

export default function RequireRole({ children, requiredRole }: RequireRoleProps) {
  const { identity } = useInternetIdentity();
  const actorQueryState = useActorQueryState();
  const { data: userRole, isLoading: roleLoading, isFetched: roleFetched } = useGetCallerUserRole();
  const { data: isVendor, isLoading: vendorLoading, isFetched: vendorFetched } = useIsVendor();
  const { data: isAdmin, isLoading: adminLoading, isFetched: adminFetched } = useIsAdmin();

  const isAuthenticated = !!identity;
  const lastDenialStateRef = useRef<string | null>(null);

  // Deterministic state machine for admin role
  if (requiredRole === 'admin') {
    // State 1: Not authenticated → deny immediately
    if (!isAuthenticated) {
      return <AccessDeniedScreen message="Please sign in to access this page" />;
    }

    // State 2: Actor initialization failed → show error with diagnostics
    if (actorQueryState.status === 'error') {
      const denialState = `admin-actor-error-${actorQueryState.status}`;
      if (lastDenialStateRef.current !== denialState) {
        console.log('[RequireRole] Admin access denied - actor initialization failed:', {
          principal: identity?.getPrincipal().toString(),
          actorStatus: actorQueryState.status,
          actorError: actorQueryState.error,
          tokenPresent: hasParameter('caffeineAdminToken'),
          timestamp: new Date().toISOString(),
        });
        lastDenialStateRef.current = denialState;
      }
      return (
        <AccessDeniedScreen 
          message="Backend initialization failed" 
          showAdminButton 
          actorError={actorQueryState.error}
          actorStatus={actorQueryState.status}
        />
      );
    }

    // State 3: Authenticated but admin check not yet fetched → show loading
    // CRITICAL: Block rendering until admin check is conclusively fetched
    if (adminLoading || !adminFetched || actorQueryState.isFetching) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-64" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      );
    }

    // State 4: Admin check fetched and user is NOT admin → deny with debug log
    if (adminFetched && !isAdmin) {
      const denialState = `admin-denied-${adminFetched}-${isAdmin}`;
      if (lastDenialStateRef.current !== denialState) {
        console.log('[RequireRole] Admin access denied:', {
          principal: identity?.getPrincipal().toString(),
          adminFetched,
          adminLoading,
          isAdmin,
          actorStatus: actorQueryState.status,
          tokenPresent: hasParameter('caffeineAdminToken'),
          timestamp: new Date().toISOString(),
        });
        lastDenialStateRef.current = denialState;
      }
      return (
        <AccessDeniedScreen 
          message="Admin access required" 
          showAdminButton 
          actorStatus={actorQueryState.status}
        />
      );
    }

    // State 5: Admin check fetched and user IS admin → allow access
    // ONLY render children when we have conclusive admin confirmation
    if (adminFetched && isAdmin === true) {
      return <>{children}</>;
    }

    // Fallback: If we reach here, something unexpected happened → show loading
    // This prevents premature rendering with undefined/partial state
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Deterministic state machine for vendor role
  if (requiredRole === 'vendor') {
    // State 1: Not authenticated → deny immediately
    if (!isAuthenticated) {
      return <AccessDeniedScreen message="Please sign in to access this page" />;
    }

    // State 2: Actor initialization failed → show error
    if (actorQueryState.status === 'error') {
      return (
        <AccessDeniedScreen 
          message="Backend initialization failed" 
          actorError={actorQueryState.error}
          actorStatus={actorQueryState.status}
        />
      );
    }

    // State 3: Authenticated but vendor check not yet fetched → show loading
    if (vendorLoading || !vendorFetched || actorQueryState.isFetching) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full" />
        </div>
      );
    }

    // State 4: Vendor check fetched and user is NOT vendor → deny
    if (vendorFetched && !isVendor) {
      return <AccessDeniedScreen message="Vendor access required" />;
    }

    // State 5: Vendor check fetched and user IS vendor → allow access
    if (vendorFetched && isVendor === true) {
      return <>{children}</>;
    }

    // Fallback: If we reach here, something unexpected happened → show loading
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Deterministic state machine for user role
  if (requiredRole === 'user') {
    // State 1: Not authenticated → deny immediately
    if (!isAuthenticated) {
      return <AccessDeniedScreen message="Please sign in to access this page" />;
    }

    // State 2: Actor initialization failed → show error
    if (actorQueryState.status === 'error') {
      return (
        <AccessDeniedScreen 
          message="Backend initialization failed" 
          actorError={actorQueryState.error}
          actorStatus={actorQueryState.status}
        />
      );
    }

    // State 3: Authenticated but role check not yet fetched → show loading
    if (roleLoading || !roleFetched || actorQueryState.isFetching) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full" />
        </div>
      );
    }

    // State 4: Role check fetched and user is guest → deny
    if (roleFetched && userRole === 'guest') {
      return <AccessDeniedScreen message="Please complete your profile to continue" />;
    }

    // State 5: Role check fetched and user has valid role → allow access
    if (roleFetched && userRole && userRole !== 'guest') {
      return <>{children}</>;
    }

    // Fallback: If we reach here, something unexpected happened → show loading
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // If requiredRole is invalid, deny access
  return <AccessDeniedScreen message="Invalid role configuration" />;
}
