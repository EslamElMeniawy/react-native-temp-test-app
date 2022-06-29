import {DefaultTheme} from 'react-native-paper';

import AppColors from '../enums/AppColors';

export const paperTheme = {
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
};
