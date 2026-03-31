/**
 * Navigation Components - Spotlight Command Center
 */

// Components
export { BottomNav } from './bottom-nav';
export { CommandPalette } from './command-palette';
// Navigation configuration
export {
  ADMIN_NAV_ITEMS,
  LANDING_NAV_ITEMS,
  PROTECTED_NAV_ITEMS,
  PUBLIC_NAV_ITEMS,
} from './config/nav-items';
// Types
export type { NavItem } from './config/types';
// Hooks
export { useCommandPalette } from './hooks/use-command-palette';
export { Logo } from './logo';
export { MobileMenu } from './mobile-menu';
// Legacy exports (kept for backward compatibility)
export { NavLink } from './nav-link';
export { Navbar } from './navbar';
export { SearchTrigger } from './search-trigger';
export { UserAvatar } from './user-avatar';
export { UserMenu } from './user-menu';
