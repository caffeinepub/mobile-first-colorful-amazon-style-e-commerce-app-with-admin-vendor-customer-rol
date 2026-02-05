import { type ReactNode } from 'react';
import TopNav from './TopNav';
import BottomNav from './BottomNav';
import ProfileSetupModal from './auth/ProfileSetupModal';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />
      <main className="flex-1 pb-20 md:pb-8">{children}</main>
      <BottomNav />
      <ProfileSetupModal />
    </div>
  );
}
