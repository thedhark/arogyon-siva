import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  isDark?: boolean;
  style?: any;
  onSelectDateTime?: (date: string, time: string) => void;
}

const DATES = [
  { id: '1', label: 'Today', subText: 'Aug 11' },
  { id: '2', label: 'Tomorrow', subText: 'Aug 12' },
  { id: '3', label: 'Wed', subText: 'Aug 13' },
  { id: '4', label: 'Thu', subText: 'Aug 14' },
];

const TIME_SLOTS = [
  '08:00 AM (Fasting)',
  '10:00 AM',
  '01:00 PM',
  '04:00 PM',
];

export default function PackageAssessmentCard({ isDark, style, onSelectDateTime }: Props) {
  const theme = useTheme();
  const activeDark = isDark ?? theme.isDark;

  const [selectedDate, setSelectedDate] = useState('1');
  const [selectedTime, setSelectedTime] = useState('08:00 AM (Fasting)');

  const handleDateSelect = (id: string) => {
    setSelectedDate(id);
    const d = DATES.find(item => item.id === id);
    if (d && onSelectDateTime) {
      onSelectDateTime(`${d.label} ${d.subText}`, selectedTime);
    }
  };

  const handleTimeSelect = (slot: string) => {
    setSelectedTime(slot);
    const d = DATES.find(item => item.id === selectedDate);
    if (d && onSelectDateTime) {
      onSelectDateTime(`${d.label} ${d.subText}`, slot);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: activeDark ? '#1C1C1E' : '#FFFFFF',
          borderColor: activeDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
        },
        style,
      ]}
    >
      {/* Date Section Header */}
      <View style={styles.headerRow}>
        <Calendar size={18} color={activeDark ? '#A78BFA' : '#6527BE'} />
        <Text style={[styles.headerTitle, { color: activeDark ? '#F3F4F6' : '#1E293B' }]}>
          Select Assessment Date & Time
        </Text>
      </View>

      {/* Horizontal Date Selector Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateRow}
      >
        {DATES.map((item) => {
          const isSelected = selectedDate === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => handleDateSelect(item.id)}
              style={[
                styles.datePill,
                {
                  backgroundColor: isSelected
                    ? (activeDark ? '#2E1065' : '#F5F3FF')
                    : (activeDark ? '#27272A' : '#FAFAFA'),
                  borderColor: isSelected
                    ? (activeDark ? '#A78BFA' : '#7C3AED')
                    : (activeDark ? '#3F3F46' : '#E2E8F0'),
                  borderWidth: isSelected ? 1.5 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.datePillLabel,
                  {
                    color: isSelected
                      ? (activeDark ? '#DDD6FE' : '#6527BE')
                      : (activeDark ? '#A1A1AA' : '#64748B'),
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {item.label}
              </Text>
              <Text
                style={[
                  styles.datePillSub,
                  {
                    color: isSelected
                      ? (activeDark ? '#DDD6FE' : '#6527BE')
                      : (activeDark ? '#F4F4F5' : '#0F172A'),
                    fontWeight: isSelected ? '800' : '700',
                  },
                ]}
              >
                {item.subText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Time Slot Section Header */}
      <View style={[styles.headerRow, { marginTop: 16 }]}>
        <Clock size={18} color={activeDark ? '#A78BFA' : '#6527BE'} />
        <Text style={[styles.headerTitle, { color: activeDark ? '#F3F4F6' : '#1E293B' }]}>
          Select Time Slot
        </Text>
      </View>

      {/* Time Slot Grid */}
      <View style={styles.timeGrid}>
        {TIME_SLOTS.map((slot) => {
          const isSelected = selectedTime === slot;
          return (
            <TouchableOpacity
              key={slot}
              activeOpacity={0.8}
              onPress={() => handleTimeSelect(slot)}
              style={[
                styles.timePill,
                {
                  backgroundColor: isSelected
                    ? (activeDark ? '#2E1065' : '#F5F3FF')
                    : (activeDark ? '#27272A' : '#FAFAFA'),
                  borderColor: isSelected
                    ? (activeDark ? '#A78BFA' : '#7C3AED')
                    : (activeDark ? '#3F3F46' : '#E2E8F0'),
                  borderWidth: isSelected ? 1.5 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.timePillText,
                  {
                    color: isSelected
                      ? (activeDark ? '#DDD6FE' : '#6527BE')
                      : (activeDark ? '#E4E4E7' : '#334155'),
                    fontWeight: isSelected ? '700' : '600',
                  },
                ]}
                numberOfLines={1}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    // Flat style with NO shadows/elevation per user requirement
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  dateRow: {
    gap: 8,
    paddingRight: 4,
  },
  datePill: {
    width: 82,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  datePillLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  datePillSub: {
    fontSize: 13,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timePill: {
    width: '48.5%',
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  timePillText: {
    fontSize: 12.5,
    textAlign: 'center',
  },
});
