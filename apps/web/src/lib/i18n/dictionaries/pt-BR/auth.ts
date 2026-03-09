/**
 * Portuguese (Brazil) translations - Auth
 */

export const auth = {
  // Common
  "auth.back": "voltar",
  "auth.or": "ou",
  "auth.terms": "termos",
  "auth.privacy": "privacidade",
  "auth.docs": "docs",
  "auth.continueWithGithub": "Continuar com GitHub",
  "auth.authenticated": "autenticado",

  // Sign in
  "auth.signIn.title": "Entre para continuar",
  "auth.signIn.subtitle": "Bem-vindo de volta, dev",
  "auth.signIn.email": "Endereço de email",
  "auth.signIn.password": "Senha",
  "auth.signIn.submit": "Entrar",
  "auth.signIn.forgotPassword": "Esqueceu a senha?",
  "auth.signIn.noAccount": "Novo por aqui?",
  "auth.signIn.createAccount": "Criar uma conta",

  // Sign up
  "auth.signUp.title": "Crie sua conta",
  "auth.signUp.subtitle": "Junte-se ao ProFile e crie seu perfil profissional.",
  "auth.signUp.name": "Nome completo",
  "auth.signUp.email": "Endereço de email",
  "auth.signUp.password": "Senha",
  "auth.signUp.confirmPassword": "Confirmar senha",
  "auth.signUp.submit": "Criar conta",
  "auth.signUp.hasAccount": "Já tem uma conta?",
  "auth.signUp.signIn": "Entrar",
  "auth.signUp.features.profiles": "Perfis bonitos para desenvolvedores",
  "auth.signUp.features.export": "Exportar para PDF e compartilhar",
  "auth.signUp.features.analytics": "Analytics em tempo real",
  "auth.signUp.features.github": "Integração com GitHub",

  // Forgot password
  "auth.forgotPassword.title": "Redefinir sua senha",
  "auth.forgotPassword.subtitle": "Digite seu email e enviaremos um link de redefinição.",
  "auth.forgotPassword.email": "Endereço de email",
  "auth.forgotPassword.submit": "Enviar link",
  "auth.forgotPassword.backToSignIn": "Voltar para entrar",
  "auth.forgotPassword.success": "Se a conta existir, um link de redefinição foi enviado para seu email.",

  // Reset password
  "auth.resetPassword.title": "Definir nova senha",
  "auth.resetPassword.subtitle": "Digite sua nova senha abaixo.",
  "auth.resetPassword.password": "Nova senha",
  "auth.resetPassword.confirmPassword": "Confirmar nova senha",
  "auth.resetPassword.submit": "Redefinir senha",
  "auth.resetPassword.success": "Senha redefinida com sucesso. Redirecionando para entrar...",
  "auth.resetPassword.backToSignIn": "Voltar para entrar",

  // Errors
  "auth.error.invalidCredentials": "Email ou senha inválidos",
  "auth.error.emailExists": "Já existe uma conta com este email",
  "auth.error.weakPassword": "A senha é muito fraca",
  "auth.error.passwordRequirements": "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@$!%*?&)",
  "auth.error.passwordMismatch": "As senhas não coincidem",
  "auth.error.invalidToken": "Token inválido ou expirado. Por favor, solicite um novo link de redefinição.",
  "auth.error.resetFailed": "Falha ao redefinir senha. Por favor, tente novamente.",
  "auth.error.emailNotSent": "Não foi possível enviar o email de redefinição. Por favor, verifique seu endereço de email e tente novamente.",
  "auth.error.emailServiceError": "O serviço de email está temporariamente indisponível. Por favor, tente novamente mais tarde.",

  // Security indicators
  "auth.security.secureSession": "Sessão Segura",
  "auth.security.encrypted": "Criptografado",
  "auth.security.secure": "Seguro",

  // Loading states
  "auth.loading.initializing": "Iniciando...",
  "auth.loading.creatingAccount": "Criando conta...",

  // Password requirements
  "auth.signUp.passwordHint": "Mínimo de 8 caracteres",
} as const;
