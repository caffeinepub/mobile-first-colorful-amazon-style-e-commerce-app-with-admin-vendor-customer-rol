import { type ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsVendor } from '../hooks/useQueries';
import TopNav from './TopNav';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: isVendor, isFetched: vendorFetched } = useIsVendor();
  const navigate = useNavigate();

  useEffect(() => {
    // Post-login redirect for vendors
    if (identity && loginStatus === 'success' && vendorFetched && isVendor === true) {
      const currentPath = window.location.pathname;
      // Only redirect if not already on a vendor route
      if (!currentPath.startsWith('/vendor')) {
        navigate({ to: '/vendor' });
      }
    }
  }, [identity, loginStatus, isVendor, vendorFetched, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <TopNav />
      <main className="flex-1 pb-20 md:pb-8">{children}</main>
      <BottomNav />
    </div>
  );
}
