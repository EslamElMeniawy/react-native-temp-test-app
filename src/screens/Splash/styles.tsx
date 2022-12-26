import {ScaledSheet} from 'react-native-size-matters';

import {AppColors} from '../../enums';

const styles = ScaledSheet.create({
  bootSplash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.BACKGROUND,
  },
  logo: {
    height: 89,
    width: 100,
  },
});

export default styles;
