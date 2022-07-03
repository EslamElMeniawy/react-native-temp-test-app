import React from 'react';
import {View} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {ScaledSheet} from 'react-native-size-matters';
import {configureLog} from 'roqay-react-native-common-components';
import Config from 'react-native-config';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {useDispatch, useSelector} from 'react-redux';
import {getApplicationName} from 'react-native-device-info';

import AppColors from './enums/AppColors';
import {
  defaultChannelId,
  displayLocalNotification,
  localChannelId,
  paperTheme,
  processNotification,
} from './utils';
import {setI18nConfig, translate} from './core';
import {RootState} from './store';
import {setNotificationsCount} from './store/notificationsCount';
import Notification from './types/api/Notification';

import NavigationContainer from './navigation/NavigationContainer';
import ErrorDialog from './components/ErrorDialog';

const getLogMessage = (message: string) => {
  return `## App: ${message}`;
};

export default () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.user);

  const {notificationsCount} = useSelector(
    (state: RootState) => state.notificationsCount,
  );

  // Log initialization.
  React.useEffect(() => {
    const appName = getApplicationName();

    configureLog({
      appName: appName,
      firebaseLogLevels:
        Config.ENABLE_FIREBASE_LOG === 'true'
          ? ['LOG', 'WARN', 'ERROR']
          : undefined,
      isLocalLogEnable: Config.ENABLE_LOCAL_LOG === 'true',
    });
  }, []);

  // Localization initialization.
  React.useEffect(() => {
    setI18nConfig();
  }, []);

  // Firebase messaging initialization.
  React.useEffect(() => {
    checkMessagingAutoInitialize();
    checkMessagingPermission();
    createNotificationsChannels();
  }, []);

  /**
   * checkMessagingAutoInitialize
   *
   * Check if auto initialize not enabled then enable it.
   */
  const checkMessagingAutoInitialize = () => {
    console.info(getLogMessage('checkMessagingAutoInitialize'));

    if (!messaging().isAutoInitEnabled) {
      messaging().setAutoInitEnabled(true);
    }
  };

  /**
   * checkMessagingPermission
   *
   * Check if notifications permission is not granted then:
   * - Request notifications permission.
   */
  const checkMessagingPermission = async () => {
    console.info(getLogMessage('checkMessagingPermission'));

    try {
      const hasPermission = await messaging().hasPermission();
      console.info(getLogMessage('hasPermission'), hasPermission);

      if (!hasPermission) {
        const authStatus = await messaging().requestPermission();
        console.info(getLogMessage('authStatus'), authStatus);

        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        console.info(getLogMessage('enabled'), enabled);

        if (!enabled) {
          console.warn(getLogMessage('Notifications Disabled'));
        }
      }
    } catch (error) {
      console.error(getLogMessage('checkMessagingPermission Error'), error);
    }
  };

  /**
   * createNotificationsChannels
   *
   * Create default and local notifications channels
   * for delivering notifications through on Android 8+.
   */
  const createNotificationsChannels = () => {
    console.info(getLogMessage('createNotificationsChannels'));
    createNotificationsChannel(defaultChannelId);
    createNotificationsChannel(localChannelId);
  };

  /**
   * createNotificationsChannel
   *
   * Call "createChannel" from "PushNotification"
   * to handle creating the notifications channel.
   *
   * @param channelId The notifications channel Id to be created.
   */
  const createNotificationsChannel = (channelId: string) => {
    console.info(getLogMessage('createNotificationsChannel'), channelId);

    PushNotification.createChannel(
      {
        channelId: channelId,
        channelName: translate('app_name'),
        soundName: 'default',
      },
      created => console.info(getLogMessage('created'), channelId, created),
    );
  };

  // Foreground messages listener.
  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.info(getLogMessage('onMessage'), remoteMessage);

      if (user) {
        console.info(getLogMessage('User Available'));

        // Increase notifications count.
        dispatch(setNotificationsCount((notificationsCount || 0) + 1));

        // Show local notification.
        displayLocalNotification(remoteMessage);
      }
    });

    return unsubscribe;
  }, []);

  // Handle interaction with notification.
  React.useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.info(getLogMessage('onNotificationOpenedApp'), remoteMessage);

      processNotification({
        id: remoteMessage.messageId,
        key: remoteMessage.messageId,
        title: remoteMessage.notification?.title || remoteMessage.data?.title,
        message: remoteMessage.notification?.body || remoteMessage.data?.body,
      } as Notification);
    });

    // Check whether an initial notification is available.
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.info(getLogMessage('getInitialNotification'), remoteMessage);

        if (remoteMessage) {
          processNotification({
            id: remoteMessage.messageId,
            key: remoteMessage.messageId,
            title:
              remoteMessage.notification?.title || remoteMessage.data?.title,
            message:
              remoteMessage.notification?.body || remoteMessage.data?.body,
          } as Notification);
        }
      });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.appContainer}>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer />
        <ErrorDialog />
      </PaperProvider>
    </View>
  );
};

const styles = ScaledSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: AppColors.BACKGROUND,
  },
});
