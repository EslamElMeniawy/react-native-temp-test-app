import type {FetchBaseQueryError} from '@reduxjs/toolkit/query';
import type {AnyAction, Dispatch, SerializedError} from '@reduxjs/toolkit';

import {setErrorDialogMessage} from '../store';
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

const showMessageError = (
  dispatch: Dispatch<AnyAction>,
  error: {message: string},
) => {
  console.info(getLogMessage('showMessageError'), error);

  const isNetWorkError =
    error.message.toLowerCase().indexOf('network') > -1 ||
    error.message.toLowerCase().indexOf('timeout') > -1;

  dispatch(
    setErrorDialogMessage(
      isNetWorkError ? translate('network_error') : error.message,
    ),
  );
};

const showDataError = (
  dispatch: Dispatch<AnyAction>,
  data: any,
  defaultErrorKey: string,
) => {
  console.info(getLogMessage('showDataError'), data, defaultErrorKey);
  const errorMessage = getDataError(data);
  console.info(getLogMessage('errorMessage'), errorMessage);

  dispatch(
    setErrorDialogMessage(
      errorMessage ? errorMessage : translate(defaultErrorKey),
    ),
  );
};

const getDataError = (data: any) => {
  console.info(getLogMessage('getDataError'), data);

  // TODO: Change error keys based on API.
  if ('error' in data && data.error) {
    return data.error;
  } else if ('errors_str' in data && data.errors_str) {
    return data.errors_str;
  } else if ('message' in data && data.message) {
    return data.message;
  } else {
    return undefined;
  }
};

const getMessageError = (error: {message: string}) => {
  console.info(getLogMessage('getMessageError'), error);

  const isNetWorkError =
    error.message.toLowerCase().indexOf('network') > -1 ||
    error.message.toLowerCase().indexOf('timeout') > -1;

  return isNetWorkError ? translate('network_error') : error.message;
};

export const handleResponseErrorInDialog = (
  dispatch: Dispatch<AnyAction>,
  response: any,
  defaultErrorKey: string,
) => {
  console.info(getLogMessage('handleErrorInDialog'), response, defaultErrorKey);
  showDataError(dispatch, response, defaultErrorKey);
};

export const handleErrorInDialog = (
  dispatch: Dispatch<AnyAction>,
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
    if (error.status == 401 && !shouldSkip401) {
      dispatch(setErrorDialogMessage(translate('session_expired')));
    } else {
      showDataError(dispatch, error.data as any, defaultErrorKey);
    }
  } else if (isErrorWithMessage(error)) {
    showMessageError(dispatch, error);
  } else {
    dispatch(setErrorDialogMessage(translate(defaultErrorKey)));
  }
};

export const is401Error = (error: unknown) =>
  isFetchBaseQueryError(error) && error.status == 401;

export const handle401ErrorOnly = (
  dispatch: Dispatch<AnyAction>,
  error: unknown,
) => {
  if (is401Error(error)) {
    dispatch(setErrorDialogMessage(translate('session_expired')));
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
    if (error.status == 401) {
      return translate('session_expired');
    } else {
      return getDataError(error.data as any);
    }
  } else if (isErrorWithMessage(error)) {
    return getMessageError(error);
  } else {
    return undefined;
  }
};
