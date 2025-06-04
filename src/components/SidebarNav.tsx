
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Repeat, FileText, BellRing, NotebookText, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
  { href: '/transactions', label: 'লেনদেন', icon: Repeat },
  { href: '/reports', label: 'রিপোর্ট', icon: FileText },
  { href: '/reminders', label: 'রিমাইন্ডার', icon: BellRing },
  { href: '/notes', label: 'আর্থিক নোট', icon: NotebookText },
  { href: '/settings', label: 'সেটিংস', icon: Settings2 },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="p-2"> {/* Add padding for the menu items */}
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={cn('w-full justify-start')} // Let default active styles from sidebar component apply
              tooltip={item.label}
            >
              <Link href={item.href}>
                <Icon className="mr-2" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
