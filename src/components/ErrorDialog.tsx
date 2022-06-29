import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AlertDialog} from 'roqay-react-native-common-components';

import {RootState} from '../store';
import {removeErrorDialogMessage} from '../store/errorDialogMessage';
import {removeUser} from '../store/user';
import {removeNotificationsCount} from '../store/notificationsCount';
import {translate} from '../core';
import {popToTop, replace} from '../utils';

export default () => {
  const dispatch = useDispatch();

  const {errorDialogMessage} = useSelector(
    (state: RootState) => state.errorDialogMessage,
  );

  const onDismiss = () => {
    // Check if session expired then:
    // - Remove user.
    // - Remove notifications count.
    // - Navigate to login screen.
    if (errorDialogMessage === translate('session_expired')) {
      dispatch(removeUser());
      dispatch(removeNotificationsCount());
      popToTop();
      replace('Login');
    }

    dispatch(removeErrorDialogMessage());
  };

  return (
    <AlertDialog
      message={errorDialogMessage}
      dialogProps={{visible: Boolean(errorDialogMessage), onDismiss: onDismiss}}
      actions={[{action: translate('ok'), actionProps: {onPress: onDismiss}}]}
    />
  );
};
