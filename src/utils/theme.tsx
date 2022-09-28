import {DefaultTheme} from 'react-native-paper';
import {Theme} from 'react-native-paper/lib/typescript/types';

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
};
