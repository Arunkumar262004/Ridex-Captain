import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const CaptainHomeScreen = ({ navigation }) => {
  const [isOnline, setIsOnline] = useState(true);

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
              trackColor={{ false: '#334155', true: '#16A34A' }}
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
    backgroundColor: '#0F172A',
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
    color: '#F8FAFC',
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
    color: '#94A3B8',
  },
  earningsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
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
    color: '#F8FAFC',
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#334155',
  },
  activeContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  searchingSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
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
    color: '#94A3B8',
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
    backgroundColor: '#334155',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  navBtnText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default CaptainHomeScreen;