import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, Clock, Sun, Sunset, Moon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Fonts } from '@/constants/theme';

export interface DateItem {
  id: string;
  day: string;
  date: string;
  fullDate?: string;
}

export const DEFAULT_DATES: DateItem[] = [
  { id: '1', day: 'Today', date: 'Aug 24', fullDate: 'Today, 24 Aug' },
  { id: '2', day: 'Tomorrow', date: 'Aug 25', fullDate: 'Tomorrow, 25 Aug' },
  { id: '3', day: 'Wed', date: 'Aug 26', fullDate: 'Wed, 26 Aug' },
  { id: '4', day: 'Thu', date: 'Aug 27', fullDate: 'Thu, 27 Aug' },
  { id: '5', day: 'Fri', date: 'Aug 28', fullDate: 'Fri, 28 Aug' },
];

export const TIME_SLOT_GROUPS = [
  {
    title: 'Morning Slots',
    icon: Sun,
    slots: ['09:00 AM', '09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM'],
  },
  {
    title: 'Afternoon Slots',
    icon: Sunset,
    slots: ['02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM'],
  },
  {
    title: 'Evening Slots',
    icon: Moon,
    slots: ['05:00 PM', '05:45 PM', '06:30 PM', '07:15 PM'],
  },
];

interface DoctorSlotPickerProps {
  selectedDate: DateItem;
  onSelectDate: (date: DateItem) => void;
  selectedTime: string;
  onSelectTime: (slot: string) => void;
  isDark: boolean;
  colors: any;
}

export default function DoctorSlotPicker({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  isDark,
  colors,
}: DoctorSlotPickerProps) {
  const handleDatePress = (d: DateItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectDate(d);
  };

  const handleTimePress = (slot: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectTime(slot);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            borderColor: isDark ? '#2C2C2E' : '#E5E7EB',
          },
        ]}
      >
        {/* Date Section Header */}
        <View style={styles.headerRow}>
          <Calendar size={17} color="#10B981" />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Select Date
          </Text>
        </View>

        {/* Horizontal Dates Strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.datesScroll}
        >
          {DEFAULT_DATES.map((item) => {
            const isSelected = selectedDate.id === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => handleDatePress(item)}
                style={[
                  styles.dateChip,
                  {
                    borderColor: isSelected ? '#10B981' : (isDark ? '#2C2C2E' : '#E5E7EB'),
                    backgroundColor: isSelected
                      ? (isDark ? '#064E3B' : '#ECFDF5')
                      : (isDark ? '#25252A' : '#F9FAFB'),
                  },
                ]}
              >
                <Text style={[styles.dateDay, { color: isSelected ? '#10B981' : (isDark ? '#9CA3AF' : '#6B7280') }]}>
                  {item.day}
                </Text>
                <Text style={[styles.dateText, { color: isSelected ? '#10B981' : colors.text }]}>
                  {item.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Time Slot Section */}
        <View style={[styles.headerRow, { marginTop: 16 }]}>
          <Clock size={17} color="#3B82F6" />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Select Time Slot
          </Text>
        </View>

        {/* Slot Groups */}
        {TIME_SLOT_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <View key={group.title} style={styles.groupContainer}>
              <View style={styles.groupHeader}>
                <Icon size={13} color={isDark ? '#9CA3AF' : '#6B7280'} />
                <Text style={[styles.groupTitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  {group.title}
                </Text>
              </View>

              <View style={styles.slotsGrid}>
                {group.slots.map((slot) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <TouchableOpacity
                      key={slot}
                      activeOpacity={0.8}
                      onPress={() => handleTimePress(slot)}
                      style={[
                        styles.timeChip,
                        {
                          borderColor: isSelected ? '#3B82F6' : (isDark ? '#2C2C2E' : '#E5E7EB'),
                          backgroundColor: isSelected
                            ? (isDark ? '#1E3A8A' : '#EFF6FF')
                            : (isDark ? '#25252A' : '#F9FAFB'),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.timeText,
                          {
                            color: isSelected ? '#3B82F6' : colors.text,
                            fontFamily: isSelected ? Fonts.bold : Fonts.medium,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 14,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 14.5,
    fontFamily: Fonts.bold,
    fontWeight: '800',
  },
  datesScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  dateChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 68,
    borderWidth: 1,
  },
  dateDay: {
    fontSize: 10.5,
    fontFamily: Fonts.medium,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12.5,
    fontFamily: Fonts.bold,
    fontWeight: '700',
  },
  groupContainer: {
    marginTop: 10,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  groupTitle: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
    fontWeight: '600',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 11,
    paddingVertical: 7.5,
    borderRadius: 10,
    borderWidth: 1,
    width: '31%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 11.5,
  },
});
