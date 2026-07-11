import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, Clock, Calendar, CheckCircle2, ChevronRight, ShieldCheck, MapPin } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export default function CheckoutScreen() {
  const router = useRouter();
  const { type, doctorId } = useLocalSearchParams();
  const { colors, isDark } = useTheme();

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
            <Image source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300' }} style={styles.avatar} />
            <View style={styles.doctorInfo}>
              <Text style={[styles.docName, { color: colors.text }]}>Dr. Sneha Iyer</Text>
              <Text style={styles.docSpecialty}>Gynaecologist • {type} Consultation</Text>
              <View style={styles.locationRow}>
                <MapPin size={12} color="#6B7280" />
                <Text style={styles.locationText}>Apollo Hospitals</Text>
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
              <Text style={[styles.scheduleValue, { color: colors.text }]}>Monday, 14 Aug</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.scheduleRow}>
            <View style={[styles.scheduleIconWrapper, { backgroundColor: '#FDF2F8' }]}>
              <Clock size={18} color="#DB2777" />
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={[styles.scheduleValue, { color: colors.text }]}>03:00 PM - 03:30 PM</Text>
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
            <Text style={[styles.paymentValue, { color: colors.text }]}>₹800</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Platform Fee</Text>
            <Text style={[styles.paymentValue, { color: colors.text }]}>₹20</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Taxes</Text>
            <Text style={[styles.paymentValue, { color: colors.text }]}>₹40</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.paymentRow}>
            <Text style={[styles.paymentTotalLabel, { color: colors.text }]}>Total Payable</Text>
            <Text style={[styles.paymentTotalValue, { color: colors.text }]}>₹860</Text>
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
          <Text style={[styles.consultationFee, { color: colors.text }]}>₹860</Text>
        </View>

        <TouchableOpacity 
          style={styles.bookButton} 
          onPress={() => router.push('/booking/success')}
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
  consultationFee: {
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
