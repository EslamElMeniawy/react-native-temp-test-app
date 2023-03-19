import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';
import {Animated, Dimensions, StyleSheet} from 'react-native';

import {
  type RootState,
  setUser as setStateUser,
  getUserApi,
  removeUser as removeStateUser,
} from '../../store';
import styles from './styles';
import {
  getLanguage,
  updateLanguage,
  getUser as getLocalStorageUser,
  setUser as setLocalStorageUser,
  removeUser as removeLocalStorageUser,
} from '../../core';
import type {RootStackScreenProps, User} from '../../types';
import {AppImages} from '../../enums';
import {isErrorWithStatus} from '../../utils';

import {Screen, Splash} from '../../components';

export default React.memo((props: RootStackScreenProps<'Splash'>) => {
  // #region Logger
  const getLogMessage = (message: string) => {
    return `## Splash Screen: ${message}`;
  };
  // #endregion

  // #region Redux
  const dispatch = useDispatch();
  const {user: stateUser} = useSelector((state: RootState) => state.user);
  // #endregion

  // #region Variables
  const {navigation} = props;
  const opacity = React.useRef(new Animated.Value(1));
  const translateY = React.useRef(new Animated.Value(0));
  // #endregion

  // #region State
  const [bootSplashIsVisible, setBootSplashIsVisible] =
    React.useState<boolean>(true);

  const [bootSplashLogoIsLoaded, setBootSplashLogoIsLoaded] =
    React.useState<boolean>(false);

  const [isLanguageLoaded, setLanguageLoaded] = React.useState<boolean>(false);

  const [isUserLoaded, setUserLoaded] = React.useState<boolean>(false);
  // #endregion

  // #region API
  const [callGetUserApi] = getUserApi();
  // #endregion

  // #region Setup
  React.useEffect(() => {
    /**
     * getSavedLanguage
     *
     * Load language from local storage then:
     * - Update app language and set "isLanguageLoaded" state variable.
     */
    const getSavedLanguage = async () => {
      console.info(getLogMessage('getSavedLanguage'));
      const language = await getLanguage();
      console.info(getLogMessage('language'), language);
      updateLanguage(language);
      setLanguageLoaded(true);
    };

    /**
     * getSavedUser
     *
     * Load user data from local storage then:
     * - If user available:
     *   - Set user to redux store.
     *   - Check if Internet connection available then:
     *     - If available call "getUpdatedUserData" to load updated user data from API.
     *     - Else set "isUserLoaded" state variable.
     * - Else:
     *   - Set "isUserLoaded" state variable.
     */
    const getSavedUser = async () => {
      console.info(getLogMessage('getSavedUser'));
      const user = await getLocalStorageUser();
      console.info(getLogMessage('user'), user);

      if (user) {
        setUserToReduxStore(user);
        getUpdatedUserData();
      } else {
        setUserLoaded(true);
      }
    };

    /**
     * setUserToReduxStore
     *
     * Set given user to redux store.
     *
     * @param user The user to set to redux store.
     */
    const setUserToReduxStore = (user: User) => {
      console.info(getLogMessage('setUserToReduxStore'), user);
      dispatch(setStateUser(user));
    };

    /**
     * getUpdatedUserData
     *
     * Call API to load updated user data then:
     * - Set user to local storage.
     * - Set user to redux store.
     * - Set "isUserLoaded" state variable.
     */
    const getUpdatedUserData = async () => {
      console.info(getLogMessage('getUpdatedUserData'));

      try {
        const user = await callGetUserApi().unwrap();
        const localStorageUser = await getLocalStorageUser();

        const userWithTokens = {
          ...user,
          apiToken: user.apiToken ? user.apiToken : localStorageUser?.apiToken,
          fcmToken: localStorageUser?.fcmToken,
        };

        console.info(getLogMessage('userWithTokens'), userWithTokens);
        setLocalStorageUser(userWithTokens);
        setUserToReduxStore(userWithTokens);
        setUserLoaded(true);
      } catch (error) {
        if (isErrorWithStatus(401, error)) {
          removeLocalStorageUser();
          dispatch(removeStateUser());
        }

        setUserLoaded(true);
      }
    };

    if (bootSplashLogoIsLoaded) {
      getSavedLanguage();
      getSavedUser();
    }
  }, [bootSplashLogoIsLoaded, callGetUserApi, dispatch]);

  React.useEffect(() => {
    const hideSplash = async () => {
      console.info(getLogMessage('hideSplash'));

      try {
        await RNBootSplash.hide();

        Animated.stagger(250, [
          Animated.spring(translateY.current, {
            useNativeDriver: true,
            toValue: -50,
          }),
          Animated.spring(translateY.current, {
            useNativeDriver: true,
            toValue: Dimensions.get('window').height,
          }),
        ]).start();

        Animated.timing(opacity.current, {
          useNativeDriver: true,
          toValue: 0,
          duration: 150,
          delay: 350,
        }).start(() => {
          setBootSplashIsVisible(false);
          openNextScreen();
        });
      } catch (error) {
        console.warn(
          getLogMessage('Error while calling "RNBootSplash.hide"'),
          error,
        );

        setBootSplashIsVisible(false);
        openNextScreen();
      }
    };

    const openNextScreen = () => {
      console.info(getLogMessage('openNextScreen'));
      navigation.replace(stateUser ? 'Home' : 'Login');
    };

    // Check if register visibility, language and user loaded then:
    // - If user available in state then:
    //   - Open home screen.
    // - Else:
    //   - Open login screen.
    if (isLanguageLoaded && isUserLoaded) {
      hideSplash();
    }
  }, [isLanguageLoaded, isUserLoaded, navigation, stateUser]);

  // #endregion

  // #region UI
  return (
    <Screen>
      {bootSplashIsVisible && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.bootSplash,
            {opacity: opacity.current},
          ]}>
          <Animated.Image
            source={AppImages.BOOT_SPLASH_LOGO}
            fadeDuration={0}
            resizeMode="contain"
            onLoadEnd={() => setBootSplashLogoIsLoaded(true)}
            style={[
              styles.logo,
              {transform: [{translateY: translateY.current}]},
            ]}
          />
        </Animated.View>
      )}
      {/* TODO: Remove this as it is used only for demonstration */}
      {!bootSplashIsVisible && <Splash />}
    </Screen>
  );
  // #endregion
});
