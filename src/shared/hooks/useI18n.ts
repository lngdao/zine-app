import { useTranslation } from 'react-i18next';
import { AllTranslationKeys, AppLanguages } from '../i18n';

export const useI18n = () => {
  const { t: translate, i18n } = useTranslation();

  const currentLng = i18n.language;
  const languages = Object.keys(
    i18n.services.resourceStore.data,
  ) as AppLanguages[];
  const t = (key: AllTranslationKeys, args?: object) =>
    translate(key, { ...args }) as string;
  const changeLanguage = (lng: AppLanguages) => i18n.changeLanguage(lng);

  return { t, currentLng, languages, changeLanguage, i18n };
};
