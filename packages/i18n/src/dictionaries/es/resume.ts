/**
 * Spanish (Latin America) translations - Resume Builder
 */

export const resume = {
  // Builder - General
  'resume.builder.loading': 'Cargando currículum...',
  'resume.builder.untitledResume': 'Currículum sin título',
  'resume.builder.preview': 'Vista previa',
  'resume.builder.copied': 'Copiado',
  'resume.builder.share': 'Compartir',
  'resume.builder.noAstData': 'Sin datos AST',
  'resume.builder.noAstDataHint': 'Completá el onboarding para generar tu currículum',
  'resume.builder.selectTheme': 'Seleccionar un Tema',
  'resume.builder.selectThemeHint': 'Elegí un tema en la barra lateral para ver tu currículum',
  'resume.builder.failedCopyLink': 'Error al copiar enlace',
  'resume.builder.sectionFallback': 'Sección {index}',

  // Builder - No Resume State
  'resume.builder.noResume.title': 'Sin Currículum Aún',
  'resume.builder.noResume.description':
    'Completá el onboarding para crear tu currículum, o agregá información manualmente.',
  'resume.builder.noResume.getStarted': 'Comenzar',

  // Builder - Dialogs
  'resume.builder.dialog.shareLinks.title': 'Enlaces para Compartir',
  'resume.builder.dialog.shareLinks.description':
    'Gestioná los enlaces para compartir tu currículum',
  'resume.builder.dialog.analytics.title': 'Analíticas',
  'resume.builder.dialog.analytics.description': 'Rendimiento e insights del currículum',
  'resume.builder.dialog.ats.title': 'Verificación de Compatibilidad ATS',
  'resume.builder.dialog.ats.description': 'Validá tu currículum contra sistemas ATS',
  'resume.builder.dialog.skills.title': 'Habilidades',
  'resume.builder.dialog.skills.description': 'Agregá, editá y organizá tus habilidades',
  'resume.builder.dialog.reorder.title': 'Reordenar Secciones',
  'resume.builder.dialog.reorder.description':
    'Arrastrá para reordenar y alternar la visibilidad de las secciones',

  // Sidebar
  'resume.sidebar.tabs.overview': 'Resumen',
  'resume.sidebar.tabs.themes': 'Temas',
  'resume.sidebar.activeTheme': 'Tema Activo',
  'resume.sidebar.defaultTheme': 'Moderno',
  'resume.sidebar.clickToChange': 'Clic para cambiar',
  'resume.sidebar.stats.title': 'Estadísticas del Currículum',
  'resume.sidebar.stats.experience': 'Experiencia',
  'resume.sidebar.stats.education': 'Educación',
  'resume.sidebar.stats.skills': 'Habilidades',
  'resume.sidebar.stats.languages': 'Idiomas',
  'resume.sidebar.quickActions': 'Acciones Rápidas',
  'resume.sidebar.editContent': 'Editar Contenido',
  'resume.sidebar.refreshPreview': 'Actualizar Vista Previa',
  'resume.sidebar.tools': 'Herramientas',
  'resume.sidebar.tool.import': 'Importar Currículum',
  'resume.sidebar.tool.versionHistory': 'Historial de Versiones',
  'resume.sidebar.tool.shareLinks': 'Enlaces para Compartir',
  'resume.sidebar.tool.analytics': 'Analíticas',
  'resume.sidebar.tool.atsCheck': 'Verificación ATS',
  'resume.sidebar.tool.skills': 'Habilidades',
  'resume.sidebar.tool.reorderSections': 'Reordenar Secciones',

  // Export
  'resume.export.title': 'Exportar Currículum',
  'resume.export.description': 'Elegí un formato para descargar tu currículum.',
  'resume.export.exporting': 'Exportando…',
  'resume.export.download': 'Descargar',
  'resume.export.failedExport': 'Error al exportar {label}',
  'resume.export.format.pdf': 'PDF',
  'resume.export.format.pdfDesc': 'Formato PDF estándar, compatible con ATS',
  'resume.export.format.docx': 'DOCX',
  'resume.export.format.docxDesc': 'Formato Microsoft Word',
  'resume.export.format.json': 'JSON',
  'resume.export.format.jsonDesc': 'Formato JSON Resume legible por máquina',
  'resume.export.format.latex': 'LaTeX',
  'resume.export.format.latexDesc': 'Código fuente LaTeX para CVs académicos',
  'resume.export.format.banner': 'Banner de LinkedIn',
  'resume.export.format.bannerDesc': 'Imagen de banner de perfil (PNG)',
  'resume.export.option.format': 'Formato:',
  'resume.export.option.template': 'Plantilla:',
  'resume.export.jsonFormat.jsonresume': 'JSON Resume',
  'resume.export.jsonFormat.profile': 'Profile',
  'resume.export.latexTemplate.simple': 'Simple',
  'resume.export.latexTemplate.moderncv': 'ModernCV',

  // Import
  'resume.import.provideJson': 'Por favor, proporcioná datos JSON',
  'resume.import.invalidJson': 'Sintaxis JSON inválida',
  'resume.import.failedParse': 'Error al procesar datos del currículum',
  'resume.import.failedClipboard': 'Error al leer el portapapeles',
  'resume.import.dropzonePre': 'Soltá un archivo',
  'resume.import.dropzonePost': 'o hacé clic para buscar',
  'resume.import.orPasteJson': 'o pegá JSON',
  'resume.import.jsonDataLabel': 'Datos JSON Resume',
  'resume.import.paste': 'Pegar',
  'resume.import.parsing': 'Procesando…',
  'resume.import.parsePreview': 'Procesar y Vista Previa',

  // Job Match
  'resume.jobMatch.title': 'Compatibilidad con Puesto',
  'resume.jobMatch.label': 'Pegá una descripción de puesto',
  'resume.jobMatch.placeholder': 'Pegá la descripción completa del puesto aquí...',
  'resume.jobMatch.analyzing': 'Analizando…',
  'resume.jobMatch.analyzeMatch': 'Analizar Compatibilidad',
  'resume.jobMatch.matchBreakdown': 'Desglose de Compatibilidad',
  'resume.jobMatch.strongMatch': 'Alta Compatibilidad',
  'resume.jobMatch.partialMatch': 'Compatibilidad Parcial',
  'resume.jobMatch.weakMatch': 'Baja Compatibilidad',
  'resume.jobMatch.scoreSuffix': '/ 100',
  'resume.jobMatch.emptyInput': 'Campo vacío',
  'resume.jobMatch.emptyInputDesc': 'Pegá una descripción de puesto para analizar.',
  'resume.jobMatch.analysisComplete': 'Análisis completo',
  'resume.jobMatch.analysisFailed': 'Error en el análisis',
  'resume.jobMatch.optimizeTip':
    'Optimizá tu currículum para mejorar la puntuación de compatibilidad',

  // View Stats
  'resume.stats.title': 'Estadísticas de Visualización',
  'resume.stats.totalViews': 'Visualizaciones Totales',
  'resume.stats.uniqueVisitors': 'Visitantes Únicos',
  'resume.stats.viewsOverTime': 'Visualizaciones en el tiempo',
  'resume.stats.topSources': 'Principales Fuentes',

  // Section Item List
  'resume.section.noItems': 'Sin elementos aún. Hacé clic en "Agregar" para crear uno.',
  'resume.section.untitled': 'Sin título',
  'resume.section.item': 'Elemento',

  // Generic Section Editor
  'resume.section.fallbackTitle': 'Sección',
  'resume.section.fieldRequired': '{field} es obligatorio',
  'resume.section.fieldMaxLength': '{field} debe tener como máximo {max} caracteres',
  'resume.section.failedSave': 'Error al guardar',
  'resume.section.deleteItem.title': 'Eliminar elemento',
  'resume.section.deleteItem.description':
    '¿Estás seguro de que querés eliminar este elemento? Esta acción no se puede deshacer.',
  'resume.section.failedDelete': 'Error al eliminar',
  'resume.section.failedLoad': 'Error al cargar sección:',
  'resume.section.noDefinition': 'Tipo de sección no encontrado o sin definiciones de campo.',
  'resume.section.itemCountOne': '1 elemento agregado',
  'resume.section.itemCountOther': '{count} elementos agregados',
  'resume.section.addButton': 'Agregar {title}',

  // Share Links
  'resume.share.title': 'Enlaces para Compartir',
  'resume.share.deleted': 'Enlace para compartir eliminado',
  'resume.share.failedDelete': 'Error al eliminar enlace para compartir',
  'resume.share.noLinks': 'Sin enlaces para compartir',
  'resume.share.noLinksDesc': 'Creá un enlace para compartir tu currículum públicamente',
  'resume.share.copied': 'Enlace copiado',
  'resume.share.failedCopy': 'Error al copiar',
  'resume.share.password': 'Contraseña',
  'resume.share.expired': 'Expirado',
  'resume.share.copyLink': 'Copiar enlace',
  'resume.share.deleteLink': 'Eliminar enlace para compartir',

  // Version History
  'resume.versions.title': 'Historial de Versiones',
  'resume.versions.close': 'Cerrar historial de versiones',
  'resume.versions.noVersions': 'Sin versiones aún',
  'resume.versions.autoSaved': 'Guardado automático',
  'resume.versions.restore': 'Restaurar',
  'resume.versions.restoreSuccess': 'Versión restaurada exitosamente',
  'resume.versions.restoreFailed': 'Error al restaurar versión',
  'resume.versions.restoreFailedDesc': 'Por favor, intentá de nuevo.',
  'resume.versions.failedLoad': 'Error al cargar historial de versiones.',
  'resume.versions.restoreConfirmTitle': '¿Restaurar a {version}?',
  'resume.versions.restoreConfirmDesc':
    'Los cambios actuales se guardarán como una nueva versión antes de restaurar.',
  'resume.versions.versionCountOne': '1 versión',
  'resume.versions.versionCountOther': '{count} versiones',
  'resume.versions.justNow': 'justo ahora',
  'resume.versions.minuteAgo': 'hace 1 minuto',
  'resume.versions.minutesAgo': 'hace {count} minutos',
  'resume.versions.hourAgo': 'hace 1 hora',
  'resume.versions.hoursAgo': 'hace {count} horas',
  'resume.versions.dayAgo': 'hace 1 día',
  'resume.versions.daysAgo': 'hace {count} días',

  // Skills Editor
  'resume.skills.editorLabel': 'Editor de habilidades',
  'resume.skills.noSkills': 'Sin habilidades agregadas. Empezá a escribir para agregar.',
  'resume.skills.namePlaceholder': 'Nombre de habilidad…',
  'resume.skills.categoryPlaceholder': 'Categoría',
  'resume.skills.levelPlaceholder': 'Nivel',
  'resume.skills.editSkill': 'Editar habilidad',
  'resume.skills.addSkill': 'Agregar habilidad',
  'resume.skills.add': 'Agregar',
  'resume.skills.removeLabel': 'Eliminar {name}',
  'resume.skills.duplicateTitle': 'Habilidad duplicada',
  'resume.skills.duplicateDesc': '"{name}" ya fue agregada.',
  'resume.skills.addedTitle': 'Habilidad agregada',
  'resume.skills.addedDesc': '"{name}" fue agregada.',
  'resume.skills.failedAdd': 'Error al agregar habilidad',
  'resume.skills.updatedTitle': 'Habilidad actualizada',
  'resume.skills.updatedDesc': '"{name}" fue actualizada.',
  'resume.skills.failedUpdate': 'Error al actualizar habilidad',
  'resume.skills.removed': 'Habilidad eliminada',
  'resume.skills.failedRemove': 'Error al eliminar habilidad',
  'resume.skills.tryAgain': 'Por favor, intentá de nuevo.',
  'resume.skills.category.Frontend': 'Frontend',
  'resume.skills.category.Backend': 'Backend',
  'resume.skills.category.DevOps': 'DevOps',
  'resume.skills.category.Database': 'Base de Datos',
  'resume.skills.category.Language': 'Lenguaje',
  'resume.skills.category.Tool': 'Herramienta',
  'resume.skills.category.SoftSkill': 'Soft Skill',

  // Section Reorder Panel
  'resume.reorder.title': 'Orden y Visibilidad de Secciones',
  'resume.reorder.noSections': 'Sin secciones para configurar',

  // Import Wizard
  'resume.import.wizard.title': 'Importar Currículum',
  'resume.import.wizard.description': 'Importá tu currículum en formato JSON Resume.',
  'resume.import.wizard.complete': 'Importación Completa',
  'resume.import.wizard.completeDesc': 'Tu currículum fue importado exitosamente.',
  'resume.import.wizard.viewResume': 'Ver Currículum',
  'resume.import.wizard.failed': 'Error en la Importación',
  'resume.import.wizard.processing': 'Esto generalmente tarda unos segundos.',

  // Import History
  'resume.import.history.title': 'Historial de Importación',
  'resume.import.history.viewResume': 'Ver Currículum',
  'resume.import.history.noImports': 'Sin importaciones aún',
  'resume.import.history.noImportsDesc': 'Importá un currículum para ver tu historial acá.',

  // Sharing
  'resume.sharing.createLink': 'Crear Enlace para Compartir',
  'resume.sharing.createLinkDesc': 'Generá un enlace para compartir tu currículum públicamente.',
  'resume.sharing.passwordPlaceholder': 'Ingresá la contraseña',
  'resume.sharing.passwordProtection': 'Protección con contraseña',
  'resume.sharing.expiryDate': 'Fecha de vencimiento (opcional)',
  'resume.sharing.done': 'Listo',

  // Analytics
  'resume.analytics.title': 'Analíticas del Currículum',
  'resume.analytics.keywordDensity': 'Densidad de Palabras Clave',
  'resume.analytics.keywordAnalysis': 'Análisis de Palabras Clave',
  'resume.analytics.warnings': 'Advertencias',
  'resume.analytics.recommendations': 'Recomendaciones',
  'resume.analytics.sectionBreakdown': 'Desglose por Sección',
  'resume.analytics.topRecommendations': 'Principales Recomendaciones',
  'resume.analytics.fullAnalysis': 'Análisis ATS Completo',

  // ATS
  'resume.ats.revalidate': 'Re-validar',
  'resume.ats.issues': 'Problemas',
  'resume.ats.suggestions': 'Sugerencias',
  'resume.ats.dropzone': 'Soltá tu currículum acá o hacé clic para buscar',
  'resume.ats.supportedFormats': 'Soporta PDF y DOCX',

  // Generic Section
  'resume.generic.noItems': 'Sin elementos aún',

  // Theme - Approval Queue
  'resume.theme.approvalQueue.title': 'Revisiones de Temas Pendientes',
  'resume.theme.approvalQueue.allCaughtUp': '¡Todo al día!',
  'resume.theme.approvalQueue.noPending': 'No hay temas pendientes de aprobación...',
  'resume.theme.approvalQueue.failedLoad': 'Error al Cargar',

  // Theme - Review Modal
  'resume.theme.review.rejectPlaceholder': 'Explicá por qué este tema está siendo rechazado...',
  'resume.theme.review.description': 'Descripción',
  'resume.theme.review.noTags': 'Sin tags',
  'resume.theme.review.styleConfig': 'Configuración de Estilo',
  'resume.theme.review.rejectionReason': 'Motivo del Rechazo',
  'resume.theme.review.reject': 'Rechazar',

  // Theme - JSON Import
  'resume.theme.jsonImport.title': 'Importar Tema',
  'resume.theme.jsonImport.description': 'Creá un tema a partir de configuración JSON',
  'resume.theme.jsonImport.themeName': 'Nombre del Tema',
  'resume.theme.jsonImport.namePlaceholder': 'Mi Tema Personalizado',
  'resume.theme.jsonImport.pasteClipboard': 'Pegar del portapapeles',

  // Theme - My Themes Manager
  'resume.theme.myThemes.title': 'Mis Temas',
  'resume.theme.myThemes.subtitle': 'Creá y gestioná tus temas personales',
  'resume.theme.myThemes.importJson': 'Importar JSON',
  'resume.theme.myThemes.newTheme': 'Nuevo Tema',
  'resume.theme.myThemes.noThemes': 'Sin Temas Aún',
  'resume.theme.myThemes.noThemesDesc': 'Creá tu primer tema o importá uno de JSON',
  'resume.theme.myThemes.createTheme': 'Crear Tema',
  'resume.theme.myThemes.deleteConfirm': '¿Eliminar este tema?',
  'resume.theme.myThemes.deleteTheme': 'Eliminar tema',
  'resume.theme.myThemes.createNew': 'Crear Nuevo Tema',
  'resume.theme.myThemes.namePlaceholder': 'Nombre del tema',

  // Theme - Card Status
  'resume.theme.card.system': 'Sistema',
  'resume.theme.card.public': 'Público',
  'resume.theme.card.pending': 'Pendiente',
  'resume.theme.card.rejected': 'Rechazado',
  'resume.theme.card.private': 'Privado',

  // Theme - Layout Editor
  'resume.theme.layout.pageNumbers': 'Números de Página',
} as const;
