import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import { X } from 'lucide-react-native';
import { DEFAULT_HOSPITAL_OFFERS, HospitalOffer } from '@/constants/hospitalOffers';
import HospitalCouponCard from './HospitalCouponCard';

interface HospitalOffersModalProps {
  visible: boolean;
  onClose: () => void;
  hospitalName?: string;
  offers?: HospitalOffer[];
  isDark?: boolean;
}

export default function HospitalOffersModal({
  visible,
  onClose,
  hospitalName = 'Hospital',
  offers = DEFAULT_HOSPITAL_OFFERS,
  isDark = false,
}: HospitalOffersModalProps) {
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const handleApplyCode = (code: string) => {
    setAppliedCode(code);
    const msg = `Promo code '${code}' copied & applied!`;
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Offer Applied', msg);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheetContainer,
            { backgroundColor: isDark ? '#12101D' : '#F8FAFC' },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Sheet Handle */}
          <View style={styles.handleBarWrapper}>
            <View style={[styles.handleBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : '#CBD5E1' }]} />
          </View>

          {/* Modal Header */}
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
              numberOfLines={1}
            >
              Offers at {hospitalName}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={isDark ? '#9CA3AF' : '#64748B'} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Section 1: Hospital Coupons */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#F3F4F6' : '#1E293B' }]}>
                Hospital coupons
              </Text>
            </View>

            {offers.map((offer) => (
              <HospitalCouponCard
                key={offer.id}
                offer={offer}
                isDark={isDark}
                onApplyCode={handleApplyCode}
              />
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '82%',
    paddingBottom: 24,
  },
  handleBarWrapper: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.4,
    flex: 1,
    paddingRight: 10,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});
