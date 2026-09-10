import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthNavigator from './AuthNavigator';
import CaptainNavigator from './CaptainNavigator';
import {setAuth, setInitialized} from '../store/slices/authSlice';
import {getAuthData} from '../../utils/storage';
import colors from '../../constants/colors';

const ONBOARDING_SEEN_KEY = 'ridex_captain_onboarding_seen';

const RootNavigator = () => {
  const dispatch = useDispatch();

  const {isAuthenticated, initialized} = useSelector(state => state.auth);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    restoreAuthentication();
  }, []);

  const restoreAuthentication = async () => {
    try {
      const seenOnboarding = await AsyncStorage.getItem(ONBOARDING_SEEN_KEY);
      setHasSeenOnboarding(seenOnboarding === 'true');

      const authData = await getAuthData();
      if (authData?.token && authData?.user) {
        dispatch(
          setAuth({
            token: authData.token,
            user: authData.user,
          }),
        );
      } else {
        dispatch(setInitialized());
      }
    } catch (error) {
      console.log('Authentication restore error:', error);
      dispatch(setInitialized());
    }
  };

  if (!initialized) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <CaptainNavigator />
      ) : (
        <AuthNavigator hasSeenOnboarding={hasSeenOnboarding} />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});

export default RootNavigator;