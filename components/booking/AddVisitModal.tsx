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
  Share as RNShare
} from 'react-native';
import { 
  ArrowLeft, 
  Plus, 
  Calendar as CalendarIcon, 
  FileEdit,
  Share2,
  Bookmark
} from 'lucide-react-native';
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
  const { colors, isDark } = useTheme();
  const addCartItem = useBookingStore((state) => state.addCartItem);
  const userProfile = useProfileStore((state) => state.userProfile);

  const datesList = React.useMemo(() => getDynamicBookingDates(), []);

  // Global selected date for the visit
  const [selectedDate, setSelectedDate] = useState(datesList[0]);
  const [requestNotes, setRequestNotes] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Multi-patient assignment state
  const [assignedPatients, setAssignedPatients] = useState<PatientSlotAssignment[]>([
    {
      id: 'me',
      name: userProfile?.name || 'Sridhar K.',
      relation: 'Self',
      avatar: userProfile?.avatar,
      selectedDate: datesList[0].fullDate,
      selectedTime: '11:30 AM',
      accentColor: '#6366F1',
    },
  ]);

  // Keep patients synced if datesList initializes
  React.useEffect(() => {
    if (datesList.length > 0 && assignedPatients.length > 0 && !assignedPatients[0].selectedDate) {
      setAssignedPatients((prev) =>
        prev.map((p) => ({ ...p, selectedDate: datesList[0].fullDate }))
      );
    }
  }, [datesList]);

  // Active patient for opening the "More slots" bottom sheet
  const [activeSheetPatient, setActiveSheetPatient] = useState<PatientSlotAssignment | null>(null);
  // Show "+ Add another person" modal
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);

  if (!doctor) return null;

  const docName = doctor.name || doctor.title || 'Doctor';
  const docSpeciality = doctor.speciality || doctor.degrees || 'Specialist';
  const docImage = doctor.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300';
  const hospitalName = doctor.hospitalName || doctor.hospital || hospitalNameProp || 'Apollo Hospital';
  
  const rawFee = doctor.fee ?? doctor.price ?? 600;
  const unitFee = typeof rawFee === 'number' ? rawFee : parseFloat(String(rawFee).replace(/[^0-9]/g, '')) || 600;
  const totalFee = unitFee * assignedPatients.length;
  const originalFee = Math.round(totalFee * 2.2);
  const savings = originalFee - totalFee;

  const handleDateChange = (dateItem: (typeof datesList)[0]) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    setSelectedDate(dateItem);
    // Sync all patients to the new global date
    setAssignedPatients((prev) =>
      prev.map((p) => ({ ...p, selectedDate: dateItem.fullDate }))
    );
  };

  const handleQuickTimeChange = (patientId: string, time: string) => {
    setAssignedPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, selectedTime: time } : p))
    );
  };

  const handleSheetSlotSelect = (patientId: string, date: string, time: string) => {
    const matchedDate = datesList.find((d) => d.fullDate === date);
    if (matchedDate) {
      setSelectedDate(matchedDate);
    }
    setAssignedPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, selectedDate: date, selectedTime: time } : p
      )
    );
  };

  const handleRemovePerson = (patientId: string) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}
    }
    setAssignedPatients((prev) => prev.filter((p) => p.id !== patientId));
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

  const handleShare = async () => {
    try {
      await RNShare.share({
        message: `Book appointment with ${docName} (${docSpeciality}) at ${hospitalName} on Arogyon!`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleConfirmAdd = () => {
    assignedPatients.forEach((patient, idx) => {
      addCartItem({
        type: 'visit',
        itemId: `${doctor.id || 'doc'}-${patient.id}-${Date.now()}-${idx}`,
        title: docName,
        subtitle: `${docSpeciality} • In-Clinic Visit`,
        price: unitFee,
        originalPrice: Math.round(unitFee * 2.2),
        savingsAmount: Math.round(unitFee * 1.2),
        image: docImage,
        selectedDate: patient.selectedDate,
        selectedTime: patient.selectedTime,
        hospitalName: hospitalName,
        assignedPatientId: patient.id,
        assignedPatientName: patient.name,
        assignedPatientRelation: patient.relation,
        assignedPatientAvatar: patient.avatar,
        notes: requestNotes || undefined,
      });
    });

    onClose();
    if (onAdded) onAdded();
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContent, { backgroundColor: isDark ? '#0D0E11' : '#F8FAFC' }]}>
        {/* Top Header */}
        <View style={[styles.topHeader, { backgroundColor: isDark ? '#16181D' : '#FFFFFF', borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}>
          <TouchableOpacity 
            style={[styles.headerBtn, { backgroundColor: isDark ? '#22252C' : '#F1F5F9' }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <ArrowLeft size={18} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>Book Appointment</Text>

          <View style={styles.headerRightActions}>
            <TouchableOpacity 
              style={[styles.headerBtn, { backgroundColor: isDark ? '#22252C' : '#F1F5F9' }]}
              onPress={() => setIsBookmarked(!isBookmarked)}
              activeOpacity={0.8}
            >
              <Bookmark 
                size={17} 
                color={isBookmarked ? '#EF4444' : colors.text} 
                fill={isBookmarked ? '#EF4444' : 'transparent'} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.headerBtn, { backgroundColor: isDark ? '#22252C' : '#F1F5F9' }]}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Share2 size={17} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Unified Scroll Content */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* 1. Doctor Profile Overview Card */}
          <DoctorBookingHeaderCard
            doctor={doctor}
            hospitalName={hospitalName}
            isDark={isDark}
          />

          {/* 1.5. Doctor About & More Options Card */}
          <DoctorAboutCard
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
                  onPress={() => handleDateChange(d)}
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
  modalContent: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: -0.15,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 8,
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
