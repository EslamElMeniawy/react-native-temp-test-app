import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';

import {
  type RootState,
  setUser as setStateUser,
  getUser as getUserApi,
  removeUser as removeStateUser,
} from '../../store';
import {
  getLanguage,
  updateLanguage,
  getUser as getLocalStorageUser,
  setUser as setLocalStorageUser,
  removeUser as removeLocalStorageUser,
} from '../../core';
import {RootStackScreenProps, RootStackParamList, User} from '../../types';
import {is401Error, userResponseToUser} from '../../utils';

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

  // #region State
  const [isLanguageLoaded, setLanguageLoaded] = React.useState<boolean>(false);
  const [isUserLoaded, setUserLoaded] = React.useState<boolean>(false);
  // #endregion

  // #region API
  const [callGetUserApi] = getUserApi();
  // #endregion

  // #region Setup
  // TODO: Move this code to next screen after splash.
  // TODO: Or keep it here if have different splash design.
  // Check if splash is displaying then hide it.
  React.useEffect(() => {
    RNBootSplash.getVisibilityStatus()
      .then(status => {
        console.info(getLogMessage('status'), status);

        if (status === 'visible') {
          RNBootSplash.hide({fade: true});
        }
      })
      .catch(error =>
        console.warn(
          getLogMessage('Error executing "RNBootSplash.getVisibilityStatus"'),
          error,
        ),
      );
  }, []);

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
      updateLanguage(language);
      setLanguageLoaded(true);
    };

    getSavedLanguage();
  }, []);

  React.useEffect(() => {
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

    getSavedUser();
  }, []);

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
      const userResponse = await callGetUserApi().unwrap();
      handleUserResponse(userResponse);
    } catch (error) {
      if (is401Error(error)) {
        removeLocalStorageUser();
        dispatch(removeStateUser());
      }

      setUserLoaded(true);
    }
  };

  const handleUserResponse = async (response: any) => {
    console.info(getLogMessage('handleUserResponse'), response);

    // TODO: Check if extra check needed here based on API response.
    const user = userResponseToUser(response);
    const localStorageUser = await getLocalStorageUser();
    user.apiToken = localStorageUser?.apiToken;
    user.fcmToken = localStorageUser?.fcmToken;
    setLocalStorageUser(user);
    setUserToReduxStore(user);
    setUserLoaded(true);
  };

  React.useEffect(() => {
    // Check if language and user loaded then:
    // - If user available in state then:
    //   - Open home screen.
    // - Else:
    //   - Open login screen.
    if (isLanguageLoaded && isUserLoaded) {
      if (stateUser) {
        navigateToScreen('Home');
      } else {
        navigateToScreen('Login');
      }
    }
  }, [isLanguageLoaded, isUserLoaded]);

  const navigateToScreen = (
    screenName: keyof RootStackParamList,
    params?: RootStackParamList[keyof RootStackParamList],
  ) => {
    console.info(getLogMessage('navigateToScreen'), screenName, params);
    const {navigation} = props;
    navigation.replace(screenName, params);
  };
  // #endregion

  // #region UI
  return (
    <Screen>
      <Splash />
    </Screen>
  );
  // #endregion
});
