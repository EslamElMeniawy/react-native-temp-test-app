import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';

import {RootState} from '../../store';
import {setUser as setStateUser} from '../../store/user';
import {
  getLanguage,
  updateLanguage,
  getUser as getLocalStorageUser,
} from '../../core';
import User from '../../types/api/User';
import {RootStackScreenProps, RootStackParamList} from '../../types/navigation';

import Screen from '../../components/Screen';
import Splash from '../../components/Splash';

const getLogMessage = (message: string) => {
  return `## Splash Screen: ${message}`;
};

export default (props: RootStackScreenProps<'Splash'>) => {
  const dispatch = useDispatch();
  const {user: stateUser} = useSelector((state: RootState) => state.user);

  const {isInternetAvailable} = useSelector(
    (state: RootState) => state.networkState,
  );

  const [isLanguageLoaded, setLanguageLoaded] = React.useState<boolean>(false);
  const [isUserLoaded, setUserLoaded] = React.useState<boolean>(false);

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

        if (isInternetAvailable) {
          getUpdatedUserData();
        } else {
          setUserLoaded(true);
        }
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
  const getUpdatedUserData = () => {
    console.info(getLogMessage('getUpdatedUserData'));
    // TODO: Call API to get updated user data.
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
    navigation.navigate(screenName, params);
  };

  return (
    <Screen>
      <Splash />
    </Screen>
  );
};
