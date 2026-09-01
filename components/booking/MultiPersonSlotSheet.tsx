import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { Sun, Sunset, Moon, Check, Calendar as CalendarIcon, User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';

export interface PatientSlotAssignment {
  id: string;
  name: string;
  relation: string;
  avatar?: string;
  selectedDate: string;
  selectedTime: string;
  accentColor?: string;
}

interface MultiPersonSlotSheetProps {
  visible: boolean;
  patient: PatientSlotAssignment | null;
  dates: Array<{ id: string; day: string; date: string; fullDate: string }>;
  onClose: () => void;
  onSelectSlot: (patientId: string, date: string, time: string) => void;
}

const MORNING_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
];

const AFTERNOON_SLOTS = [
  { time: '01:00 PM', available: true },
  { time: '01:30 PM', available: true },
  { time: '02:00 PM', available: true },
  { time: '02:30 PM', available: true },
  { time: '03:00 PM', available: true },
  { time: '04:30 PM', available: false },
  { time: '05:00 PM', available: true },
  { time: '05:30 PM', available: true },
];

const EVENING_SLOTS = [
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM',
];

export default function MultiPersonSlotSheet({
  visible,
  patient,
  dates,
  onClose,
  onSelectSlot,
}: MultiPersonSlotSheetProps) {
  const { colors, isDark } = useTheme();

  const [activeDate, setActiveDate] = useState<string>(
    patient?.selectedDate || dates[0]?.fullDate || 'Today, 30 Aug'
  );
  const [activeTime, setActiveTime] = useState<string>(
    patient?.selectedTime || '11:30 AM'
  );

  React.useEffect(() => {
    if (patient) {
      if (patient.selectedDate) setActiveDate(patient.selectedDate);
      if (patient.selectedTime) setActiveTime(patient.selectedTime);
    }
  }, [patient]);

  if (!patient) return null;

  const accentColor = patient.accentColor || '#6366F1';

  const handlePickTime = (time: string, available = true) => {
    if (!available) return;
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    setActiveTime(time);
    onSelectSlot(patient.id, activeDate, time);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.sheetContainer,
            { backgroundColor: isDark ? '#12141A' : '#FFFFFF' },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Top Sheet Handle */}
          <View style={styles.handleBar} />

          {/* Header Row: Person Name & Close Button */}
          <View style={styles.headerRow}>
            <View style={styles.personHeaderGroup}>
              <View style={[styles.avatarCircle, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#EEF2FF' }]}>
                <User size={16} color={accentColor} />
              </View>
              <Text style={[styles.personName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {patient.name}
              </Text>
              <View style={[styles.relationBadge, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#F3F4F6' }]}>
                <Text style={[styles.relationText, { color: isDark ? '#A5B4FC' : '#4F46E5' }]}>
                  {patient.relation}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.closeText, { color: accentColor }]}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Date Selector Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesScroll}
          >
            {dates.map((d) => {
              const isSelected = activeDate === d.fullDate;
              return (
                <TouchableOpacity
                  key={d.id}
                  style={[
                    styles.dateChip,
                    {
                      backgroundColor: isSelected
                        ? accentColor
                        : (isDark ? '#1C1F26' : '#FFFFFF'),
                      borderColor: isSelected
                        ? accentColor
                        : (isDark ? '#2E3340' : '#E2E8F0'),
                    },
                  ]}
                  onPress={() => setActiveDate(d.fullDate)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      { color: isSelected ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B') },
                    ]}
                  >
                    {d.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateText,
                      { color: isSelected ? '#FFFFFF' : (isDark ? '#F8FAFC' : '#0F172A') },
                    ]}
                  >
                    {d.date}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[
                styles.calendarBtn,
                {
                  backgroundColor: isDark ? '#1C1F26' : '#FFFFFF',
                  borderColor: isDark ? '#2E3340' : '#E2E8F0',
                },
              ]}
              activeOpacity={0.8}
            >
              <CalendarIcon size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </ScrollView>

          {/* Grouped Time Slots List */}
          <ScrollView style={styles.slotsScroll} showsVerticalScrollIndicator={false}>
            {/* 1. Morning Section */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleRow}>
                  <Sun size={16} color="#F59E0B" />
                  <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    Morning
                  </Text>
                </View>
                <View style={[styles.countBadge, { backgroundColor: isDark ? '#1C1F26' : '#F1F5F9' }]}>
                  <Text style={[styles.countBadgeText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    {MORNING_SLOTS.length} slots
                  </Text>
                </View>
              </View>

              <View style={styles.slotsGrid}>
                {MORNING_SLOTS.map((time) => {
                  const isSelected = activeTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.slotCard,
                        {
                          backgroundColor: isSelected
                            ? accentColor
                            : (isDark ? '#1C1F26' : '#FFFFFF'),
                          borderColor: isSelected
                            ? accentColor
                            : (isDark ? '#2E3340' : '#E2E8F0'),
                        },
                      ]}
                      onPress={() => handlePickTime(time)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.slotText,
                          { color: isSelected ? '#FFFFFF' : (isDark ? '#F8FAFC' : '#0F172A') },
                        ]}
                      >
                        {time}
                      </Text>
                      {isSelected && (
                        <View style={styles.checkIcon}>
                          <Check size={12} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 2. Afternoon Section */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleRow}>
                  <Sunset size={16} color="#EC4899" />
                  <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    Afternoon
                  </Text>
                </View>
                <View style={[styles.countBadge, { backgroundColor: isDark ? '#1C1F26' : '#F1F5F9' }]}>
                  <Text style={[styles.countBadgeText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    {AFTERNOON_SLOTS.filter(s => s.available).length} slots
                  </Text>
                </View>
              </View>

              <View style={styles.slotsGrid}>
                {AFTERNOON_SLOTS.map(({ time, available }) => {
                  const isSelected = activeTime === time && available;
                  return (
                    <TouchableOpacity
                      key={time}
                      disabled={!available}
                      style={[
                        styles.slotCard,
                        {
                          backgroundColor: !available
                            ? (isDark ? '#16181D' : '#F8FAFC')
                            : isSelected
                            ? accentColor
                            : (isDark ? '#1C1F26' : '#FFFFFF'),
                          borderColor: !available
                            ? (isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9')
                            : isSelected
                            ? accentColor
                            : (isDark ? '#2E3340' : '#E2E8F0'),
                          opacity: !available ? 0.45 : 1,
                        },
                      ]}
                      onPress={() => handlePickTime(time, available)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.slotText,
                          !available && styles.disabledText,
                          {
                            color: isSelected
                              ? '#FFFFFF'
                              : !available
                              ? (isDark ? '#64748B' : '#94A3B8')
                              : (isDark ? '#F8FAFC' : '#0F172A'),
                          },
                        ]}
                      >
                        {time}
                      </Text>
                      {isSelected && (
                        <View style={styles.checkIcon}>
                          <Check size={12} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3. Evening Section */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleRow}>
                  <Moon size={16} color="#8B5CF6" />
                  <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    Evening
                  </Text>
                </View>
                <View style={[styles.countBadge, { backgroundColor: isDark ? '#1C1F26' : '#F1F5F9' }]}>
                  <Text style={[styles.countBadgeText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    {EVENING_SLOTS.length} slots
                  </Text>
                </View>
              </View>

              <View style={styles.slotsGrid}>
                {EVENING_SLOTS.map((time) => {
                  const isSelected = activeTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.slotCard,
                        {
                          backgroundColor: isSelected
                            ? accentColor
                            : (isDark ? '#1C1F26' : '#FFFFFF'),
                          borderColor: isSelected
                            ? accentColor
                            : (isDark ? '#2E3340' : '#E2E8F0'),
                        },
                      ]}
                      onPress={() => handlePickTime(time)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.slotText,
                          { color: isSelected ? '#FFFFFF' : (isDark ? '#F8FAFC' : '#0F172A') },
                        ]}
                      >
                        {time}
                      </Text>
                      {isSelected && (
                        <View style={styles.checkIcon}>
                          <Check size={12} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    maxHeight: '85%',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  handleBar: {
    width: 44,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  personHeaderGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personName: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  relationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  relationText: {
    fontSize: 11,
    fontWeight: '700',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  datesScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 16,
  },
  dateChip: {
    width: 72,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700',
  },
  calendarBtn: {
    width: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotsScroll: {
    marginBottom: 8,
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotCard: {
    width: '22.8%',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  slotText: {
    fontSize: 12,
    fontWeight: '700',
  },
  disabledText: {
    textDecorationLine: 'line-through',
  },
  checkIcon: {
    position: 'absolute',
    bottom: 2,
    right: 3,
  },
});
