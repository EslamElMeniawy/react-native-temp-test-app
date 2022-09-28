import {configureStore} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import Config from 'react-native-config';

import userReducer from './user';
import notificationsCountReducer from './notificationsCount';
import errorDialogMessageReducer from './errorDialogMessage';
import networkStateReducer from './networkState';
import {api} from './api/baseApi';

export const store = configureStore({
  reducer: {
    user: userReducer,
    notificationsCount: notificationsCountReducer,
    errorDialogMessage: errorDialogMessageReducer,
    networkState: networkStateReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: getDefaultMiddleware => {
    const middleware = getDefaultMiddleware().concat(api.middleware);

    const middlewareWithLogger =
      Config.ENABLE_LOCAL_LOG === 'true'
        ? middleware.concat(logger)
        : middleware;

    return middlewareWithLogger;
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export * from './user';
export * from './notificationsCount';
export * from './errorDialogMessage';
export * from './networkState';
