import React from 'react';
import Toast from 'react-native-toast-notifications';
import {Platform, View} from 'react-native';
import {ScaledSheet, ms} from 'react-native-size-matters';
import {Text, getStatusBarHeight} from 'roqay-react-native-common-components';
import tinyColor from 'tinycolor2';

import AppColors from '../enums/AppColors';

interface Props {
  reference?: React.LegacyRef<Toast>;
}

export default (props: Props) => {
  const {reference} = props;

  return (
    <Toast
      ref={reference}
      placement="top"
      offset={Platform.OS == 'ios' ? getStatusBarHeight() : undefined}
      renderToast={toastOptions => {
        const indicatorColor = tinyColor(
          toastOptions.type == 'danger' ? AppColors.ERROR : AppColors.PRIMARY,
        );

        const borderColor = indicatorColor.clone();
        borderColor.setAlpha(0.25);

        return (
          <View
            style={[
              styles.container,
              {
                borderColor: borderColor.toHex8String(),
                borderStartColor: indicatorColor.toHex8String(),
              },
            ]}>
            <Text style={styles.text}>{toastOptions.message}</Text>
          </View>
        );
      }}
    />
  );
};

const styles = ScaledSheet.create({
  container: {
    borderRadius: '8@msr',
    borderWidth: '1@msr',
    overflow: 'hidden',
    backgroundColor: AppColors.SURFACE,
    borderStartWidth: '8@msr',
  },
  text: {
    margin: '8@msr',
    color: AppColors.ON_SURFACE,
  },
});
