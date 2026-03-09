/**
 * @profile/i18n
 *
 * Internationalization package for Profile.
 * Supports: English (en), Portuguese Brazil (pt-BR)
 *
 * Usage:
 *   import { t, setLocale, getLocale, type Locale } from '@profile/i18n';
 *
 *   setLocale('pt-BR');
 *   console.log(t('common.save')); // "Salvar"
 */

export { en } from "./locales/en";
export { ptBR } from "./locales/pt-BR";
export {
 t,
 setLocale,
 getLocale,
 type Locale,
 type TranslationKey,
} from "./core";
export type { Translations } from "./types";
