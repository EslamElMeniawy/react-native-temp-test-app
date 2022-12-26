import {api} from './baseApi';
import {ApiRequest, PagingResponse, Notification} from '../../types';
import {notificationsResponseToPaging} from '../../utils';

export const notificationsApi = api.injectEndpoints({
  endpoints: builder => ({
    // TODO: Change params, endpoint and method based on API requirements.
    getNotifications: builder.query<PagingResponse<Notification>, ApiRequest>({
      providesTags: result =>
        result && result?.data
          ? [
              // Provides a tag for each order in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.data.map(({id}) => ({
                type: 'Notifications' as const,
                id,
              })),
              {type: 'Notifications', id: 'PARTIAL-LIST'},
            ]
          : [{type: 'Notifications', id: 'PARTIAL-LIST'}],
      query: apiRequest => ({
        url: '/notifications',
        method: 'GET',
        params: apiRequest.params,
      }),
      transformResponse: (response: any) =>
        notificationsResponseToPaging(response),
    }),
    // TODO: Change params, endpoint and method based on API requirements.
    updateFcmToken: builder.mutation<any, ApiRequest>({
      query: apiRequest => ({
        url: '/fcm-token',
        method: 'POST',
        body: apiRequest.body,
      }),
    }),
    // TODO: Add more notifications related APIs here (mark read, ...etc).
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery: getNotificationsApi,
  useUpdateFcmTokenMutation: updateFcmTokenApi,
} = notificationsApi;
