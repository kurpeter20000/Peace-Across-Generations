// Interface strings live in one dictionary per language so Arabic (RTL)
// and South Sudanese languages can be added later without touching layouts.
import en from './en.json';

export const languages = { en: { name: 'English', dir: 'ltr' } } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

const dictionaries: Record<Lang, typeof en> = { en };

export function t(key: keyof typeof en, lang: Lang = defaultLang): string {
  return dictionaries[lang][key] ?? en[key];
}
