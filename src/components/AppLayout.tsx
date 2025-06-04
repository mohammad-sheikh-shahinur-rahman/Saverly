
import type { ReactNode } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { SidebarNav } from '@/components/SidebarNav';
import { usePinLock } from '@/contexts/PinLockContext';
import { PinOverlay } from '@/components/PinOverlay';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAppLocked, isPinEnabled } = usePinLock();

  if (isPinEnabled && isAppLocked) {
    return <PinOverlay />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <div className="flex flex-1">
        <aside className="hidden md:block w-64 border-r bg-card">
          <SidebarNav />
        </aside>
        <main className="flex-1 p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
