import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Text, Button} from 'roqay-react-native-common-components';
import RNRestart from 'react-native-restart';
import {ScaledSheet, vs} from 'react-native-size-matters';
import RNBootSplash from 'react-native-bootsplash';

import {translate} from 'core';
import {AppColors} from 'enums';

import Screen from './Screen';

export default React.memo(() => {
  React.useEffect(() => {
    RNBootSplash.hide();
  }, []);

  return (
    <SafeAreaProvider>
      <Screen style={styles.container}>
        <Text type="bold" size={18} style={[styles.text, styles.title]}>
          {translate('error_fallback_title')}
        </Text>
        <Text style={[styles.text, styles.message]}>
          {translate('error_fallback_message')}
        </Text>
        <Button
          text={translate('restart_app')}
          onPress={() => RNRestart.Restart()}
          style={styles.bt}
          textProps={{style: styles.btnTxt}}
        />
      </Screen>
    </SafeAreaProvider>
  );
});

const styles = ScaledSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: vs(16),
  },
  text: {
    color: AppColors.ON_BACKGROUND,
    textAlign: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    // TODO: Add font family relative to app font.
    // fontFamily: 'Cairo-Bold',
  },
  message: {
    // TODO: Add font family relative to app font.
    // fontFamily: 'Cairo-Regular',
  },
  bt: {
    width: '90%',
    alignSelf: 'center',
    marginTop: vs(32),
    backgroundColor: AppColors.PRIMARY,
  },
  btnTxt: {
    color: AppColors.ON_PRIMARY,
    // TODO: Add font family relative to app font.
    // fontFamily: 'Cairo-Bold',
  },
});
