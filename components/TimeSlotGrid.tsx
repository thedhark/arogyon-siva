import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface TimeSlotGridProps {
  timeSlots: { id: number; time: string }[];
  selectedTime: number;
  setSelectedTime: (id: number) => void;
  isDark: boolean;
  colors: any;
}

export default function TimeSlotGrid({ timeSlots, selectedTime, setSelectedTime, isDark, colors }: TimeSlotGridProps) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Time Slots</Text>
      <View style={styles.timeGrid}>
        {timeSlots.map((slot) => (
          <TouchableOpacity 
            key={slot.id} 
            style={[
              styles.timeSlot, 
              selectedTime === slot.id && styles.timeSlotSelected,
              { borderColor: isDark ? '#333' : '#E5E7EB', backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
            ]}
            onPress={() => setSelectedTime(slot.id)}
          >
            <Text style={[
              styles.timeText, 
              selectedTime === slot.id ? styles.timeTextSelected : { color: colors.text }
            ]}>
              {slot.time}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.timeSlot, { borderColor: 'transparent' }]}>
          <Text style={[styles.timeText, { color: '#10B981', fontWeight: '700' }]}>View more <ChevronRight size={12} color="#10B981" /></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 12,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotSelected: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
