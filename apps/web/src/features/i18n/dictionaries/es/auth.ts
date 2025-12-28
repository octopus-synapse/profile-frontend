/**
 * Spanish translations - Auth
 */

export const auth = {
  // Sign in
  "auth.signIn.title": "Iniciar sesion en ProFile",
  "auth.signIn.subtitle": "Bienvenido de vuelta! Por favor inicie sesion para continuar.",
  "auth.signIn.email": "Correo electronico",
  "auth.signIn.password": "Contrasena",
  "auth.signIn.submit": "Iniciar sesion",
  "auth.signIn.forgotPassword": "Olvido su contrasena?",
  "auth.signIn.noAccount": "No tiene una cuenta?",
  "auth.signIn.createAccount": "Crear una cuenta",

  // Sign up
  "auth.signUp.title": "Crea tu cuenta",
  "auth.signUp.subtitle": "Unete a ProFile y crea tu perfil profesional.",
  "auth.signUp.name": "Nombre completo",
  "auth.signUp.email": "Correo electronico",
  "auth.signUp.password": "Contrasena",
  "auth.signUp.confirmPassword": "Confirmar contrasena",
  "auth.signUp.submit": "Crear cuenta",
  "auth.signUp.hasAccount": "Ya tiene una cuenta?",
  "auth.signUp.signIn": "Iniciar sesion",

  // Forgot password
  "auth.forgotPassword.title": "Restablecer tu contrasena",
  "auth.forgotPassword.subtitle":
    "Ingresa tu correo y te enviaremos un enlace para restablecer.",
  "auth.forgotPassword.email": "Correo electronico",
  "auth.forgotPassword.submit": "Enviar enlace",
  "auth.forgotPassword.backToSignIn": "Volver a iniciar sesion",

  // Errors
  "auth.error.invalidCredentials": "Correo o contrasena invalidos",
  "auth.error.emailExists": "Ya existe una cuenta con este correo",
  "auth.error.weakPassword": "La contrasena es muy debil",
  "auth.error.passwordMismatch": "Las contrasenas no coinciden",
} as const;
