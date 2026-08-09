import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { PhoneCall, CheckCircle2, X, Clock, ShieldCheck, User, Phone } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface PackageEnquiryModalProps {
  visible: boolean;
  onClose: () => void;
  packageTitle: string;
  hospitalName?: string;
}

export default function PackageEnquiryModal({
  visible,
  onClose,
  packageTitle,
  hospitalName = 'Partner Hospital',
}: PackageEnquiryModalProps) {
  const { colors, isDark } = useTheme();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState<'asap' | 'morning' | 'evening'>('asap');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!phone || phone.length < 10) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.modalCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <TouchableOpacity onPress={handleResetAndClose} style={styles.closeBtn}>
            <X size={20} color={colors.text} />
          </TouchableOpacity>

          {!submitted ? (
            <View style={styles.formContainer}>
              <View style={styles.headerIconCircle}>
                <PhoneCall size={24} color="#6527BE" />
              </View>

              <Text style={[styles.modalTitle, { color: colors.text }]}>Talk to Care Advisor</Text>
              <Text style={styles.modalSub}>
                Get free guidance on package inclusions, insurance cashless coverage, and EMI options for{' '}
                <Text style={{ fontWeight: '700', color: colors.text }}>{packageTitle}</Text>
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Your Name</Text>
                <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5' }]}>
                  <User size={16} color="#888" />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mobile Number *</Text>
                <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5' }]}>
                  <Phone size={16} color="#888" />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter 10-digit phone number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Preferred Callback Time</Text>
                <View style={styles.timePillsRow}>
                  {[
                    { id: 'asap', label: '⚡ Within 15 mins' },
                    { id: 'morning', label: '🌅 Morning (9-12)' },
                    { id: 'evening', label: '🌆 Evening (4-7)' },
                  ].map((time) => (
                    <TouchableOpacity
                      key={time.id}
                      style={[
                        styles.timePill,
                        preferredTime === time.id
                          ? { backgroundColor: '#6527BE', borderColor: '#6527BE' }
                          : { backgroundColor: isDark ? '#2C2C2E' : '#F0F0F0', borderColor: 'transparent' },
                      ]}
                      onPress={() => setPreferredTime(time.id as any)}
                    >
                      <Text
                        style={[
                          styles.timePillText,
                          { color: preferredTime === time.id ? '#FFF' : colors.text },
                        ]}
                      >
                        {time.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.trustBadge}>
                <ShieldCheck size={16} color="#00A981" />
                <Text style={styles.trustText}>100% Free Consultation • Zero Spam Guarantee</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  (!phone || phone.length < 10) && { opacity: 0.5 },
                ]}
                disabled={!phone || phone.length < 10 || submitting}
                onPress={handleSubmit}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.submitBtnText}>Request Call Now</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <Animated.View entering={FadeIn} style={styles.successContainer}>
              <View style={styles.successIconCircle}>
                <CheckCircle2 size={44} color="#00A981" />
              </View>
              <Text style={[styles.successTitle, { color: colors.text }]}>Callback Requested!</Text>
              <Text style={styles.successSub}>
                A dedicated Care Manager from <Text style={{ fontWeight: '700' }}>{hospitalName}</Text> will call you shortly on{' '}
                <Text style={{ fontWeight: '700' }}>+91 {phone}</Text>.
              </Text>

              <View style={styles.successBox}>
                <Clock size={16} color="#6527BE" />
                <Text style={styles.successBoxText}>Expected Response Time: ~15 Minutes</Text>
              </View>

              <TouchableOpacity style={styles.doneBtn} onPress={handleResetAndClose}>
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  formContainer: {
    alignItems: 'center',
  },
  headerIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  timePillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  timePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  timePillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 12,
  },
  trustText: {
    fontSize: 11,
    color: '#00A981',
    fontWeight: '600',
  },
  submitBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#6527BE',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6F6F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  successSub: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 20,
  },
  successBoxText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6527BE',
  },
  doneBtn: {
    width: '100%',
    height: 46,
    backgroundColor: '#00A981',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
