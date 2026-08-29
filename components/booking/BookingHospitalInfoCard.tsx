import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { Phone, Copy, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { Appointment } from '@/hooks/useBookingStore';

interface Props {
  appointment: Appointment;
}

export default function BookingHospitalInfoCard({ appointment }: Props) {
  const { colors, isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const hospitalName = appointment.hospitalName || 'Apollo Hospitals, Banjara Hills';
  const locationText = appointment.location || 'Banjara Hills, Hyderabad';
  const orderId = `#${appointment.id.replace(/[^0-9]/g, '') || '8506003545'}`;

  const handleCall = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Linking.openURL('tel:08022223333').catch(() => {});
  };

  const handleCopy = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? '#1E1E24' : '#FFFFFF',
          borderColor: isDark ? '#27272A' : '#F1F5F9',
        },
      ]}
    >
      {/* Hospital Details Row */}
      <View style={styles.topRow}>
        <Image
          source={{
            uri:
              appointment.image ||
              'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200',
          }}
          style={styles.hospitalImage}
        />
        <View style={styles.infoCol}>
          <Text style={[styles.hospitalName, { color: colors.text }]} numberOfLines={2}>
            {hospitalName}
          </Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {locationText}
          </Text>
        </View>

        {/* Phone Call Action Button */}
        <TouchableOpacity
          style={[
            styles.callButton,
            { borderColor: isDark ? '#3F3F46' : '#FEE2E2', backgroundColor: isDark ? '#27272A' : '#FEF2F2' },
          ]}
          onPress={handleCall}
          activeOpacity={0.7}
        >
          <Phone size={17} color="#E11D48" />
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { backgroundColor: isDark ? '#2A2A34' : '#F8FAFC' }]} />

      {/* Booking Order ID with Copy Action */}
      <View style={styles.orderIdRow}>
        <Text style={[styles.orderIdLabel, { color: colors.text }]}>
          Order ID: <Text style={styles.orderIdVal}>{orderId}</Text>
        </Text>
        <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.7}>
          {copied ? (
            <Check size={14} color="#10B981" strokeWidth={2.4} />
          ) : (
            <Copy size={14} color={isDark ? '#94A3B8' : '#64748B'} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hospitalImage: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  infoCol: {
    flex: 1,
  },
  hospitalName: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  locationText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderIdLabel: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    fontWeight: '700',
  },
  orderIdVal: {
    fontFamily: Fonts.medium,
    color: '#64748B',
    fontWeight: '500',
  },
  copyBtn: {
    padding: 4,
  },
});
