import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const RideMap = ({ location, destination }) => {
  const pickupCoords = location ? {
    latitude: location.latitude || location.lat || 12.9716,
    longitude: location.longitude || location.lng || 77.5946,
  } : { latitude: 12.9716, longitude: 77.5946 };

  const dropoffCoords = destination ? {
    latitude: destination.latitude || destination.lat || 12.9352,
    longitude: destination.longitude || destination.lng || 77.6245,
  } : null;

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: pickupCoords.latitude,
        longitude: pickupCoords.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }}
      showsUserLocation
      showsMyLocationButton
    >
      {/* Pickup Marker */}
      <Marker
        coordinate={pickupCoords}
        title="Pickup"
        description={location?.address || 'Pickup Point'}
        pinColor="#22C55E"
      />

      {/* Dropoff Marker */}
      {dropoffCoords && (
        <Marker
          coordinate={dropoffCoords}
          title="Dropoff"
          description={destination?.address || 'Destination'}
          pinColor="#EF4444"
        />
      )}

      {/* Route Polyline Line */}
      {dropoffCoords && (
        <Polyline
          coordinates={[pickupCoords, dropoffCoords]}
          strokeColor="#38BDF8"
          strokeWidth={4}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default RideMap;