import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import type {RootStackParamList} from '../types';

// Screens.
import Splash from '../screens/Splash';

const Stack = createStackNavigator<RootStackParamList>();

export default React.memo(() => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={Splash} />
    </Stack.Navigator>
  );
});
