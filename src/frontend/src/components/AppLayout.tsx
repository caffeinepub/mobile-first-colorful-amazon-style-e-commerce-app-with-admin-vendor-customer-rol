import { type ReactNode } from 'react';
import TopNav from './TopNav';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <TopNav />
      <main className="flex-1 pb-20 md:pb-8">{children}</main>
      <BottomNav />
    </div>
  );
}
