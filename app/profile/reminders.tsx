import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput, Modal, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Bell, Plus, Pill, Calendar, Clock, Trash2, CheckCircle2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown } from 'react-native-reanimated';

export type Reminder = {
  id: string;
  title: string;
  type: 'Medication' | 'Appointment' | 'Checkup';
  time: string;
  dosage?: string;
  days: string;
  active: boolean;
};

export default function RemindersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Telmisartan 40mg',
      type: 'Medication',
      time: '08:00 AM',
      dosage: '1 Tablet after breakfast',
      days: 'Daily',
      active: true,
    },
    {
      id: '2',
      title: 'Atorvastatin 10mg',
      type: 'Medication',
      time: '09:30 PM',
      dosage: '1 Tablet after dinner',
      days: 'Daily',
      active: true,
    },
    {
      id: '3',
      title: 'Dr. Anand Sharma Cardiology Checkup',
      type: 'Appointment',
      time: '10:30 AM',
      dosage: 'Apollo Clinic, Room 302',
      days: 'Tomorrow',
      active: true,
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00 AM');
  const [newDosage, setNewDosage] = useState('');

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleAddReminder = () => {
    if (!newTitle) return;
    setReminders(prev => [
      {
        id: Math.random().toString(36).substring(7),
        title: newTitle,
        type: 'Medication',
        time: newTime,
        dosage: newDosage || '1 Dose',
        days: 'Daily',
        active: true,
      },
      ...prev,
    ]);
    setNewTitle('');
    setNewDosage('');
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
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.subtitleRow}>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Set daily pill alarms and appointment alerts to stay on track with your health routine.
          </Text>
        </View>

        <View style={styles.list}>
          {reminders.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <View style={styles.iconCircle}>
                <Bell size={32} color="#10B981" />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Reminders Set</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                Tap the '+' button above to add pill or checkup reminders.
              </Text>
            </View>
          ) : (
            reminders.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInDown.delay(index * 100)}>
                <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: item.type === 'Medication' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)' }]}>
                      {item.type === 'Medication' ? (
                        <Pill size={22} color="#10B981" />
                      ) : (
                        <Calendar size={22} color="#3B82F6" />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                      {item.dosage && (
                        <Text style={[styles.dosageText, { color: colors.textSecondary }]}>{item.dosage}</Text>
                      )}
                      <View style={styles.timeTag}>
                        <Clock size={12} color={colors.accent} style={{ marginRight: 4 }} />
                        <Text style={[styles.timeText, { color: colors.accent }]}>{item.time} • {item.days}</Text>
                      </View>
                    </View>

                    <View style={{ alignItems: 'flex-end', gap: 8 }}>
                      <Switch
                        value={item.active}
                        onValueChange={() => toggleReminder(item.id)}
                        trackColor={{ false: '#767577', true: colors.accent }}
                      />
                      <TouchableOpacity onPress={() => deleteReminder(item.id)} style={{ padding: 4 }}>
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Reminder Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <Text style={[styles.modalHeading, { color: colors.text }]}>Add New Medication Reminder</Text>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Medicine Name</Text>
              <TextInput
                style={[styles.modalInput, { color: colors.text, backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
                placeholder="e.g. Paracetamol 500mg"
                placeholderTextColor={colors.textMuted}
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>Reminder Time</Text>
              <TextInput
                style={[styles.modalInput, { color: colors.text, backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
                placeholder="e.g. 08:30 AM"
                placeholderTextColor={colors.textMuted}
                value={newTime}
                onChangeText={setNewTime}
              />

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>Dosage Instructions</Text>
              <TextInput
                style={[styles.modalInput, { color: colors.text, backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
                placeholder="e.g. 1 tablet after meals"
                placeholderTextColor={colors.textMuted}
                value={newDosage}
                onChangeText={setNewDosage}
              />
            </View>

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
  headerTitle: { fontSize: 20, fontWeight: '700' },
  addBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 60 },
  subtitleRow: { marginBottom: 20 },
  subtitle: { fontSize: 14, lineHeight: 20 },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 32, borderRadius: 24, marginTop: 40 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  list: { gap: 14 },
  card: { padding: 16, borderRadius: 20, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  dosageText: { fontSize: 13, marginBottom: 6 },
  timeTag: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 12, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: 16 },
  modalHeading: { fontSize: 20, fontWeight: '800' },
  formGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '700' },
  modalInput: { height: 50, borderRadius: 14, paddingHorizontal: 16, fontSize: 15, fontWeight: '600' },
  modalBtnRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cancelBtn: { flex: 1, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  saveBtn: { flex: 1, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }
});

