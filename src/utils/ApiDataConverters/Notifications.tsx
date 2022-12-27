import {PagingResponse, Notification} from '../../types';

export const notificationsResponseToPaging = (
  notificationsResponse: any,
): PagingResponse<Notification> => ({
  // TODO: Change this mapping based on API response.
  currentPage: notificationsResponse.meta?.current_page,
  lastPage: notificationsResponse.meta?.last_page,
  data: _getNotifications(notificationsResponse.data),
});

const _getNotifications = (notifications?: any): Notification[] | undefined =>
  notifications?.map((notification: any) => _getNotification(notification));

const _getNotification = (notification: any): Notification => ({
  // TODO: Change this mapping based on API response.
  id: notification.id,
  key: `notification_${notification.id || 0}`,
  title: notification.title,
  message: notification.body,
});
