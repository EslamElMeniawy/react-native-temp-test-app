import type {AnyAction, Dispatch} from '@reduxjs/toolkit';

import {removeUser as removeLocalStorageUser} from '../core';
import {
  removeUser as removeStateUser,
  removeNotificationsCount,
} from '../store';
import {popToTop, replace} from '../navigation';

const getLogMessage = (message: string) => {
  return `## UserUtils: ${message}`;
};

export const removeUserDataLogout = (
  dispatch: Dispatch<AnyAction>,
  onSuccess?: () => void,
  onError?: () => void,
) => {
  console.info(getLogMessage('removeUserDataLogout'));
  const userRemoved = removeLocalStorageUser();
  console.info(getLogMessage('userRemoved'), userRemoved);

  if (userRemoved) {
    dispatch(removeStateUser());
    dispatch(removeNotificationsCount());
    popToTop();
    replace('Login');
    onSuccess?.();
  } else {
    onError?.();
  }
};
