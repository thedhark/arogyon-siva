import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { User, Plus, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { PatientSlotAssignment } from './MultiPersonSlotSheet';

interface PackagePersonSelectorCardProps {
  assignedPatients: PatientSlotAssignment[];
  onAddPersonPress: () => void;
  onRemovePerson: (id: string) => void;
}

export default function PackagePersonSelectorCard({
  assignedPatients,
  onAddPersonPress,
  onRemovePerson,
}: PackagePersonSelectorCardProps) {
  const { isDark } = useTheme();

  const handleRemove = (id: string) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}
    }
    onRemovePerson(id);
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
      {/* Title & Beneficiary Count */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Who is this package for?
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Select or add family members for this package
          </Text>
        </View>
        <View style={[styles.countPill, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#EEF2FF' }]}>
          <Text style={[styles.countPillText, { color: isDark ? '#A5B4FC' : '#4F46E5' }]}>
            {assignedPatients.length} {assignedPatients.length === 1 ? 'Person' : 'Persons'}
          </Text>
        </View>
      </View>

      {/* List of Assigned Persons */}
      <View style={styles.patientsList}>
        {assignedPatients.map((patient, idx) => {
          const accentColor = patient.accentColor || '#6366F1';
          const canRemove = assignedPatients.length > 1;

          return (
            <View
              key={`${patient.id}-${idx}`}
              style={[
                styles.patientRow,
                {
                  backgroundColor: isDark ? '#1C1F26' : '#F8FAFC',
                  borderColor: isDark ? '#2E3340' : '#E2E8F0',
                },
              ]}
            >
              <View style={styles.patientLeft}>
                <View style={[styles.avatarCircle, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#EEF2FF' }]}>
                  <User size={16} color={accentColor} />
                </View>
                <View>
                  <Text style={[styles.patientName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    {patient.name}
                  </Text>
                  <View style={[styles.relationBadge, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#E0E7FF' }]}>
                    <Text style={[styles.relationText, { color: isDark ? '#A5B4FC' : '#4338CA' }]}>
                      {patient.relation}
                    </Text>
                  </View>
                </View>
              </View>

              {canRemove && (
                <TouchableOpacity
                  onPress={() => handleRemove(patient.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={[styles.removeBtn, { backgroundColor: isDark ? '#262A36' : '#F1F5F9' }]}
                >
                  <X size={14} color={isDark ? '#94A3B8' : '#64748B'} />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      {/* Add Another Person Button */}
      <TouchableOpacity
        style={[
          styles.addPersonBtn,
          {
            backgroundColor: isDark ? '#1C1F26' : '#F5F3FF',
            borderColor: isDark ? '#4F46E5' : '#818CF8',
          },
        ]}
        onPress={onAddPersonPress}
        activeOpacity={0.8}
      >
        <Plus size={16} color="#6366F1" strokeWidth={2.4} />
        <Text style={styles.addPersonBtnText}>+ Add another person</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  countPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  patientsList: {
    gap: 8,
    marginBottom: 10,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  patientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  relationBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  relationText: {
    fontSize: 10,
    fontWeight: '700',
  },
  removeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPersonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  addPersonBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6366F1',
  },
});
