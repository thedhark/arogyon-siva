import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Tag,
  User,
  Users,
  Plus,
  X,
  UserCheck,
  FileText,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/hooks/useBookingStore';

import PaymentGatewayModal, { PaymentDetails } from '@/components/booking/PaymentGatewayModal';
import CouponOverlay from '@/components/packages/CouponOverlay';

export interface PatientMember {
  id: string;
  name: string;
  relation: string;
  age: string;
  gender: string;
  notes?: string;
}

const INITIAL_PATIENTS: PatientMember[] = [
  { id: 'p1', name: 'John Doe', relation: 'Self', age: '28', gender: 'Male', notes: '' },
  { id: 'p2', name: 'Anita Doe', relation: 'Spouse', age: '26', gender: 'Female', notes: 'Mild seasonal allergies' },
  { id: 'p3', name: 'Ramesh Doe', relation: 'Father', age: '60', gender: 'Male', notes: 'Hypertension' },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { type, doctorId, date, time } = useLocalSearchParams();
  const { colors, isDark } = useTheme();

  const getDoctor = useBookingStore(state => state.getDoctor);
  const getHospital = useBookingStore(state => state.getHospital);
  const bookAppointment = useBookingStore(state => state.bookAppointment);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCouponOverlay, setShowCouponOverlay] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  // Patient / Family Member State
  const [patients, setPatients] = useState<PatientMember[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p1');
  const [showPatientModal, setShowPatientModal] = useState<boolean>(false);
  const [showAddFamilyForm, setShowAddFamilyForm] = useState<boolean>(false);

  // New Family Member Form State
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('Spouse');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState('Female');
  const [newNotes, setNewNotes] = useState('');

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

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const hospitalData = getHospital(doctorData.hospitalId);
  const consultationFee = parseInt(doctorData.fee) || 500;
  const platformFee = 20;
  const taxes = Math.round(consultationFee * 0.05); // 5% tax mock

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalPayable = Math.max(0, consultationFee + platformFee + taxes - discount);

  const handleApplyCoupon = (code: string) => {
    let disc = 50;
    if (code.toUpperCase() === 'AROGYON50') disc = 50;
    else if (code.toUpperCase() === 'HEALTH10') disc = Math.round(consultationFee * 0.1);
    else if (code.toUpperCase() === 'WELCOME100') disc = 100;
    else if (code.toUpperCase() === 'HEALTH20') disc = Math.round(consultationFee * 0.2);
    else if (code.toUpperCase() === 'FIRSTCARE') disc = 150;

    setAppliedCoupon({ code, discount: disc });
  };

  const handleAddFamilyMember = () => {
    if (!newName.trim()) return;

    const newMember: PatientMember = {
      id: `p-${Date.now()}`,
      name: newName.trim(),
      relation: newRelation,
      age: newAge.trim() || '30',
      gender: newGender,
      notes: newNotes.trim(),
    };

    setPatients(prev => [...prev, newMember]);
    setSelectedPatientId(newMember.id);

    // Reset form
    setNewName('');
    setNewAge('');
    setNewNotes('');
    setShowAddFamilyForm(false);
  };

  const handlePaymentSuccess = (payment: PaymentDetails) => {
    setShowPaymentModal(false);
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
      image: doctorData.image,
    });

    router.replace({ pathname: '/booking/success', params: { appointmentId, paymentId: payment.paymentId } });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#F5F7FA' }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

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
                <Text style={styles.locationText}>{hospitalData?.name || (doctorData.location.includes(',') ? doctorData.location.split(',')[1].trim() : doctorData.location)}</Text>
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

        {/* Patient Details (Family Booking Supported) */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 0, marginBottom: 0 }]}>Patient Details</Text>
          <TouchableOpacity onPress={() => setShowPatientModal(true)} style={styles.changePatientBtn}>
            <Users size={14} color="#0D9488" />
            <Text style={styles.changePatientText}>Change / Add Family</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.card, styles.patientCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}
          onPress={() => setShowPatientModal(true)}
        >
          <View style={styles.patientLeft}>
            <View style={styles.patientAvatarBg}>
              <User size={22} color="#0D9488" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.patientHeaderRow}>
                <Text style={[styles.patientName, { color: colors.text }]}>{selectedPatient.name}</Text>
                <View style={styles.relationChip}>
                  <Text style={styles.relationChipText}>{selectedPatient.relation}</Text>
                </View>
              </View>
              <Text style={styles.patientSubtext}>
                {selectedPatient.gender}, {selectedPatient.age} years
              </Text>
              {Boolean(selectedPatient.notes) && (
                <View style={styles.notesBox}>
                  <FileText size={12} color="#6B7280" />
                  <Text style={styles.notesText} numberOfLines={1}>
                    {selectedPatient.notes}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Coupon Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Apply Coupon</Text>
        <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <TouchableOpacity
            style={styles.couponRow}
            onPress={() => setShowCouponOverlay(true)}
          >
            <View style={styles.couponLeft}>
              <View style={[styles.couponIconBox, appliedCoupon ? { backgroundColor: '#ECFDF5' } : {}]}>
                <Tag size={20} color={appliedCoupon ? '#10B981' : '#EC4899'} />
              </View>
              <View>
                {appliedCoupon ? (
                  <>
                    <Text style={[styles.couponTitleText, { color: colors.text }]}>'{appliedCoupon.code}' Applied</Text>
                    <Text style={styles.couponSavedText}>You saved ₹{appliedCoupon.discount} on consultation</Text>
                  </>
                ) : (
                  <>
                    <Text style={[styles.couponTitleText, { color: colors.text }]}>Have a Coupon Code?</Text>
                    <Text style={styles.couponSubtitleText}>Tap to view available coupons or enter code</Text>
                  </>
                )}
              </View>
            </View>

            {appliedCoupon ? (
              <TouchableOpacity onPress={() => setAppliedCoupon(null)}>
                <Text style={styles.removeCouponBtn}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <ChevronRight size={20} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        </View>

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

          {appliedCoupon && (
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: '#10B981', fontWeight: '700' }]}>
                Coupon Discount ({appliedCoupon.code})
              </Text>
              <Text style={[styles.paymentValue, { color: '#10B981', fontWeight: '800' }]}>
                - ₹{appliedCoupon.discount}
              </Text>
            </View>
          )}

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
          onPress={() => setShowPaymentModal(true)}
        >
          <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.videoBookText}>Pay & Confirm</Text>
        </TouchableOpacity>
      </View>

      {/* Patient / Family Member Modal */}
      <Modal visible={showPatientModal} transparent animationType="slide" onRequestClose={() => setShowPatientModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {showAddFamilyForm ? 'Add Family Member' : 'Select Patient'}
              </Text>
              <TouchableOpacity onPress={() => { setShowPatientModal(false); setShowAddFamilyForm(false); }}>
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            {!showAddFamilyForm ? (
              <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
                {patients.map((p) => {
                  const isSelected = p.id === selectedPatientId;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[
                        styles.patientSelectCard,
                        { borderColor: isSelected ? '#0D9488' : (isDark ? '#333' : '#E5E7EB'), backgroundColor: isSelected ? (isDark ? '#112D29' : '#F0FDFA') : 'transparent' },
                      ]}
                      onPress={() => {
                        setSelectedPatientId(p.id);
                        setShowPatientModal(false);
                      }}
                    >
                      <View style={styles.patientLeft}>
                        <View style={[styles.patientAvatarBg, isSelected && { backgroundColor: '#0D9488' }]}>
                          <User size={20} color={isSelected ? '#FFFFFF' : '#0D9488'} />
                        </View>
                        <View>
                          <View style={styles.patientHeaderRow}>
                            <Text style={[styles.patientName, { color: colors.text }]}>{p.name}</Text>
                            <View style={styles.relationChip}>
                              <Text style={styles.relationChipText}>{p.relation}</Text>
                            </View>
                          </View>
                          <Text style={styles.patientSubtext}>{p.gender}, {p.age} years</Text>
                          {Boolean(p.notes) && <Text style={styles.notesText} numberOfLines={1}>{p.notes}</Text>}
                        </View>
                      </View>
                      {isSelected && <UserCheck size={20} color="#0D9488" />}
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity style={styles.addFamilyBtn} onPress={() => setShowAddFamilyForm(true)}>
                  <Plus size={18} color="#0D9488" />
                  <Text style={styles.addFamilyBtnText}>Add New Family Member</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Full Name</Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: isDark ? '#2C2C2E' : '#F9FAFB', color: colors.text, borderColor: isDark ? '#444' : '#E5E7EB' }]}
                    placeholder="e.g. Priya Sharma"
                    placeholderTextColor="#9CA3AF"
                    value={newName}
                    onChangeText={setNewName}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Relation</Text>
                  <View style={styles.pillsRow}>
                    {['Spouse', 'Child', 'Parent', 'Sibling', 'Other'].map((rel) => (
                      <TouchableOpacity
                        key={rel}
                        style={[styles.pillBtn, newRelation === rel && styles.pillBtnActive]}
                        onPress={() => setNewRelation(rel)}
                      >
                        <Text style={[styles.pillText, newRelation === rel && styles.pillTextActive]}>{rel}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>Age (Years)</Text>
                    <TextInput
                      style={[styles.formInput, { backgroundColor: isDark ? '#2C2C2E' : '#F9FAFB', color: colors.text, borderColor: isDark ? '#444' : '#E5E7EB' }]}
                      placeholder="e.g. 32"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={newAge}
                      onChangeText={setNewAge}
                    />
                  </View>

                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>Gender</Text>
                    <View style={styles.pillsRow}>
                      {['Male', 'Female', 'Other'].map((gen) => (
                        <TouchableOpacity
                          key={gen}
                          style={[styles.pillBtn, newGender === gen && styles.pillBtnActive]}
                          onPress={() => setNewGender(gen)}
                        >
                          <Text style={[styles.pillText, newGender === gen && styles.pillTextActive]}>{gen}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Symptoms / Health Notes (Optional)</Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: isDark ? '#2C2C2E' : '#F9FAFB', color: colors.text, borderColor: isDark ? '#444' : '#E5E7EB', height: 60, textAlignVertical: 'top' }]}
                    placeholder="e.g. Mild fever for 2 days, back pain"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    value={newNotes}
                    onChangeText={setNewNotes}
                  />
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddFamilyForm(false)}>
                    <Text style={styles.cancelBtnText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleAddFamilyMember}>
                    <Text style={styles.saveBtnText}>Save Patient</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <CouponOverlay
        visible={showCouponOverlay}
        onClose={() => setShowCouponOverlay(false)}
        onApply={handleApplyCoupon}
      />

      <PaymentGatewayModal
        visible={showPaymentModal}
        amount={totalPayable}
        title="Confirm Appointment Payment"
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />
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
  changePatientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  changePatientText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  patientAvatarBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  patientHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '800',
  },
  relationChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  relationChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  patientSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  notesText: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  couponIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  couponTitleText: {
    fontSize: 14,
    fontWeight: '800',
  },
  couponSubtitleText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  couponSavedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
    marginTop: 2,
  },
  removeCouponBtn: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 13,
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
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  patientSelectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  addFamilyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#0D9488',
    borderStyle: 'dashed',
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  addFamilyBtnText: {
    color: '#0D9488',
    fontWeight: '800',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 6,
  },
  formInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  pillBtnActive: {
    backgroundColor: '#0D9488',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontWeight: '700',
    color: '#4B5563',
  },
  saveBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0D9488',
    alignItems: 'center',
  },
  saveBtnText: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
