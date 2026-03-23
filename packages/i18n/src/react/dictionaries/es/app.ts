/**
 * Spanish (Latin America) translations - App Pages (Dashboard, Errors, etc.)
 */

export const app = {
  // Dashboard
  'app.dashboard.title': 'Dashboard',
  'app.dashboard.welcome': 'Bienvenido de vuelta,',
  'app.dashboard.developer': 'desarrollador',
  'app.dashboard.authenticated': 'autenticado: true',
  'app.dashboard.status.profile': 'incompleto',
  'app.dashboard.status.resume': 'borrador',
  'app.dashboard.status.visibility': 'privado',
  'app.dashboard.quickActions': 'Acciones Rápidas',
  'app.dashboard.editProfile': 'Editar Perfil',
  'app.dashboard.editProfileDesc': 'Actualizá tu información',
  'app.dashboard.viewResume': 'Ver Currículum',
  'app.dashboard.viewResumeDesc': 'Vista previa de tu currículum',
  'app.dashboard.settings': 'Configuración',
  'app.dashboard.settingsDesc': 'Administrar preferencias',

  // Home Page
  'app.home.ready': 'listo',
  'app.home.title': 'Tu perfil de desarrollador,',
  'app.home.titleHighlight': 'cuidadosamente diseñado',
  'app.home.features.portfolio': 'Un portafolio profesional',
  'app.home.features.resume': 'Currículum profesional',
  'app.home.features.analytics': 'Analytics en tiempo real',
  'app.home.cta.getStarted': 'Comenzar',
  'app.home.cta.viewDemo': 'Ver Demo',

  // Unauthorized Page
  'app.unauthorized.title': 'Acceso Denegado',
  'app.unauthorized.description':
    'No tenés permiso para acceder a esta página. Contactá a un administrador si creés que esto es un error.',
  'app.unauthorized.goHome': 'ir_inicio()',
  'app.unauthorized.tryDifferent': 'probar_otra_cuenta()',
  'app.unauthorized.errorCode': 'error.codigo',
  'app.unauthorized.forbidden': 'PROHIBIDO',
  'app.unauthorized.checkPermissions': 'Por favor, verificá tus permisos',

  // Not Found Page
  'app.notFound.title': 'Página no encontrada',
  'app.notFound.description': 'La página que buscás no existe o fue movida.',
  'app.notFound.goHome': 'ir_inicio()',
  'app.notFound.goBack': 'volver()',

  // Onboarding
  'app.onboarding.title': 'Configurá tu Perfil',
  'app.onboarding.description': 'Completá la configuración de tu perfil profesional en minutos',

  // Onboarding Steps
  'app.onboarding.step.technicalSkills': 'Habilidades Técnicas',
  'app.onboarding.step.technicalSkillsDesc':
    'Seleccioná tus habilidades o buscá en nuestro catálogo',
  'app.onboarding.step.back': 'volver',
  'app.onboarding.step.skip': 'omitir',
  'app.onboarding.step.continue': 'continuar',
  'app.onboarding.step.submit': 'enviar',
  'app.onboarding.step.processing': 'procesando...',
  'app.onboarding.step.noSkills': 'Todavía estoy desarrollando mis habilidades (omitir por ahora)',
  'app.onboarding.step.skillsSelected': '{count} habilidad(es) seleccionada(s)',
  'app.onboarding.step.searchSkills': 'Buscar habilidades (React, Python, Docker...)',
  'app.onboarding.step.addCustomSkill': 'Agregar habilidad personalizada',
  'app.onboarding.step.customSkillPlaceholder': 'Nombre de la habilidad...',
  'app.onboarding.step.category': 'Categoría',
  'app.onboarding.step.levels': 'Niveles',
  'app.onboarding.step.noSkillsFound': 'No se encontraron habilidades para "{query}"',

  // Skill Levels
  'app.skills.level.beginner': 'Principiante',
  'app.skills.level.basic': 'Básico',
  'app.skills.level.intermediate': 'Intermedio',
  'app.skills.level.advanced': 'Avanzado',
  'app.skills.level.expert': 'Experto',

  // Dashboard extended
  'app.dashboard.editProfileFn': 'editar_perfil()',
  'app.dashboard.editProfileFnDesc': 'Mirá y editá tu perfil profesional',
  'app.dashboard.manageResumeFn': 'gestionar_curriculum()',
  'app.dashboard.manageResumeFnDesc': 'Gestioná y exportá tu currículum',
  'app.dashboard.configureFn': 'configurar()',
  'app.dashboard.configureFnDesc': 'Configurá las preferencias de tu cuenta',
  'app.dashboard.execute': 'ejecutar',
  'app.dashboard.terminalHelp': 'Comandos disponibles:',
  'app.dashboard.helpEdit': 'Editar tu perfil',
  'app.dashboard.helpExport': 'Exportar currículum a PDF',
  'app.dashboard.helpPublish': 'Hacer perfil público',

  // Settings Page
  'app.settings.title': 'Configuración',
  'app.settings.description': 'Administrá tu perfil y preferencias',
  'app.settings.backToDashboard': 'Volver al Dashboard',
  'app.settings.tabs.resume': 'Currículum',
  'app.settings.tabs.profile': 'Perfil',
  'app.settings.tabs.experience': 'Experiencia',
  'app.settings.tabs.education': 'Educación',
  'app.settings.tabs.skills': 'Habilidades',
  'app.settings.tabs.languages': 'Idiomas',
  'app.settings.tabs.preferences': 'Preferencias',
  'app.settings.tabs.account': 'Cuenta & Seguridad',
} as const;
