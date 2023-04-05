import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import {getBundleId} from 'react-native-device-info';

import {Notification} from '../types';
import {store, setUser as setStateUser /*notificationsApi*/} from '../store';
import {AppColors} from '../enums';

const getLogMessage = (message: string) => {
  return `## NotificationUtils: ${message}`;
};

const packageName: string = getBundleId();
export const defaultChannelId: string = `${packageName}.default_notification_channel`;
export const localChannelId: string = `${packageName}.local_notification_channel`;

export const processNotification = (notification: Notification) => {
  console.info(getLogMessage('processNotification'), notification);

  // Clear notification.
  if (notification.id && typeof notification.id === 'string') {
    PushNotification.cancelLocalNotification(notification.id);

    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeDeliveredNotifications([notification.id]);
    }

    // Call mark notification read API.
    // TODO: Add this after the API is done.
    // store.dispatch(
    //   notificationsApi.endpoints.markNotificationRead.initiate({
    //     pathVar: notification.id,
    //   }),
    // );
  }

  // Set new badge.
  const {user: stateUser} = store.getState().user;
  console.info(getLogMessage('stateUser'), stateUser);
  const newNotificationsCount = (stateUser?.unreadNotificationsCount || 1) - 1;
  PushNotification.setApplicationIconBadgeNumber(newNotificationsCount);

  if (stateUser) {
    // Set new notifications count to redux state.
    const userWithNewNotificationsCount = {...stateUser};

    userWithNewNotificationsCount.unreadNotificationsCount =
      newNotificationsCount;

    console.info(
      getLogMessage('userWithNewNotificationsCount'),
      userWithNewNotificationsCount,
    );

    store.dispatch(setStateUser(userWithNewNotificationsCount));

    console.info(getLogMessage('User Available'));

    // Open notification related screen.
    openNotificationRelatedScreen(notification);
  }
};

export const openNotificationRelatedScreen = (notification: Notification) => {
  console.info(getLogMessage('openNotificationRelatedScreen'), notification);
  // TODO: Determine screen to open and navigate to it.
};

export const displayLocalNotification = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  console.info(getLogMessage('displayLocalNotification'), remoteMessage);
  const title = remoteMessage.notification?.title || remoteMessage.data?.title;
  console.info(getLogMessage('title'), title);
  const body = remoteMessage.notification?.body || remoteMessage.data?.body;
  console.info(getLogMessage('body'), body);

  // If notification body available show local notification.
  if (body) {
    PushNotification.localNotification({
      title: title,
      message: body,
      bigText: body,
      color: AppColors.PRIMARY,
      channelId: localChannelId,
      soundName: 'default',
      messageId: remoteMessage.messageId,
      userInfo: remoteMessage.data,
    });
  }
};
