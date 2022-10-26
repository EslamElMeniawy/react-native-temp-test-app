import {DefaultTheme} from 'react-native-paper';
import {Theme} from 'react-native-paper/lib/typescript/types';
import {Platform} from 'react-native';

import {AppColors} from '../enums';

export const paperTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: AppColors.PRIMARY,
    background: AppColors.BACKGROUND,
    surface: AppColors.SURFACE,
    accent: AppColors.SECONDARY,
    error: AppColors.ERROR,
    text: AppColors.ON_BACKGROUND,
    onSurface: AppColors.ON_SURFACE,
  },
  // TODO: Replace font names with required custom font.
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'SegoeUI',
      fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    },
    medium: {
      fontFamily: 'SegoeUI-Bold',
      fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    },
    light: {
      fontFamily: 'SegoeUI-Semilight',
      fontWeight: Platform.OS === 'ios' ? '300' : undefined,
    },
    thin: {
      fontFamily: 'SegoeUI-Light',
      fontWeight: Platform.OS === 'ios' ? '200' : undefined,
    },
  },
};
