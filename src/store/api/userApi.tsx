import {api} from './baseApi';

export const userApi = api.injectEndpoints({
  endpoints: builder => ({
    // TODO: Change params, endpoint and method based on API requirements.
    getUser: builder.mutation<any, void>({
      query: () => '/user',
    }),
    // TODO: Add more user related APIs here (change password, edit profile, ...etc).
  }),
  overrideExisting: false,
});

export const {useGetUserMutation: getUser} = userApi;
