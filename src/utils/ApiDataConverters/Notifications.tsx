import {PagingResponse, Notification} from '../../types';

export const notificationsResponseToPaging = (
  notificationsResponse: any,
): PagingResponse<Notification> => ({
  // TODO: Change this mapping based on API response.
  currentPage: notificationsResponse.paging?.current_page,
  lastPage: notificationsResponse.paging?.last_page,
  data: getNotifications(notificationsResponse.data),
});

const getNotifications = (notifications?: any): Notification[] | undefined =>
  notifications?.map((notification: any) => ({
    // TODO: Change this mapping based on API response.
    id: notification.id,
    key: `notification_${notification.id || 0}`,
    title: notification.title,
    message: notification.body,
  }));
