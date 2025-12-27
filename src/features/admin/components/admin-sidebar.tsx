"use client";

/**
 * Admin Sidebar Navigation
 * Developer-inspired design with code aesthetic
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Activity,
  Shield,
  Terminal,
} from "lucide-react";

const navItems = [
  {
    label: "dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "resumes",
    href: "/admin/resumes",
    icon: FileText,
  },
  {
    label: "activity",
    href: "/admin/activity",
    icon: Activity,
  },
  {
    label: "settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-pf-border-default bg-pf-canvas-subtle w-64 shrink-0 border-r">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-pf-border-default flex items-center gap-3 border-b px-4 py-4">
          <div className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex items-center justify-center p-2">
            <Shield className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-pf-fg-default font-mono text-sm font-semibold">admin</p>
            <p className="text-pf-fg-muted font-mono text-xs">control_panel</p>
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
                  "flex items-center gap-3 px-3 py-2 font-mono text-sm transition-colors",
                  isActive
                    ? "bg-pf-canvas-default text-pf-fg-default border-pf-border-default border"
                    : "text-pf-fg-muted hover:bg-pf-canvas-default hover:text-pf-fg-default"
                )}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
                {isActive && <span className="text-code-string ml-auto text-xs">●</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-pf-border-default border-t p-4">
          <div className="flex items-center gap-2">
            <Terminal className="text-pf-fg-subtle h-3 w-3" strokeWidth={1.5} />
            <p className="text-pf-fg-subtle font-mono text-xs">profile@v2.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
