/**
 * English translations - Resume Builder
 */

export const resume = {
  // Builder - General
  'resume.builder.loading': 'Loading resume...',
  'resume.builder.untitledResume': 'Untitled Resume',
  'resume.builder.preview': 'Preview',
  'resume.builder.copied': 'Copied',
  'resume.builder.share': 'Share',
  'resume.builder.noAstData': 'No AST data',
  'resume.builder.failedCopyLink': 'Failed to copy link',
  'resume.builder.sectionFallback': 'Section {index}',

  // Builder - No Resume State
  'resume.builder.noResume.title': 'No Resume Yet',
  'resume.builder.noResume.description':
    'Complete the onboarding to create your resume, or add information manually.',
  'resume.builder.noResume.getStarted': 'Get Started',

  // Builder - Dialogs
  'resume.builder.dialog.shareLinks.title': 'Share Links',
  'resume.builder.dialog.shareLinks.description': 'Manage share links for your resume',
  'resume.builder.dialog.analytics.title': 'Analytics',
  'resume.builder.dialog.analytics.description': 'Resume performance and insights',
  'resume.builder.dialog.ats.title': 'ATS Compatibility Check',
  'resume.builder.dialog.ats.description': 'Validate your resume against ATS systems',
  'resume.builder.dialog.skills.title': 'Skills',
  'resume.builder.dialog.skills.description': 'Add, edit, and organize your skills',
  'resume.builder.dialog.reorder.title': 'Reorder Sections',
  'resume.builder.dialog.reorder.description':
    'Drag to reorder and toggle section visibility',

  // Sidebar
  'resume.sidebar.tabs.overview': 'Overview',
  'resume.sidebar.tabs.themes': 'Themes',
  'resume.sidebar.activeTheme': 'Active Theme',
  'resume.sidebar.defaultTheme': 'Modern',
  'resume.sidebar.stats.title': 'Resume Stats',
  'resume.sidebar.stats.experience': 'Experience',
  'resume.sidebar.stats.education': 'Education',
  'resume.sidebar.stats.skills': 'Skills',
  'resume.sidebar.stats.languages': 'Languages',
  'resume.sidebar.quickActions': 'Quick Actions',
  'resume.sidebar.editContent': 'Edit Content',
  'resume.sidebar.refreshPreview': 'Refresh Preview',
  'resume.sidebar.tools': 'Tools',
  'resume.sidebar.tool.import': 'Import Resume',
  'resume.sidebar.tool.versionHistory': 'Version History',
  'resume.sidebar.tool.shareLinks': 'Share Links',
  'resume.sidebar.tool.analytics': 'Analytics',
  'resume.sidebar.tool.atsCheck': 'ATS Check',
  'resume.sidebar.tool.skills': 'Skills',
  'resume.sidebar.tool.reorderSections': 'Reorder Sections',

  // Export
  'resume.export.title': 'Export Resume',
  'resume.export.description': 'Choose a format to download your resume.',
  'resume.export.exporting': 'Exporting…',
  'resume.export.download': 'Download',
  'resume.export.failedExport': 'Failed to export {label}',
  'resume.export.format.pdf': 'PDF',
  'resume.export.format.pdfDesc': 'Standard PDF format, ATS-friendly',
  'resume.export.format.docx': 'DOCX',
  'resume.export.format.docxDesc': 'Microsoft Word format',
  'resume.export.format.json': 'JSON',
  'resume.export.format.jsonDesc': 'Machine-readable JSON Resume format',
  'resume.export.format.latex': 'LaTeX',
  'resume.export.format.latexDesc': 'LaTeX source for academic CVs',
  'resume.export.format.banner': 'LinkedIn Banner',
  'resume.export.format.bannerDesc': 'Profile banner image (PNG)',
  'resume.export.option.format': 'Format:',
  'resume.export.option.template': 'Template:',
  'resume.export.jsonFormat.jsonresume': 'JSON Resume',
  'resume.export.jsonFormat.profile': 'Profile',
  'resume.export.latexTemplate.simple': 'Simple',
  'resume.export.latexTemplate.moderncv': 'ModernCV',

  // Import
  'resume.import.provideJson': 'Please provide JSON data',
  'resume.import.invalidJson': 'Invalid JSON syntax',
  'resume.import.failedParse': 'Failed to parse resume data',
  'resume.import.failedClipboard': 'Failed to read clipboard',
  'resume.import.dropzonePre': 'Drop a',
  'resume.import.dropzonePost': 'file or click to browse',
  'resume.import.orPasteJson': 'or paste JSON',
  'resume.import.jsonDataLabel': 'JSON Resume Data',
  'resume.import.paste': 'Paste',
  'resume.import.parsing': 'Parsing…',
  'resume.import.parsePreview': 'Parse & Preview',

  // Job Match
  'resume.jobMatch.title': 'Job Match',
  'resume.jobMatch.label': 'Paste a job description',
  'resume.jobMatch.placeholder': 'Paste the full job description here...',
  'resume.jobMatch.analyzing': 'Analyzing…',
  'resume.jobMatch.analyzeMatch': 'Analyze Match',
  'resume.jobMatch.matchBreakdown': 'Match Breakdown',
  'resume.jobMatch.strongMatch': 'Strong Match',
  'resume.jobMatch.partialMatch': 'Partial Match',
  'resume.jobMatch.weakMatch': 'Weak Match',
  'resume.jobMatch.scoreSuffix': '/ 100',
  'resume.jobMatch.emptyInput': 'Empty input',
  'resume.jobMatch.emptyInputDesc': 'Paste a job description to analyze.',
  'resume.jobMatch.analysisComplete': 'Analysis complete',
  'resume.jobMatch.analysisFailed': 'Analysis failed',
  'resume.jobMatch.optimizeTip': 'Optimize your resume to improve the match score',

  // View Stats
  'resume.stats.title': 'View Statistics',
  'resume.stats.totalViews': 'Total Views',
  'resume.stats.uniqueVisitors': 'Unique Visitors',
  'resume.stats.viewsOverTime': 'Views over time',
  'resume.stats.topSources': 'Top Sources',

  // Section Item List
  'resume.section.noItems': 'No items yet. Click "Add" to create one.',
  'resume.section.untitled': 'Untitled',
  'resume.section.item': 'Item',

  // Generic Section Editor
  'resume.section.fallbackTitle': 'Section',
  'resume.section.fieldRequired': '{field} is required',
  'resume.section.fieldMaxLength': '{field} must be at most {max} characters',
  'resume.section.failedSave': 'Failed to save',
  'resume.section.deleteItem.title': 'Delete item',
  'resume.section.deleteItem.description':
    'Are you sure you want to delete this item? This action cannot be undone.',
  'resume.section.failedDelete': 'Failed to delete',
  'resume.section.failedLoad': 'Failed to load section:',
  'resume.section.noDefinition': 'Section type not found or has no field definitions.',
  'resume.section.itemCountOne': '1 item added',
  'resume.section.itemCountOther': '{count} items added',
  'resume.section.addButton': 'Add {title}',

  // Share Links
  'resume.share.title': 'Share Links',
  'resume.share.deleted': 'Share link deleted',
  'resume.share.failedDelete': 'Failed to delete share link',
  'resume.share.noLinks': 'No share links',
  'resume.share.noLinksDesc': 'Create a share link to share your resume publicly',
  'resume.share.copied': 'Link copied',
  'resume.share.failedCopy': 'Failed to copy',
  'resume.share.password': 'Password',
  'resume.share.expired': 'Expired',
  'resume.share.copyLink': 'Copy link',
  'resume.share.deleteLink': 'Delete share link',

  // Version History
  'resume.versions.title': 'Version History',
  'resume.versions.close': 'Close version history',
  'resume.versions.noVersions': 'No versions yet',
  'resume.versions.autoSaved': 'Auto-saved',
  'resume.versions.restore': 'Restore',
  'resume.versions.restoreSuccess': 'Version restored successfully',
  'resume.versions.restoreFailed': 'Failed to restore version',
  'resume.versions.restoreFailedDesc': 'Please try again.',
  'resume.versions.failedLoad': 'Failed to load version history.',
  'resume.versions.restoreConfirmTitle': 'Restore to {version}?',
  'resume.versions.restoreConfirmDesc':
    'Current changes will be saved as a new version before restoring.',
  'resume.versions.versionCountOne': '1 version',
  'resume.versions.versionCountOther': '{count} versions',
  'resume.versions.justNow': 'just now',
  'resume.versions.minuteAgo': '1 minute ago',
  'resume.versions.minutesAgo': '{count} minutes ago',
  'resume.versions.hourAgo': '1 hour ago',
  'resume.versions.hoursAgo': '{count} hours ago',
  'resume.versions.dayAgo': '1 day ago',
  'resume.versions.daysAgo': '{count} days ago',

  // Skills Editor
  'resume.skills.editorLabel': 'Skills editor',
  'resume.skills.noSkills': 'No skills added yet. Start typing to add skills.',
  'resume.skills.namePlaceholder': 'Skill name…',
  'resume.skills.categoryPlaceholder': 'Category',
  'resume.skills.levelPlaceholder': 'Level',
  'resume.skills.editSkill': 'Edit skill',
  'resume.skills.addSkill': 'Add skill',
  'resume.skills.add': 'Add',
  'resume.skills.removeLabel': 'Remove {name}',
  'resume.skills.duplicateTitle': 'Duplicate skill',
  'resume.skills.duplicateDesc': '"{name}" is already added.',
  'resume.skills.addedTitle': 'Skill added',
  'resume.skills.addedDesc': '"{name}" was added.',
  'resume.skills.failedAdd': 'Failed to add skill',
  'resume.skills.updatedTitle': 'Skill updated',
  'resume.skills.updatedDesc': '"{name}" was updated.',
  'resume.skills.failedUpdate': 'Failed to update skill',
  'resume.skills.removed': 'Skill removed',
  'resume.skills.failedRemove': 'Failed to remove skill',
  'resume.skills.tryAgain': 'Please try again.',
  'resume.skills.category.Frontend': 'Frontend',
  'resume.skills.category.Backend': 'Backend',
  'resume.skills.category.DevOps': 'DevOps',
  'resume.skills.category.Database': 'Database',
  'resume.skills.category.Language': 'Language',
  'resume.skills.category.Tool': 'Tool',
  'resume.skills.category.SoftSkill': 'Soft Skill',

  // Section Reorder Panel
  'resume.reorder.title': 'Section Order & Visibility',
  'resume.reorder.noSections': 'No sections to configure',

  // Import Wizard
  'resume.import.wizard.title': 'Import Resume',
  'resume.import.wizard.description': 'Import your resume from JSON Resume format.',
  'resume.import.wizard.complete': 'Import Complete',
  'resume.import.wizard.completeDesc': 'Your resume has been imported successfully.',
  'resume.import.wizard.viewResume': 'View Resume',
  'resume.import.wizard.failed': 'Import Failed',
  'resume.import.wizard.processing': 'This usually takes a few seconds.',

  // Import History
  'resume.import.history.title': 'Import History',
  'resume.import.history.viewResume': 'View Resume',
  'resume.import.history.noImports': 'No imports yet',
  'resume.import.history.noImportsDesc': 'Import a resume to see your history here.',

  // Sharing
  'resume.sharing.createLink': 'Create Share Link',
  'resume.sharing.createLinkDesc': 'Generate a link to share your resume publicly.',
  'resume.sharing.passwordPlaceholder': 'Enter password',
  'resume.sharing.passwordProtection': 'Password protection',
  'resume.sharing.expiryDate': 'Expiry date (optional)',
  'resume.sharing.done': 'Done',

  // Analytics
  'resume.analytics.title': 'Resume Analytics',
  'resume.analytics.keywordDensity': 'Keyword Density',
  'resume.analytics.keywordAnalysis': 'Keyword Analysis',
  'resume.analytics.warnings': 'Warnings',
  'resume.analytics.recommendations': 'Recommendations',
  'resume.analytics.sectionBreakdown': 'Section Breakdown',
  'resume.analytics.topRecommendations': 'Top Recommendations',
  'resume.analytics.fullAnalysis': 'Full ATS Analysis',

  // ATS
  'resume.ats.revalidate': 'Re-validate',
  'resume.ats.issues': 'Issues',
  'resume.ats.suggestions': 'Suggestions',
  'resume.ats.dropzone': 'Drop your resume here or click to browse',
  'resume.ats.supportedFormats': 'Supports PDF and DOCX',

  // Generic Section
  'resume.generic.noItems': 'No items yet',

  // Theme - Approval Queue
  'resume.theme.approvalQueue.title': 'Pending Theme Reviews',
  'resume.theme.approvalQueue.allCaughtUp': 'All Caught Up!',
  'resume.theme.approvalQueue.noPending': 'No themes are pending approval...',
  'resume.theme.approvalQueue.failedLoad': 'Failed to Load',

  // Theme - Review Modal
  'resume.theme.review.rejectPlaceholder': 'Explain why this theme is being rejected...',
  'resume.theme.review.description': 'Description',
  'resume.theme.review.noTags': 'No tags',
  'resume.theme.review.styleConfig': 'Style Configuration',
  'resume.theme.review.rejectionReason': 'Rejection Reason',
  'resume.theme.review.reject': 'Reject',

  // Theme - JSON Import
  'resume.theme.jsonImport.title': 'Import Theme',
  'resume.theme.jsonImport.description': 'Create a theme from JSON configuration',
  'resume.theme.jsonImport.themeName': 'Theme Name',
  'resume.theme.jsonImport.namePlaceholder': 'My Custom Theme',
  'resume.theme.jsonImport.pasteClipboard': 'Paste from clipboard',

  // Theme - My Themes Manager
  'resume.theme.myThemes.title': 'My Themes',
  'resume.theme.myThemes.subtitle': 'Create and manage your personal themes',
  'resume.theme.myThemes.importJson': 'Import JSON',
  'resume.theme.myThemes.newTheme': 'New Theme',
  'resume.theme.myThemes.noThemes': 'No Themes Yet',
  'resume.theme.myThemes.noThemesDesc': 'Create your first theme or import one from JSON',
  'resume.theme.myThemes.createTheme': 'Create Theme',
  'resume.theme.myThemes.deleteConfirm': 'Delete this theme?',
  'resume.theme.myThemes.deleteTheme': 'Delete theme',
  'resume.theme.myThemes.createNew': 'Create New Theme',
  'resume.theme.myThemes.namePlaceholder': 'Theme name',

  // Theme - Card Status
  'resume.theme.card.system': 'System',
  'resume.theme.card.public': 'Public',
  'resume.theme.card.pending': 'Pending',
  'resume.theme.card.rejected': 'Rejected',
  'resume.theme.card.private': 'Private',

  // Theme - Layout Editor
  'resume.theme.layout.pageNumbers': 'Page Numbers',
} as const;
