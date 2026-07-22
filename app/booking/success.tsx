import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { CheckCircle2, Calendar, Clock, MapPin, ArrowRight, Download, Home } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import Animated, { FadeInDown, FadeIn, useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing, withSequence, withSpring } from 'react-native-reanimated';
import { useBookingStore } from '@/hooks/useBookingStore';

const { width } = Dimensions.get('window');

export default function BookingSuccessScreen() {
  const router = useRouter();
  const { appointmentId } = useLocalSearchParams();
  const { colors, isDark } = useTheme();

  const getAppointment = useBookingStore(state => state.getAppointment);
  const appointment = getAppointment(appointmentId as string);

  // Animations
  const checkScale = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    checkScale.value = withDelay(
      300, 
      withSpring(1, { damping: 12, stiffness: 90 })
    );
    cardTranslateY.value = withDelay(
      600,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) })
    );
    cardOpacity.value = withDelay(
      600,
      withTiming(1, { duration: 600 })
    );
  }, []);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }]
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }]
  }));

  if (!appointment) {
    return (
      <View style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#F5F7FA', justifyContent: 'center', alignItems: 'center' }]}>
         <Text style={{ color: colors.text }}>Booking not found.</Text>
         <TouchableOpacity onPress={() => router.replace('/')} style={{ marginTop: 20 }}>
            <Text style={{ color: colors.accent }}>Go Home</Text>
         </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#FDFDFD' }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Success Header Area */}
        <View style={styles.successHeader}>
          <Animated.View style={[styles.checkCircle, checkAnimatedStyle]}>
            <CheckCircle2 size={64} color="#10B981" />
          </Animated.View>
          <Animated.Text entering={FadeInDown.delay(700)} style={[styles.title, { color: colors.text }]}>
            Booking Confirmed!
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(800)} style={styles.subtitle}>
            Your appointment has been successfully booked.
          </Animated.Text>
        </View>

        {/* Dynamic Booking Details Card */}
        <Animated.View style={[
          styles.ticketCard, 
          { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' },
          cardAnimatedStyle
        ]}>
          <View style={styles.ticketHeader}>
            <View>
              <Text style={styles.ticketLabel}>Doctor</Text>
              <Text style={[styles.ticketValue, { color: colors.text }]}>{appointment.doctorName}</Text>
              <Text style={styles.ticketSubValue}>{appointment.speciality}</Text>
            </View>
          </View>
          
          <View style={styles.dashLine} />

          <View style={styles.ticketBody}>
            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: isDark ? '#2A2A2A' : '#F5F7FA' }]}>
                <Calendar size={18} color={colors.accent} />
              </View>
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{appointment.date}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: isDark ? '#2A2A2A' : '#F5F7FA' }]}>
                <Clock size={18} color="#F59E0B" />
              </View>
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{appointment.time}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: isDark ? '#2A2A2A' : '#F5F7FA' }]}>
                <MapPin size={18} color="#EC4899" />
              </View>
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{appointment.location}</Text>
              </View>
            </View>
          </View>

          <View style={styles.ticketFooter}>
            <Text style={styles.bookingIdText}>Booking ID: {appointment.id}</Text>
          </View>

          {/* Ticket Cutout Effects */}
          <View style={[styles.cutout, styles.cutoutLeft, { backgroundColor: isDark ? '#121212' : '#FDFDFD' }]} />
          <View style={[styles.cutout, styles.cutoutRight, { backgroundColor: isDark ? '#121212' : '#FDFDFD' }]} />
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(1000)} style={styles.actionArea}>
          <TouchableOpacity 
            style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
            onPress={() => router.replace(`/appointments/${appointment.id}` as any)}
          >
            <Text style={styles.primaryBtnText}>View Appointment</Text>
            <ArrowRight size={18} color="#FFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryBtn, { borderColor: isDark ? '#333' : '#E5E7EB' }]}
            onPress={() => router.replace('/')}
          >
            <Home size={18} color={colors.text} />
            <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Back to Home</Text>
          </TouchableOpacity>
        </Animated.View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
  ticketCard: {
    width: width - 48,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 40,
  },
  ticketHeader: {
    padding: 24,
    paddingBottom: 20,
  },
  ticketLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ticketValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  ticketSubValue: {
    fontSize: 14,
    color: '#0D9488',
    fontWeight: '600',
  },
  dashLine: {
    height: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginHorizontal: 24,
  },
  ticketBody: {
    padding: 24,
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  ticketFooter: {
    backgroundColor: '#00000005',
    padding: 16,
    alignItems: 'center',
  },
  bookingIdText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '700',
    letterSpacing: 1,
  },
  cutout: {
    position: 'absolute',
    top: 96, // Roughly where the dash line is
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  cutoutLeft: {
    left: -12,
  },
  cutoutRight: {
    right: -12,
  },
  actionArea: {
    width: '100%',
    gap: 16,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
  }
});
