import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';

const CaptainActiveRideScreen = ({ route, navigation }) => {
  const { ride } = route.params || {};

  const isOngoing = ride?.status === 'ONGOING';

  const handleCompleteRide = () => {
    Alert.alert('Ride Completed', `Fare collected: ₹${ride?.fare || 0}. Returning to dashboard.`, [
      {
        text: 'OK',
        onPress: () => navigation.navigate('CaptainHome'),
      },
    ]);
  };

  if (!ride) {
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
      <View style={styles.header}>
        <Text style={styles.title}>Captain Active Trip</Text>
        <Text style={styles.subtitle}>
          {isOngoing ? 'Trip in progress - Navigate to dropoff' : 'En route to customer pickup location'}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.passengerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{ride.customerName ? ride.customerName.charAt(0) : 'P'}</Text>
          </View>
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>{ride.customerName || 'Passenger'}</Text>
            <Text style={styles.passengerPhone}>{ride.customerPhone || 'Contact details'}</Text>
          </View>
          <Text style={styles.fare}>₹{ride.fare || 0}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.locationContainer}>
          <View style={[styles.dot, styles.greenDot]} />
          <Text style={styles.locationText}>Pickup: {ride.pickupLocation?.address || 'Pickup Point'}</Text>
        </View>

        <View style={styles.locationContainer}>
          <View style={[styles.dot, styles.redDot]} />
          <Text style={styles.locationText}>Dropoff: {ride.dropoffLocation?.address || 'Destination'}</Text>
        </View>

        <View style={styles.statusBadgeRow}>
          <Text style={styles.statusLabel}>Trip Status:</Text>
          <Text style={[styles.statusBadge, isOngoing ? styles.statusGreen : styles.statusBlue]}>
            {ride?.status || 'ARRIVED'}
          </Text>
        </View>
      </View>

      {!isOngoing ? (
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('QRScannerScreen', { rideId: ride?._id || ride?.id })}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
    justifyContent: 'center',
  },
  emptyContainer: {
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 20,
  },
  passengerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  passengerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  passengerPhone: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  fare: {
    fontSize: 22,
    fontWeight: '800',
    color: '#38BDF8',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  greenDot: {
    backgroundColor: '#22C55E',
  },
  redDot: {
    backgroundColor: '#EF4444',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  statusLabel: {
    fontSize: 13,
    color: '#94A3B8',
    marginRight: 8,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 4,
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
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  homeButton: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default CaptainActiveRideScreen;
