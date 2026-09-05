import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { verifyQrAndStartRide } from '../../services/api/rideApi';

const QRScannerScreen = ({ route, navigation }) => {
  const { rideId } = route.params || {};
  const [scannedData, setScannedData] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handles scanned payload verification
  const handleVerify = async (dataToVerify) => {
    const payload = dataToVerify || scannedData;
    if (!payload) {
      Alert.alert('Scan Required', 'Please scan the customer QR code or paste payload.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await verifyQrAndStartRide(rideId, payload);
      if (res.success && res.data) {
        Alert.alert('Ride Started!', 'QR Code verified successfully. Have a safe trip!', [
          {
            text: 'OK',
            onPress: () => navigation.replace('ActiveRideScreen', { ride: res.data }),
          },
        ]);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired QR code.';
      setErrorMsg(msg);
      Alert.alert('Verification Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Scan Customer QR</Text>
      <Text style={styles.subTitle}>
        Position the customer's dynamic QR code inside the viewfinder to start the ride.
      </Text>

      {/* Scanner Viewfinder */}
      <View style={styles.scannerFrame}>
        <View style={styles.viewfinder}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          <Text style={styles.scannerStatus}>Camera Scanner Active</Text>
        </View>
      </View>

      {/* Fallback Input for Testing / Simulator */}
      <View style={styles.manualBox}>
        <Text style={styles.manualLabel}>Simulator / Test Input:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Paste scanned QR JSON string..."
          placeholderTextColor="#777"
          value={scannedData}
          onChangeText={setScannedData}
          multiline
        />
        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => handleVerify()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify QR & Start Ride</Text>
          )}
        </TouchableOpacity>
      </View>

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
    marginBottom: 24,
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
    borderColor: '#38BDF8',
  },
  topLeft: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  topRight: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  bottomLeft: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  bottomRight: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
  scannerStatus: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  manualBox: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  manualLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 13,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    marginBottom: 8,
  },
  verifyButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelText: {
    color: '#94A3B8',
    fontSize: 15,
  },
});

export default QRScannerScreen;
