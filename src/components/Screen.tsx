import React from 'react';
import {StatusBar, StatusBarProps, View} from 'react-native';
import {Edge, SafeAreaView} from 'react-native-safe-area-context';
import {ScaledSheet} from 'react-native-size-matters';
import tinyColor from 'tinycolor2';

import AppColors from '../enums/AppColors';

interface Props {
  edges?: Edge[];
  statusBarProps?: StatusBarProps;
  children?: React.ReactNode;
}

export default (props: Props) => {
  const {edges, statusBarProps, children} = props;

  const {backgroundColor, barStyle, ...restStatusBarProps} =
    statusBarProps || {};

  const statusBarBackgroundColor = backgroundColor || AppColors.BACKGROUND;

  return (
    <SafeAreaView style={styles.container} edges={edges}>
      <StatusBar
        backgroundColor={statusBarBackgroundColor}
        barStyle={
          barStyle || tinyColor(statusBarBackgroundColor as string).isLight()
            ? 'dark-content'
            : 'light-content'
        }
        {...restStatusBarProps}
      />
      {children}
    </SafeAreaView>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BACKGROUND,
  },
});
