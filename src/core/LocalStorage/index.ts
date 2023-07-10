import {MMKVLoader} from 'react-native-mmkv-storage';

import LocalStorageKeys from './keys';
import {AppLanguages} from 'enums';
import type {User} from 'types';

const getLogMessage = (message: string) => {
  return `## LocalStorage: ${message}`;
};

const MMKV = new MMKVLoader().withEncryption().initialize();

const setString = async (key: LocalStorageKeys, value: string) => {
  console.info(getLogMessage('setString'), key, value);

  try {
    const result = await MMKV.setStringAsync(key, value);
    console.info(getLogMessage('result'), result);
    return result;
  } catch (e) {
    console.error(getLogMessage('Error setString'), key, value, e);
    return null;
  }
};

const getString = async (key: LocalStorageKeys) => {
  console.info(getLogMessage('getString'), key);

  try {
    const string = await MMKV.getStringAsync(key);
    return string;
  } catch (e) {
    console.error(getLogMessage('Error getString'), key, e);
    return null;
  }
};

const setMap = async (key: LocalStorageKeys, value: object) => {
  console.info(getLogMessage('setMap'), key, value);

  try {
    const result = await MMKV.setMapAsync(key, value);
    console.info(getLogMessage('result'), result);
    return result;
  } catch (e) {
    console.error(getLogMessage('Error setMap'), key, value, e);
    return null;
  }
};

const getMap = async (key: LocalStorageKeys) => {
  console.info(getLogMessage('getMap'), key);

  try {
    const map = await MMKV.getMapAsync(key);
    return map;
  } catch (e) {
    console.error(getLogMessage('Error getMap'), key, e);
    return null;
  }
};

// const setBoolean = async (key: LocalStorageKeys, value: boolean) => {
//   console.info(getLogMessage('setBoolean'), key, value);

//   try {
//     const result = await MMKV.setBoolAsync(key, value);
//     console.info(getLogMessage('result'), result);
//     return result;
//   } catch (e) {
//     console.error(getLogMessage('Error setBoolean'), key, value, e);
//     return null;
//   }
// };

// const getBoolean = async (key: LocalStorageKeys) => {
//   console.info(getLogMessage('getBoolean'), key);

//   try {
//     const bool = await MMKV.getBoolAsync(key);
//     return bool;
//   } catch (e) {
//     console.error(getLogMessage('Error getBoolean'), key, e);
//     return null;
//   }
// };

// const setInt = async (key: LocalStorageKeys, value: number) => {
//   console.info(getLogMessage('setInt'), key, value);

//   try {
//     const result = await MMKV.setIntAsync(key, value);
//     console.info(getLogMessage('result'), result);
//     return result;
//   } catch (e) {
//     console.error(getLogMessage('Error setInt'), key, value, e);
//     return null;
//   }
// };

// const getInt = async (key: LocalStorageKeys) => {
//   console.info(getLogMessage('getInt'), key);

//   try {
//     const int = await MMKV.getIntAsync(key);
//     return int;
//   } catch (e) {
//     console.error(getLogMessage('Error getInt'), key, e);
//     return null;
//   }
// };

const removeItem = (key: LocalStorageKeys) => {
  console.info(getLogMessage('removeItem'), key);
  return MMKV.removeItem(key);
};

export const getLanguage = async () => {
  console.info(getLogMessage('getLanguage'));
  const language = await getString(LocalStorageKeys.LANGUAGE);
  console.info(getLogMessage('language'), language);
  return language ? (language as AppLanguages) : null;
};

export const setLanguage = async (language: AppLanguages) => {
  console.info(getLogMessage('setLanguage'), language);
  const languageSaved = await setString(LocalStorageKeys.LANGUAGE, language);
  console.info(getLogMessage('languageSaved'), languageSaved);
  return languageSaved;
};

export const getUser = async () => {
  console.info(getLogMessage('getUser'));
  const user = await getMap(LocalStorageKeys.USER);
  console.info(getLogMessage('user'), user);
  return user ? (user as User) : null;
};

export const setUser = async (user: User) => {
  console.info(getLogMessage('setUser'), user);
  const userSaved = await setMap(LocalStorageKeys.USER, user);
  console.info(getLogMessage('userSaved'), userSaved);
  return userSaved;
};

export const removeUser = () => {
  console.info(getLogMessage('removeUser'));
  const userRemoved = removeItem(LocalStorageKeys.USER);
  console.info(getLogMessage('userRemoved'), userRemoved);
  return userRemoved;
};
