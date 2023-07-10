import React from 'react';
import {ScaledSheet, vs, s} from 'react-native-size-matters';
import {
  ScrollView,
  Text,
  Button,
  TextInput,
  emailRegExp,
  strictPasswordRegExp,
} from 'roqay-react-native-common-components';
import Config from 'react-native-config';
import {useDispatch, useSelector} from 'react-redux';
import {View, Keyboard} from 'react-native';
import {useForm, Controller} from 'react-hook-form';

import {
  type RootState,
  setErrorDialogMessage,
  setErrorDialogTitleMessage,
  showLoadingDialog,
  removeLoadingDialog,
} from 'store';
import {translate} from 'core';

// TODO: Remove all this temp explanation code.
export default React.memo(() => {
  // #region Logger
  const getLogMessage = (message: string) => {
    return `## Splash: ${message}`;
  };
  // #endregion

  // #region Redux
  const dispatch = useDispatch();

  const {isInternetAvailable, isConnectionExpensive} = useSelector(
    (state: RootState) => state.networkState,
  );
  // #endregion

  // #region Form
  type FormValues = {
    email?: string;
    password?: string;
    password_confirmation?: string;
  };

  const {
    control,
    handleSubmit,
    formState: {errors: formErrors},
    getValues,
  } = useForm<FormValues>({
    defaultValues: {
      email: undefined,
      password: undefined,
      password_confirmation: undefined,
    },
  });
  // #endregion

  // #region Press events
  const onShowErrorDialogPress = () => {
    console.info(getLogMessage('onShowErrorDialogPress'));
    dispatch(setErrorDialogMessage('Some error happened!'));
  };

  const onShowLoadingDialogPress = () => {
    console.info(getLogMessage('onShowLoadingDialogPress'));
    dispatch(showLoadingDialog());

    setTimeout(() => {
      dispatch(removeLoadingDialog());
    }, 2000);
  };

  const onSubmitPress = async (data: FormValues) => {
    console.info(getLogMessage('onSubmitPress'), data);
    Keyboard.dismiss();

    // Check if Internet available before calling API.
    if (isInternetAvailable) {
      dispatch(showLoadingDialog());

      setTimeout(() => {
        dispatch(removeLoadingDialog());
        dispatch(
          setErrorDialogTitleMessage({
            title: 'Done Submitting Form',
            message: 'Submit process is done successfully',
          }),
        );
      }, 2000);
    } else {
      dispatch(setErrorDialogMessage(translate('network_error')));
    }
  };
  // #endregion

  // #region UI
  const getContent = () => (
    <>
      {getScreenTitle()}
      {getEnvironmentText()}
      {getDialogButtonsRow()}
      {getInternetStatusRow()}
      {getForm()}
    </>
  );

  const getScreenTitle = () => (
    <Text variant="displaySmall" style={styles.content}>
      Splash Screen
    </Text>
  );

  const getEnvironmentText = () => (
    <Text type="bold" size={13} style={styles.content}>
      {'Environment: '}
      <Text>{Config.ENV_NAME}</Text>
    </Text>
  );

  const getDialogButtonsRow = () => (
    <View style={styles.row}>
      {getErrorDialogButton()}
      {getLoadingDialogButton()}
    </View>
  );

  const getErrorDialogButton = () => (
    <Button
      text="Show Error Dialog"
      onPress={onShowErrorDialogPress}
      textProps={{style: styles.buttonText}}
    />
  );

  const getLoadingDialogButton = () => (
    <Button
      text="Show Loading Dialog"
      onPress={onShowLoadingDialogPress}
      textProps={{style: styles.buttonText}}
    />
  );

  const getInternetStatusRow = () => (
    <View style={styles.row}>
      {getInternetAvailableText()}
      {getConnectionExpensiveText()}
    </View>
  );

  const getInternetAvailableText = () => (
    <Text type="bold" size={13} style={styles.rowText}>
      {'Internet Available: '}
      <Text>{`${isInternetAvailable}`}</Text>
    </Text>
  );

  const getConnectionExpensiveText = () => (
    <Text type="bold" size={13} style={styles.rowText}>
      {'Connection Expensive: '}
      <Text>{`${isConnectionExpensive}`}</Text>
    </Text>
  );

  const getForm = () => (
    <>
      {getInputs()}
      <Button
        text="Submit Form"
        onPress={handleSubmit(onSubmitPress)}
        textProps={{style: styles.buttonText}}
        style={styles.submitButton}
      />
    </>
  );

  const getInputs = () => (
    <>
      {getEmailInput()}
      {getPasswordInput()}
      {getPasswordConfirmationInput()}
    </>
  );

  const getEmailInput = () => (
    <Controller
      name="email"
      control={control}
      rules={{
        required: {
          value: true,
          message: 'Field is required',
        },
        pattern: {
          value: emailRegExp,
          message: 'Invalid email address',
        },
      }}
      render={({field: {onChange, onBlur, value}}) => (
        <TextInput
          style={styles.input}
          placeholder={'Email Address'}
          keyboardType="email-address"
          errorProps={{errorMessage: formErrors.email?.message}}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
        />
      )}
    />
  );

  const getPasswordInput = () => (
    <Controller
      name="password"
      control={control}
      rules={{
        required: {
          value: true,
          message: 'Field is required',
        },
        pattern: {
          value: strictPasswordRegExp,
          message: 'Invalid password',
        },
      }}
      render={({field: {onChange, onBlur, value}}) => (
        <TextInput
          style={styles.input}
          placeholder={'Password'}
          secureTextEntry
          errorProps={{errorMessage: formErrors.password?.message}}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
        />
      )}
    />
  );

  const getPasswordConfirmationInput = () => (
    <Controller
      name="password_confirmation"
      control={control}
      rules={{
        required: {
          value: true,
          message: 'Field is required',
        },
        validate: value =>
          value === getValues('password') || 'Password not match',
      }}
      render={({field: {onChange, onBlur, value}}) => (
        <TextInput
          style={styles.input}
          placeholder={'Password Confirmation'}
          secureTextEntry
          errorProps={{errorMessage: formErrors.password_confirmation?.message}}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
        />
      )}
    />
  );

  return <ScrollView>{getContent()}</ScrollView>;
  // #endregion
});

const styles = ScaledSheet.create({
  content: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: vs(16),
  },
  buttonText: {
    paddingHorizontal: s(16),
  },
  row: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(16),
  },
  rowText: {
    textAlign: 'center',
  },
  input: {
    width: '90%',
    alignSelf: 'center',
    marginTop: vs(16),
  },
  submitButton: {
    width: '90%',
    alignSelf: 'center',
    marginTop: vs(16),
  },
});
