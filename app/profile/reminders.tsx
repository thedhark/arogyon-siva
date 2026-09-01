import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput, Modal, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Bell, Plus, Pill, Calendar, Clock, Trash2, CheckCircle2, Music2, Sun, Sunset, Moon, Sparkles, AlertTriangle, Volume2, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

export type Reminder = {
  id: string;
  title: string;
  type: 'Medication' | 'Appointment' | 'Checkup';
  times: string[];
  dosage?: string;
  mealTiming?: 'After Food' | 'Before Food' | 'With Food' | 'Empty Stomach';
  soundTone?: string;
  days: string;
  active: boolean;
};

const SOUND_TONES = [
  'Gentle Chime',
  'Zen Bell',
  'Vital Echo',
  'Morning Breeze',
  'Pulse Tone',
];

const MEAL_OPTIONS: Array<'After Food' | 'Before Food' | 'With Food' | 'Empty Stomach'> = [
  'After Food',
  'Before Food',
  'With Food',
  'Empty Stomach',
];

const DEFAULT_TIME_PRESETS = [
  { label: 'Morning', time: '08:00 AM', icon: Sun },
  { label: 'Afternoon', time: '01:30 PM', icon: Sun },
  { label: 'Evening', time: '06:00 PM', icon: Sunset },
  { label: 'Night', time: '09:30 PM', icon: Moon },
];

