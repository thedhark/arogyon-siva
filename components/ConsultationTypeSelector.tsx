import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Video, CheckCircle2 } from 'lucide-react-native';

interface ConsultationTypeSelectorProps {
  consultationType: string;
  setConsultationType: (type: string) => void;
  colors: any;
}

export default function ConsultationTypeSelector({ consultationType, setConsultationType, colors }: ConsultationTypeSelectorProps) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Consultation Type</Text>
      <View style={styles.consultTypeRow}>
        <TouchableOpacity 
          style={[styles.consultCard, consultationType === 'in-clinic' && styles.consultCardActive]}
          onPress={() => setConsultationType('in-clinic')}
        >
          {consultationType === 'in-clinic' && (
            <View style={styles.consultCheckBadge}>
              <CheckCircle2 size={12} color="#FFFFFF" />
            </View>
          )}
          <View style={[styles.consultIconBox, { backgroundColor: '#F0FDF4' }]}>
            <MapPin size={20} color="#10B981" />
          </View>
          <Text style={[styles.consultCardTitle, { color: colors.text }]}>In-clinic Visit</Text>
          <Text style={styles.consultCardSub}>Meet at hospital</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.consultCard, consultationType === 'video' && styles.consultCardActive]}
          onPress={() => setConsultationType('video')}
        >
          {consultationType === 'video' && (
            <View style={styles.consultCheckBadge}>
              <CheckCircle2 size={12} color="#FFFFFF" />
            </View>
          )}
          <View style={[styles.consultIconBox, { backgroundColor: '#EFF6FF' }]}>
            <Video size={20} color="#3B82F6" />
          </View>
          <Text style={[styles.consultCardTitle, { color: colors.text }]}>Video Consultation</Text>
          <Text style={styles.consultCardSub}>Consult online</Text>
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
  consultTypeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  consultCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  consultCardActive: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  consultCheckBadge: {
    position: 'absolute',
    top: -1,
    right: -1,
    backgroundColor: '#10B981',
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  consultCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  consultCardSub: {
    fontSize: 12,
    color: '#6B7280',
  },
});
