/**
 * English translations - Auth
 */

export const auth = {
  // Common
  'auth.back': 'back',
  'auth.or': 'or',
  'auth.terms': 'terms',
  'auth.privacy': 'privacy',
  'auth.docs': 'docs',
  'auth.continueWithGithub': 'Continue with GitHub',
  'auth.authenticated': 'authenticated',

  // Sign in
  'auth.signIn.title': 'Sign in to continue',
  'auth.signIn.subtitle': 'Welcome back, developer',
  'auth.signIn.email': 'Email address',
  'auth.signIn.password': 'Password',
  'auth.signIn.submit': 'Sign in',
  'auth.signIn.forgotPassword': 'Forgot password?',
  'auth.signIn.noAccount': 'New here?',
  'auth.signIn.createAccount': 'Create an account',

  // Sign up
  'auth.signUp.title': 'Create your account',
  'auth.signUp.subtitle': 'Join ProFile and create your professional profile.',
  'auth.signUp.name': 'Full name',
  'auth.signUp.email': 'Email address',
  'auth.signUp.password': 'Password',
  'auth.signUp.confirmPassword': 'Confirm password',
  'auth.signUp.submit': 'Create account',
  'auth.signUp.hasAccount': 'Already have an account?',
  'auth.signUp.signIn': 'Sign in',
  'auth.signUp.features.profiles': 'Beautiful developer profiles',
  'auth.signUp.features.export': 'Export to PDF & share',
  'auth.signUp.features.analytics': 'Real-time analytics',
  'auth.signUp.features.github': 'GitHub integration',

  // Forgot password
  'auth.forgotPassword.title': 'Reset your password',
  'auth.forgotPassword.subtitle': "Enter your email and we'll send you a reset link.",
  'auth.forgotPassword.email': 'Email address',
  'auth.forgotPassword.submit': 'Send reset link',
  'auth.forgotPassword.backToSignIn': 'Back to sign in',
  'auth.forgotPassword.success': 'If an account exists, a reset link has been sent to your email.',

  // Reset password
  'auth.resetPassword.title': 'Set new password',
  'auth.resetPassword.subtitle': 'Enter your new password below.',
  'auth.resetPassword.password': 'New password',
  'auth.resetPassword.confirmPassword': 'Confirm new password',
  'auth.resetPassword.submit': 'Reset password',
  'auth.resetPassword.success': 'Password reset successfully. Redirecting to sign in...',
  'auth.resetPassword.backToSignIn': 'Back to sign in',

  // Errors
  'auth.error.invalidCredentials': 'Invalid email or password',
  'auth.error.emailExists': 'An account with this email already exists',
  'auth.error.weakPassword': 'Password is too weak',
  'auth.error.passwordRequirements':
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
  'auth.error.passwordMismatch': 'Passwords do not match',
  'auth.error.invalidToken': 'Invalid or expired reset token. Please request a new reset link.',
  'auth.error.resetFailed': 'Failed to reset password. Please try again.',
  'auth.error.emailNotSent':
    'Unable to send reset email. Please verify your email address and try again.',
  'auth.error.emailServiceError':
    'Email service is temporarily unavailable. Please try again later.',

  // Security indicators
  'auth.security.secureSession': 'Secure Session',
  'auth.security.encrypted': 'Encrypted',
  'auth.security.secure': 'Secure',

  // Loading states
  'auth.loading.initializing': 'Initializing...',
  'auth.loading.creatingAccount': 'Creating account...',

  // Password requirements
  'auth.signUp.passwordHint': 'Minimum 8 characters',

  // Password strength
  'auth.signUp.passwordStrength.weak': 'Weak',
  'auth.signUp.passwordStrength.fair': 'Fair',
  'auth.signUp.passwordStrength.good': 'Good',
  'auth.signUp.passwordStrength.strong': 'Strong',

  // 2FA
  'auth.2fa.title': 'Two-Factor Authentication',
  'auth.2fa.totpPrompt': 'Enter the 6-digit code from your authenticator app.',
  'auth.2fa.backupPrompt': 'Enter one of your backup codes.',
  'auth.2fa.verify': 'Verify',
  'auth.2fa.verifying': 'Verifying…',
  'auth.2fa.useBackup': 'Use a backup code instead',
  'auth.2fa.useAuthenticator': 'Use authenticator app instead',
  'auth.2fa.verificationFailed': 'Verification failed',
  'auth.2fa.invalidTotp': 'Invalid authenticator code. Please try again.',
  'auth.2fa.invalidBackup': 'Invalid backup code. Please try again.',
  'auth.2fa.enabled': 'Two-factor authentication enabled',
  'auth.2fa.invalidCode': 'Invalid code',
  'auth.2fa.checkApp': 'Please check your authenticator app and try again.',
  'auth.2fa.backupCopied': 'Backup codes copied to clipboard',
  'auth.2fa.backupCopyFailed': 'Failed to copy backup codes',
  'auth.2fa.scanQr': 'Scan QR Code',
  'auth.2fa.verifyCode': 'Verify Code',
  'auth.2fa.backupCodes': 'Backup Codes',
  'auth.2fa.scanDescription': 'Scan this QR code with your authenticator app.',
  'auth.2fa.verifyDescription': 'Enter the 6-digit code from your authenticator app.',
  'auth.2fa.backupDescription': 'Save these backup codes in a safe place.',
  'auth.2fa.verifyAndEnable': 'Verify & Enable',
  'auth.2fa.done': 'Done',
  'auth.2fa.manualKey': 'Manual entry key',
  'auth.2fa.copyAll': 'Copy all codes',
  'auth.2fa.backupWarning': 'Each backup code can only be used once. Store them securely.',
  'auth.2fa.qrAlt': '2FA QR Code',
  'auth.2fa.backupPlaceholder': 'Backup code',

  // Loading
  'auth.loading.generic': 'Loading...',
} as const;
