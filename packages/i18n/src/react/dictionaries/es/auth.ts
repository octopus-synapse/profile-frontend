/**
 * Spanish (Latin America) translations - Auth
 */

export const auth = {
  // Common
  'auth.back': 'volver',
  'auth.or': 'o',
  'auth.terms': 'términos',
  'auth.privacy': 'privacidad',
  'auth.docs': 'docs',
  'auth.continueWithGithub': 'Continuar con GitHub',
  'auth.authenticated': 'autenticado',

  // Sign in
  'auth.signIn.title': 'Iniciá sesión para continuar',
  'auth.signIn.subtitle': 'Bienvenido de vuelta, dev',
  'auth.signIn.email': 'Dirección de email',
  'auth.signIn.password': 'Contraseña',
  'auth.signIn.submit': 'Iniciar sesión',
  'auth.signIn.forgotPassword': '¿Olvidaste la contraseña?',
  'auth.signIn.noAccount': '¿Nuevo por acá?',
  'auth.signIn.createAccount': 'Crear una cuenta',

  // Sign up
  'auth.signUp.title': 'Creá tu cuenta',
  'auth.signUp.subtitle': 'Unite a ProFile y creá tu perfil profesional.',
  'auth.signUp.name': 'Nombre completo',
  'auth.signUp.email': 'Dirección de email',
  'auth.signUp.password': 'Contraseña',
  'auth.signUp.confirmPassword': 'Confirmar contraseña',
  'auth.signUp.submit': 'Crear cuenta',
  'auth.signUp.hasAccount': '¿Ya tenés una cuenta?',
  'auth.signUp.signIn': 'Iniciar sesión',
  'auth.signUp.features.profiles': 'Perfiles profesionales para devs',
  'auth.signUp.features.export': 'Exportar a PDF y compartir',
  'auth.signUp.features.analytics': 'Analytics en tiempo real',
  'auth.signUp.features.github': 'Integración con GitHub',

  // Forgot password
  'auth.forgotPassword.title': 'Restablecer tu contraseña',
  'auth.forgotPassword.subtitle': 'Ingresá tu email y te enviaremos un enlace de restablecimiento.',
  'auth.forgotPassword.email': 'Dirección de email',
  'auth.forgotPassword.submit': 'Enviar enlace',
  'auth.forgotPassword.backToSignIn': 'Volver a iniciar sesión',
  'auth.forgotPassword.success':
    'Si la cuenta existe, se envió un enlace de restablecimiento a tu email.',

  // Reset password
  'auth.resetPassword.title': 'Definir nueva contraseña',
  'auth.resetPassword.subtitle': 'Ingresá tu nueva contraseña a continuación.',
  'auth.resetPassword.password': 'Nueva contraseña',
  'auth.resetPassword.confirmPassword': 'Confirmar nueva contraseña',
  'auth.resetPassword.submit': 'Restablecer contraseña',
  'auth.resetPassword.success':
    'Contraseña restablecida con éxito. Redirigiendo a iniciar sesión...',
  'auth.resetPassword.backToSignIn': 'Volver a iniciar sesión',

  // Errors
  'auth.error.invalidCredentials': 'Email o contraseña inválidos',
  'auth.error.emailExists': 'Ya existe una cuenta con este email',
  'auth.error.weakPassword': 'La contraseña es muy débil',
  'auth.error.passwordRequirements':
    'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)',
  'auth.error.passwordMismatch': 'Las contraseñas no coinciden',
  'auth.error.invalidToken':
    'Token inválido o expirado. Por favor, solicitá un nuevo enlace de restablecimiento.',
  'auth.error.resetFailed': 'Error al restablecer la contraseña. Por favor, intentá de nuevo.',
  'auth.error.emailNotSent':
    'No se pudo enviar el email de restablecimiento. Por favor, verificá tu dirección de email e intentá de nuevo.',
  'auth.error.emailServiceError':
    'El servicio de email está temporalmente no disponible. Por favor, intentá más tarde.',

  // Security indicators
  'auth.security.secureSession': 'Sesión Segura',
  'auth.security.encrypted': 'Encriptado',
  'auth.security.secure': 'Seguro',

  // Loading states
  'auth.loading.initializing': 'Iniciando...',
  'auth.loading.creatingAccount': 'Creando cuenta...',

  // Password requirements
  'auth.signUp.passwordHint': 'Mínimo 8 caracteres',

  // Password strength
  'auth.signUp.passwordStrength.weak': 'Débil',
  'auth.signUp.passwordStrength.fair': 'Regular',
  'auth.signUp.passwordStrength.good': 'Bueno',
  'auth.signUp.passwordStrength.strong': 'Fuerte',

  // 2FA
  'auth.2fa.title': 'Autenticación de Dos Factores',
  'auth.2fa.totpPrompt': 'Ingresá el código de 6 dígitos de tu app autenticadora.',
  'auth.2fa.backupPrompt': 'Ingresá uno de tus códigos de respaldo.',
  'auth.2fa.verify': 'Verificar',
  'auth.2fa.verifying': 'Verificando…',
  'auth.2fa.useBackup': 'Usar un código de respaldo',
  'auth.2fa.useAuthenticator': 'Usar app autenticadora',
  'auth.2fa.verificationFailed': 'La verificación falló',
  'auth.2fa.invalidTotp': 'Código del autenticador inválido. Por favor, intentá de nuevo.',
  'auth.2fa.invalidBackup': 'Código de respaldo inválido. Por favor, intentá de nuevo.',
  'auth.2fa.enabled': 'Autenticación de dos factores activada',
  'auth.2fa.invalidCode': 'Código inválido',
  'auth.2fa.checkApp': 'Por favor, verificá tu app autenticadora e intentá de nuevo.',
  'auth.2fa.backupCopied': 'Códigos de respaldo copiados',
  'auth.2fa.backupCopyFailed': 'Error al copiar códigos de respaldo',
  'auth.2fa.scanQr': 'Escanear Código QR',
  'auth.2fa.verifyCode': 'Verificar Código',
  'auth.2fa.backupCodes': 'Códigos de Respaldo',
  'auth.2fa.scanDescription': 'Escaneá este código QR con tu app autenticadora.',
  'auth.2fa.verifyDescription': 'Ingresá el código de 6 dígitos de tu app autenticadora.',
  'auth.2fa.backupDescription': 'Guardá estos códigos de respaldo en un lugar seguro.',
  'auth.2fa.verifyAndEnable': 'Verificar y Activar',
  'auth.2fa.done': 'Listo',
  'auth.2fa.manualKey': 'Clave de ingreso manual',
  'auth.2fa.copyAll': 'Copiar todos los códigos',
  'auth.2fa.backupWarning': 'Cada código de respaldo se puede usar solo una vez. Guardalos de forma segura.',
  'auth.2fa.qrAlt': 'Código QR 2FA',
  'auth.2fa.backupPlaceholder': 'Código de respaldo',

  // Loading
  'auth.loading.generic': 'Cargando...',
} as const;
