import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  TextInput,
  Platform,
  Share as RNShare
} from 'react-native';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Globe, 
  ArrowLeft, 
  Share2, 
  Bookmark,
  MessageSquare
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { useBookingStore } from '@/hooks/useBookingStore';
import StickyBookingPaymentBar from '@/components/booking/StickyBookingPaymentBar';

interface AddVisitModalProps {
  visible: boolean;
  doctor: any;
  hospitalName?: string;
  onClose: () => void;
  onAdded?: () => void;
}

const DATES = [
  { id: '1', day: 'Today', date: 'Aug 11' },
  { id: '2', day: 'Tomorrow', date: 'Aug 12' },
  { id: '3', day: 'Wed', date: 'Aug 13' },
  { id: '4', day: 'Thu', date: 'Aug 14' },
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:30 AM', 
  '02:00 PM', '04:00 PM', '05:30 PM'
];

export default function AddVisitModal({ 
  visible, 
  doctor, 
  hospitalName = 'Apollo Hospital', 
  onClose, 
  onAdded 
}: AddVisitModalProps) {
  const { colors, isDark } = useTheme();
  const addCartItem = useBookingStore(state => state.addCartItem);

  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1]);
  const [requestNotes, setRequestNotes] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!doctor) return null;

  const docName = doctor.name || doctor.title || 'Doctor';
  const docSpeciality = doctor.speciality || doctor.degrees || 'Specialist';
  const docImage = doctor.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200';
  
  const baseFee = parseFloat(doctor.fee || doctor.price || '699') || 699;
  const totalFee = baseFee;
  const originalFee = Math.round(totalFee * 2.5);
  const savings = originalFee - totalFee;

  const handleShare = async () => {
    try {
      await RNShare.share({
        message: `Book a visit with ${docName} (${docSpeciality}) at ${hospitalName} on Arogyon!`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleConfirmAdd = () => {
    addCartItem({
      type: 'visit',
      itemId: doctor.id || 'doc-1',
      title: docName,
      subtitle: `${docSpeciality} • In-Clinic Visit`,
      price: totalFee,
      originalPrice: originalFee,
      savingsAmount: savings,
      image: docImage,
      selectedDate: `${selectedDate.day}, ${selectedDate.date}`,
      selectedTime: selectedTime,
      hospitalName: hospitalName,
    });

    onClose();
    if (onAdded) onAdded();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: isDark ? '#121212' : '#F8FAFC' }]}>
          {/* Top Modal Navigation Header */}
          <View style={[styles.topHeader, { backgroundColor: isDark ? '#1A1A1E' : '#FFFFFF', borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}>
            <TouchableOpacity 
              style={[styles.headerBtn, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <ArrowLeft size={18} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { color: colors.text }]}>Schedule Visit</Text>

            <View style={styles.headerRightActions}>
              <TouchableOpacity 
                style={[styles.headerBtn, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]}
                onPress={() => setIsBookmarked(!isBookmarked)}
                activeOpacity={0.8}
              >
                <Bookmark 
                  size={17} 
                  color={isBookmarked ? '#E11D48' : colors.text} 
                  fill={isBookmarked ? '#E11D48' : 'transparent'} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.headerBtn, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]}
                onPress={handleShare}
                activeOpacity={0.8}
              >
                <Share2 size={17} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Unified Content ScrollView */}
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Merged Doctor Profile + Booking Date & Time Container */}
            <View style={[styles.unifiedContainer, { backgroundColor: isDark ? '#1E1E24' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}>
              
              {/* 1. Minimal Doctor Profile Row (No ratings / happy patients stats) */}
              <View style={styles.doctorSummaryRow}>
                <Image 
                  source={{ uri: docImage }} 
                  style={styles.doctorAvatar} 
                  resizeMode="cover"
                />
                <View style={styles.doctorSummaryInfo}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.doctorName, { color: colors.text }]} numberOfLines={1}>
                      {docName}
                    </Text>
                    <CheckCircle2 size={15} color="#00A981" fill="#E6F6F2" style={{ marginLeft: 5 }} />
                  </View>

                  <Text style={styles.specialityText} numberOfLines={1}>
                    {docSpeciality}
                  </Text>

                  <View style={styles.locationRow}>
                    <MapPin size={12} color="#64748B" />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {hospitalName || doctor.location || 'Apollo Hospitals'}
                    </Text>
                  </View>

                  {doctor.languages && (
                    <View style={styles.languagesRow}>
                      <Globe size={12} color="#64748B" />
                      <Text style={styles.languagesText} numberOfLines={1}>
                        {doctor.languages}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Minimal Divider */}
              <View style={[styles.sectionDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }]} />

              {/* 2. Select Booking Date */}
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Calendar size={15} color="#E11D48" />
                  <Text style={[styles.sectionHeaderTitle, { color: colors.text }]}>
                    Select Booking Date
                  </Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesScroll}>
                  {DATES.map((item) => {
                    const isSelected = selectedDate.id === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.dateChip,
                          {
                            borderColor: isSelected ? '#E11D48' : (isDark ? '#2E2E36' : '#E2E8F0'),
                            backgroundColor: isSelected ? (isDark ? '#3B121F' : '#FFF1F2') : (isDark ? '#24242B' : '#F8FAFC'),
                          }
                        ]}
                        onPress={() => setSelectedDate(item)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.dateDay, { color: isSelected ? '#E11D48' : (isDark ? '#9CA3AF' : '#64748B') }]}>
                          {item.day}
                        </Text>
                        <Text style={[styles.dateText, { color: isSelected ? '#E11D48' : colors.text }]}>
                          {item.date}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Minimal Divider */}
              <View style={[styles.sectionDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }]} />

              {/* 3. Select Time Slot */}
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Clock size={15} color="#E11D48" />
                  <Text style={[styles.sectionHeaderTitle, { color: colors.text }]}>
                    Select Time Slot
                  </Text>
                </View>

                <View style={styles.timeSlotsGrid}>
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <TouchableOpacity
                        key={slot}
                        style={[
                          styles.timeChip,
                          {
                            borderColor: isSelected ? '#E11D48' : (isDark ? '#2E2E36' : '#E2E8F0'),
                            backgroundColor: isSelected ? (isDark ? '#3B121F' : '#FFF1F2') : (isDark ? '#24242B' : '#F8FAFC'),
                          }
                        ]}
                        onPress={() => setSelectedTime(slot)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.timeText, { color: isSelected ? '#E11D48' : colors.text, fontWeight: isSelected ? '700' : '500' }]}>
                          {slot}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Minimal Divider */}
              <View style={[styles.sectionDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }]} />

              {/* 4. Medical Symptoms / Notes (Optional) */}
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <MessageSquare size={15} color="#64748B" />
                  <Text style={[styles.sectionHeaderTitle, { color: colors.text }]}>
                    Medical Symptoms / Note (Optional)
                  </Text>
                </View>
                <TextInput
                  style={[
                    styles.notesInput, 
                    { 
                      color: colors.text, 
                      borderColor: isDark ? '#2E2E36' : '#E2E8F0', 
                      backgroundColor: isDark ? '#24242B' : '#F8FAFC' 
                    }
                  ]}
                  placeholder="Describe symptoms or medical requests for the doctor..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={2}
                  value={requestNotes}
                  onChangeText={setRequestNotes}
                />
              </View>

            </View>
          </ScrollView>

          {/* Sticky Booking Payment Bar */}
          <StickyBookingPaymentBar
            priceDropText="Price dropped by ₹167"
            price={totalFee}
            originalPrice={originalFee}
            discountText="60% Off"
            ctaText="Confirm Visit"
            ctaIcon="calendar"
            onPressCTA={handleConfirmAdd}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
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
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 110,
  },
  unifiedContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  doctorSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doctorAvatar: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  doctorSummaryInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  doctorName: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.15,
  },
  specialityText: {
    fontFamily: Fonts.medium,
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  locationText: {
    fontFamily: Fonts.regular,
    fontSize: 11.5,
    color: '#64748B',
  },
  languagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  languagesText: {
    fontFamily: Fonts.regular,
    fontSize: 11.5,
    color: '#64748B',
  },
  sectionDivider: {
    height: 1,
    marginVertical: 14,
  },
  sectionBlock: {
    width: '100%',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionHeaderTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 13.5,
    fontWeight: '600',
  },
  datesScroll: {
    gap: 8,
  },
  dateChip: {
    width: 72,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  dateDay: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    marginTop: 2,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    width: '31%',
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  notesInput: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    fontSize: 12.5,
    minHeight: 56,
    textAlignVertical: 'top',
    fontFamily: Fonts.regular,
  },
});
