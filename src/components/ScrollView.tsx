import React from 'react';
import {ScrollView} from 'roqay-react-native-common-components';
import {Props} from 'roqay-react-native-common-components/src/components/ScrollView';

export default React.memo((props: Omit<Props, 'theme'>) => {
  const {enableOnAndroid, ...restProps} = props;

  return (
    <ScrollView
      enableOnAndroid={
        enableOnAndroid == null || enableOnAndroid === undefined
          ? true
          : enableOnAndroid
      }
      {...restProps}
    />
  );
});
