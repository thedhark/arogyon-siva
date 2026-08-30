import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MapPin, ChevronRight, ChevronDown, Sun, Sunset, Moon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Fonts } from '@/constants/theme';

export interface DateItem {
  id: string;
  day: string;
  date: string;
  fullDate?: string;
}

export const DEFAULT_DATES: DateItem[] = [
  { id: '1', day: 'Today', date: '25 Aug', fullDate: 'Today, 25 Aug' },
  { id: '2', day: 'Tomorrow', date: '26 Aug', fullDate: 'Tomorrow, 26 Aug' },
  { id: '3', day: '27 Aug', date: '27 Aug', fullDate: 'Wed, 27 Aug' },
  { id: '4', day: '28 Aug', date: '28 Aug', fullDate: 'Thu, 28 Aug' },
  { id: '5', day: '29 Aug', date: '29 Aug', fullDate: 'Fri, 29 Aug' },
];

export const QUICK_SLOTS = ['11:30 AM', '12:15 PM', '1:00 PM', '4:30 PM'];

export const ALL_SLOT_GROUPS = [
  {
    title: 'Morning Slots',
    icon: Sun,
    slots: ['9:00 AM', '9:30 AM', '10:15 AM', '11:00 AM', '11:30 AM'],
  },
  {
    title: 'Afternoon Slots',
    icon: Sunset,
    slots: ['12:15 PM', '1:00 PM', '2:00 PM', '2:45 PM', '3:30 PM', '4:30 PM'],
  },
  {
    title: 'Evening Slots',
    icon: Moon,
    slots: ['5:00 PM', '5:45 PM', '6:30 PM', '7:15 PM', '8:00 PM'],
  },
];

interface DoctorSlotPickerProps {
  hospitalName?: string;
  hospitalLocation?: string;
  clinicFee?: number | string;
  selectedDate: DateItem;
  onSelectDate: (date: DateItem) => void;
  selectedTime: string;
  onSelectTime: (slot: string) => void;
  isDark: boolean;
  colors: any;
}

export default function DoctorSlotPicker({
  hospitalName = 'Dr. Rela Institute & Medical Centre',
  hospitalLocation = 'Chromepet',
  clinicFee = 600,
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  isDark,
  colors,
}: DoctorSlotPickerProps) {
  const [showAllSlots, setShowAllSlots] = useState(false);

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
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
          },
        ]}
      >
        {/* Section Header */}
        <Text style={[styles.cardTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
          Book Clinic Visit
        </Text>

        {/* Hospital Info & Consultation Fee Row */}
        <View style={styles.hospitalFeeRow}>
          <View style={[styles.mapPinSquare, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF' }]}>
            <MapPin size={18} color="#2563EB" />
          </View>

          <View style={styles.hospitalTextCol}>
            <Text style={[styles.hospitalName, { color: isDark ? '#F8FAFC' : '#0F172A' }]} numberOfLines={1}>
              {hospitalName}
            </Text>
            <Text style={[styles.hospitalLocation, { color: isDark ? '#94A3B8' : '#64748B' }]} numberOfLines={1}>
              {hospitalLocation}
            </Text>
          </View>

          <View style={styles.feeCol}>
            <Text style={[styles.feeValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              ₹{clinicFee}
            </Text>
            <Text style={[styles.feeSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Consultation fee
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9' }]} />

        {/* Date Selector Tabs */}
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
                style={styles.dateTab}
              >
                <Text
                  style={[
                    styles.dateTabText,
                    {
                      color: isSelected
                        ? '#2563EB'
                        : isDark
                        ? '#94A3B8'
                        : '#64748B',
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.day}
                </Text>
                {isSelected ? <View style={styles.activeUnderline} /> : <View style={styles.inactiveUnderline} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Quick Time Slots Row */}
        <View style={styles.quickSlotsRow}>
          {QUICK_SLOTS.map((slot) => {
            const isSelected = selectedTime === slot;
            return (
              <TouchableOpacity
                key={slot}
                activeOpacity={0.8}
                onPress={() => handleTimePress(slot)}
                style={[
                  styles.quickSlotPill,
                  {
                    backgroundColor: isSelected
                      ? '#2563EB'
                      : isDark
                      ? '#0F172A'
                      : '#FFFFFF',
                    borderColor: isSelected
                      ? '#2563EB'
                      : isDark
                      ? 'rgba(59, 130, 246, 0.4)'
                      : '#93C5FD',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.slotPillText,
                    {
                      color: isSelected ? '#FFFFFF' : '#2563EB',
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

        {/* Expandable All Slots Section */}
        {showAllSlots ? (
          <View style={styles.allSlotsExpanded}>
            {ALL_SLOT_GROUPS.map((group) => {
              const IconComp = group.icon;
              return (
                <View key={group.title} style={styles.slotGroup}>
                  <View style={styles.groupHeaderRow}>
                    <IconComp size={14} color={isDark ? '#94A3B8' : '#64748B'} />
                    <Text style={[styles.groupTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      {group.title}
                    </Text>
                  </View>
                  <View style={styles.expandedGrid}>
                    {group.slots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <TouchableOpacity
                          key={slot}
                          activeOpacity={0.8}
                          onPress={() => handleTimePress(slot)}
                          style={[
                            styles.expandedSlotPill,
                            {
                              backgroundColor: isSelected
                                ? '#2563EB'
                                : isDark
                                ? '#0F172A'
                                : '#FFFFFF',
                              borderColor: isSelected
                                ? '#2563EB'
                                : isDark
                                ? 'rgba(59, 130, 246, 0.4)'
                                : '#93C5FD',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.slotPillText,
                              {
                                color: isSelected ? '#FFFFFF' : '#2563EB',
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
            })}
          </View>
        ) : null}

        {/* View All Slots Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowAllSlots(!showAllSlots)}
          style={[
            styles.viewAllSlotsBtn,
            { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC' },
          ]}
        >
          <Text style={[styles.viewAllSlotsText, { color: '#2563EB' }]}>
            {showAllSlots ? 'Hide slots' : 'View all slots'}
          </Text>
          {showAllSlots ? (
            <ChevronDown size={16} color="#2563EB" />
          ) : (
            <ChevronRight size={16} color="#2563EB" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16.5,
    fontFamily: Fonts.bold,
    fontWeight: '800',
    marginBottom: 14,
  },
  hospitalFeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mapPinSquare: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hospitalTextCol: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 13.5,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    marginBottom: 2,
  },
  hospitalLocation: {
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  feeCol: {
    alignItems: 'flex-end',
  },
  feeValue: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    fontWeight: '800',
  },
  feeSub: {
    fontSize: 10.5,
    fontFamily: Fonts.regular,
    marginTop: 1,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  datesScroll: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 14,
  },
  dateTab: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  dateTabText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  activeUnderline: {
    height: 2.5,
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
    marginTop: 6,
  },
  inactiveUnderline: {
    height: 2.5,
    width: '100%',
    backgroundColor: 'transparent',
    marginTop: 6,
  },
  quickSlotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  quickSlotPill: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 2,
    borderRadius: 10,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotPillText: {
    fontSize: 11.5,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
  allSlotsExpanded: {
    marginTop: 6,
    marginBottom: 10,
  },
  slotGroup: {
    marginBottom: 12,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 11.5,
    fontFamily: Fonts.semiBold,
    fontWeight: '600',
  },
  expandedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  expandedSlotPill: {
    width: '31%',
    paddingVertical: 9,
    paddingHorizontal: 2,
    borderRadius: 10,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllSlotsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 11,
    borderRadius: 12,
  },
  viewAllSlotsText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    fontWeight: '700',
  },
});
