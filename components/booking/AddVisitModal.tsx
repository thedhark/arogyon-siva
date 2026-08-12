import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Pressable, 
  TextInput,
  Platform
} from 'react-native';
import { 
  X, 
  Calendar, 
  Clock, 
  Star, 
  Check, 
  ShieldCheck, 
  HeartPulse, 
  MessageSquare,
  Stethoscope,
  CheckCircle2
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/hooks/useBookingStore';
import DoctorProfileHeader from '@/components/doctor/DoctorProfileHeader';
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
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [requestNotes, setRequestNotes] = useState('');

  if (!doctor) return null;

  const docName = doctor.name || doctor.title || 'Doctor';
  const docSpeciality = doctor.speciality || doctor.degrees || 'Specialist';
  const docImage = doctor.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200';
  const docRating = doctor.rating || '4.8';
  
  const baseFee = parseFloat(doctor.fee || doctor.price || '699') || 699;
  const selectedService = doctor.services?.find((s: any) => s.id === selectedServiceId);
  const servicePriceNum = selectedService ? parseFloat(selectedService.price.replace(/[^0-9.]/g, '')) || 0 : 0;
  const totalFee = baseFee + servicePriceNum;
  const originalFee = Math.round(totalFee * 2.5);
  const savings = originalFee - totalFee;

  const fullDoctorData = {
    id: doctor.id || 'doc-1',
    name: docName,
    verified: doctor.verified !== false,
    speciality: docSpeciality,
    experience: doctor.experience || '7+ Years Experience',
    rating: docRating,
    reviews: doctor.reviews || '256',
    location: doctor.location || hospitalName,
    distance: doctor.distance || '2.4 km',
    patients: doctor.patients || '1,500+ Patients',
    languages: doctor.languages || 'English, Hindi, Kannada',
    about: doctor.about || `Senior specialist in ${docSpeciality} with over 7+ years of experience performing advanced procedures and consultations.`,
    image: docImage,
    fee: totalFee.toString(),
    services: doctor.services || [
      { id: 's1', name: 'Comprehensive Consultation', price: '₹699' },
      { id: 's2', name: 'Follow-up Diagnostic Assessment', price: '₹499' },
    ],
  };

  const handleConfirmAdd = () => {
    addCartItem({
      type: 'visit',
      itemId: fullDoctorData.id,
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
          {/* Full Doctor Profile Content ScrollView */}
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Rich Doctor Profile Header */}
            <DoctorProfileHeader 
              doctorData={fullDoctorData}
              colors={colors}
              isDark={isDark}
              onBackPress={onClose}
            />

            {/* Date & Time Slot Selector */}
            <View style={styles.sectionContainer}>
              <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
                <View style={styles.cardHeader}>
                  <Calendar size={18} color="#10B981" />
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Select Booking Date</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
                  {DATES.map((item) => {
                    const isSelected = selectedDate.id === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.dateChip,
                          {
                            borderColor: isSelected ? '#10B981' : (isDark ? '#333' : '#E5E7EB'),
                            backgroundColor: isSelected ? (isDark ? '#112D29' : '#ECFDF5') : 'transparent',
                          }
                        ]}
                        onPress={() => setSelectedDate(item)}
                      >
                        <Text style={[styles.dateDay, { color: isSelected ? '#10B981' : '#6B7280' }]}>{item.day}</Text>
                        <Text style={[styles.dateText, { color: isSelected ? '#10B981' : colors.text }]}>{item.date}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <View style={[styles.cardHeader, { marginTop: 16 }]}>
                  <Clock size={18} color="#10B981" />
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Select Time Slot</Text>
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
                            borderColor: isSelected ? '#10B981' : (isDark ? '#333' : '#E5E7EB'),
                            backgroundColor: isSelected ? (isDark ? '#112D29' : '#ECFDF5') : 'transparent',
                          }
                        ]}
                        onPress={() => setSelectedTime(slot)}
                      >
                        <Text style={[styles.timeText, { color: isSelected ? '#10B981' : colors.text }]}>{slot}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Symptoms / Notes Input */}
            <View style={styles.sectionContainer}>
              <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB', marginBottom: 20 }]}>
                <View style={styles.cardHeader}>
                  <MessageSquare size={18} color="#10B981" />
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Add Medical Symptoms / Note (Optional)</Text>
                </View>
                <TextInput
                  style={[styles.notesInput, { color: colors.text, borderColor: isDark ? '#3A3A3A' : '#E5E7EB', backgroundColor: isDark ? '#2A2A2A' : '#F9FAFB' }]}
                  placeholder="Describe your health problem, past treatment or symptoms for the doctor..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
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
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },
  topBar: {
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 8,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  sectionContainer: {
    paddingHorizontal: 14,
    marginTop: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  datesRow: {
    gap: 10,
  },
  dateChip: {
    width: 76,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  dateDay: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
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
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  notesInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 13,
    minHeight: 70,
    textAlignVertical: 'top',
  },
});
