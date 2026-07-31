import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight, ArrowLeft, Plus, CalendarPlus, Receipt } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useBookingStore } from '@/hooks/useBookingStore';

export default function AppointmentsScreen() {
  const insets = useSafeAreaInsets();
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
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        {/* Header */}
        <View style={[styles.headerRow, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>My Appointments</Text>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TouchableOpacity 
              style={[styles.receiptHeaderBtn, { backgroundColor: isDark ? '#2D2D2D' : '#F1F5F9' }]}
              onPress={() => router.push('/profile/payments')}
            >
              <Receipt size={18} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.bookBtn, { backgroundColor: colors.accent }]}
              onPress={() => router.push('/category/doctor')}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.bookBtnText}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Header Tabs */}
        <View style={[styles.tabsContainer, { borderBottomColor: isDark ? '#333' : '#F0F0F0' }]}>
          <Pressable 
            style={[styles.tab, activeTab === 'upcoming' && { borderBottomColor: colors.accent }]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'upcoming' ? colors.accent : colors.textSecondary,
                fontWeight: activeTab === 'upcoming' ? '700' : '500'
              }
            ]}>Upcoming ({appointments.filter(a => a.status === 'upcoming').length})</Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'past' && { borderBottomColor: colors.accent }]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'past' ? colors.accent : colors.textSecondary,
                fontWeight: activeTab === 'past' ? '700' : '500'
              }
            ]}>Past History</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
          {filteredAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <CalendarIcon size={56} color={colors.accent} opacity={0.3} />
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                No {activeTab} appointments
              </Text>
              <Text style={[styles.emptyStateSubtitle, { color: colors.textMuted }]}>
                Book a consultation with top specialists & doctors nearby.
              </Text>
              <TouchableOpacity 
                style={[styles.bookNowBtn, { backgroundColor: colors.accent }]}
                onPress={() => router.push('/category/doctor')}
              >
                <CalendarPlus size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.bookNowBtnText}>Book Doctor Consultation</Text>
              </TouchableOpacity>
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
                      <Image source={{ uri: app.image }} style={{ width: 52, height: 52, borderRadius: 26, marginRight: 12 }} />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '700', flex: 1 },
  receiptHeaderBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  bookBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, gap: 4 },
  bookBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 15,
  },
  listContainer: {
    padding: 20,
    gap: 16,
    paddingBottom: 60,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 6,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  bookNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 24,
  },
  bookNowBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
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
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  specialty: {
    fontSize: 13,
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
    padding: 14,
    borderRadius: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '45%',
  },
  detailText: {
    fontSize: 13,
    fontWeight: '600',
  }
});

