import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import RNLanguageDetector from './plugins/RNLanguagedetector';

import * as translations from './locales';

type RecursivePaths<T> = T extends object
  ? {
      [K in keyof T]-?: T[K] extends object
        ? `${K & string}.${RecursivePaths<T[K]>}`
        : K & string;
    }[keyof T]
  : never;

const translationValues = Object.values(translations)[0];

export type AppLanguages = keyof typeof translations;
export type AllTranslationKeys = RecursivePaths<typeof translationValues>;

const resources = Object.keys(translations).reduce(
  (acc, curr) => {
    acc[curr] = { translation: translations[curr as AppLanguages] };
    return acc;
  },
  {} as Record<string, { translation: typeof translationValues }>,
);

i18n
  .use(RNLanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'vi',
    supportedLngs: ['vi', 'en'],
    resources,
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  });
