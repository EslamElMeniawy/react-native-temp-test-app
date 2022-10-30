import {api} from './baseApi';
import {ApiRequest} from '../../types';

export const authApi = api.injectEndpoints({
  endpoints: builder => ({
    // TODO: Change params, endpoint and method based on API requirements.
    login: builder.mutation<any, ApiRequest>({
      query: apiRequest => ({
        url: '/login',
        method: 'POST',
        body: apiRequest.body,
      }),
    }),
    // TODO: Change params, endpoint and method based on API requirements.
    logout: builder.mutation<any, void>({
      query: () => '/logout',
    }),
    // TODO: Add more auth related APIs here (register, ...etc).
  }),
  overrideExisting: false,
});

export const {useLoginMutation: login, useLogoutMutation: logout} = authApi;
