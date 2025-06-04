
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Repeat, FileText, BellRing, NotebookText, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start',
              isActive && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
            )}
          >
            <Link href={item.href}>
              <Icon className="mr-2 h-5 w-5" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
