// apps/web/src/shared/config/constants.ts

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
} as const;
export const LANGUAGES = {
  ES: "es",
  EN: "en",
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "CredentialsSignin",
  UNEXPECTED: "UnexpectedError",
} as const;

export const I18N_NAMESPACES = {
  AUTH: "Auth",
  NAVIGATION: "Navigation",
} as const;

// (Opcional) Si quieres tipar fuertemente las llaves de los diccionarios
export const AUTH_KEYS = {
  EMAIL_LABEL: "emailLabel",
  EMAIL_PLACEHOLDER: "emailPlaceholder",
  EMAIL_REQUIRED: "emailRequired",
  PASSWORD_LABEL: "passwordLabel",
  PASSWORD_PLACEHOLDER: "passwordPlaceholder",
  PASSWORD_REQUIRED: "passwordRequired",
  REMEMBER_ME: "rememberMe",
  INVALID_CREDENTIALS: "invalidCredentials",
  UNEXPECTED_ERROR: "unexpectedError",
} as const;
