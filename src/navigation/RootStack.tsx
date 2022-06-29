import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import type {RootStackParamList} from '../types/navigation';

import Splash from '../screens/Splash';

const Stack = createStackNavigator<RootStackParamList>();

export default () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={Splash} />
    </Stack.Navigator>
  );
};
