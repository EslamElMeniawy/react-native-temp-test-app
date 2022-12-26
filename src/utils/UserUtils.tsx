import messaging from '@react-native-firebase/messaging';

import {removeUser as removeLocalStorageUser} from '../core';
import {store, removeUser as removeStateUser, api} from '../store';
import {reset} from '../navigation';

const getLogMessage = (message: string) => {
  return `## UserUtils: ${message}`;
};

export const removeUserDataLogout = async () => {
  console.info(getLogMessage('removeUserDataLogout'));
  const userRemoved = removeLocalStorageUser();
  console.info(getLogMessage('userRemoved'), userRemoved);
  await messaging().deleteToken();
  store.dispatch(removeStateUser());
  reset('Login');
  store.dispatch(api.util.resetApiState());
};
