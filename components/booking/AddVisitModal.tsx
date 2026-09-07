import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Platform,
  useWindowDimensions,
  Share as RNShare
} from 'react-native';
import { 
  ArrowLeft, 
  ChevronLeft,
  Bell,
  Plus, 
  Calendar as CalendarIcon, 
  FileEdit,
  Share2,
  Bookmark
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { useBookingStore } from '@/hooks/useBookingStore';
import { useProfileStore } from '@/hooks/useProfileStore';
import DoctorBookingHeaderCard from './DoctorBookingHeaderCard';
import DoctorAboutCard from './DoctorAboutCard';
import PersonSlotCard from './PersonSlotCard';
import MultiPersonSlotSheet, { PatientSlotAssignment } from './MultiPersonSlotSheet';
import SelectFamilyMemberModal from './SelectFamilyMemberModal';
import StickyBookingPaymentBar from './StickyBookingPaymentBar';

interface AddVisitModalProps {
  visible: boolean;
  doctor: any;
  hospitalName?: string;
  onClose: () => void;
  onAdded?: () => void;
}

const getDynamicBookingDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateLabel = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    dates.push({
      id: String(i + 1),
      day: dayLabel,
      date: dateLabel,
      fullDate: `${dayLabel}, ${dateLabel}`,
    });
  }
  return dates;
};

