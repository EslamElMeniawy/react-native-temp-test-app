import {Notification} from '../../types';

export const notificationsResponseToNotificationsList = (
  notificationsResponse: any,
): Notification[] | undefined =>
  // TODO: Change this based on API response.
  notificationsResponse?.notifications?.map((notification: any) => ({
    id: notification.id,
    key: `notification_${notification.id || 0}`,
    title: notification.title,
    message: notification.body,
  }));
