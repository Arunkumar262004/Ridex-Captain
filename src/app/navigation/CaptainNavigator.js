import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CaptainHomeScreen from '../../screens/captain/CaptainHomeScreen';
import RideRequestScreen from '../../screens/captain/RideRequestScreen';
import QRScannerScreen from '../../screens/captain/QRScannerScreen';
import ActiveRideScreen from '../../screens/captain/ActiveRideScreen';
import EarningsScreen from '../../screens/captain/EarningsScreen';

const Stack = createNativeStackNavigator();

const CaptainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CaptainHome" component={CaptainHomeScreen} />
      <Stack.Screen name="RideRequest" component={RideRequestScreen} />
      <Stack.Screen
        name="QRScannerScreen"
        component={QRScannerScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="ActiveRideScreen" component={ActiveRideScreen} />
      <Stack.Screen name="Earnings" component={EarningsScreen} />
    </Stack.Navigator>
  );
};

export default CaptainNavigator;
