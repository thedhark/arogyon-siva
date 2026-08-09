import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView 
} from 'react-native';
import { ChevronDown, CheckCircle2, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const CITY_OPTIONS = [
  'Tirupati',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Delhi NCR',
  'Mumbai',
  'Pune',
];

interface Props {
  visible: boolean;
  onClose: () => void;
  treatmentName: string;
  onSuccess: (treatment: string, name: string, phone: string, city: string) => void;
  isDark?: boolean;
}

export default function TreatmentBookingModal({
  visible,
  onClose,
  treatmentName,
  onSuccess,
  isDark = false,
}: Props) {
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('+919550715570');
  const [selectedCity, setSelectedCity] = useState('Tirupati');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSuccess(treatmentName, patientName || 'Patient', patientPhone, selectedCity);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalCard,
          { backgroundColor: isDark ? '#111927' : '#FFFFFF' }
        ]}>
          {/* Close Handle / Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <X size={20} color={isDark ? '#FFFFFF' : '#64748B'} />
          </TouchableOpacity>

          {/* Modal Header Title matching screenshot 2 */}
          <Text style={[styles.modalHeadingTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Book an appointment for {treatmentName || 'Surgery'} with our expert surgeon
          </Text>

          {/* Name Input */}
          <TextInput
            style={[
              styles.textInput,
              { 
                backgroundColor: isDark ? '#0B1320' : '#FFFFFF', 
                color: isDark ? '#FFFFFF' : '#0B3848',
                borderColor: isDark ? '#334155' : '#CBD5E1'
              }
            ]}
            placeholder="Full Name"
            placeholderTextColor="#94A3B8"
            value={patientName}
            onChangeText={setPatientName}
          />

          {/* Phone Number Input */}
          <TextInput
            style={[
              styles.textInput,
              { 
                backgroundColor: isDark ? '#0B1320' : '#FFFFFF', 
                color: isDark ? '#FFFFFF' : '#0B3848',
                borderColor: isDark ? '#334155' : '#CBD5E1'
              }
            ]}
            placeholder="+91 9550715570"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            value={patientPhone}
            onChangeText={setPatientPhone}
          />

          {/* City Dropdown Selector */}
          <TouchableOpacity
            style={[
              styles.dropdownInput,
              { 
                backgroundColor: isDark ? '#0B1320' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#CBD5E1'
              }
            ]}
            onPress={() => setShowCityDropdown(!showCityDropdown)}
            activeOpacity={0.8}
          >
            <Text style={[styles.dropdownText, { color: isDark ? '#FFFFFF' : '#0B3848' }]}>
              {selectedCity}
            </Text>
            <ChevronDown size={20} color="#64748B" />
          </TouchableOpacity>

          {/* City Dropdown Options */}
          {showCityDropdown && (
            <View style={[styles.cityDropdownMenu, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }]}>
              {CITY_OPTIONS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={styles.cityOptionRow}
                  onPress={() => {
                    setSelectedCity(c);
                    setShowCityDropdown(false);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={[
                    styles.cityOptionText, 
                    { color: selectedCity === c ? '#0B3848' : (isDark ? '#E2E8F0' : '#475569') },
                    selectedCity === c && { fontWeight: '700' }
                  ]}>
                    {c}
                  </Text>
                  {selectedCity === c && <CheckCircle2 size={16} color="#48C728" />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Submit CTA Button matching screenshot */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            activeOpacity={0.9}
          >
            <Text style={styles.submitBtnText}>Book Appointment</Text>
          </TouchableOpacity>

          {/* Footer Disclaimer */}
          <Text style={styles.disclaimerText}>
            By submitting the form, you agree to Arogyon's <Text style={styles.tncLink}>T & C</Text>
          </Text>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    width: '100%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
    zIndex: 10,
  },
  modalHeadingTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 20,
    marginTop: 8,
    paddingRight: 20,
  },
  textInput: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 14,
  },
  dropdownInput: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: '600',
  },
  cityDropdownMenu: {
    borderRadius: 14,
    padding: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cityOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  cityOptionText: {
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: '#0B3848',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    elevation: 2,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 14,
  },
  tncLink: {
    color: '#48C728',
    fontWeight: '700',
  },
});
