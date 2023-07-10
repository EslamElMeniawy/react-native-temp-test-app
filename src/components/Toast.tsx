import React from 'react';
import Toast from 'react-native-toast-notifications';
import {View} from 'react-native';
import {ScaledSheet, ms} from 'react-native-size-matters';
import {Text, getStatusBarHeight} from 'roqay-react-native-common-components';
import tinyColor from 'tinycolor2';

import {AppColors} from 'enums';

interface Props {
  reference?: React.LegacyRef<Toast>;
}

export default React.memo((props: Props) => {
  const {reference} = props;

  return (
    <Toast
      ref={reference}
      placement="top"
      offset={getStatusBarHeight()}
      renderToast={toastOptions => {
        const indicatorColor = tinyColor(
          toastOptions.type === 'danger' ? AppColors.ERROR : AppColors.PRIMARY,
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
});

const styles = ScaledSheet.create({
  container: {
    borderRadius: ms(8),
    borderWidth: ms(1),
    overflow: 'hidden',
    backgroundColor: AppColors.SURFACE,
    borderStartWidth: ms(8),
  },
  text: {
    margin: ms(8),
    color: AppColors.ON_SURFACE,
  },
});