export default function RemindersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Telmisartan 40mg',
      type: 'Medication',
      times: ['08:00 AM', '08:30 PM'],
      dosage: '1 Tablet',
      mealTiming: 'After Food',
      soundTone: 'Gentle Chime',
      days: 'Daily',
      active: true,
    },
    {
      id: '2',
      title: 'Metformin 500mg',
      type: 'Medication',
      times: ['08:30 AM', '01:30 PM', '09:00 PM'],
      dosage: '1 Tablet',
      mealTiming: 'With Food',
      soundTone: 'Vital Echo',
      days: 'Daily',
      active: true,
    },
    {
      id: '3',
      title: 'Dr. Anand Sharma Cardiology Review',
      type: 'Appointment',
      times: ['10:30 AM'],
      dosage: 'Apollo Clinic, Room 302',
      mealTiming: 'Before Food',
      soundTone: 'Zen Bell',
      days: 'Tomorrow',
      active: true,
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['08:00 AM', '08:30 PM']);
  const [customTimeInput, setCustomTimeInput] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newMealTiming, setNewMealTiming] = useState<'After Food' | 'Before Food' | 'With Food' | 'Empty Stomach'>('After Food');
  const [selectedSoundTone, setSelectedSoundTone] = useState('Gentle Chime');

  const [reminderToDelete, setReminderToDelete] = useState<{ id: string; title: string } | null>(null);

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleConfirmDelete = () => {
    if (reminderToDelete) {
      setReminders(prev => prev.filter(r => r.id !== reminderToDelete.id));
      setReminderToDelete(null);
    }
  };

  const toggleTimePreset = (timeStr: string) => {
    if (selectedTimes.includes(timeStr)) {
      if (selectedTimes.length > 1) {
        setSelectedTimes(selectedTimes.filter(t => t !== timeStr));
      }
    } else {
      setSelectedTimes([...selectedTimes, timeStr]);
    }
  };

  const handleAddCustomTime = () => {
    if (customTimeInput.trim() && !selectedTimes.includes(customTimeInput.trim())) {
      setSelectedTimes([...selectedTimes, customTimeInput.trim()]);
      setCustomTimeInput('');
    }
  };

  const handleAddReminder = () => {
    if (!newTitle.trim()) return;
    setReminders(prev => [
      {
        id: Math.random().toString(36).substring(7),
        title: newTitle.trim(),
        type: 'Medication',
        times: selectedTimes.length > 0 ? selectedTimes : ['09:00 AM'],
        dosage: newDosage.trim() || '1 Dose',
        mealTiming: newMealTiming,
        soundTone: selectedSoundTone,
        days: 'Daily',
        active: true,
      },
      ...prev,
    ]);
    setNewTitle('');
    setNewDosage('');
    setSelectedTimes(['08:00 AM', '08:30 PM']);
    setShowAddModal(false);
  };

  return (
    <AnimatedScreen entrance="fade" style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Pill & Health Reminders</Text>
        <TouchableOpacity 
          style={[styles.addBtn, { backgroundColor: colors.accent }]}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.subtitleRow}>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Set recurring multi-time pill alarms with soothing ringtones to stay healthy and on schedule.
          </Text>
        </View>

        <View style={styles.list}>
          {reminders.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <View style={styles.iconCircle}>
                <Bell size={36} color="#10B981" />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Reminders Configured</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                Tap the '+' button above to add prescription pills with multiple dosage alarms.
              </Text>
            </View>
          ) : (
            reminders.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInDown.delay(index * 80)}>
                <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: item.type === 'Medication' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)' }]}>
                      {item.type === 'Medication' ? (
                        <Pill size={22} color="#10B981" />
                      ) : (
                        <Calendar size={22} color="#3B82F6" />
                      )}
                    </View>

                    <View style={{ flex: 1, paddingRight: 6 }}>
                      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                      
                      <View style={styles.subTagsRow}>
                        {item.dosage && (
                          <Text style={[styles.dosageText, { color: colors.textSecondary }]}>{item.dosage}</Text>
                        )}
                        {item.mealTiming && (
                          <View style={[styles.mealBadge, { backgroundColor: isDark ? '#2D3748' : '#F1F5F9' }]}>
                            <Text style={[styles.mealBadgeText, { color: colors.accent }]}>{item.mealTiming}</Text>
                          </View>
                        )}
                      </View>

                      {/* Sound Tone Indicator */}
                      {item.soundTone && (
                        <View style={styles.soundIndicatorRow}>
                          <Volume2 size={12} color={colors.textMuted} />
                          <Text style={[styles.soundToneText, { color: colors.textMuted }]}>{item.soundTone}</Text>
                        </View>
                      )}
                    </View>

                    <View style={{ alignItems: 'flex-end', gap: 10 }}>
                      <Switch
                        value={item.active}
                        onValueChange={() => toggleReminder(item.id)}
                        trackColor={{ false: '#767577', true: colors.accent }}
                      />
                      <TouchableOpacity 
                        onPress={() => setReminderToDelete({ id: item.id, title: item.title })}
                        style={styles.deletePillBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Multiple Timings Chip Grid */}
                  <View style={[styles.timeChipsContainer, { borderTopColor: isDark ? '#2D3748' : '#F1F5F9' }]}>
                    <Text style={[styles.timingsLabel, { color: colors.textMuted }]}>DAILY SCHEDULE:</Text>
                    <View style={styles.timeChipsRow}>
                      {item.times.map((t, idx) => (
                        <View key={idx} style={[styles.timeChip, { backgroundColor: colors.accent + '15', borderColor: colors.accent + '30' }]}>
                          <Clock size={12} color={colors.accent} />
                          <Text style={[styles.timeChipText, { color: colors.accent }]}>{t}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Multi-Timing Reminder Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalHeading, { color: colors.text }]}>Add Pill Reminder</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 460 }}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Medicine / Pill Name</Text>
                <TextInput
                  style={[styles.modalInput, { color: colors.text, backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
                  placeholder="e.g. Paracetamol 500mg"
                  placeholderTextColor={colors.textMuted}
                  value={newTitle}
                  onChangeText={setNewTitle}
                />

                <Text style={[styles.label, { color: colors.textSecondary, marginTop: 14 }]}>Dosage Amount</Text>
                <TextInput
                  style={[styles.modalInput, { color: colors.text, backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
                  placeholder="e.g. 1 Tablet"
                  placeholderTextColor={colors.textMuted}
                  value={newDosage}
                  onChangeText={setNewDosage}
                />

                {/* Multiple Dosage Timings Selector */}
                <Text style={[styles.label, { color: colors.textSecondary, marginTop: 14 }]}>Multiple Daily Dosage Times</Text>
                <View style={styles.presetTimesRow}>
                  {DEFAULT_TIME_PRESETS.map((preset) => {
                    const isSelected = selectedTimes.includes(preset.time);
                    const IconComp = preset.icon;
                    return (
                      <TouchableOpacity
                        key={preset.label}
                        style={[
                          styles.presetTimeBtn,
                          { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' },
                          isSelected && { backgroundColor: colors.accent, borderColor: colors.accent }
                        ]}
                        onPress={() => toggleTimePreset(preset.time)}
                        activeOpacity={0.8}
                      >
                        <IconComp size={14} color={isSelected ? '#FFF' : colors.textSecondary} />
                        <Text style={[styles.presetTimeLabel, { color: isSelected ? '#FFF' : colors.text }]}>{preset.label}</Text>
                        <Text style={[styles.presetTimeVal, { color: isSelected ? '#FFF' : colors.textMuted }]}>{preset.time}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Meal Relation Timing */}
                <Text style={[styles.label, { color: colors.textSecondary, marginTop: 14 }]}>Meal Timing</Text>
                <View style={styles.mealOptionsRow}>
                  {MEAL_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.mealChip,
                        { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' },
                        newMealTiming === opt && { backgroundColor: colors.accent + '20', borderColor: colors.accent, borderWidth: 1.5 }
                      ]}
                      onPress={() => setNewMealTiming(opt)}
                    >
                      <Text style={[styles.mealChipText, { color: newMealTiming === opt ? colors.accent : colors.textSecondary }]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Sound / Tone Picker */}
                <Text style={[styles.label, { color: colors.textSecondary, marginTop: 14 }]}>Alarm Sound Tone</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.soundScroll}>
                  {SOUND_TONES.map((tone) => (
                    <TouchableOpacity
                      key={tone}
                      style={[
                        styles.soundChip,
                        { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' },
                        selectedSoundTone === tone && { backgroundColor: colors.accent, borderColor: colors.accent }
                      ]}
                      onPress={() => setSelectedSoundTone(tone)}
                    >
                      <Music2 size={13} color={selectedSoundTone === tone ? '#FFF' : colors.textSecondary} />
                      <Text style={[styles.soundChipText, { color: selectedSoundTone === tone ? '#FFF' : colors.text }]}>{tone}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]} onPress={() => setShowAddModal(false)}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveBtn, { backgroundColor: colors.accent, opacity: newTitle ? 1 : 0.5 }]} 
                onPress={handleAddReminder}
                disabled={!newTitle}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFF' }}>Save Reminder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Minimal Delete Confirmation Modal */}
      <Modal
        visible={!!reminderToDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setReminderToDelete(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setReminderToDelete(null)}>
          <Animated.View 
            entering={ZoomIn.duration(200)}
            style={[
              styles.deleteModalCard, 
              { backgroundColor: isDark ? '#1F2430' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' }
            ]}
          >
            <View style={styles.deleteIconWrap}>
              <AlertTriangle size={28} color="#EF4444" />
            </View>

            <Text style={[styles.deleteModalTitle, { color: colors.text }]}>Delete Reminder?</Text>
            <Text style={[styles.deleteModalDesc, { color: colors.textSecondary }]}>
              Are you sure you want to stop alerts for <Text style={{ fontWeight: '700', color: colors.text }}>{reminderToDelete?.title}</Text>?
            </Text>

            <View style={styles.deleteModalBtnRow}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { backgroundColor: isDark ? '#2D3748' : '#F1F5F9' }]}
                onPress={() => setReminderToDelete(null)}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalCancelText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmDeleteBtn}
                onPress={handleConfirmDelete}
                activeOpacity={0.85}
              >
                <Trash2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.modalConfirmDeleteText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>

    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: { paddingRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  addBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 60 },
  subtitleRow: { marginBottom: 18 },
  subtitle: { fontSize: 13.5, lineHeight: 20 },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 32, borderRadius: 24, marginTop: 40 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  list: { gap: 14 },
  card: { padding: 16, borderRadius: 20, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  subTagsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 },
  dosageText: { fontSize: 13, fontWeight: '500' },
  mealBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  mealBadgeText: { fontSize: 11, fontWeight: '700' },
  soundIndicatorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  soundToneText: { fontSize: 11, fontWeight: '600' },
  deletePillBtn: { padding: 6, borderRadius: 8, backgroundColor: 'rgba(239, 68, 68, 0.08)' },
  timeChipsContainer: { marginTop: 12, borderTopWidth: 1, paddingTop: 10 },
  timingsLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6 },
  timeChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  timeChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, gap: 5 },
  timeChipText: { fontSize: 12, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalSheet: { padding: 24, borderTopLeftRadius: 28, borderTopRightRadius: 28, gap: 14, maxHeight: '85%' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalHeading: { fontSize: 20, fontWeight: '800' },
  formGroup: { gap: 6 },
  label: { fontSize: 12.5, fontWeight: '700' },
  modalInput: { height: 48, borderRadius: 14, paddingHorizontal: 16, fontSize: 14.5, fontWeight: '600' },
  presetTimesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  presetTimeBtn: { flex: 1, minWidth: '45%', padding: 10, borderRadius: 14, borderWidth: 1, borderColor: 'transparent', gap: 2 },
  presetTimeLabel: { fontSize: 12, fontWeight: '700' },
  presetTimeVal: { fontSize: 11, fontWeight: '600' },
  mealOptionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  mealChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
  mealChipText: { fontSize: 12.5, fontWeight: '700' },
  soundScroll: { gap: 8, marginTop: 4 },
  soundChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14, gap: 6 },
  soundChipText: { fontSize: 12.5, fontWeight: '700' },
  modalBtnRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  saveBtn: { flex: 1, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  deleteModalCard: { width: '100%', maxWidth: 380, borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8 },
  deleteIconWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(239, 68, 68, 0.12)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  deleteModalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  deleteModalDesc: { fontSize: 13.5, lineHeight: 20, textAlign: 'center', marginBottom: 22 },
  deleteModalBtnRow: { flexDirection: 'row', gap: 12, width: '100%' },
  modalCancelBtn: { flex: 1, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  modalCancelText: { fontSize: 14.5, fontWeight: '700' },
  modalConfirmDeleteBtn: { flex: 1, height: 48, borderRadius: 14, backgroundColor: '#EF4444', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  modalConfirmDeleteText: { color: '#FFFFFF', fontSize: 14.5, fontWeight: '700' },
});


