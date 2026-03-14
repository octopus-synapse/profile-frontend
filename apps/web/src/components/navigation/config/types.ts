/**
 * Navigation Types
 *
 * Type definitions for navigation system.
 */

import type { SessionUserResponseDtoRole } from '@profile/api-client';
import type { DictionaryKey } from '@profile/i18n';
import type { LucideIcon } from 'lucide-react';

/**
 * Navigation item definition
 */
export interface NavItem {
  /** Unique identifier for the nav item */
  key: string;
  /** Route path or hash link */
  href: string;
  /** i18n dictionary key for the label */
  labelKey: DictionaryKey;
  /** Optional icon component */
  icon?: LucideIcon;
  /** Whether this item requires authentication */
  requiresAuth: boolean;
  /** Optional roles required to see this item */
  requiredRoles?: SessionUserResponseDtoRole[];
  /** Whether this is an external link (opens in new tab) */
  external?: boolean;
}

/**
 * Navigation group definition (for grouped menus)
 */
export interface NavGroup {
  /** Unique identifier for the group */
  key: string;
  /** i18n dictionary key for the group label */
  labelKey: DictionaryKey;
  /** Items in this group */
  items: NavItem[];
}

/**
 * Mobile menu state
 */
export interface MobileMenuState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
