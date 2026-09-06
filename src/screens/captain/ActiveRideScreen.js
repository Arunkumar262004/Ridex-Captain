import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import io from 'socket.io-client';
import RideMap from '../../components/map/RideMap';
import { startLiveLocationTracking, stopLiveLocationTracking } from '../../services/location/locationService';

const CaptainActiveRideScreen = ({ route, navigation }) => {
  const { ride } = route.params || {};

  const [currentRide, setCurrentRide] = useState(ride);
  const [captainLocation, setCaptainLocation] = useState(ride?.captainLocation || null);

  const isOngoing = currentRide?.status === 'ONGOING';

  useEffect(() => {
    if (!ride?._id && !ride?.id) return;

    const rideId = ride._id || ride.id;

    let socket;
    let watchId;

    try {
      socket = io('http://10.0.2.2:5000');
      socket.emit('join_ride_room', rideId);

      // Start live GPS tracking & emitting coordinates to customer room
      startLiveLocationTracking(rideId, socket, (newLocation) => {
        setCaptainLocation(newLocation);
      }).then(id => {
        watchId = id;
      });
    } catch (e) {
      console.log('Captain socket tracking offline fallback');
    }

    return () => {
      if (watchId) stopLiveLocationTracking(watchId);
      if (socket) socket.disconnect();
    };
  }, [ride]);

  const handleCompleteRide = () => {
    Alert.alert('Ride Completed', `Fare collected: ₹${currentRide?.fare || 0}. Returning to dashboard.`, [
      {
        text: 'OK',
        onPress: () => navigation.navigate('CaptainHome'),
      },
    ]);
  };

  if (!currentRide) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Active Ride Found</Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('CaptainHome')}
          >
            <Text style={styles.homeButtonText}>Return to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Route Map View with Live Captain Movement */}
      <View style={styles.mapContainer}>
        <RideMap
          location={currentRide.pickupLocation}
          destination={currentRide.dropoffLocation}
          captainLocation={captainLocation}
        />
      </View>

      {/* Driver Controls Panel */}
      <View style={styles.infoPanel}>
        <View style={styles.header}>
          <Text style={styles.title}>Captain Active Trip</Text>
          <Text style={styles.subtitle}>
            {isOngoing ? 'Trip in progress - Navigate to dropoff' : 'En route to customer pickup location'}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.passengerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{currentRide.customerName ? currentRide.customerName.charAt(0) : 'P'}</Text>
            </View>
            <View style={styles.passengerInfo}>
              <Text style={styles.passengerName}>{currentRide.customerName || 'Passenger'}</Text>
              <Text style={styles.passengerPhone}>{currentRide.customerPhone || 'Contact details'}</Text>
            </View>
            <Text style={styles.fare}>₹{currentRide.fare || 0}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.locationContainer}>
            <View style={[styles.dot, styles.greenDot]} />
            <Text style={styles.locationText} numberOfLines={1}>Pickup: {currentRide.pickupLocation?.address || 'Pickup Point'}</Text>
          </View>

          <View style={styles.locationContainer}>
            <View style={[styles.dot, styles.redDot]} />
            <Text style={styles.locationText} numberOfLines={1}>Dropoff: {currentRide.dropoffLocation?.address || 'Destination'}</Text>
          </View>

          <View style={styles.statusBadgeRow}>
            <Text style={styles.statusLabel}>Trip Status:</Text>
            <Text style={[styles.statusBadge, isOngoing ? styles.statusGreen : styles.statusBlue]}>
              {currentRide?.status || 'ACCEPTED'}
            </Text>
          </View>
        </View>

        {!isOngoing ? (
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => navigation.navigate('QRScannerScreen', { rideId: currentRide?._id || currentRide?.id })}
          >
            <Text style={styles.scanButtonText}>Scan Customer QR Code to Start Ride</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleCompleteRide}
          >
            <Text style={styles.completeButtonText}>Complete Ride & Collect Fare</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('CaptainHome')}
        >
          <Text style={styles.homeButtonText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  mapContainer: {
    flex: 1,
  },
  infoPanel: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    color: '#F8FAFC',
    fontWeight: '700',
    marginBottom: 20,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },
  passengerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  passengerPhone: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  fare: {
    fontSize: 20,
    fontWeight: '800',
    color: '#38BDF8',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  greenDot: {
    backgroundColor: '#22C55E',
  },
  redDot: {
    backgroundColor: '#EF4444',
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
    flex: 1,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginRight: 6,
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBlue: {
    backgroundColor: '#1E3A8A',
    color: '#60A5FA',
  },
  statusGreen: {
    backgroundColor: '#14532D',
    color: '#4ADE80',
  },
  scanButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  completeButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  homeButton: {
    backgroundColor: '#334155',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default CaptainActiveRideScreen;
