import type {FetchBaseQueryError} from '@reduxjs/toolkit/query';
import type {SerializedError} from '@reduxjs/toolkit';

import {store, setErrorDialogMessage} from '../store';
import {translate} from '../core';

const getLogMessage = (message: string) => {
  return `## ErrorHandlingUtils: ${message}`;
};

const isFetchBaseQueryError = (
  error: unknown,
): error is FetchBaseQueryError => {
  console.info(getLogMessage('isFetchBaseQueryError'), error);
  return typeof error === 'object' && error != null && 'status' in error;
};

const isErrorWithMessage = (error: unknown): error is {message: string} => {
  console.info(getLogMessage('isErrorWithMessage'), error);

  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
};

const showMessageError = (error: {message: string}) => {
  console.info(getLogMessage('showMessageError'), error);
  const errorMessage = getMessageError(error);
  console.info(getLogMessage('errorMessage'), errorMessage);
  store.dispatch(setErrorDialogMessage(errorMessage));
};

const showDataError = (data: any, defaultErrorKey: string) => {
  console.info(getLogMessage('showDataError'), data, defaultErrorKey);
  const errorMessage = data ? getDataError(data) : undefined;
  console.info(getLogMessage('errorMessage'), errorMessage);

  store.dispatch(
    setErrorDialogMessage(
      errorMessage ? errorMessage : translate(defaultErrorKey),
    ),
  );
};

const getDataError = (data: any) => {
  console.info(getLogMessage('getDataError'), data);

  if (typeof data === 'object') {
    if ('error' in data && data.error && typeof data.error === 'string') {
      return data.error;
    } else if (
      'errors' in data &&
      data.errors &&
      typeof data.errors === 'string'
    ) {
      return data.errors;
    } else if (
      'errors' in data &&
      data.errors &&
      typeof data.errors === 'object' &&
      'message' in data.errors &&
      data.errors.message &&
      data.errors.message.length
    ) {
      return data.errors.message.join('\n');
    } else if ('message' in data && data.message) {
      return data.message;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};

const getMessageError = (error: {message: string}) => {
  console.info(getLogMessage('getMessageError'), error);

  const isNetWorkError =
    error.message.toLowerCase().indexOf('network') > -1 ||
    error.message.toLowerCase().indexOf('timeout') > -1 ||
    error.message.toLowerCase().indexOf('aborted') > -1;

  return isNetWorkError ? translate('network_error') : error.message;
};

export const handleResponseErrorInDialog = (
  response: any,
  defaultErrorKey: string,
) => {
  console.info(getLogMessage('handleErrorInDialog'), response, defaultErrorKey);
  showDataError(response, defaultErrorKey);
};

export const handleErrorInDialog = (
  error: unknown,
  defaultErrorKey: string,
  shouldSkip401: boolean = false,
) => {
  console.info(
    getLogMessage('handleErrorInDialog'),
    error,
    defaultErrorKey,
    shouldSkip401,
  );

  if (isFetchBaseQueryError(error)) {
    if (error.status === 401 && !shouldSkip401) {
      store.dispatch(setErrorDialogMessage(translate('session_expired')));
    } else {
      showDataError(error.data as any, defaultErrorKey);
    }
  } else if (isErrorWithMessage(error)) {
    showMessageError(error);
  } else {
    store.dispatch(setErrorDialogMessage(translate(defaultErrorKey)));
  }
};

export const isErrorWithStatus = (status: number, error: unknown) =>
  isFetchBaseQueryError(error) && error.status === status;

export const handle401ErrorOnly = (error: unknown) => {
  if (isErrorWithStatus(401, error)) {
    store.dispatch(setErrorDialogMessage(translate('session_expired')));
  }
};

export const getResponseErrorMessage = (response: any): string | undefined => {
  console.info(getLogMessage('getResponseErrorMessage'), response);
  const errorMessage = getDataError(response);
  console.info(getLogMessage('errorMessage'), errorMessage);
  return errorMessage;
};

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError,
): string | undefined => {
  if (isFetchBaseQueryError(error)) {
    if (error.status === 401) {
      return translate('session_expired');
    } else if (
      error.status === 'TIMEOUT_ERROR' ||
      (error.status === 'FETCH_ERROR' &&
        error.error &&
        error.error.toLocaleLowerCase().indexOf('network') > -1)
    ) {
      return translate('network_error');
    } else {
      return getDataError(error.data as any);
    }
  } else if (isErrorWithMessage(error)) {
    return getMessageError(error);
  } else {
    return undefined;
  }
};

export const getErrorsObject = (
  error: FetchBaseQueryError,
): Record<string, string[]> | undefined => {
  const data = error.data as any;

  if (
    typeof data === 'object' &&
    'errors' in data &&
    data.errors &&
    typeof data.errors === 'object' &&
    Object.keys(data.errors).length
  ) {
    return data.errors;
  }

  return undefined;
};
