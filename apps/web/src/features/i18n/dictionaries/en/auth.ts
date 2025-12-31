/**
 * English translations - Auth
 */

export const auth = {
  // Common
  "auth.back": "back",
  "auth.or": "or",
  "auth.terms": "terms",
  "auth.privacy": "privacy",
  "auth.docs": "docs",
  "auth.continueWithGithub": "Continue with GitHub",
  "auth.authenticated": "authenticated",

  // Sign in
  "auth.signIn.title": "Sign in to continue",
  "auth.signIn.subtitle": "Welcome back, developer",
  "auth.signIn.email": "Email address",
  "auth.signIn.password": "Password",
  "auth.signIn.submit": "Sign in",
  "auth.signIn.forgotPassword": "Forgot password?",
  "auth.signIn.noAccount": "New here?",
  "auth.signIn.createAccount": "Create an account",

  // Sign up
  "auth.signUp.title": "Create your account",
  "auth.signUp.subtitle": "Join ProFile and create your professional profile.",
  "auth.signUp.name": "Full name",
  "auth.signUp.email": "Email address",
  "auth.signUp.password": "Password",
  "auth.signUp.confirmPassword": "Confirm password",
  "auth.signUp.submit": "Create account",
  "auth.signUp.hasAccount": "Already have an account?",
  "auth.signUp.signIn": "Sign in",
  "auth.signUp.features.profiles": "Beautiful developer profiles",
  "auth.signUp.features.export": "Export to PDF & share",
  "auth.signUp.features.analytics": "Real-time analytics",
  "auth.signUp.features.github": "GitHub integration",

  // Forgot password
  "auth.forgotPassword.title": "Reset your password",
  "auth.forgotPassword.subtitle": "Enter your email and we'll send you a reset link.",
  "auth.forgotPassword.email": "Email address",
  "auth.forgotPassword.submit": "Send reset link",
  "auth.forgotPassword.backToSignIn": "Back to sign in",
  "auth.forgotPassword.success": "If an account exists, a reset link has been sent to your email.",

  // Reset password
  "auth.resetPassword.title": "Set new password",
  "auth.resetPassword.subtitle": "Enter your new password below.",
  "auth.resetPassword.password": "New password",
  "auth.resetPassword.confirmPassword": "Confirm new password",
  "auth.resetPassword.submit": "Reset password",
  "auth.resetPassword.success": "Password reset successfully. Redirecting to sign in...",
  "auth.resetPassword.backToSignIn": "Back to sign in",

  // Errors
  "auth.error.invalidCredentials": "Invalid email or password",
  "auth.error.emailExists": "An account with this email already exists",
  "auth.error.weakPassword": "Password is too weak",
  "auth.error.passwordRequirements": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
  "auth.error.passwordMismatch": "Passwords do not match",
  "auth.error.invalidToken": "Invalid or expired reset token. Please request a new reset link.",
  "auth.error.resetFailed": "Failed to reset password. Please try again.",
  "auth.error.emailNotSent": "Unable to send reset email. Please verify your email address and try again.",
  "auth.error.emailServiceError": "Email service is temporarily unavailable. Please try again later.",
} as const;
