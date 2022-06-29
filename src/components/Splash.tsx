import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import {Text, Button} from 'roqay-react-native-common-components';
import Config from 'react-native-config';
import {useDispatch} from 'react-redux';

import {setErrorDialogMessage} from '../store/errorDialogMessage';

export default () => {
  // TODO: Design splash.
  const dispatch = useDispatch();

  return (
    <>
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
    </>
  );
};

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