export default function AddVisitModal({ 
  visible, 
  doctor, 
  hospitalName: hospitalNameProp = 'Apollo Hospital', 
  onClose, 
  onAdded 
}: AddVisitModalProps) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && windowWidth >= 1024;
  const addCartItem = useBookingStore((state) => state.addCartItem);
  const userProfile = useProfileStore((state) => state.userProfile);

  const datesList = React.useMemo(() => getDynamicBookingDates(), []);

  // Global selected date for the visit
  const [selectedDate, setSelectedDate] = useState(datesList[0]);
  const [requestNotes, setRequestNotes] = useState('');

  // Multi-patient assignment state
  const [assignedPatients, setAssignedPatients] = useState<PatientSlotAssignment[]>([
    {
      id: 'me',
      name: userProfile?.name || 'Self',
      relation: 'Self',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250',
      selectedDate: datesList[0].fullDate,
      selectedTime: '10:00 AM',
    }
  ]);

  // Active patient for opening the "More slots" bottom sheet
  const [activeSheetPatient, setActiveSheetPatient] = useState<PatientSlotAssignment | null>(null);
  // Show "+ Add another person" modal
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);

  if (!doctor) return null;

  const docName = doctor.name || doctor.title || 'Dr. Specialist';
  const hospitalName = doctor.hospitalName || hospitalNameProp;
  const clinicFee = parseInt(String(doctor.fee || '600').replace(/[^0-9]/g, ''), 10) || 600;
  const originalFee = Math.round(clinicFee * 1.5);
  const totalFee = clinicFee * assignedPatients.length;

  const handleGlobalDateChange = (dateItem: any) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    setSelectedDate(dateItem);
    setAssignedPatients((prev) =>
      prev.map((p) => ({ ...p, selectedDate: dateItem.fullDate }))
    );
  };

  const handleQuickTimeChange = (patientId: string, time: string) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    setAssignedPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, selectedTime: time } : p))
    );
  };

  const handleSheetSlotSelect = (patientId: string, date: string, time: string) => {
    setAssignedPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, selectedDate: date, selectedTime: time } : p
      )
    );
  };

  const handleRemovePerson = (id: string) => {
    if (assignedPatients.length <= 1) return;
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    setAssignedPatients((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddPerson = (newPerson: PatientSlotAssignment) => {
    setAssignedPatients((prev) => [
      ...prev,
      {
        ...newPerson,
        selectedDate: selectedDate.fullDate,
      },
    ]);
  };

  const handleConfirmAdd = () => {
    assignedPatients.forEach((patient, idx) => {
      addCartItem({
        type: 'visit',
        itemId: `${doctor.id || 'doc'}-${patient.id}-${Date.now()}-${idx}`,
        title: docName,
        subtitle: `${doctor.speciality || 'Specialist'} • Clinic Consultation`,
        price: clinicFee,
        originalPrice: originalFee,
        savingsAmount: originalFee - clinicFee,
        image: doctor.image || '',
        hospitalName: hospitalName,
        selectedDate: patient.selectedDate,
        selectedTime: patient.selectedTime,
        assignedPatientId: patient.id,
        assignedPatientName: patient.name,
        assignedPatientRelation: patient.relation,
        assignedPatientAvatar: patient.avatar,
        notes: requestNotes.trim() || undefined,
      });
    });

    onClose();
    if (onAdded) onAdded();
  };

  return (
    <Modal 
      visible={visible} 
      animationType={Platform.OS === 'web' ? 'fade' : 'slide'} 
      transparent={Platform.OS === 'web'}
      presentationStyle={Platform.OS === 'web' ? 'overFullScreen' : 'fullScreen'}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalRoot, Platform.OS === 'web' && styles.webModalRoot]}>
        {/* On Web: Backdrop click outside middle column closes modal */}
        {Platform.OS === 'web' && (
          <TouchableOpacity
            style={styles.webBackdrop}
            activeOpacity={1}
            onPress={onClose}
          />
        )}

        <View
          style={[
            styles.modalContent,
            { backgroundColor: isDark ? '#0D0E11' : '#F8FAFC' },
            Platform.OS === 'web' && (
              isDesktopWeb
                ? {
                    position: 'absolute' as any,
                    left: 260,
                    right: 350,
                    top: 0,
                    bottom: 0,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderLeftColor: isDark ? '#262626' : '#E2E8F0',
                    borderRightColor: isDark ? '#262626' : '#E2E8F0',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                  }
                : {
                    width: '100%',
                    maxWidth: 620,
                    height: '100%',
                    alignSelf: 'center',
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderLeftColor: isDark ? '#262626' : '#E2E8F0',
                    borderRightColor: isDark ? '#262626' : '#E2E8F0',
                  }
            ),
          ]}
        >
          {/* Top Header matching reference design */}
          <View style={[styles.topHeader, { backgroundColor: isDark ? '#16181D' : '#F8FAFC' }]}>
            <TouchableOpacity 
              style={[styles.headerRoundBtn, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0' }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <ChevronLeft size={22} color={isDark ? '#F8FAFC' : '#1E293B'} />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>Doctor Details</Text>

            <TouchableOpacity 
              style={[styles.headerRoundBtn, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0' }]}
              onPress={() => {
                onClose();
                router.push('/notifications');
              }}
              activeOpacity={0.8}
            >
              <Bell size={20} color={isDark ? '#F8FAFC' : '#1E293B'} />
            </TouchableOpacity>
          </View>

        {/* Unified Scroll Content */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* 1. Doctor Profile Overview Card */}
          <DoctorBookingHeaderCard
            doctor={doctor}
            hospitalName={hospitalName}
            isDark={isDark}
          />

          {/* 2. Section Heading: Select appointment time */}
          <View style={styles.sectionHeaderBlock}>
            <Text style={[styles.sectionHeading, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Select appointment time
            </Text>
            <Text style={[styles.sectionSubheading, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Choose a time for each person
            </Text>
          </View>

          {/* 3. Global Date Selector Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesScroll}
          >
            {datesList.map((d) => {
              const isSelected = selectedDate.id === d.id;
              return (
                <TouchableOpacity
                  key={d.id}
                  style={[
                    styles.dateChip,
                    {
                      backgroundColor: isSelected
                        ? '#6366F1'
                        : (isDark ? '#16181D' : '#FFFFFF'),
                      borderColor: isSelected
                        ? '#6366F1'
                        : (isDark ? '#2E3340' : '#E2E8F0'),
                    },
                  ]}
                  onPress={() => handleGlobalDateChange(d)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      { color: isSelected ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B') },
                    ]}
                  >
                    {d.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateText,
                      { color: isSelected ? '#FFFFFF' : (isDark ? '#F8FAFC' : '#0F172A') },
                    ]}
                  >
                    {d.date}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[
                styles.calendarBtn,
                {
                  backgroundColor: isDark ? '#16181D' : '#FFFFFF',
                  borderColor: isDark ? '#2E3340' : '#E2E8F0',
                },
              ]}
              activeOpacity={0.8}
            >
              <CalendarIcon size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </ScrollView>

          {/* 4. Multi-Patient Slot Cards */}
          <View style={styles.patientsListBlock}>
            {assignedPatients.map((patient, idx) => (
              <PersonSlotCard
                key={`${patient.id}-${idx}`}
                patient={patient}
                canRemove={assignedPatients.length > 1}
                onRemove={handleRemovePerson}
                onSelectQuickTime={handleQuickTimeChange}
                onOpenMoreSlots={(p) => setActiveSheetPatient(p)}
              />
            ))}
          </View>

          {/* 5. "+ Add another person" Action Button */}
          <TouchableOpacity
            style={[
              styles.addPersonCard,
              {
                backgroundColor: isDark ? '#16181D' : '#FFFFFF',
                borderColor: isDark ? '#4F46E5' : '#818CF8',
              },
            ]}
            onPress={() => setShowAddPersonModal(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.addPersonIconCircle, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#EEF2FF' }]}>
              <Plus size={20} color="#6366F1" strokeWidth={2.4} />
            </View>
            <View style={styles.addPersonTextCol}>
              <Text style={styles.addPersonTitle}>Add another person</Text>
              <Text style={[styles.addPersonSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Add family member or friend
              </Text>
            </View>
          </TouchableOpacity>

          {/* 6. Medical Symptoms / Notes (Optional) */}
          <View style={styles.notesSection}>
            <View style={styles.notesHeaderRow}>
              <Text style={[styles.notesLabel, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Add symptoms or notes <Text style={[styles.optionalTag, { color: isDark ? '#94A3B8' : '#64748B' }]}> (optional)</Text>
              </Text>
            </View>

            <View
              style={[
                styles.notesInputWrapper,
                {
                  backgroundColor: isDark ? '#16181D' : '#FFFFFF',
                  borderColor: isDark ? '#2E3340' : '#E2E8F0',
                },
              ]}
            >
              <TextInput
                style={[
                  styles.notesInput,
                  { color: isDark ? '#F8FAFC' : '#0F172A' },
                ]}
                placeholder="E.g. Headache, dizziness, neck pain..."
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                multiline
                numberOfLines={2}
                value={requestNotes}
                onChangeText={setRequestNotes}
              />
              <FileEdit size={18} color={isDark ? '#94A3B8' : '#94A3B8'} style={styles.editIcon} />
            </View>
          </View>
        </ScrollView>

        {/* Sticky Booking Payment Bar */}
        <StickyBookingPaymentBar
          priceDropText="Special Arogyon Care Discount"
          price={totalFee}
          originalPrice={originalFee}
          discountText="55% Off"
          ctaText={assignedPatients.length > 1 ? `Confirm (${assignedPatients.length} Persons)` : 'Confirm Appointment'}
          ctaIcon="calendar"
          onPressCTA={handleConfirmAdd}
        />
        </View>
      </View>

      {/* Categorized "More Slots" Bottom Sheet */}
      <MultiPersonSlotSheet
        visible={!!activeSheetPatient}
        patient={activeSheetPatient}
        dates={datesList}
        onClose={() => setActiveSheetPatient(null)}
        onSelectSlot={handleSheetSlotSelect}
      />

      {/* Select Family Member Sheet */}
      <SelectFamilyMemberModal
        visible={showAddPersonModal}
        alreadySelectedIds={assignedPatients.map((p) => p.id)}
        onClose={() => setShowAddPersonModal(false)}
        onSelectMember={handleAddPerson}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  webModalRoot: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  webBackdrop: {
    position: 'absolute' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: 10,
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  headerRoundBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 140,
  },
  sectionHeaderBlock: {
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  sectionSubheading: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  datesScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 16,
  },
  dateChip: {
    width: 76,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700',
  },
  calendarBtn: {
    width: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientsListBlock: {
    marginBottom: 12,
  },
  addPersonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  addPersonIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPersonTextCol: {
    flex: 1,
  },
  addPersonTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#6366F1',
    marginBottom: 2,
  },
  addPersonSubtitle: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  notesSection: {
    marginBottom: 16,
  },
  notesHeaderRow: {
    marginBottom: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionalTag: {
    fontSize: 12,
    fontWeight: '400',
  },
  notesInputWrapper: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  notesInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  editIcon: {
    marginLeft: 8,
  },
});
