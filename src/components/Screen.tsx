import React from 'react';
import {StyleProp, ViewStyle, View} from 'react-native';
import {
  Edge,
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {ScaledSheet} from 'react-native-size-matters';
import tinyColor from 'tinycolor2';
import {
  StatusBar,
  NavigationBar,
  StatusBarProps,
  NavigationBarProps,
} from 'react-native-bars';

import {AppColors} from 'enums';

interface Props {
  edges?: Edge[];
  statusBarProps?: StatusBarProps;
  statusBarColor?: string;
  navigationBarProps?: NavigationBarProps;
  navigationBarColor?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default React.memo((props: Props) => {
  const insets = useSafeAreaInsets();

  const {
    edges,
    statusBarProps,
    statusBarColor,
    navigationBarProps,
    navigationBarColor,
    children,
    style,
  } = props;

  const {barStyle: statusBarStyle, ...restStatusBarProps} =
    statusBarProps || {};

  const {barStyle: navigationBarStyle, ...restNavigationBarProps} =
    navigationBarProps || {};

  const statusBarContainerStyle = {
    height: !edges || (edges && edges.includes('top')) ? insets.top : 0,
    backgroundColor: statusBarColor ? statusBarColor : AppColors.BACKGROUND,
  };

  const contentStyle = {
    paddingRight:
      !edges || (edges && edges.includes('right')) ? insets.right : 0,
    paddingLeft: !edges || (edges && edges.includes('left')) ? insets.left : 0,
  };

  const navigationBarContainerStyle = {
    height: !edges || (edges && edges.includes('bottom')) ? insets.bottom : 0,
    backgroundColor: navigationBarColor
      ? navigationBarColor
      : AppColors.BACKGROUND,
  };

  return (
    <SafeAreaProvider>
      <View style={statusBarContainerStyle}>
        <StatusBar
          barStyle={
            statusBarStyle
              ? statusBarStyle
              : tinyColor(
                  statusBarColor ? statusBarColor : AppColors.BACKGROUND,
                ).isLight()
              ? 'dark-content'
              : 'light-content'
          }
          {...restStatusBarProps}
        />
      </View>
      <View style={[styles.content, contentStyle, style]}>{children}</View>
      <View style={navigationBarContainerStyle}>
        <NavigationBar
          barStyle={
            navigationBarStyle
              ? navigationBarStyle
              : tinyColor(
                  navigationBarColor
                    ? navigationBarColor
                    : AppColors.BACKGROUND,
                ).isLight()
              ? 'dark-content'
              : 'light-content'
          }
          {...restNavigationBarProps}
        />
      </View>
    </SafeAreaProvider>
  );
});

const styles = ScaledSheet.create({
  content: {
    flex: 1,
    backgroundColor: AppColors.BACKGROUND,
  },
});
