import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { verifyQrAndStartRide } from '../../services/api/rideApi';

const QRScannerScreen = ({ route, navigation }) => {
  const { rideId } = route.params || {};
  const [loading, setLoading] = useState(false);

  const handleVerify = async (scannedPayload) => {
    if (!rideId) {
      Alert.alert('Error', 'Missing ride identifier.');
      return;
    }

    try {
      setLoading(true);
      const res = await verifyQrAndStartRide(rideId, scannedPayload);
      if (res && res.success && res.data) {
        Alert.alert('Ride Started', 'Customer QR Code verified successfully.', [
          {
            text: 'Start Trip',
            onPress: () => navigation.replace('ActiveRideScreen', { ride: { ...res.data, status: 'ONGOING' } }),
          },
        ]);
      }
    } catch (err) {
      Alert.alert('Verification Failed', err.response?.data?.message || 'Invalid or expired QR code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Scan Customer QR</Text>
      <Text style={styles.subTitle}>
        Scan the customer's dynamic QR code on arrival to start the ride.
      </Text>

      <View style={styles.scannerFrame}>
        <View style={styles.viewfinder}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          <Text style={styles.scannerStatus}>Camera Viewfinder</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.verifyButton}
        onPress={() => handleVerify()}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.verifyButtonText}>Verify Scanned QR & Start Ride</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  scannerFrame: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  viewfinder: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#22C55E',
  },
  topLeft: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  topRight: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  bottomLeft: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  bottomRight: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
  scannerStatus: {
    color: '#22C55E',
    fontSize: 13,
    fontWeight: '700',
  },
  verifyButton: {
    backgroundColor: '#16A34A',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelText: {
    color: '#94A3B8',
    fontSize: 15,
  },
});

export default QRScannerScreen;
