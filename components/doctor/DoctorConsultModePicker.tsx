import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Building2, CheckCircle2 } from 'lucide-react-native';
import { Fonts } from '@/constants/theme';

export type ConsultMode = 'in-clinic';

interface DoctorConsultModePickerProps {
  clinicFee: number;
  hospitalName?: string;
  isDark: boolean;
  colors: any;
}

export default function DoctorConsultModePicker({
  clinicFee,
  hospitalName = 'Apollo Hospital',
  isDark,
  colors,
}: DoctorConsultModePickerProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Consultation Mode
      </Text>

      <View
        style={[
          styles.inClinicCard,
          {
            backgroundColor: isDark ? '#064E3B18' : '#ECFDF5',
            borderColor: isDark ? '#05966940' : '#A7F3D0',
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.iconBadge,
              { backgroundColor: isDark ? '#065F46' : '#D1FAE5' },
            ]}
          >
            <Building2 size={18} color={isDark ? '#34D399' : '#059669'} />
          </View>
          <View style={styles.headerTextCol}>
            <View style={styles.titleBadgeRow}>
              <Text style={[styles.modeTitle, { color: colors.text }]}>
                In-Clinic / OPD Visit
              </Text>
              <View style={styles.confirmedBadge}>
                <CheckCircle2 size={11} color="#059669" />
                <Text style={styles.confirmedBadgeText}>Direct Appointment</Text>
              </View>
            </View>
            <Text style={[styles.modeSubtext, { color: isDark ? '#9CA3AF' : '#4B5563' }]} numberOfLines={1}>
              {hospitalName} • Physical Consultation
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(5, 150, 105, 0.15)' },
          ]}
        />

        <View style={styles.bottomRow}>
          <Text style={[styles.feeLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Consultation Fee
          </Text>
          <View style={styles.feeContainer}>
            <Text style={[styles.feeText, { color: isDark ? '#34D399' : '#059669' }]}>
              ₹{clinicFee}
            </Text>
            <Text style={[styles.perVisitText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              / visit
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    fontWeight: '800',
    marginBottom: 10,
  },
  inClinicCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
    gap: 2,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeTitle: {
    fontSize: 14.5,
    fontFamily: Fonts.bold,
    fontWeight: '700',
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  confirmedBadgeText: {
    fontSize: 9.5,
    fontFamily: Fonts.bold,
    color: '#059669',
    fontWeight: '700',
  },
  modeSubtext: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  feeLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    fontWeight: '500',
  },
  feeText: {
    fontSize: 17,
    fontFamily: Fonts.bold,
    fontWeight: '800',
  },
  perVisitText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
  },
});
