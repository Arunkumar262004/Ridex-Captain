import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CaptainActiveRideScreen = ({ route, navigation }) => {
  const { ride } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Captain Active Ride</Text>

      <View style={styles.card}>
        <Text style={styles.statusText}>
          Status: <Text style={styles.statusValue}>{ride?.status || 'ONGOING'}</Text>
        </Text>
        <Text style={styles.detailText}>Pickup: {ride?.pickupLocation?.address || 'Pickup Point'}</Text>
        <Text style={styles.detailText}>Destination: {ride?.dropoffLocation?.address || 'Destination'}</Text>
      </View>

      {ride?.status !== 'ONGOING' ? (
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('QRScannerScreen', { rideId: ride?._id || ride?.id })}
        >
          <Text style={styles.scanButtonText}>Scan Customer QR to Start</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => navigation.navigate('CaptainHome')}
        >
          <Text style={styles.completeButtonText}>Complete Ride</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 20, justifyContent: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 20 },
  card: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, marginBottom: 20 },
  statusText: { fontSize: 16, color: '#CBD5E1', marginBottom: 8 },
  statusValue: { fontWeight: 'bold', color: '#38BDF8' },
  detailText: { fontSize: 14, color: '#94A3B8', marginBottom: 4 },
  scanButton: { backgroundColor: '#38BDF8', padding: 16, borderRadius: 12, alignItems: 'center' },
  scanButtonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 },
  completeButton: { backgroundColor: '#22C55E', padding: 16, borderRadius: 12, alignItems: 'center' },
  completeButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});

export default CaptainActiveRideScreen;
