/**
 * Admin Feature
 */

// Types
export type { AdminStats, AdminUser, RecentActivity, SystemHealth } from "./types";

// Repository
export { adminRepository } from "./services/admin-repository";

// Hooks
export {
  adminKeys,
  useAdminStats,
  useRecentActivity,
  useSystemHealth,
  useRecentUsers,
} from "./hooks";

// Components
export {
  StatCard,
  SystemHealthWidget,
  RecentUsersWidget,
  RecentActivityWidget,
  AdminSidebar,
  UsersTable,
} from "./components";
