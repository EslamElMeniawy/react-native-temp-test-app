import {Platform, NativeModules, I18nManager} from 'react-native';
import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import RNRestart from 'react-native-restart';
import memoize from 'lodash.memoize';

import AppLanguages from '../../enums/AppLanguages';

const getLogMessage = (message: string) => {
  return `## I18n: ${message}`;
};

const translationGetters = {
  ar: () => require('../../translations/ar.json'),
  en: () => require('../../translations/en.json'),
};

// Get device language.
const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier;

const defaultLocale: string =
  deviceLanguage.toLowerCase().indexOf(AppLanguages.ARABIC) > -1
    ? AppLanguages.ARABIC
    : AppLanguages.ENGLISH;

export const setI18nConfig = () => {
  console.info(getLogMessage('setI18nConfig'));
  const locales = RNLocalize.getLocales();

  if (Array.isArray(locales)) {
    I18n.locale = locales[0].languageTag;
  }

  // If an English translation is not available in en.js, it will look inside ar.js
  I18n.fallbacks = true;

  // It will convert HOME_noteTitle to "HOME note title"
  // if the value of HOME_noteTitle doesn't exist in any of the translation files.
  I18n.missingBehaviour = 'guess';

  // Clear translation cache.
  translate?.cache?.clear?.();

  // If the current locale in device is not en or ar.
  I18n.defaultLocale = defaultLocale;

  // Set the locale.
  I18n.locale = defaultLocale;
  I18nManager.allowRTL(defaultLocale === AppLanguages.ARABIC);
  I18nManager.forceRTL(defaultLocale === AppLanguages.ARABIC);

  // Define the supported translations.
  I18n.translations = {
    [AppLanguages.ARABIC]: translationGetters.ar(),
    [AppLanguages.ENGLISH]: translationGetters.en(),
  };
};

export const updateLanguage = (language?: AppLanguages | null) => {
  console.info(getLogMessage('updateLanguage'), language);
  const locale = language || defaultLocale;

  // Clear translation cache.
  translate?.cache?.clear?.();

  // Set the locale.
  I18n.locale = locale;
  I18nManager.allowRTL(locale === AppLanguages.ARABIC);
  I18nManager.forceRTL(locale === AppLanguages.ARABIC);

  if (locale === AppLanguages.ARABIC && !I18nManager.isRTL) {
    RNRestart.Restart();
  }

  if (locale === AppLanguages.ENGLISH && I18nManager.isRTL) {
    RNRestart.Restart();
  }
};

export const getCurrentLocale = () => I18n.locale;

export const translate = memoize(
  key => I18n.t(key),
  key => key,
);
