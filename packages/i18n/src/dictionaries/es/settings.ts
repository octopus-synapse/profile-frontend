/**
 * Spanish (Latin America) translations - Settings
 */

export const settings = {
  // Settings Page Navigation
  'settings.nav.sections': 'Secciones',
  'settings.nav.account': 'Cuenta',

  // Profile Section
  'settings.profile.title': 'Perfil público',
  'settings.profile.description':
    'Mantené la identidad de la cuenta acá. La identidad del currículum va en la sección Currículum.',
  'settings.profile.saveChanges': 'Guardar Cambios',
  'settings.profile.failedUpdate': 'Error al actualizar perfil',
  'settings.profile.failedLoad': 'Error al cargar perfil',
  'settings.profile.unexpectedError': 'Ocurrió un error inesperado. Por favor, intentá de nuevo.',
  'settings.profile.displayName': 'Nombre para Mostrar',
  'settings.profile.displayNamePlaceholder': 'Cómo querés que te conozcan',
  'settings.profile.bio': 'Bio',
  'settings.profile.bioPlaceholder': 'Un breve resumen sobre vos',
  'settings.profile.location': 'Ubicación',
  'settings.profile.locationPlaceholder': 'Ciudad, País',
  'settings.profile.phone': 'Teléfono',
  'settings.profile.website': 'Sitio Web',
  'settings.profile.linkedin': 'LinkedIn',
  'settings.profile.linkedinTooltip':
    'Enlace a tu perfil de LinkedIn. Visible como enlace social en tu perfil público.',
  'settings.profile.github': 'GitHub',
  'settings.profile.githubTooltip':
    'Enlace a tu perfil de GitHub. Ideal para mostrar tus contribuciones open source.',
  'settings.profile.savedSuccess': 'Cambios guardados exitosamente',
  'settings.profile.failedSave': 'Error al guardar cambios',

  // Preferences Section
  'settings.preferences.title': 'Preferencias',
  'settings.preferences.description': 'Personalizá tu experiencia',
  'settings.preferences.visibility.title': 'Visibilidad del Perfil',
  'settings.preferences.visibility.description': 'Controlá quién puede ver tu perfil público',
  'settings.preferences.visibility.public': 'Público',
  'settings.preferences.visibility.publicDesc': 'Cualquiera puede ver',
  'settings.preferences.visibility.private': 'Privado',
  'settings.preferences.visibility.privateDesc': 'Solo vos podés ver',
  'settings.preferences.visibility.updating': 'Actualizando...',
  'settings.preferences.language.title': 'Idioma de la Interfaz',
  'settings.preferences.language.description': 'Elegí tu idioma de interfaz preferido',

  // Danger Zone
  'settings.danger.title': 'Zona de Peligro',
  'settings.danger.description': 'Acciones irreversibles que afectan tu cuenta.',
  'settings.danger.export.title': 'Exportar tus datos',
  'settings.danger.export.description':
    'Descargá todos tus datos en formato JSON (GDPR Artículo 20).',
  'settings.danger.export.exporting': 'Exportando…',
  'settings.danger.export.button': 'Exportar Datos',
  'settings.danger.export.success': 'Exportación de datos descargada',
  'settings.danger.export.error': 'Error al exportar datos',
  'settings.danger.deactivate.title': 'Desactivar cuenta',
  'settings.danger.deactivate.description':
    'Desactivá temporalmente tu cuenta. Podés reactivarla después.',
  'settings.danger.deactivate.button': 'Desactivar',
  'settings.danger.deactivate.dialogTitle': '¿Desactivar Cuenta?',
  'settings.danger.deactivate.dialogDesc':
    'Tu cuenta será desactivada, pero tus datos se preservarán. Podés reactivar contactando a soporte.',
  'settings.danger.deactivate.deactivating': 'Desactivando…',
  'settings.danger.deactivate.success': 'Cuenta desactivada',
  'settings.danger.deactivate.error': 'Error al desactivar cuenta',
  'settings.danger.delete.title': 'Eliminar cuenta',
  'settings.danger.delete.description':
    'Eliminá permanentemente tu cuenta y todos los datos. Esto no se puede deshacer.',
  'settings.danger.delete.button': 'Eliminar Cuenta',
  'settings.danger.delete.dialogTitle': 'Eliminar Cuenta Permanentemente',
  'settings.danger.delete.dialogDesc':
    'Esta acción es irreversible. Todos tus datos, currículums y configuraciones serán eliminados permanentemente.',
  'settings.danger.delete.confirmPrompt': 'Escribí {phrase} para confirmar:',
  'settings.danger.delete.deleting': 'Eliminando…',
  'settings.danger.delete.deleteForever': 'Eliminar Para Siempre',
  'settings.danger.delete.success': 'Cuenta eliminada permanentemente',
  'settings.danger.delete.error': 'Error al eliminar cuenta',

  // Two-Factor Authentication
  'settings.twoFactor.title': 'Autenticación de Dos Factores',
  'settings.twoFactor.description': 'Agregá una capa extra de seguridad a tu cuenta.',
  'settings.twoFactor.enabled': 'Activado',
  'settings.twoFactor.disabled': 'Desactivado',
  'settings.twoFactor.enable': 'Activar 2FA',
  'settings.twoFactor.disable': 'Desactivar 2FA',
  'settings.twoFactor.backupCodesRemaining': 'Códigos de respaldo restantes:',
  'settings.twoFactor.regenerateBackup': 'Regenerar Códigos de Respaldo',
  'settings.twoFactor.disableDialogTitle': '¿Desactivar Autenticación de Dos Factores?',
  'settings.twoFactor.disableDialogDesc':
    'Esto eliminará la capa extra de seguridad de tu cuenta. Podés reactivarla en cualquier momento.',
  'settings.twoFactor.disabling': 'Desactivando…',
  'settings.twoFactor.disableSuccess': 'Autenticación de dos factores desactivada',
  'settings.twoFactor.disableError': 'Error al desactivar 2FA',
  'settings.twoFactor.regenDialogTitle': 'Regenerar Códigos de Respaldo',
  'settings.twoFactor.regenDialogDescAfter':
    'Guardá estos nuevos códigos de respaldo. Los códigos anteriores ahora son inválidos.',
  'settings.twoFactor.regenDialogDescBefore':
    'Esto invalidará todos los códigos de respaldo existentes.',
  'settings.twoFactor.copyAllCodes': 'Copiar todos los códigos',
  'settings.twoFactor.done': 'Listo',
  'settings.twoFactor.generating': 'Generando…',
  'settings.twoFactor.regenerate': 'Regenerar',
  'settings.twoFactor.regenSuccess': 'Nuevos códigos de respaldo generados',
  'settings.twoFactor.regenError': 'Error al regenerar códigos de respaldo',
  'settings.twoFactor.copySuccess': 'Códigos de respaldo copiados',
  'settings.twoFactor.copyError': 'Error al copiar códigos de respaldo',
  'settings.twoFactor.notEnabled': '2FA no activado',

  // Add Section Dialog
  'settings.sections.addNew': 'Agregar sección',
  'settings.sections.addNewDescription': 'Elegí un tipo de sección para agregar a tu currículum',
  'settings.sections.addItemDescription': 'Completá los detalles abajo',
  'settings.sections.editItemTitle': 'Editar {section}',
  'settings.sections.editItemDescription': 'Actualizá los detalles abajo',
  'settings.sections.searchPlaceholder': 'Buscar secciones...',
  'settings.sections.noResults': 'No se encontraron secciones',
  'settings.sections.yourSections': 'Tus secciones',
  'settings.sections.availableSections': 'Disponibles',

  // Username Field
  'settings.username.title': 'Nombre de usuario',
  'settings.username.viewProfile': 'Ver perfil público',
  'settings.username.restricted': 'Cambio de nombre de usuario restringido',
  'settings.username.updateFailed':
    'Error al actualizar nombre de usuario. Por favor, intentá de nuevo.',

  // Resume Basics
  'settings.resume.title': 'Esenciales del currículum',
  'settings.resume.description': 'Editá la información principal creada durante el onboarding.',
  'settings.resume.titlePlaceholder': 'Mi Currículum',
  'settings.resume.headlinePlaceholder': 'Ingeniero de Software Senior',
  'settings.resume.fullNamePlaceholder': 'Juan Pérez',
  'settings.resume.locationPlaceholder': 'Buenos Aires, AR',
  'settings.resume.summaryPlaceholder': 'Contale a los reclutadores lo que más importa...',
  'settings.resume.failedLoad': 'Error al cargar configuraciones del currículum',
  'settings.resume.failedLoadDesc': 'No pudimos cargar tus configuraciones de currículum aún.',
  'settings.resume.summary': 'Resumen',
  'settings.resume.theme': 'Tema del currículum',
  'settings.resume.themeDescription': 'Aplicá un estilo visual diferente...',
  'settings.resume.updateSuccess': 'Currículum actualizado exitosamente',
  'settings.resume.updateFailed': 'Error al actualizar currículum',

  // Resume Sections Card
  'settings.resume.sections.title': 'Secciones del currículum',
  'settings.resume.sections.description':
    'Construí tu perfil agregando experiencias, educación, habilidades,...',
  'settings.resume.sections.loading': 'Cargando tipos de sección...',
} as const;
