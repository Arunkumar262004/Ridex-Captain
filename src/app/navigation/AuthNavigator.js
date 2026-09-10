import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LoginScreen from '../../screens/auth/LoginScreen';
import RegisterScreen from '../../screens/auth/RegisterScreen';
import OnboardingScreen from '../../screens/onboarding/OnboardingScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = ({hasSeenOnboarding}) => {
  return (
    <Stack.Navigator
      initialRouteName={hasSeenOnboarding ? 'Login' : 'Onboarding'}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Create Account',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;