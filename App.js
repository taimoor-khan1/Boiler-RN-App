/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useRef, useState } from 'react';
import { AppNavigator } from './src/config/Routes';
import { Provider } from 'react-redux';
import store from './src/store/index';
import messaging from '@react-native-firebase/messaging';
import { Alert, Image, Text, View } from 'react-native';
import NotificationPopup from 'react-native-push-notification-popup';
import styles from './src/assets/styles';

import { StatusBarComponent } from './src/components/StatusBar/CustomStatusBar';

const App = () => {
  const popupRef = useRef(null);
  const [popupState, setPopupState] = useState(null);
  // Register background handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Message handled in the ios!', remoteMessage);
  });
  useEffect(async () => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (global.channelId !== remoteMessage?.data?.channel_id) {
        console.log('foreground!', remoteMessage);
        setPopupState(remoteMessage?.data);
        console.log('poup', popupRef?.current);
        popupRef?.current?.show({
          appTitle: 'Saiyan Stocks',
          title: remoteMessage?.data?.data?.title,
          body: remoteMessage?.data?.data?.body,
          slideOutTime: 3000,
        });
      }
    });

    return unsubscribe;
  }, []);

  const renderCustomPopup = () => {
    return (
      <View style={[styles.alertWrapper, styles.cardShadow]}>
        <View style={{ flex: 0.8 }}>
          <Text style={styles.alertTitle}>{popupState?.title}</Text>
          <Text style={styles.alertText}>{popupState?.body}</Text>
        </View>
      </View>
    );
  };

  return (
    <Provider store={store}>
      <StatusBarComponent />
      <AppNavigator />
      <NotificationPopup
        ref={popupRef}
        renderPopupContent={() => renderCustomPopup()}
        shouldChildHandleResponderStart={true}
        shouldChildHandleResponderMove={true}
      />
    </Provider>
  );
};

export default App;

