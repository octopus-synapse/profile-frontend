/**
 * English translations - Settings
 */

export const settings = {
  // Settings Page Navigation
  'settings.nav.sections': 'Sections',
  'settings.nav.account': 'Account',

  // Profile Section
  'settings.profile.title': 'Public profile',
  'settings.profile.description':
    'Keep account-level identity here. Resume identity lives in the Resume section.',
  'settings.profile.contact': 'Contact',
  'settings.profile.social': 'Social',
  'settings.profile.saveChanges': 'Save Changes',
  'settings.profile.failedUpdate': 'Failed to update profile',
  'settings.profile.failedLoad': 'Failed to load profile',
  'settings.profile.unexpectedError': 'An unexpected error occurred. Please try again.',
  'settings.profile.displayName': 'Display Name',
  'settings.profile.displayNamePlaceholder': 'How you want to be known',
  'settings.profile.bio': 'Bio',
  'settings.profile.bioPlaceholder': 'A short summary about yourself',
  'settings.profile.location': 'Location',
  'settings.profile.locationPlaceholder': 'City, Country',
  'settings.profile.phone': 'Phone',
  'settings.profile.website': 'Website',
  'settings.profile.linkedin': 'LinkedIn',
  'settings.profile.linkedinTooltip':
    'Link to your LinkedIn profile. Visible as a social link on your public profile.',
  'settings.profile.github': 'GitHub',
  'settings.profile.githubTooltip':
    'Link to your GitHub profile. Great for showcasing your open source contributions.',
  'settings.profile.savedSuccess': 'Changes saved successfully',
  'settings.profile.failedSave': 'Failed to save changes',

  // Preferences Section
  'settings.preferences.title': 'Preferences',
  'settings.preferences.description': 'Customize your experience',
  'settings.preferences.visibility.title': 'Profile Visibility',
  'settings.preferences.visibility.description': 'Control who can see your public profile',
  'settings.preferences.visibility.public': 'Public',
  'settings.preferences.visibility.publicDesc': 'Anyone can view',
  'settings.preferences.visibility.private': 'Private',
  'settings.preferences.visibility.privateDesc': 'Only you can view',
  'settings.preferences.visibility.updating': 'Updating...',
  'settings.preferences.language.title': 'Interface Language',
  'settings.preferences.language.description': 'Choose your preferred interface language',

  // Danger Zone
  'settings.danger.title': 'Danger Zone',
  'settings.danger.description': 'Irreversible actions that affect your account.',
  'settings.danger.export.title': 'Export your data',
  'settings.danger.export.description': 'Download all your data in JSON format (GDPR Article 20).',
  'settings.danger.export.exporting': 'Exporting…',
  'settings.danger.export.button': 'Export Data',
  'settings.danger.export.success': 'Data export downloaded',
  'settings.danger.export.error': 'Failed to export data',
  'settings.danger.deactivate.title': 'Deactivate account',
  'settings.danger.deactivate.description':
    'Temporarily disable your account. You can reactivate it later.',
  'settings.danger.deactivate.button': 'Deactivate',
  'settings.danger.deactivate.dialogTitle': 'Deactivate Account?',
  'settings.danger.deactivate.dialogDesc':
    'Your account will be disabled but your data will be preserved. You can reactivate by contacting support.',
  'settings.danger.deactivate.deactivating': 'Deactivating…',
  'settings.danger.deactivate.success': 'Account deactivated',
  'settings.danger.deactivate.error': 'Failed to deactivate account',
  'settings.danger.delete.title': 'Delete account',
  'settings.danger.delete.description':
    'Permanently delete your account and all data. This cannot be undone.',
  'settings.danger.delete.button': 'Delete Account',
  'settings.danger.delete.dialogTitle': 'Permanently Delete Account',
  'settings.danger.delete.dialogDesc':
    'This action is irreversible. All your data, resumes, and settings will be permanently removed.',
  'settings.danger.delete.confirmPrompt': 'Type {phrase} to confirm:',
  'settings.danger.delete.deleting': 'Deleting…',
  'settings.danger.delete.deleteForever': 'Delete Forever',
  'settings.danger.delete.success': 'Account permanently deleted',
  'settings.danger.delete.error': 'Failed to delete account',

  // Two-Factor Authentication
  'settings.twoFactor.title': 'Two-Factor Authentication',
  'settings.twoFactor.description': 'Add an extra layer of security to your account.',
  'settings.twoFactor.enabled': 'Enabled',
  'settings.twoFactor.disabled': 'Disabled',
  'settings.twoFactor.enable': 'Enable 2FA',
  'settings.twoFactor.disable': 'Disable 2FA',
  'settings.twoFactor.backupCodesRemaining': 'Backup codes remaining:',
  'settings.twoFactor.regenerateBackup': 'Regenerate Backup Codes',
  'settings.twoFactor.disableDialogTitle': 'Disable Two-Factor Authentication?',
  'settings.twoFactor.disableDialogDesc':
    'This will remove the extra security layer from your account. You can re-enable it at any time.',
  'settings.twoFactor.disabling': 'Disabling…',
  'settings.twoFactor.disableSuccess': 'Two-factor authentication disabled',
  'settings.twoFactor.disableError': 'Failed to disable 2FA',
  'settings.twoFactor.regenDialogTitle': 'Regenerate Backup Codes',
  'settings.twoFactor.regenDialogDescAfter':
    'Save these new backup codes. Previous codes are now invalid.',
  'settings.twoFactor.regenDialogDescBefore': 'This will invalidate all existing backup codes.',
  'settings.twoFactor.copyAllCodes': 'Copy all codes',
  'settings.twoFactor.done': 'Done',
  'settings.twoFactor.generating': 'Generating…',
  'settings.twoFactor.regenerate': 'Regenerate',
  'settings.twoFactor.regenSuccess': 'New backup codes generated',
  'settings.twoFactor.regenError': 'Failed to regenerate backup codes',
  'settings.twoFactor.copySuccess': 'Backup codes copied to clipboard',
  'settings.twoFactor.copyError': 'Failed to copy backup codes',
  'settings.twoFactor.notEnabled': '2FA not enabled',

  // Add Section Dialog
  'settings.sections.addNew': 'Add section',
  'settings.sections.addNewDescription': 'Choose a section type to add to your resume',
  'settings.sections.addItemDescription': 'Fill in the details below',
  'settings.sections.editItemTitle': 'Edit {section}',
  'settings.sections.editItemDescription': 'Update the details below',
  'settings.sections.searchPlaceholder': 'Search sections...',
  'settings.sections.noResults': 'No sections found',
  'settings.sections.yourSections': 'Your sections',
  'settings.sections.availableSections': 'Available',

  // Username Field
  'settings.username.title': 'Username',
  'settings.username.viewProfile': 'View public profile',
  'settings.username.restricted': 'Username change restricted',
  'settings.username.updateFailed': 'Failed to update username. Please try again.',

  // Resume Basics
  'settings.resume.title': 'Resume essentials',
  'settings.resume.description': 'Edit the core information created during onboarding.',
  'settings.resume.titlePlaceholder': 'My Resume',
  'settings.resume.headlinePlaceholder': 'Senior Software Engineer',
  'settings.resume.fullNamePlaceholder': 'Jane Doe',
  'settings.resume.locationPlaceholder': 'Sao Paulo, BR',
  'settings.resume.summaryPlaceholder': 'Tell recruiters what matters most...',
  'settings.resume.failedLoad': 'Failed to load resume settings',
  'settings.resume.failedLoadDesc': 'We could not load your resume settings yet.',
  'settings.resume.summary': 'Summary',
  'settings.resume.theme': 'Resume theme',
  'settings.resume.themeDescription': 'Apply a different visual style...',
  'settings.resume.updateSuccess': 'Resume updated successfully',
  'settings.resume.updateFailed': 'Failed to update resume',

  // Resume Sections Card
  'settings.resume.sections.title': 'Resume sections',
  'settings.resume.sections.description':
    'Build your profile by adding experiences, education, skills,...',
  'settings.resume.sections.loading': 'Loading section types...',
} as const;
