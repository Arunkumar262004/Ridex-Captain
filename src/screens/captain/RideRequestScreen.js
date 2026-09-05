import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const RideRequestScreen = ({ route, navigation }) => {
  const { ride } = route.params || {};

  const handleAccept = () => {
    if (ride) {
      navigation.navigate('ActiveRideScreen', { ride: { ...ride, status: 'ACCEPTED' } });
    }
  };

  const handleDecline = () => {
    navigation.goBack();
  };

  if (!ride) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Active Request</Text>
          <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
            <Text style={styles.declineText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>New Ride Request</Text>
          <Text style={styles.headerSubtitle}>Respond before timer expires</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.riderRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{ride.customerName ? ride.customerName.charAt(0) : 'P'}</Text>
            </View>
            <View style={styles.riderInfo}>
              <Text style={styles.riderName}>{ride.customerName || 'Passenger'}</Text>
              <Text style={styles.riderRating}>Cash Payment</Text>
            </View>
            <Text style={styles.fare}>₹{ride.fare || 0}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.locationRow}>
            <View style={[styles.dot, styles.greenDot]} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>PICKUP</Text>
              <Text style={styles.locationText}>{ride.pickupLocation?.address || 'Pickup address'}</Text>
            </View>
          </View>

          <View style={styles.lineConnector} />

          <View style={styles.locationRow}>
            <View style={[styles.dot, styles.redDot]} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>DROPOFF</Text>
              <Text style={styles.locationText}>{ride.dropoffLocation?.address || 'Dropoff address'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.acceptText}>Accept Ride</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  riderRow: {
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
  riderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  riderName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  riderRating: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  fare: {
    fontSize: 24,
    fontWeight: '800',
    color: '#38BDF8',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  greenDot: {
    backgroundColor: '#22C55E',
  },
  redDot: {
    backgroundColor: '#EF4444',
  },
  lineConnector: {
    width: 2,
    height: 20,
    backgroundColor: '#334155',
    marginLeft: 5,
    marginVertical: 2,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E2E8F0',
    marginTop: 2,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  declineText: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 16,
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#16A34A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
});

export default RideRequestScreen;
