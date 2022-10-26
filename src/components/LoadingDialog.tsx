import React from 'react';
import {useSelector} from 'react-redux';
import {LoadingDialog} from 'roqay-react-native-common-components';

import {RootState} from '../store';

export default React.memo(() => {
  // #region Redux
  const {showLoadingDialog} = useSelector(
    (state: RootState) => state.loadingDialog,
  );
  // #endregion

  return <LoadingDialog visible={showLoadingDialog} />;
});
