'use client';

/**
 * Admin Sidebar Navigation
 * Clean, professional design
 */

import {
  Activity,
  FileText,
  Layers,
  LayoutDashboard,
  Palette,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/utils/cn';

const navItems = [
  {
    label: 'Dashboard',
    href: '/protected/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Users',
    href: '/protected/admin/users',
    icon: Users,
  },
  {
    label: 'Section Types',
    href: '/protected/admin/section-types',
    icon: Layers,
  },
  {
    label: 'Resumes',
    href: '/protected/admin/resumes',
    icon: FileText,
  },
  {
    label: 'Themes',
    href: '/protected/admin/themes',
    icon: Palette,
  },
  {
    label: 'Activity',
    href: '/protected/admin/activity',
    icon: Activity,
  },
  {
    label: 'Settings',
    href: '/protected/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-pf-border-default bg-pf-canvas-overlay w-64 shrink-0 border-r">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-pf-border-default flex items-center gap-3 border-b px-5 py-5">
          <div className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex h-10 w-10 items-center justify-center rounded-xl">
            <Shield className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-pf-fg-default text-sm font-semibold">Admin Panel</p>
            <p className="text-pf-fg-muted text-xs">Manage your platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-pf-canvas-emphasis text-pf-fg-on-emphasis'
                    : 'text-pf-fg-muted hover:bg-pf-canvas-subtle hover:text-pf-fg-default',
                )}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-pf-border-default border-t px-5 py-4">
          <p className="text-pf-fg-subtle text-xs">Profile Platform v2.0</p>
        </div>
      </div>
    </aside>
  );
}
