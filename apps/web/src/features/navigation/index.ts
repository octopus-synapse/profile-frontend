/**
 * Navigation Feature
 * GitHub-inspired navigation system
 */

// Components
export { Navbar, NavLink, Logo, UserMenu, MobileMenu, LanguageSwitcher } from "./components";

// Hooks
export { useNavigation, useMobileMenu } from "./hooks";

// Config
export {
  PUBLIC_NAV_ITEMS,
  PROTECTED_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  NAV_GROUPS,
  USER_MENU_ITEMS,
  ADMIN_MENU_ITEMS,
} from "./config/nav-items";

// Types
export type { NavItem, NavGroup, MobileMenuState } from "./types";
