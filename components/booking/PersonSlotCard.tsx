import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { User, ChevronDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { PatientSlotAssignment } from './MultiPersonSlotSheet';

interface PersonSlotCardProps {
  patient: PatientSlotAssignment;
  canRemove: boolean;
  onRemove: (id: string) => void;
  onSelectQuickTime: (patientId: string, time: string) => void;
  onOpenMoreSlots: (patient: PatientSlotAssignment) => void;
}

const DEFAULT_QUICK_TIMES = ['10:00 AM', '11:30 AM', '01:00 PM', '04:30 PM'];

export default function PersonSlotCard({
  patient,
  canRemove,
  onRemove,
  onSelectQuickTime,
  onOpenMoreSlots,
}: PersonSlotCardProps) {
  const { colors, isDark } = useTheme();

  const accentColor = patient.accentColor || '#6366F1';
  const quickSlots = DEFAULT_QUICK_TIMES.includes(patient.selectedTime)
    ? DEFAULT_QUICK_TIMES
    : [patient.selectedTime, ...DEFAULT_QUICK_TIMES.slice(0, 3)];

  const handlePick = (time: string) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    onSelectQuickTime(patient.id, time);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#16181D' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
        },
      ]}
    >
      {/* Header Row: Avatar, Name, Relation, Remove */}
      <View style={styles.headerRow}>
        <View style={styles.leftGroup}>
          <View
            style={[
              styles.avatarCircle,
              { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#EEF2FF' },
            ]}
          >
            <User size={16} color={accentColor} />
          </View>

          <Text style={[styles.name, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {patient.name}
          </Text>

          <View
            style={[
              styles.relationBadge,
              { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#F3F4F6' },
            ]}
          >
            <Text style={[styles.relationText, { color: isDark ? '#A5B4FC' : '#4F46E5' }]}>
              {patient.relation}
            </Text>
          </View>
        </View>

        {canRemove && (
          <TouchableOpacity
            onPress={() => onRemove(patient.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.removeText, { color: isDark ? '#818CF8' : '#4F46E5' }]}>
              Remove
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Time Slots Row + More button */}
      <View style={styles.slotsRow}>
        {quickSlots.map((time) => {
          const isSelected = patient.selectedTime === time;
          return (
            <TouchableOpacity
              key={time}
              style={[
                styles.slotChip,
                {
                  backgroundColor: isSelected
                    ? accentColor
                    : (isDark ? '#1F222A' : '#FFFFFF'),
                  borderColor: isSelected
                    ? accentColor
                    : (isDark ? '#2E3340' : '#E2E8F0'),
                },
              ]}
              onPress={() => handlePick(time)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.slotTimeText,
                  { color: isSelected ? '#FFFFFF' : (isDark ? '#F8FAFC' : '#0F172A') },
                ]}
              >
                {time.split(' ')[0]}
              </Text>
              <Text
                style={[
                  styles.slotPeriodText,
                  { color: isSelected ? 'rgba(255,255,255,0.85)' : (isDark ? '#94A3B8' : '#64748B') },
                ]}
              >
                {time.split(' ')[1]}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* More dropdown pill */}
        <TouchableOpacity
          style={[
            styles.moreChip,
            {
              backgroundColor: isDark ? '#1F222A' : '#FFFFFF',
              borderColor: isDark ? '#2E3340' : '#E2E8F0',
            },
          ]}
          onPress={() => onOpenMoreSlots(patient)}
          activeOpacity={0.8}
        >
          <Text style={[styles.moreText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            More
          </Text>
          <ChevronDown size={14} color={isDark ? '#94A3B8' : '#64748B'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  leftGroup: {
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
  name: {
    fontSize: 15.5,
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
  removeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  slotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slotChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotTimeText: {
    fontSize: 12.5,
    fontWeight: '800',
    lineHeight: 15,
  },
  slotPeriodText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  moreChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  moreText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
