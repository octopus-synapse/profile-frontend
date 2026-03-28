/**
 * Portuguese (Brazil) translations - Auth
 */

export const auth = {
  // Common
  'auth.back': 'voltar',
  'auth.or': 'ou',
  'auth.terms': 'termos',
  'auth.privacy': 'privacidade',
  'auth.docs': 'docs',
  'auth.continueWithGithub': 'Continuar com GitHub',
  'auth.authenticated': 'autenticado',

  // Sign in
  'auth.signIn.title': 'Entre para continuar',
  'auth.signIn.subtitle': 'Bem-vindo de volta, dev',
  'auth.signIn.email': 'Endereço de email',
  'auth.signIn.password': 'Senha',
  'auth.signIn.submit': 'Entrar',
  'auth.signIn.forgotPassword': 'Esqueceu a senha?',
  'auth.signIn.noAccount': 'Novo por aqui?',
  'auth.signIn.createAccount': 'Criar uma conta',

  // Sign up
  'auth.signUp.title': 'Crie sua conta',
  'auth.signUp.subtitle': 'Junte-se ao ProFile e crie seu perfil profissional.',
  'auth.signUp.name': 'Nome completo',
  'auth.signUp.email': 'Endereço de email',
  'auth.signUp.password': 'Senha',
  'auth.signUp.confirmPassword': 'Confirmar senha',
  'auth.signUp.submit': 'Criar conta',
  'auth.signUp.namePlaceholder': 'Maria Silva',
  'auth.signUp.hasAccount': 'Já tem uma conta?',
  'auth.signUp.signIn': 'Entrar',
  'auth.signUp.features.profiles': 'Perfis bonitos para desenvolvedores',
  'auth.signUp.features.export': 'Exportar para PDF e compartilhar',
  'auth.signUp.features.analytics': 'Analytics em tempo real',
  'auth.signUp.features.github': 'Integração com GitHub',

  // Forgot password
  'auth.forgotPassword.title': 'Redefinir sua senha',
  'auth.forgotPassword.subtitle': 'Digite seu email e enviaremos um link de redefinição.',
  'auth.forgotPassword.email': 'Endereço de email',
  'auth.forgotPassword.submit': 'Enviar link',
  'auth.forgotPassword.backToSignIn': 'Voltar para entrar',
  'auth.forgotPassword.success':
    'Se a conta existir, um link de redefinição foi enviado para seu email.',

  // Reset password
  'auth.resetPassword.title': 'Definir nova senha',
  'auth.resetPassword.subtitle': 'Digite sua nova senha abaixo.',
  'auth.resetPassword.password': 'Nova senha',
  'auth.resetPassword.confirmPassword': 'Confirmar nova senha',
  'auth.resetPassword.submit': 'Redefinir senha',
  'auth.resetPassword.success': 'Senha redefinida com sucesso. Redirecionando para entrar...',
  'auth.resetPassword.backToSignIn': 'Voltar para entrar',

  // Errors
  'auth.error.invalidCredentials': 'Email ou senha inválidos',
  'auth.error.emailExists': 'Já existe uma conta com este email',
  'auth.error.weakPassword': 'A senha é muito fraca',
  'auth.error.passwordRequirements':
    'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@$!%*?&)',
  'auth.error.passwordMismatch': 'As senhas não coincidem',
  'auth.error.invalidToken':
    'Token inválido ou expirado. Por favor, solicite um novo link de redefinição.',
  'auth.error.resetFailed': 'Falha ao redefinir senha. Por favor, tente novamente.',
  'auth.error.emailNotSent':
    'Não foi possível enviar o email de redefinição. Por favor, verifique seu endereço de email e tente novamente.',
  'auth.error.emailServiceError':
    'O serviço de email está temporariamente indisponível. Por favor, tente novamente mais tarde.',

  // Security indicators
  'auth.security.secureSession': 'Sessão Segura',
  'auth.security.encrypted': 'Criptografado',
  'auth.security.secure': 'Seguro',

  // Loading states
  'auth.loading.initializing': 'Iniciando...',
  'auth.loading.creatingAccount': 'Criando conta...',

  // Password requirements
  'auth.signUp.passwordHint': 'Mínimo de 8 caracteres',

  // Password strength
  'auth.signUp.passwordStrength.weak': 'Fraco',
  'auth.signUp.passwordStrength.fair': 'Razoável',
  'auth.signUp.passwordStrength.good': 'Bom',
  'auth.signUp.passwordStrength.strong': 'Forte',

  // 2FA
  'auth.2fa.title': 'Autenticação de Dois Fatores',
  'auth.2fa.totpPrompt': 'Digite o código de 6 dígitos do seu aplicativo autenticador.',
  'auth.2fa.backupPrompt': 'Digite um dos seus códigos de backup.',
  'auth.2fa.verify': 'Verificar',
  'auth.2fa.verifying': 'Verificando…',
  'auth.2fa.useBackup': 'Usar um código de backup',
  'auth.2fa.useAuthenticator': 'Usar aplicativo autenticador',
  'auth.2fa.verificationFailed': 'Verificação falhou',
  'auth.2fa.invalidTotp': 'Código do autenticador inválido. Por favor, tente novamente.',
  'auth.2fa.invalidBackup': 'Código de backup inválido. Por favor, tente novamente.',
  'auth.2fa.enabled': 'Autenticação de dois fatores ativada',
  'auth.2fa.invalidCode': 'Código inválido',
  'auth.2fa.checkApp': 'Por favor, verifique seu aplicativo autenticador e tente novamente.',
  'auth.2fa.backupCopied': 'Códigos de backup copiados',
  'auth.2fa.backupCopyFailed': 'Falha ao copiar códigos de backup',
  'auth.2fa.scanQr': 'Escanear QR Code',
  'auth.2fa.verifyCode': 'Verificar Código',
  'auth.2fa.backupCodes': 'Códigos de Backup',
  'auth.2fa.scanDescription': 'Escaneie este QR code com seu aplicativo autenticador.',
  'auth.2fa.verifyDescription': 'Digite o código de 6 dígitos do seu aplicativo autenticador.',
  'auth.2fa.backupDescription': 'Salve estes códigos de backup em um local seguro.',
  'auth.2fa.verifyAndEnable': 'Verificar e Ativar',
  'auth.2fa.done': 'Concluído',
  'auth.2fa.manualKey': 'Chave de entrada manual',
  'auth.2fa.copyAll': 'Copiar todos os códigos',
  'auth.2fa.backupWarning':
    'Cada código de backup pode ser usado apenas uma vez. Guarde-os com segurança.',
  'auth.2fa.qrAlt': 'QR Code 2FA',
  'auth.2fa.backupPlaceholder': 'Código de backup',

  // Loading
  'auth.loading.generic': 'Carregando...',
} as const;
