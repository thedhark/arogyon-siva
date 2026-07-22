import React, { forwardRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTheme } from '@/hooks/useTheme';
import { Calendar, Clock } from 'lucide-react-native';

interface Props {
  onConfirm: (date: string, time: string) => void;
}

const DATES = [
  { id: '1', date: 'Aug 14', day: 'Mon' },
  { id: '2', date: 'Aug 15', day: 'Tue' },
  { id: '3', date: 'Aug 16', day: 'Wed' },
  { id: '4', date: 'Aug 17', day: 'Thu' },
];

const TIMES = [
  '09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM',
  '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'
];

export const SlotSelectionBottomSheet = forwardRef<BottomSheetModal, Props>(({ onConfirm }, ref) => {
  const { colors, isDark } = useTheme();
  const [selectedDate, setSelectedDate] = useState(DATES[0].date);
  const [selectedTime, setSelectedTime] = useState(TIMES[2]);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={['55%']}
      index={0}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />
      )}
      backgroundStyle={{ backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }}
      handleIndicatorStyle={{ backgroundColor: isDark ? '#333' : '#E5E5E5', width: 40 }}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Select Time Slot</Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          <Calendar size={16} color={colors.textSecondary} /> Select Date
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
          {DATES.map((item) => {
            const isSelected = selectedDate === item.date;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.dateCard,
                  { backgroundColor: isSelected ? colors.accent : (isDark ? '#2A2A2A' : '#F5F5F5') },
                  isSelected && styles.dateCardActive
                ]}
                onPress={() => setSelectedDate(item.date)}
              >
                <Text style={[styles.dayText, { color: isSelected ? '#FFFFFF' : colors.textSecondary }]}>{item.day}</Text>
                <Text style={[styles.dateText, { color: isSelected ? '#FFFFFF' : colors.text }]}>{item.date}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          <Clock size={16} color={colors.textSecondary} /> Select Time
        </Text>
        <View style={styles.timeGrid}>
          {TIMES.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeCard,
                  { 
                    backgroundColor: isSelected ? colors.accent + '20' : (isDark ? '#2A2A2A' : '#F5F5F5'),
                    borderColor: isSelected ? colors.accent : 'transparent',
                    borderWidth: 1,
                  }
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.timeText, { color: isSelected ? colors.accent : colors.text }]}>{time}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity 
          style={[styles.confirmBtn, { backgroundColor: colors.accent }]}
          onPress={() => onConfirm(selectedDate, selectedTime)}
        >
          <Text style={styles.confirmBtnText}>Confirm Slot</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scrollRow: {
    gap: 12,
    marginBottom: 24,
  },
  dateCard: {
    width: 64,
    height: 72,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCardActive: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '800',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  timeCard: {
    width: '22%',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  confirmBtn: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  }
});
