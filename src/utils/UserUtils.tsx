import messaging from '@react-native-firebase/messaging';

import {
  setUser as setLocalStorageUser,
  removeUser as removeLocalStorageUser,
} from '../core';
import {
  store,
  setUser as setStateUser,
  removeUser as removeStateUser,
  api,
  setErrorDialogMessage,
} from '../store';
import {reset} from '../navigation';
import {User} from '../types';

const getLogMessage = (message: string) => {
  return `## UserUtils: ${message}`;
};
export const saveUserDataOpenHome = async (
  user: User,
  errorMessage?: string,
) => {
  console.info(getLogMessage('saveUserDataOpenHome'), user, errorMessage);

  try {
    const userSaved = await setLocalStorageUser(user);

    if (userSaved) {
      store.dispatch(setStateUser(user));
      reset('Home');
    } else {
      if (errorMessage) {
        store.dispatch(setErrorDialogMessage(errorMessage));
      }
    }
  } catch (error) {
    console.error(getLogMessage('error'), error);

    if (errorMessage) {
      store.dispatch(setErrorDialogMessage(errorMessage));
    }
  }
};

export const saveUserData = async (
  user: User,
  errorMessage?: string,
  onFinish?: () => void,
) => {
  console.info(getLogMessage('saveUserData'), user, errorMessage);

  try {
    const userSaved = await setLocalStorageUser(user);

    if (userSaved) {
      store.dispatch(setStateUser(user));
      onFinish?.();
    } else {
      if (errorMessage) {
        store.dispatch(setErrorDialogMessage(errorMessage));
      }
    }
  } catch (error) {
    console.error(getLogMessage('error'), error);

    if (errorMessage) {
      store.dispatch(setErrorDialogMessage(errorMessage));
    }
  }
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
