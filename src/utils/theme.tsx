import {
  MD3LightTheme as DefaultTheme,
  configureFonts,
} from 'react-native-paper';
import type {
  MD3Theme,
  MD3Colors,
} from 'react-native-paper/lib/typescript/src/types';

import {AppColors} from 'enums';

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
  surfaceDisabled: AppColors.SURFACE_DISABLED,
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
  onSurfaceDisabled: AppColors.ON_SURFACE_DISABLED,
  onError: AppColors.ON_ERROR,
  onErrorContainer: AppColors.ON_ERROR_CONTAINER,
  onBackground: AppColors.ON_BACKGROUND,
  outline: AppColors.OUTLINE,
  outlineVariant: AppColors.OUTLINE_VARIANT,
  inverseSurface: AppColors.INVERSE_SURFACE,
  inverseOnSurface: AppColors.INVERSE_ON_SURFACE,
  inversePrimary: AppColors.INVERSE_PRIMARY,
  shadow: AppColors.SHADOW,
  scrim: AppColors.SCRIM,
  backdrop: AppColors.BACKDROP,
  elevation: {
    ...DefaultTheme.colors.elevation,
    level0: AppColors.ELEVATION_LEVEL_0,
    // Note: Color values with transparency cause RN to transfer shadows to children nodes
    // instead of View component in Surface. Providing solid background fixes the issue.
    level1: AppColors.ELEVATION_LEVEL_1,
    level2: AppColors.ELEVATION_LEVEL_2,
    level3: AppColors.ELEVATION_LEVEL_3,
    level4: AppColors.ELEVATION_LEVEL_4,
    level5: AppColors.ELEVATION_LEVEL_5,
  },
};

// TODO: Replace font names with required custom font then enable commented font lines.
const baseFont = {
  // fontFamily: 'Cairo-Regular',
} as const;

const baseVariants = configureFonts({config: baseFont});

const customVariants = {
  // Customize individual base variants.
  titleSmall: {
    ...baseVariants.titleSmall,
    // fontFamily: 'Cairo-Bold',
  },
  titleMedium: {
    ...baseVariants.titleMedium,
    // fontFamily: 'Cairo-Bold',
  },
  labelSmall: {
    ...baseVariants.labelSmall,
    // fontFamily: 'Cairo-Bold',
  },
  labelMedium: {
    ...baseVariants.labelMedium,
    // fontFamily: 'Cairo-Bold',
  },
  labelLarge: {
    ...baseVariants.labelLarge,
    // fontFamily: 'Cairo-Bold',
  },
} as const;

const fonts = configureFonts({
  config: {
    ...baseVariants,
    ...customVariants,
  },
});

export const paperTheme: MD3Theme = {
  ...DefaultTheme,
  colors: colors,
  fonts: fonts,
};
