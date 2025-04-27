// From: https://gitlab.com/os-team/libs/utils/-/blob/main/packages/i18next-react-native-language-detector/src/index.ts

import { getItem, setItem } from '@/libs/storage';
import { LanguageDetectorModule } from 'i18next';
import { Platform, NativeModules } from 'react-native';
import { STORAGE_LANGUAGE } from '@/config';
import { dayjs } from '@/libs/date';

const RNLanguageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  init: () => {},
  detect: () => {
    let lng;
    const savedLanguage = getItem(STORAGE_LANGUAGE);

    if (savedLanguage) {
      lng = savedLanguage;
    } else {
      const locale =
        Platform.OS === 'ios'
          ? NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
          : NativeModules.I18nManager.localeIdentifier;

      lng = locale.split('_')[0];
    }

    dayjs.locale(lng);
    return lng;
  },
  cacheUserLanguage: (lng) => {
    dayjs.locale(lng);
    setItem(STORAGE_LANGUAGE, lng);
  },
};

export default RNLanguageDetector;
