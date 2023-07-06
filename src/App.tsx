import React from 'react';
import {
  AppState,
  NativeModules,
  Platform,
  PermissionsAndroid,
  View,
} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {ScaledSheet} from 'react-native-size-matters';
import {configureLog} from 'roqay-react-native-common-components';
import Config from 'react-native-config';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {Provider as ReduxProvider, useDispatch} from 'react-redux';
import {getApplicationName} from 'react-native-device-info';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {withErrorBoundary} from 'react-error-boundary';
import crashlytics from '@react-native-firebase/crashlytics';

import {AppColors} from 'enums';
import {
  defaultChannelId,
  displayLocalNotification,
  localChannelId,
  paperTheme,
  processNotification,
} from 'utils';
import {setI18nConfig, translate, getUser} from 'core';
import {
  store,
  setUser as setStateUser,
  setIsInternetAvailable,
  setIsConnectionExpensive,
  removeIsConnectionExpensive,
} from 'store';
import {Notification} from 'types';

import {NavigationContainer} from 'navigation';
import {ErrorDialog, LoadingDialog, Toast, ErrorFallbackView} from 'components';

const AppContent = React.memo(() => {
  // #region Logger
  const getLogMessage = (message: string) => {
    return `## App: ${message}`;
  };
  // #endregion

  // #region Redux
  const dispatch = useDispatch();
  // #endregion

  // #region Variables
  const internetLostToastId = React.useRef<string | undefined>(undefined);
  // #endregion

  // #region State
  const [languageLoaded, setLanguageLoaded] = React.useState<boolean>(false);
  // #endregion

  // #region Setup
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
    setI18nConfig().then(() => setLanguageLoaded(true));
  }, []);

  // Add listener for network state change.
  React.useEffect(() => {
    /**
     * handleNetworkState
     *
     * Save network state to redux store.
     * Check if not internet then show connection lost toast.
     *
     * @param state The new network state to handle.
     */
    const handleNetworkState = (state: NetInfoState) => {
      console.info(getLogMessage('handleNetworkState'));
      console.info(getLogMessage('state'), state);

      // Check Internet available state.
      const isInternetAvailable =
        state.isConnected && state.isInternetReachable;
      console.info(getLogMessage('isInternetAvailable'), isInternetAvailable);

      dispatch(
        setIsInternetAvailable(
          isInternetAvailable == null ? true : isInternetAvailable,
        ),
      );

      // Check connection expensive state.
      const isConnectionExpensive = state.details?.isConnectionExpensive;
      console.info(
        getLogMessage('isConnectionExpensive'),
        isConnectionExpensive,
      );

      if (isConnectionExpensive === undefined) {
        dispatch(removeIsConnectionExpensive());
      } else {
        dispatch(setIsConnectionExpensive(isConnectionExpensive));
      }

      // Show internet lost toast if no Internet connection available.
      console.info(
        getLogMessage('internetLostToastId'),
        internetLostToastId.current,
      );

      if (isInternetAvailable === false) {
        if (internetLostToastId.current) {
          toast?.update(
            internetLostToastId.current,
            translate('internet_lost'),
            {
              type: 'danger',
              onClose: () => (internetLostToastId.current = undefined),
            },
          );
        } else {
          internetLostToastId.current = toast?.show(
            translate('internet_lost'),
            {
              type: 'danger',
              onClose: () => (internetLostToastId.current = undefined),
            },
          );
        }
      } else {
        if (internetLostToastId.current) {
          toast?.hide(internetLostToastId.current);
        }
      }
    };

    const subAppState = AppState.addEventListener(
      'change',
      async nextAppState => {
        console.info(getLogMessage('App state changed'));
        console.info(getLogMessage('nextAppState'), nextAppState);

        if (Platform.OS === 'ios' && nextAppState === 'active') {
          const newNetInfo = await NativeModules.RNCNetInfo.getCurrentState(
            'wifi',
          );

          console.info(getLogMessage('newNetInfo'), newNetInfo);

          NetInfo.fetch().then(state => {
            console.info(getLogMessage('state'), state);
            handleNetworkState(state);
          });
        }
      },
    );

    const unsubscribeNetState = NetInfo.addEventListener(state => {
      console.info(getLogMessage('Network state changed'));
      console.info(getLogMessage('state'), state);
      handleNetworkState(state);
    });

    return () => {
      if (subAppState) {
        subAppState.remove();
      }

      unsubscribeNetState();
    };
  }, [dispatch]);

  // Firebase messaging initialization.
  React.useEffect(() => {
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
        if (Platform.OS === 'android') {
          const androidPermissionStatus = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );

          console.info(
            getLogMessage('androidPermissionStatus'),
            androidPermissionStatus,
          );
        }

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

    checkMessagingAutoInitialize();
    checkMessagingPermission();
    createNotificationsChannels();
  }, []);

  // Foreground messages listener.
  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.info(getLogMessage('onMessage'), remoteMessage);
      const user = await getUser();

      if (user) {
        console.info(getLogMessage('User Available'));

        // Increase notifications count.
        const userWithNewNotificationsCount = {...user};

        userWithNewNotificationsCount.unreadNotificationsCount =
          (user.unreadNotificationsCount || 0) + 1;

        console.info(
          getLogMessage('userWithNewNotificationsCount'),
          userWithNewNotificationsCount,
        );

        dispatch(setStateUser(userWithNewNotificationsCount));

        // Show local notification.
        displayLocalNotification(remoteMessage);
      }
    });

    return unsubscribe;
  }, [dispatch]);

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
  // #endregion

  // #region UI
  return languageLoaded ? (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer />
      <ErrorDialog />
      <LoadingDialog />
      <Toast reference={ref => (toast = ref)} />
    </PaperProvider>
  ) : undefined;
  // #endregion
});

const App = React.memo(() => (
  <GestureHandlerRootView style={styles.gestureHandlerRoot}>
    <View style={styles.appContainer}>
      <ReduxProvider store={store}>
        <AppContent />
      </ReduxProvider>
    </View>
  </GestureHandlerRootView>
));

const AppWithErrorBoundary = withErrorBoundary(App, {
  fallback: <ErrorFallbackView />,
  onError(error, info) {
    console.error('ErrorBoundary::onError', error, info);

    // Log error to Firebase.
    if (Config.ENABLE_FIREBASE_LOG) {
      crashlytics().recordError(
        new Error(
          `## ERROR ## Message: ErrorBoundary::onError ## Data: ${JSON.stringify(
            {error, info},
          )}`,
        ),
      );
    }
  },
});

export default AppWithErrorBoundary;

const styles = ScaledSheet.create({
  gestureHandlerRoot: {
    flex: 1,
  },
  appContainer: {
    flex: 1,
    backgroundColor: AppColors.BACKGROUND,
  },
});
