/**
 * Navigation Types
 */

import type { UserRole } from "@/shared/types/auth";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  key: string;
  href: string;
  labelKey: string;
  icon?: LucideIcon;
  requiredRoles?: UserRole[];
  requiresAuth: boolean;
  external?: boolean;
  badge?: string | number;
}

export interface NavGroup {
  key: string;
  labelKey: string;
  items: NavItem[];
}

export interface MobileMenuState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}
