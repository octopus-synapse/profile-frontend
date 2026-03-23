/**
 * Spanish (Latin America) translations - Admin
 */

export const admin = {
  // Dashboard
  'admin.dashboard.title': 'Panel Administrativo',
  'admin.dashboard.welcome': 'Bienvenido al panel admin',
  'admin.dashboard.totalUsers': 'Total de Usuarios',
  'admin.dashboard.totalResumes': 'Total de Currículums',
  'admin.dashboard.activeUsers': 'Usuarios Activos',
  'admin.dashboard.recentActivity': 'Actividad Reciente',

  // Users
  'admin.users.title': 'Gestión de Usuarios',
  'admin.users.search': 'Buscar usuarios...',
  'admin.users.table.name': 'Nombre',
  'admin.users.table.email': 'Email',
  'admin.users.table.role': 'Rol',
  'admin.users.table.status': 'Estado',
  'admin.users.table.created': 'Creado',
  'admin.users.table.actions': 'Acciones',
  'admin.users.noUsers': 'No se encontraron usuarios',
  'admin.users.deleteConfirm': '¿Estás seguro de que querés eliminar este usuario?',

  // Roles
  'admin.role.user': 'Usuario',
  'admin.role.admin': 'Admin',

  // Access
  'admin.access.denied': 'Acceso Denegado',
  'admin.access.deniedMessage': 'No tenés permiso para acceder a esta página.',

  // Dashboard extended
  'admin.dashboard.subtitle': 'Resumen de las métricas clave y actividad de tu plataforma',
  'admin.dashboard.allOperational': 'Todos los sistemas operativos',
  'admin.dashboard.servicesRunning': 'Los servicios funcionan correctamente. Verificado recién.',
  'admin.dashboard.publicProfiles': 'Perfiles Públicos',
  'admin.dashboard.resumesCreated': 'Currículums Creados',

  // Users table extended
  'admin.users.table.user': 'Usuario',
  'admin.users.table.resumes': 'Currículums',
  'admin.users.table.joined': 'Registro',
  'admin.users.table.lastLogin': 'Último Login',
  'admin.users.table.noName': 'Sin nombre',
  'admin.users.table.never': 'Nunca',
  'admin.users.table.removeAdmin': 'Quitar Admin',
  'admin.users.table.makeAdmin': 'Hacer Admin',
  'admin.users.table.viewProfile': 'Ver Perfil',
  'admin.users.table.deleteUser': 'Eliminar Usuario',
  'admin.users.deleteTitle': 'Eliminar Usuario',
  'admin.users.deleteDescription':
    '¿Estás seguro de que querés eliminar este usuario? Esta acción no se puede deshacer. Todos sus datos serán eliminados permanentemente.',
  'admin.users.deleteSuccess': 'Usuario eliminado con éxito',
  'admin.users.deleteFailed': 'Error al eliminar usuario',
  'admin.users.roleUpdated': 'Rol del usuario actualizado',
  'admin.users.roleUpdateFailed': 'Error al actualizar rol',
  'admin.users.filterAllRoles': 'Todos los Roles',
  'admin.users.adjustSearch': 'Intentá ajustar tu búsqueda o filtros',
  'admin.users.usersWillAppear': 'Los usuarios aparecerán acá cuando se registren',
  'admin.users.unnamedUser': 'Usuario sin nombre',

  // Recent users widget
  'admin.recentUsers.title': 'Usuarios Recientes',
  'admin.recentUsers.viewAll': 'Ver todos',
  'admin.recentUsers.noUsers': 'No hay usuarios todavía',
  'admin.recentUsers.noUsersDesc': 'Los usuarios aparecerán acá cuando se registren',

  // Recent activity widget
  'admin.recentActivity.title': 'Actividad Reciente',
  'admin.recentActivity.noActivity': 'No hay actividad todavía',
  'admin.recentActivity.noActivityDesc': 'La actividad de los usuarios aparecerá acá',
  'admin.recentActivity.signedUp': 'se registró',
  'admin.recentActivity.loggedIn': 'inició sesión',
  'admin.recentActivity.createdResume': 'creó un currículum',
  'admin.recentActivity.updatedProfile': 'actualizó el perfil',

  // Section types
  'admin.sectionTypes.search': 'Buscar tipos de sección...',
  'admin.sectionTypes.allKinds': 'Todos los Tipos',
  'admin.sectionTypes.statusAll': 'Todos',
  'admin.sectionTypes.active': 'Activo',
  'admin.sectionTypes.inactive': 'Inactivo',
  'admin.sectionTypes.new': 'Nuevo Tipo de Sección',
  'admin.sectionTypes.notFound': 'No se encontraron tipos de sección',
  'admin.sectionTypes.adjustSearch': 'Intentá ajustar tu búsqueda o filtros',
  'admin.sectionTypes.willAppear': 'Los tipos de sección aparecerán acá cuando se creen',
  'admin.sectionTypes.deleted': 'Tipo de sección eliminado',
  'admin.sectionTypes.deleteFailed': 'Error al eliminar tipo de sección',

  // Section type form
  'admin.sectionTypes.form.key': 'Clave',
  'admin.sectionTypes.form.title': 'Título',
  'admin.sectionTypes.form.description': 'Descripción',
  'admin.sectionTypes.form.semanticKind': 'Tipo Semántico',
  'admin.sectionTypes.form.iconType': 'Tipo de Ícono',
  'admin.sectionTypes.form.icon': 'Ícono',
  'admin.sectionTypes.form.minItems': 'Mín. Ítems',
  'admin.sectionTypes.form.maxItems': 'Máx. Ítems',
  'admin.sectionTypes.form.active': 'Activo',
  'admin.sectionTypes.form.repeatable': 'Repetible',
  'admin.sectionTypes.form.translations': 'Traducciones',
  'admin.sectionTypes.form.label': 'Etiqueta',
  'admin.sectionTypes.form.noDataLabel': 'Etiqueta Sin Datos',
  'admin.sectionTypes.form.placeholder': 'Placeholder',
  'admin.sectionTypes.form.addLabel': 'Etiqueta Agregar',

  // Theme approvals
  'admin.themes.title': 'Aprobación de Temas',
  'admin.themes.subtitle': 'Revisá y aprobá temas enviados por usuarios para uso público',
  'admin.themes.pendingCount': '{count} tema(s) esperando revisión',
  'admin.themes.reviewPrompt': 'Revisá los envíos para hacerlos disponibles para todos los usuarios',
  'admin.themes.allCaughtUp': '¡Todo al día!',
  'admin.themes.noPending': 'No hay temas pendientes de revisión por el momento',
  'admin.themes.pendingReview': 'Pendiente de Revisión',
  'admin.themes.approvedToday': 'Aprobados Hoy',
  'admin.themes.rejectedToday': 'Rechazados Hoy',
  'admin.themes.pendingReviews': 'Revisiones Pendientes',
} as const;
