import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import {Text, Button} from 'roqay-react-native-common-components';
import Config from 'react-native-config';
import {useDispatch, useSelector} from 'react-redux';

import {
  RootState,
  setErrorDialogMessage,
  setShowLoadingDialog,
  removeShowLoadingDialog,
} from '../store';

import ScrollView from './ScrollView';

export default React.memo(() => {
  // TODO: Design splash.

  // #region Redux
  const dispatch = useDispatch();

  const {isInternetAvailable, isConnectionExpensive} = useSelector(
    (state: RootState) => state.networkState,
  );
  // #endregion

  return (
    <ScrollView>
      <Text type="bold" style={styles.content}>
        Splash Screen
      </Text>
      <Text style={styles.content}>{`Environment: ${Config.ENV_NAME}`}</Text>
      <Button
        style={styles.content}
        text="Show Error Dialog"
        onPress={() => dispatch(setErrorDialogMessage('Some error happened!'))}
        textProps={{style: styles.buttonText}}
      />
      <Button
        style={styles.content}
        text="Show Loading Dialog"
        onPress={() => {
          dispatch(setShowLoadingDialog(true));
          setTimeout(() => {
            dispatch(removeShowLoadingDialog());
          }, 2000);
        }}
        textProps={{style: styles.buttonText}}
      />
      <Text style={styles.content}>
        {`Internet Available: ${isInternetAvailable}`}
      </Text>
      <Text style={styles.content}>
        {`Connection Expensive: ${isConnectionExpensive}`}
      </Text>
    </ScrollView>
  );
});

const styles = ScaledSheet.create({
  content: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: '16@vs',
  },
  buttonText: {
    paddingHorizontal: '16@s',
  },
});
