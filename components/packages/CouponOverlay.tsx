import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { X, Tag, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (couponCode: string) => void;
}

const DUMMY_COUPONS = [
  { code: 'HEALTH20', title: 'Flat 20% Off', desc: 'On all pregnancy care packages. Max discount ₹5000.' },
  { code: 'FIRSTCARE', title: 'Save ₹2000', desc: 'Valid for first time package bookings only.' },
];

export default function CouponOverlay({ visible, onClose, onApply }: Props) {
  const { colors, isDark } = useTheme();
  const [inputCode, setInputCode] = useState('');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlayContainer}>
        <TouchableOpacity style={styles.overlayBg} activeOpacity={1} onPress={onClose} />
        
        <SafeAreaView edges={['bottom']} style={[styles.contentContainer, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Apply Coupon</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1C1C1E' : '#F5F5F5' }]}>
              <Tag size={18} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter coupon code"
                placeholderTextColor="#999"
                value={inputCode}
                onChangeText={setInputCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity 
                style={[styles.applyBtn, { opacity: inputCode.length > 2 ? 1 : 0.5 }]}
                disabled={inputCode.length <= 2}
                onPress={() => {
                  onApply(inputCode);
                  onClose();
                }}
              >
                <Text style={styles.applyBtnText}>APPLY</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.couponList} showsVerticalScrollIndicator={false}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Coupons</Text>
            
            {DUMMY_COUPONS.map((coupon, index) => (
              <View key={index} style={[styles.couponCard, { borderColor: isDark ? '#333' : '#E0E0E0' }]}>
                <View style={styles.couponHeader}>
                  <View style={styles.couponCodeWrapper}>
                    <Text style={styles.couponCode}>{coupon.code}</Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    onApply(coupon.code);
                    onClose();
                  }}>
                    <Text style={styles.applyInlineBtn}>APPLY</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.couponTitle, { color: colors.text }]}>{coupon.title}</Text>
                <Text style={styles.couponDesc}>{coupon.desc}</Text>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '60%',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  inputSection: {
    padding: 20,
    paddingBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingRight: 8,
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    fontWeight: '600',
  },
  applyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  applyBtnText: {
    color: '#E91E63',
    fontWeight: '800',
    fontSize: 14,
  },
  couponList: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 10,
  },
  couponCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  couponCodeWrapper: {
    backgroundColor: '#FCE4EC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F8BBD0',
    borderStyle: 'dashed',
  },
  couponCode: {
    color: '#E91E63',
    fontWeight: '800',
    fontSize: 13,
  },
  applyInlineBtn: {
    color: '#E91E63',
    fontWeight: '800',
    fontSize: 13,
  },
  couponTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  couponDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});
