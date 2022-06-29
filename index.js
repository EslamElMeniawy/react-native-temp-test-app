/**
 * @format
 */

import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider as ReduxProvider} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import {name as appName} from './app.json';
import {store} from './src/store';
import {processNotification} from './src/utils';

import App from './src/App';

enableScreens();

const getLogMessage = message => {
  return `## index: ${message}`;
};

// Register background handler for firebase messages.
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.info(getLogMessage('BackgroundMessageHandler'), remoteMessage);
});

// Configuration for local notifications.
PushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened.
  onNotification(notification) {
    console.info(getLogMessage('onNotification'), notification);

    processNotification({
      id: notification.id,
      key: notification.id,
      title: notification.data.title,
      message: notification.message,
    });

    // (required) Called when a remote is received or opened, or local notification is opened.
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
});

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore.
    return null;
  }

  return (
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  );
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
