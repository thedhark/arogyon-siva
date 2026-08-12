import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Clock, Calendar, ChevronRight, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export interface AssignedPatient {
  id: string;
  name: string;
  relation: string;
  age: string | number;
  gender: string;
  avatar?: string;
}

export interface AppointmentItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
  dateStr?: string;
  timeStr?: string;
  patient: AssignedPatient;
  badgeStyle?: 'teal' | 'pink';
}

interface AppointmentItemCardProps {
  item: AppointmentItem;
  onRemoveItem: (id: string) => void;
  onSelectPatient: (id: string) => void;
}

export default function AppointmentItemCard({
  item,
  onRemoveItem,
  onSelectPatient,
}: AppointmentItemCardProps) {
  const { colors, isDark } = useTheme();

  const isSelf = item.patient.relation.toLowerCase() === 'self';
  const isPinkTheme = item.badgeStyle === 'pink' || (!isSelf && item.patient.gender?.toLowerCase() === 'female');

  const subCardBg = isDark
    ? isPinkTheme ? '#2A1A24' : '#112D29'
    : isPinkTheme ? '#FFF1F2' : '#F0FDFA';

  const relationColor = isDark
    ? isPinkTheme ? '#F472B6' : '#2DD4BF'
    : isPinkTheme ? '#E11D48' : '#0D9488';

  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      {/* Top Item Row */}
      <View style={styles.mainRow}>
        <Image
          source={{ uri: item.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200' }}
          style={styles.itemAvatar}
        />
        <View style={styles.infoCol}>
          <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>

          <View style={styles.timeRow}>
            {item.title.toLowerCase().includes('package') ? (
              <Calendar size={13} color="#6B7280" style={{ marginRight: 4 }} />
            ) : (
              <Clock size={13} color="#6B7280" style={{ marginRight: 4 }} />
            )}
            <Text style={styles.timeText}>
              {item.dateStr || 'Today, Aug 11'} • {item.timeStr || '10:00 AM'}
            </Text>
          </View>

          <Text style={[styles.priceText, { color: colors.text }]}>
            ₹{item.price.toLocaleString('en-IN')}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => onRemoveItem(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Patient Sub-Card */}
      <TouchableOpacity
        style={[styles.patientSubCard, { backgroundColor: subCardBg }]}
        onPress={() => onSelectPatient(item.id)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.patient.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150' }}
          style={styles.patientAvatar}
        />
        <View style={styles.patientInfo}>
          <Text style={styles.patientLine1} numberOfLines={1}>
            <Text style={{ color: colors.textMuted, fontWeight: '500' }}>For </Text>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{item.patient.name} </Text>
            <Text style={{ color: relationColor, fontWeight: '700' }}>
              ({item.patient.relation})
            </Text>
          </Text>
          <Text style={styles.patientLine2}>
            {item.patient.gender} • {item.patient.age} years
          </Text>
        </View>

        <ChevronRight size={18} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 14,
  },
  infoCol: {
    flex: 1,
    paddingRight: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 12.5,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  patientSubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },
  patientAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  patientInfo: {
    flex: 1,
  },
  patientLine1: {
    fontSize: 13,
  },
  patientLine2: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 1,
  },
});
