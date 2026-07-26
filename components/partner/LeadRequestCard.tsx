import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PatientLead } from '../../constants/partner-data';
import { usePartnerStore } from '../../hooks/usePartnerStore';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  lead: PatientLead;
}

export const LeadRequestCard: React.FC<Props> = ({ lead }) => {
  const { colors } = useTheme();
  const { updateLeadStatus } = usePartnerStore();

  const handleCall = () => {
    Linking.openURL(`tel:${lead.phone}`).catch(() => {
      Alert.alert('Calling Patient', `Dialing ${lead.patientName} at ${lead.phone}...`);
    });
  };

  const getUrgencyColor = (urgency: PatientLead['urgency']) => {
    switch (urgency) {
      case 'Emergency':
        return '#EF4444';
      case 'High':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.patientInfo}>
          <Text style={[styles.name, { color: colors.text }]}>{lead.patientName}</Text>
          <Text style={styles.time}>{lead.createdAt}</Text>
        </View>
        <View style={[styles.urgencyBadge, { backgroundColor: `${getUrgencyColor(lead.urgency)}20` }]}>
          <Text style={[styles.urgencyText, { color: getUrgencyColor(lead.urgency) }]}>{lead.urgency}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="medical-outline" size={14} color="#8B5CF6" />
        <Text style={[styles.detailText, { color: colors.text }]}>{lead.specialty}</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
        <Text style={styles.subDetailText}>Preferred: {lead.preferredTime}</Text>
      </View>

      {lead.notes && (
        <View style={styles.notesBox}>
          <Text style={styles.notesText}>{lead.notes}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.statusChips}>
          {(['New', 'Contacted', 'Scheduled', 'Closed'] as const).map((st) => (
            <Pressable
              key={st}
              onPress={() => updateLeadStatus(lead.id, st)}
              style={[
                styles.chip,
                lead.status === st
                  ? { backgroundColor: '#3B82F6' }
                  : { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.chipText, lead.status === st ? { color: '#FFFFFF' } : { color: colors.text }]}>
                {st}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={handleCall} style={styles.callBtn}>
          <Ionicons name="call" size={14} color="#FFFFFF" />
          <Text style={styles.callBtnText}>Call</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
  },
  time: {
    fontSize: 11,
    color: '#94A3B8',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '700',
  },
  subDetailText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  notesBox: {
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  notesText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.1)',
  },
  statusChips: {
    flexDirection: 'row',
    gap: 4,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '700',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  callBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
