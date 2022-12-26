import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AlertDialog} from 'roqay-react-native-common-components';

import {type RootState, removeErrorDialogMessage} from '../store';
import {translate} from '../core';
import {removeUserDataLogout} from '../utils';

export default React.memo(() => {
  // #region Redux
  const dispatch = useDispatch();

  const {errorDialogTitle, errorDialogMessage} = useSelector(
    (state: RootState) => state.errorDialog,
  );
  // #endregion

  const onDismiss = () => {
    // Check if session expired then:
    // - Remove user.
    // - Remove notifications count.
    // - Navigate to login screen.
    if (errorDialogMessage === translate('session_expired')) {
      removeUserDataLogout();
    }

    dispatch(removeErrorDialogMessage());
  };

  return (
    <AlertDialog
      title={errorDialogTitle}
      message={errorDialogMessage}
      dialogProps={{
        visible: Boolean(errorDialogMessage),
        onDismiss: onDismiss,
      }}
      actions={[{action: translate('ok'), actionProps: {onPress: onDismiss}}]}
    />
  );
});
