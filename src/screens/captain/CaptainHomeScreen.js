import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import io from 'socket.io-client';
import { requestLocationPermission } from '../../services/location/locationService';
import { updateCaptainLocation, setCaptainOffline } from '../../services/api/userApi';
import { SOCKET_URL } from '../../constants/config';

const CaptainHomeScreen = ({ navigation }) => {
  const [isOnline, setIsOnline] = useState(true);
  const watchIdRef = useRef(null);
  const requestSocketRef = useRef(null);

  // Listens for new ride requests while online. There's no per-captain
  // radius/vehicle-type dispatch yet (see ride.controller.js -
  // createRide just broadcasts to every connected socket), so this is a
  // simple "show me whatever comes in while I'm online" listener, not a
  // real matching engine - good enough to see and act on a request, but
  // every online captain currently sees every ride.
  useEffect(() => {
    if (!isOnline) {
      if (requestSocketRef.current) {
        requestSocketRef.current.disconnect();
        requestSocketRef.current = null;
      }
      return undefined;
    }

    const socket = io(SOCKET_URL);
    requestSocketRef.current = socket;

    socket.on('new_ride_available', ride => {
      navigation.navigate('RideRequest', { ride });
    });

    return () => {
      socket.disconnect();
      requestSocketRef.current = null;
    };
  }, [isOnline, navigation]);

  // Reports live position to the server only while the online switch is on
  // - this is exactly what backs the "nearby partner" markers customers see
  // on the vehicle-selection map, so a captain has to actually be online
  // and pinging to show up there.
  useEffect(() => {
    if (!isOnline) {
      if (watchIdRef.current != null) {
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setCaptainOffline().catch(() => {});
      return undefined;
    }

    let cancelled = false;

    (async () => {
      const hasPermission = await requestLocationPermission();
      if (cancelled || !hasPermission) return;

      watchIdRef.current = Geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          updateCaptainLocation({ latitude, longitude }).catch(() => {});
        },
        error => console.log('Presence location watch error:', error),
        {
          enableHighAccuracy: true,
          distanceFilter: 25,
          interval: 8000,
        },
      );
    })();

    return () => {
      cancelled = true;
      if (watchIdRef.current != null) {
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isOnline]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Captain Dashboard</Text>
          <View style={styles.onlineToggleRow}>
            <Text style={[styles.statusText, isOnline ? styles.onlineText : styles.offlineText]}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: '#CBD5E1', true: '#16A34A' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.earningsCard}>
          <Text style={styles.cardLabel}>TODAY'S SUMMARY</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Completed Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>0.0 hrs</Text>
              <Text style={styles.statLabel}>Online Hours</Text>
            </View>
          </View>
        </View>

        {isOnline ? (
          <View style={styles.activeContainer}>
            <Text style={styles.searchingTitle}>Looking for nearby passengers...</Text>
            <Text style={styles.searchingSubtitle}>Stay in high-demand zones for incoming ride requests</Text>
          </View>
        ) : (
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineTitle}>You are currently Offline</Text>
            <Text style={styles.offlineSubtitle}>Turn switch ON to start receiving ride requests</Text>
          </View>
        )}

        <View style={styles.bottomNavRow}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => navigation.navigate('Earnings')}
          >
            <Text style={styles.navBtnText}>Earnings & Statistics</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  onlineToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  onlineText: {
    color: '#22C55E',
  },
  offlineText: {
    color: '#64748B',
  },
  earningsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.5,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  activeContainer: {
    backgroundColor: '#FFF8F3',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  searchingSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },
  offlineContainer: {
    padding: 30,
    alignItems: 'center',
  },
  offlineTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748B',
  },
  offlineSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  bottomNavRow: {
    marginTop: 10,
  },
  navBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  navBtnText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default CaptainHomeScreen;