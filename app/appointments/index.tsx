import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight, CheckCircle2, XCircle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useBookingStore } from '@/hooks/useBookingStore';

export default function AppointmentsScreen() {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const appointments = useBookingStore(state => state.appointments);

  const filteredAppointments = appointments.filter(app => {
    if (activeTab === 'upcoming') return app.status === 'upcoming';
    return app.status === 'completed' || app.status === 'cancelled';
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return colors.accent;
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return colors.textSecondary;
    }
  };

  return (
    <AnimatedScreen entrance="fade">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        {/* Header Tabs */}
        <View style={[styles.tabsContainer, { borderBottomColor: isDark ? '#333' : '#F0F0F0' }]}>
          <Pressable 
            style={[styles.tab, activeTab === 'upcoming' && { borderBottomColor: colors.accent }]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'upcoming' ? colors.accent : colors.textSecondary,
                fontWeight: activeTab === 'upcoming' ? '600' : '500'
              }
            ]}>Upcoming</Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'past' && { borderBottomColor: colors.accent }]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'past' ? colors.accent : colors.textSecondary,
                fontWeight: activeTab === 'past' ? '600' : '500'
              }
            ]}>Past</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
          {filteredAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <CalendarIcon size={48} color={colors.textSecondary} opacity={0.5} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No {activeTab} appointments found
              </Text>
            </View>
          ) : (
            filteredAppointments.map((app, index) => (
              <Animated.View key={app.id} entering={FadeInDown.delay(index * 100)}>
                <Pressable 
                  style={[
                    styles.card, 
                    { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }
                  ]}
                  onPress={() => router.push(`/appointments/${app.id}` as any)}
                >
                  <View style={styles.cardHeader}>
                    {app.image && (
                      <Image source={{ uri: app.image }} style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }} />
                    )}
                    <View style={styles.doctorInfo}>
                      <Text style={[styles.doctorName, { color: colors.text }]}>{app.doctorName}</Text>
                      <Text style={[styles.specialty, { color: colors.textSecondary }]}>{app.speciality}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(app.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(app.status) }]}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailsGrid}>
                    <View style={styles.detailRow}>
                      <CalendarIcon size={16} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.text }]}>{app.date}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Clock size={16} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.text }]}>{app.time}</Text>
                    </View>
                    <View style={[styles.detailRow, { width: '100%', marginTop: 8 }]}>
                      <MapPin size={16} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.text }]} numberOfLines={1}>
                        {app.hospitalName || app.location}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            ))
          )}
        </ScrollView>
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  doctorInfo: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'center'
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#00000005',
    padding: 12,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '45%',
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
  }
});
