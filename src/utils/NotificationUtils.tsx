import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {useDispatch, useSelector} from 'react-redux';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';

import Notification from '../types/api/Notification';
import {RootState} from '../store';
import {
  setNotificationsCount,
  removeNotificationsCount,
} from '../store/notificationsCount';
import AppColors from '../enums/AppColors';

const getLogMessage = (message: string) => {
  return `## NotificationUtils: ${message}`;
};

// TODO: Replace with default notification channel id.
export const defaultChannelId: string = 'default_notification_channel';

// TODO: Replace with local notification channel id.
export const localChannelId: string = 'local_notification_channel';

export const processNotification = (notification: Notification) => {
  console.info(getLogMessage('processNotification'), notification);

  // Clear notification.
  if (notification.id && typeof notification.id === 'string') {
    PushNotification.cancelLocalNotification(notification.id);

    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeDeliveredNotifications([notification.id]);
    }
  }

  // Set new badge.
  const {notificationsCount} = useSelector(
    (state: RootState) => state.notificationsCount,
  );

  const newNotificationsCount = (notificationsCount || 1) - 1;
  PushNotification.setApplicationIconBadgeNumber(newNotificationsCount);

  // Set new notifications count to redux state.
  const dispatch = useDispatch();

  if (newNotificationsCount > 0) {
    dispatch(setNotificationsCount(newNotificationsCount));
  } else {
    dispatch(removeNotificationsCount());
  }

  // Get user.
  const {user} = useSelector((state: RootState) => state.user);
  console.info(getLogMessage('user'), user);

  if (user) {
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
