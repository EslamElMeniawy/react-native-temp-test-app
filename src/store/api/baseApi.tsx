import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Config from 'react-native-config';

import {type RootState} from '../../store';
import {getCurrentLocale} from '../../core';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: Config.API_URL,
    timeout: 60000,
    prepareHeaders: (headers, {getState}) => {
      const apiToken = (getState() as RootState).user.user?.apiToken;

      if (apiToken) {
        headers.set('Authorization', apiToken);
      }

      headers.set('Accept', 'application/json');
      headers.set('Accept-Language', getCurrentLocale());
      return headers;
    },
  }),
  endpoints: () => ({}),
  reducerPath: 'api',
  refetchOnMountOrArgChange: true,
  // TODO: If needed add tags to be used in invalidating API data.
  tagTypes: ['Notifications'],
});
