/**
 * English translations - Admin
 */

export const admin = {
  // Dashboard
  'admin.dashboard.title': 'Admin Dashboard',
  'admin.dashboard.welcome': 'Welcome to the admin panel',
  'admin.dashboard.totalUsers': 'Total Users',
  'admin.dashboard.totalResumes': 'Total Resumes',
  'admin.dashboard.activeUsers': 'Active Users',
  'admin.dashboard.recentActivity': 'Recent Activity',

  // Users
  'admin.users.title': 'User Management',
  'admin.users.search': 'Search users...',
  'admin.users.table.name': 'Name',
  'admin.users.table.email': 'Email',
  'admin.users.table.role': 'Role',
  'admin.users.table.status': 'Status',
  'admin.users.table.created': 'Created',
  'admin.users.table.actions': 'Actions',
  'admin.users.noUsers': 'No users found',
  'admin.users.deleteConfirm': 'Are you sure you want to delete this user?',

  // Roles
  'admin.role.user': 'User',
  'admin.role.admin': 'Admin',

  // Access
  'admin.access.denied': 'Access Denied',
  'admin.access.deniedMessage': "You don't have permission to access this page.",

  // Dashboard extended
  'admin.dashboard.subtitle': "Overview of your platform's key metrics and activity",
  'admin.dashboard.allOperational': 'All systems operational',
  'admin.dashboard.servicesRunning': 'Services are running smoothly. Last checked just now.',
  'admin.dashboard.publicProfiles': 'Public Profiles',
  'admin.dashboard.resumesCreated': 'Resumes Created',

  // Users table extended
  'admin.users.table.user': 'User',
  'admin.users.table.resumes': 'Resumes',
  'admin.users.table.joined': 'Joined',
  'admin.users.table.lastLogin': 'Last Login',
  'admin.users.table.noName': 'No name',
  'admin.users.table.never': 'Never',
  'admin.users.table.removeAdmin': 'Remove Admin',
  'admin.users.table.makeAdmin': 'Make Admin',
  'admin.users.table.viewProfile': 'View Profile',
  'admin.users.table.deleteUser': 'Delete User',
  'admin.users.deleteTitle': 'Delete User',
  'admin.users.deleteDescription':
    'Are you sure you want to delete this user? This action cannot be undone. All their data will be permanently removed.',
  'admin.users.deleteSuccess': 'User deleted successfully',
  'admin.users.deleteFailed': 'Failed to delete user',
  'admin.users.roleUpdated': 'User role updated',
  'admin.users.roleUpdateFailed': 'Failed to update role',
  'admin.users.filterAllRoles': 'All Roles',
  'admin.users.adjustSearch': 'Try adjusting your search or filters',
  'admin.users.usersWillAppear': 'Users will appear here once they sign up',
  'admin.users.unnamedUser': 'Unnamed User',

  // Recent users widget
  'admin.recentUsers.title': 'Recent Users',
  'admin.recentUsers.viewAll': 'View all',
  'admin.recentUsers.noUsers': 'No users yet',
  'admin.recentUsers.noUsersDesc': 'Users will appear here once they sign up',

  // Recent activity widget
  'admin.recentActivity.title': 'Recent Activity',
  'admin.recentActivity.noActivity': 'No activity yet',
  'admin.recentActivity.noActivityDesc': 'User activity will appear here',
  'admin.recentActivity.signedUp': 'signed up',
  'admin.recentActivity.loggedIn': 'logged in',
  'admin.recentActivity.createdResume': 'created a resume',
  'admin.recentActivity.updatedProfile': 'updated profile',

  // Section types
  'admin.sectionTypes.search': 'Search section types...',
  'admin.sectionTypes.allKinds': 'All Kinds',
  'admin.sectionTypes.statusAll': 'All',
  'admin.sectionTypes.active': 'Active',
  'admin.sectionTypes.inactive': 'Inactive',
  'admin.sectionTypes.new': 'New Section Type',
  'admin.sectionTypes.notFound': 'No section types found',
  'admin.sectionTypes.adjustSearch': 'Try adjusting your search or filters',
  'admin.sectionTypes.willAppear': 'Section types will appear here once created',
  'admin.sectionTypes.deleted': 'Section type deleted',
  'admin.sectionTypes.deleteFailed': 'Failed to delete section type',

  // Section type form
  'admin.sectionTypes.form.key': 'Key',
  'admin.sectionTypes.form.title': 'Title',
  'admin.sectionTypes.form.description': 'Description',
  'admin.sectionTypes.form.semanticKind': 'Semantic Kind',
  'admin.sectionTypes.form.iconType': 'Icon Type',
  'admin.sectionTypes.form.icon': 'Icon',
  'admin.sectionTypes.form.minItems': 'Min Items',
  'admin.sectionTypes.form.maxItems': 'Max Items',
  'admin.sectionTypes.form.active': 'Active',
  'admin.sectionTypes.form.repeatable': 'Repeatable',
  'admin.sectionTypes.form.translations': 'Translations',
  'admin.sectionTypes.form.label': 'Label',
  'admin.sectionTypes.form.noDataLabel': 'No Data Label',
  'admin.sectionTypes.form.placeholder': 'Placeholder',
  'admin.sectionTypes.form.addLabel': 'Add Label',

  // Theme approvals
  'admin.themes.title': 'Theme Approvals',
  'admin.themes.subtitle': 'Review and approve user-submitted themes for public use',
  'admin.themes.pendingCount': '{count} theme(s) awaiting review',
  'admin.themes.reviewPrompt': 'Review submissions to make them available for all users',
  'admin.themes.allCaughtUp': 'All caught up!',
  'admin.themes.noPending': 'No themes pending review at the moment',
  'admin.themes.pendingReview': 'Pending Review',
  'admin.themes.approvedToday': 'Approved Today',
  'admin.themes.rejectedToday': 'Rejected Today',
  'admin.themes.pendingReviews': 'Pending Reviews',
} as const;
