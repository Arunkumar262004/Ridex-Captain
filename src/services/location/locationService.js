import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';

const requestLocationPermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Ridex Location Permission',
      message: 'Ridex needs your location to track live captain movement.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    },
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

const getCurrentLocation = async () => {
  const hasPermission = await requestLocationPermission();

  if (!hasPermission) {
    throw new Error('Location permission denied');
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      error => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });
};

/**
 * Start live GPS location watcher for Captain and emit coordinates to server via WebSockets
 */
const startLiveLocationTracking = async (rideId, socket, onLocationUpdate) => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission || !socket) return null;

  const watchId = Geolocation.watchPosition(
    position => {
      const captainLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        heading: position.coords.heading || 0,
        speed: position.coords.speed || 0,
      };

      // Emit live GPS coordinates to Socket.io server
      socket.emit('captain_location_update', {
        rideId,
        captainLocation,
      });

      if (onLocationUpdate) {
        onLocationUpdate(captainLocation);
      }
    },
    error => {
      console.log('Location watch error:', error);
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 5, // Update every 5 meters
      interval: 3000,    // Update every 3 seconds
    },
  );

  return watchId;
};

const stopLiveLocationTracking = (watchId) => {
  if (watchId !== null && watchId !== undefined) {
    Geolocation.clearWatch(watchId);
  }
};

export {
  requestLocationPermission,
  getCurrentLocation,
  startLiveLocationTracking,
  stopLiveLocationTracking,
};