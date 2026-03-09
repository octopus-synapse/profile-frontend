/**
 * Translation types for type-safe i18n.
 *
 * All locales must implement this interface.
 */

export interface Translations {
 common: {
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  create: string;
  loading: string;
  error: string;
  success: string;
  confirm: string;
  back: string;
  next: string;
  previous: string;
  search: string;
  filter: string;
  sort: string;
  refresh: string;
  close: string;
  open: string;
  view: string;
  download: string;
  upload: string;
  copy: string;
  share: string;
  settings: string;
  help: string;
  logout: string;
  login: string;
  signup: string;
 };

 auth: {
  email: string;
  password: string;
  confirmPassword: string;
  forgotPassword: string;
  resetPassword: string;
  rememberMe: string;
  loginTitle: string;
  signupTitle: string;
  loginButton: string;
  signupButton: string;
  noAccount: string;
  hasAccount: string;
  invalidCredentials: string;
  emailRequired: string;
  passwordRequired: string;
  passwordMismatch: string;
  passwordTooShort: string;
  emailInvalid: string;
 };

 profile: {
  title: string;
  name: string;
  bio: string;
  location: string;
  website: string;
  avatar: string;
  coverPhoto: string;
  editProfile: string;
  viewProfile: string;
  followers: string;
  following: string;
  posts: string;
 };

 resume: {
  title: string;
  create: string;
  edit: string;
  delete: string;
  duplicate: string;
  export: string;
  import: string;
  preview: string;
  sections: {
   experience: string;
   education: string;
   skills: string;
   projects: string;
   certifications: string;
   languages: string;
   awards: string;
   publications: string;
   references: string;
   summary: string;
   contact: string;
  };
 };

 errors: {
  generic: string;
  notFound: string;
  unauthorized: string;
  forbidden: string;
  serverError: string;
  networkError: string;
  validationError: string;
  timeout: string;
 };

 notifications: {
  saved: string;
  deleted: string;
  created: string;
  updated: string;
  copied: string;
  shared: string;
  uploaded: string;
  downloaded: string;
 };
}
