import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Calendar as CalendarIcon, Clock, MapPin, User, FileText, XCircle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useBookingStore } from '@/hooks/useBookingStore';

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();

  const getAppointment = useBookingStore(state => state.getAppointment);
  const cancelAppointment = useBookingStore(state => state.cancelAppointment);
  
  const appointment = getAppointment(id as string);

  if (!appointment) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Appointment not found.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.accent }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const handleCancel = () => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive",
          onPress: () => {
            cancelAppointment(appointment.id);
            router.back();
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return '#10B981';
      case 'completed': return '#3B82F6';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const statusColor = getStatusColor(appointment.status);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ArogyonAppt_${appointment.id}`;

  return (
    <AnimatedScreen entrance="fade">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Appointment Details</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Status Banner */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <View style={[
              styles.statusBanner, 
              { 
                backgroundColor: appointment.confirmationStatus === 'visit_requested' 
                  ? '#FEF3C7' 
                  : statusColor + '15' 
              }
            ]}>
              <Text style={[
                styles.statusBannerText, 
                { 
                  color: appointment.confirmationStatus === 'visit_requested' 
                    ? '#D97706' 
                    : statusColor 
                }
              ]}>
                {appointment.status === 'upcoming' && (
                  appointment.confirmationStatus === 'visit_requested'
                    ? 'Visit Requested • Awaiting Hospital Confirmation'
                    : 'Appointment Confirmed'
                )}
                {appointment.status === 'completed' && 'Appointment Completed'}
                {appointment.status === 'cancelled' && 'Appointment Cancelled'}
              </Text>
            </View>

            {appointment.confirmationStatus === 'visit_requested' && (
              <View style={{ backgroundColor: isDark ? '#1F2937' : '#F0FDFA', padding: 14, borderRadius: 14, marginTop: 10, borderWidth: 1, borderColor: isDark ? '#374151' : '#CCFBF1' }}>
                <Text style={{ fontSize: 13, color: isDark ? '#E5E7EB' : '#0F766E', fontWeight: '600' }}>
                  ⏳ Hospital Approval Pending: {appointment.hospitalName} has received your visit request and is verifying doctor availability. Slot confirmation usually takes 10-15 mins.
                </Text>
              </View>
            )}
          </Animated.View>

          {/* QR Code Section (Only for upcoming) */}
          {appointment.status === 'upcoming' && (
            <Animated.View entering={FadeInDown.delay(200)} style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Scan at Reception</Text>
              <View style={styles.qrContainer}>
                <Image source={{ uri: qrUrl }} style={styles.qrCode} />
                <Text style={[styles.qrText, { color: colors.textSecondary }]}>ID: #{appointment.id}</Text>
              </View>
            </Animated.View>
          )}

          {/* Details Section */}
          <Animated.View entering={FadeInDown.delay(300)} style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Doctor Details</Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              {appointment.image && (
                <Image source={{ uri: appointment.image }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }} />
              )}
              <View>
                <Text style={[styles.doctorName, { color: colors.text }]}>{appointment.doctorName}</Text>
                <Text style={[styles.specialty, { color: colors.textSecondary }]}>{appointment.speciality}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <CalendarIcon size={20} color={colors.accent} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Date</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{appointment.date}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Clock size={20} color={colors.accent} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Time</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{appointment.time}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={20} color={colors.accent} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Location</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{appointment.location}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Patient Details */}
          <Animated.View entering={FadeInDown.delay(400)} style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Patient Details</Text>
            <View style={styles.infoRow}>
              <User size={20} color={colors.textSecondary} />
              <Text style={[styles.infoValue, { color: colors.text, marginLeft: 12 }]}>Self</Text>
            </View>
            <View style={styles.infoRow}>
              <FileText size={20} color={colors.textSecondary} />
              <Text style={[styles.infoValue, { color: colors.text, marginLeft: 12 }]}>{appointment.type} Consultation</Text>
            </View>
          </Animated.View>

          {/* Payment & Receipt Details */}
          <Animated.View entering={FadeInDown.delay(450)} style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment & Receipt</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Payment Status</Text>
                <Text style={[styles.infoValue, { color: appointment.paymentStatus === 'refunded' ? '#EF4444' : '#10B981' }]}>
                  {appointment.paymentStatus === 'refunded' ? 'Refunded' : 'Paid'} • ₹{appointment.totalPaid || appointment.fee}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Payment Method & Ref ID</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {appointment.paymentMethod || 'UPI Instant'} ({appointment.paymentId || 'PAY-RZP-984210'})
                </Text>
              </View>
            </View>
            <Pressable 
              style={[styles.receiptBtn, { backgroundColor: colors.accent + '15' }]} 
              onPress={() => router.push('/profile/payments')}
            >
              <FileText size={16} color={colors.accent} />
              <Text style={[styles.receiptBtnText, { color: colors.accent }]}>View All Receipts & Invoices</Text>
            </Pressable>
          </Animated.View>
          
        </ScrollView>

        {/* Actions (Only for upcoming) */}
        {appointment.status === 'upcoming' && (
          <Animated.View entering={FadeInDown.delay(500)} style={[styles.footer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderTopColor: isDark ? '#333' : '#F0F0F0' }]}>
            <Pressable 
              style={[styles.actionButton, { backgroundColor: '#FF3B3015' }]}
              onPress={handleCancel}
            >
              <Text style={[styles.actionButtonText, { color: '#FF3B30' }]}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, { backgroundColor: colors.accent }]}>
              <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Reschedule</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 100,
  },
  statusBanner: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statusBannerText: {
    fontSize: 16,
    fontWeight: '700',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  qrCode: {
    width: 150,
    height: 150,
    marginBottom: 12,
  },
  qrText: {
    fontSize: 14,
    fontWeight: '500',
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
    opacity: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    gap: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginTop: 4,
  },
  receiptBtnText: {
    fontSize: 14,
    fontWeight: '700',
  }
});
