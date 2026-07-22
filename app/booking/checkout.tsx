import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, Clock, Calendar, CheckCircle2, ChevronRight, ShieldCheck, MapPin } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/hooks/useBookingStore';

export default function CheckoutScreen() {
  const router = useRouter();
  const { type, doctorId, date, time } = useLocalSearchParams();
  const { colors, isDark } = useTheme();

  const getDoctor = useBookingStore(state => state.getDoctor);
  const getHospital = useBookingStore(state => state.getHospital);
  const bookAppointment = useBookingStore(state => state.bookAppointment);

  const doctorData = getDoctor(doctorId as string);
  
  if (!doctorData) {
    return (
      <View style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#F5F7FA', justifyContent: 'center', alignItems: 'center' }]}>
         <Text style={{ color: colors.text }}>Doctor details not found.</Text>
         <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
            <Text style={{ color: colors.accent }}>Go Back</Text>
         </TouchableOpacity>
      </View>
    );
  }

  const hospitalData = getHospital(doctorData.hospitalId);
  const consultationFee = parseInt(doctorData.fee);
  const platformFee = 20;
  const taxes = Math.round(consultationFee * 0.05); // 5% tax mock
  const totalPayable = consultationFee + platformFee + taxes;

  const handleConfirm = () => {
    const appointmentId = bookAppointment({
      doctorId: doctorData.id,
      doctorName: doctorData.name,
      speciality: doctorData.speciality,
      hospitalName: hospitalData?.name || doctorData.location,
      location: doctorData.location,
      date: (date as string) || 'Today',
      time: (time as string) || '10:00 AM',
      fee: totalPayable.toString(),
      type: (type as string) || 'In-Clinic',
      image: doctorData.image
    });

    router.replace({ pathname: '/booking/success', params: { appointmentId } });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#F5F7FA' }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Confirm Appointment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Doctor Summary */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <View style={styles.doctorRow}>
            <Image source={{ uri: doctorData.image }} style={styles.avatar} />
            <View style={styles.doctorInfo}>
              <Text style={[styles.docName, { color: colors.text }]}>{doctorData.name}</Text>
              <Text style={styles.docSpecialty}>{doctorData.speciality} • {type || 'In-Clinic'} Consultation</Text>
              <View style={styles.locationRow}>
                <MapPin size={12} color="#6B7280" />
                <Text style={styles.locationText}>{hospitalData?.name || doctorData.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Schedule */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Schedule</Text>
        <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <View style={styles.scheduleRow}>
            <View style={styles.scheduleIconWrapper}>
              <Calendar size={18} color="#0D9488" />
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={[styles.scheduleValue, { color: colors.text }]}>{date || 'Select Date'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.scheduleRow}>
            <View style={[styles.scheduleIconWrapper, { backgroundColor: '#FDF2F8' }]}>
              <Clock size={18} color="#DB2777" />
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={[styles.scheduleValue, { color: colors.text }]}>{time || 'Select Time'}</Text>
            </View>
          </View>
        </View>

        {/* Patient Details */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Patient Details</Text>
        <TouchableOpacity style={[styles.card, styles.patientCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <View>
            <Text style={[styles.patientName, { color: colors.text }]}>John Doe</Text>
            <Text style={styles.patientSubtext}>Male, 28 years</Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Payment Summary */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Summary</Text>
        <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Consultation Fee</Text>
            <Text style={[styles.paymentValue, { color: colors.text }]}>₹{consultationFee}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Platform Fee</Text>
            <Text style={[styles.paymentValue, { color: colors.text }]}>₹{platformFee}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Taxes</Text>
            <Text style={[styles.paymentValue, { color: colors.text }]}>₹{taxes}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.paymentRow}>
            <Text style={[styles.paymentTotalLabel, { color: colors.text }]}>Total Payable</Text>
            <Text style={[styles.paymentTotalValue, { color: colors.text }]}>₹{totalPayable}</Text>
          </View>
          <View style={styles.secureRow}>
            <ShieldCheck size={14} color="#10B981" />
            <Text style={styles.secureText}>100% Secure Payment</Text>
          </View>
        </View>

      </ScrollView>

      {/* Footer Action Bar */}
      <View style={[styles.footerBar, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderTopColor: isDark ? '#333' : '#E5E7EB' }]}>
        <View style={styles.availabilityCol}>
          <Text style={styles.totalPayableLabel}>Total Payable</Text>
          <Text style={[styles.consultationFeeLabel, { color: colors.text }]}>₹{totalPayable}</Text>
        </View>

        <TouchableOpacity 
          style={styles.bookButton} 
          onPress={handleConfirm}
        >
          <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.videoBookText}>Pay & Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 20,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  docSpecialty: {
    fontSize: 13,
    color: '#0D9488',
    fontWeight: '600',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
    marginVertical: 12,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientName: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  patientSubtext: {
    fontSize: 13,
    color: '#6B7280',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  paymentTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  paymentTotalValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 6,
  },
  secureText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  availabilityCol: {
    flex: 1,
  },
  totalPayableLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  consultationFeeLabel: {
    fontSize: 18,
    fontWeight: '800',
  },
  bookButton: {
    flex: 1.5,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EC4899',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  videoBookText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
