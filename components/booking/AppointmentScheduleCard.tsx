import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface AppointmentScheduleCardProps {
  selectedDate: string;
  selectedTime: string;
  onPressDate?: () => void;
  onPressTime?: () => void;
}

export default function AppointmentScheduleCard({
  selectedDate,
  selectedTime,
  onPressDate,
  onPressTime,
}: AppointmentScheduleCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>SCHEDULE</Text>
      
      <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        {/* Date Selection Row */}
        <TouchableOpacity
          style={styles.row}
          onPress={onPressDate}
          activeOpacity={0.7}
        >
          <View style={styles.leftGroup}>
            <View style={[styles.iconWrapper, { backgroundColor: isDark ? '#112D29' : '#E6F4F1' }]}>
              <Calendar size={18} color="#0D9488" />
            </View>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Select Date</Text>
          </View>

          <View style={styles.rightGroup}>
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
              {selectedDate || 'Tue, 11 Aug 2025'}
            </Text>
            <ChevronRight size={18} color="#9CA3AF" style={{ marginLeft: 4 }} />
          </View>
        </TouchableOpacity>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: isDark ? '#2D2D2D' : '#F3F4F6' }]} />

        {/* Time Selection Row */}
        <TouchableOpacity
          style={styles.row}
          onPress={onPressTime}
          activeOpacity={0.7}
        >
          <View style={styles.leftGroup}>
            <View style={[styles.iconWrapper, { backgroundColor: isDark ? '#2A1A24' : '#FDF2F8' }]}>
              <Clock size={18} color="#EC4899" />
            </View>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Select Time</Text>
          </View>

          <View style={styles.rightGroup}>
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
              {selectedTime || '10:00 AM'}
            </Text>
            <ChevronRight size={18} color="#9CA3AF" style={{ marginLeft: 4 }} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 10,
    paddingLeft: 4,
  },
  card: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});
