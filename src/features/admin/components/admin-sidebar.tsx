"use client";

/**
 * Admin Sidebar Navigation
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { LayoutDashboard, Users, FileText, Settings, Activity, Shield } from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Resumes",
    href: "/admin/resumes",
    icon: FileText,
  },
  {
    label: "Activity",
    href: "/admin/activity",
    icon: Activity,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-gh-border-default bg-gh-canvas-subtle w-64 shrink-0 border-r">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-gh-border-default flex items-center gap-2 border-b px-4 py-4">
          <div className="bg-gh-attention-subtle flex items-center justify-center rounded-lg p-2">
            <Shield className="text-gh-attention-fg h-5 w-5" />
          </div>
          <div>
            <p className="text-gh-fg-default text-sm font-semibold">Admin</p>
            <p className="text-gh-fg-muted text-xs">Control Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gh-canvas-default text-gh-fg-default"
                    : "text-gh-fg-muted hover:bg-gh-canvas-default hover:text-gh-fg-default"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-gh-border-default border-t p-4">
          <p className="text-gh-fg-subtle text-xs">Profile v2.0.0</p>
        </div>
      </div>
    </aside>
  );
}
