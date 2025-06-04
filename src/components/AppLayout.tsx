"use client"; // Added this line

import type { ReactNode } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { SidebarNav } from '@/components/SidebarNav';
import { usePinLock } from '@/contexts/PinLockContext';
import { PinOverlay } from '@/components/PinOverlay';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAppLocked, isPinEnabled } = usePinLock();

  if (isPinEnabled && isAppLocked) {
    return <PinOverlay />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <div className="flex flex-1">
          <Sidebar>
            <SidebarContent className="p-0"> {/* Remove default padding to allow SidebarNav to control it */}
              <SidebarNav />
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <div className="p-6 bg-background"> {/* Re-apply original main padding here */}
              {children}
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
