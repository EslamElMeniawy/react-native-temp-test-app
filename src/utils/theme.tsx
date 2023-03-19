import {
  MD3LightTheme as DefaultTheme,
  configureFonts,
} from 'react-native-paper';
import type {
  MD3Theme,
  MD3Colors,
  MD3Typescale,
} from 'react-native-paper/lib/typescript/src/types';
import {Platform} from 'react-native';
import tinyColor from 'tinycolor2';

import {AppColors} from '../enums';

const colors: MD3Colors = {
  ...DefaultTheme.colors,
  primary: AppColors.PRIMARY,
  primaryContainer: AppColors.PRIMARY_CONTAINER,
  secondary: AppColors.SECONDARY,
  secondaryContainer: AppColors.SECONDARY_CONTAINER,
  tertiary: AppColors.TERTIARY,
  tertiaryContainer: AppColors.TERTIARY_CONTAINER,
  surface: AppColors.SURFACE,
  surfaceVariant: AppColors.SURFACE_VARIANT,
  surfaceDisabled: tinyColor(AppColors.ON_SURFACE)
    .setAlpha(0.12)
    .toHex8String(),
  background: AppColors.BACKGROUND,
  error: AppColors.ERROR,
  errorContainer: AppColors.ERROR_CONTAINER,
  onPrimary: AppColors.ON_PRIMARY,
  onPrimaryContainer: AppColors.ON_PRIMARY_CONTAINER,
  onSecondary: AppColors.ON_SECONDARY,
  onSecondaryContainer: AppColors.ON_SECONDARY_CONTAINER,
  onTertiary: AppColors.ON_TERTIARY,
  onTertiaryContainer: AppColors.ON_TERTIARY_CONTAINER,
  onSurface: AppColors.ON_SURFACE,
  onSurfaceVariant: AppColors.ON_SURFACE_VARIANT,
  onSurfaceDisabled: tinyColor(AppColors.ON_SURFACE)
    .setAlpha(0.38)
    .toHex8String(),
  onError: AppColors.ON_ERROR,
  onErrorContainer: AppColors.ON_ERROR_CONTAINER,
  onBackground: AppColors.ON_BACKGROUND,
  outline: AppColors.OUTLINE,
  outlineVariant: AppColors.OUTLINE_VARIANT,
  inverseSurface: AppColors.INVERSE_SURFACE,
  inverseOnSurface: AppColors.INVERSE_ON_SURFACE,
  inversePrimary: AppColors.INVERSE_PRIMARY,
  shadow: AppColors.SHADOW,
  scrim: AppColors.SHADOW,
  backdrop: AppColors.BACKDROP,
  elevation: {
    ...DefaultTheme.colors.elevation,
    // Note: Color values with transparency cause RN to transfer shadows to children nodes
    // instead of View component in Surface. Providing solid background fixes the issue.
    level1: AppColors.ELEVATION_LEVEL_1,
    level2: AppColors.ELEVATION_LEVEL_2,
    level3: AppColors.ELEVATION_LEVEL_3,
    level4: AppColors.ELEVATION_LEVEL_4,
    level5: AppColors.ELEVATION_LEVEL_5,
  },
};

// TODO: Replace font names with required custom font.
const fonts: MD3Typescale = configureFonts({
  config: {
    displayLarge: {
      fontFamily: 'Cairo-Regular',
      fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    },
    displayMedium: {
      fontFamily: 'Cairo-Regular',
      fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    },
    displaySmall: {
      fontFamily: 'Cairo-Regular',
      fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    },
    headlineLarge: {
      fontFamily: 'Cairo-Regular',
      fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    },
    headlineMedium: {
      fontFamily: 'Cairo-Regular',
      fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    },
    headlineSmall: {
      fontFamily: 'Cairo-Regular',
      fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    },
    titleLarge: {
      fontFamily: 'Cairo-Regular',
      fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    },
    titleMedium: {
      fontFamily: 'Cairo-Medium',
      fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    },
    titleSmall: {
      fontFamily: 'Cairo-Medium',
      fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    },
    labelLarge: {
      fontFamily: 'Cairo-Medium',
      fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    },
    labelMedium: {
      fontFamily: 'Cairo-Medium',
      fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    },
    labelSmall: {
      fontFamily: 'Cairo-Medium',
      fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    },
    bodyLarge: {
      fontFamily: 'Cairo-Medium',
      fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    },
    bodyMedium: {
      fontFamily: 'Cairo-Medium',
      fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    },
    bodySmall: {
      fontFamily: 'Cairo-Medium',
      fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    },
  },
});

export const paperTheme: MD3Theme = {
  ...DefaultTheme,
  colors: colors,
  fonts: fonts,
};
