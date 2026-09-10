import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const ONBOARDING_SEEN_KEY = 'ridex_captain_onboarding_seen';

// Order follows the pagination dots baked into each graphic (1st/2nd/3rd
// position), not the source filenames — 3rd.png's dots show it as the
// first slide, 1stscreen.png's dots show it as the last.
const SLIDES = [
  { key: 'intro', image: require('../../assets/splash_images/3rd.png'), hasButton: true },
  { key: 'features', image: require('../../assets/splash_images/2nd-screen.png'), hasButton: false },
  { key: 'captain', image: require('../../assets/splash_images/1stscreen.png'), hasButton: true },
];

const OnboardingScreen = ({ navigation }) => {
  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
    } catch (error) {
      // Non-fatal — worst case the onboarding shows again next launch.
    }

    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} resizeMode="cover" />

            {/* Invisible hit-target over the button already drawn into the graphic */}
            {item.hasButton && (
              <TouchableOpacity
                style={styles.buttonOverlay}
                activeOpacity={0.7}
                onPress={finishOnboarding}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF2FB',
  },
  slide: {
    width,
    height,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonOverlay: {
    position: 'absolute',
    left: '8%',
    right: '8%',
    top: '82%',
    height: '9%',
  },
});

export default OnboardingScreen;
