import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { 
  X, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Truck, 
  FlaskConical, 
  Pill, 
  Bone, 
  Baby, 
  Clock, 
  PhoneCall, 
  Award, 
  Coffee, 
  Wifi, 
  Building2 
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface HospitalInfoModalProps {
  visible: boolean;
  onClose: () => void;
  hospitalName: string;
  location?: string;
  phone?: string;
}

const ALL_FACILITIES = [
  { id: '1', name: 'Cashless Insurance Clearance', desc: 'Direct claim settlement with 30+ TPA insurance providers.', icon: ShieldCheck },
  { id: '2', name: '24x7 Emergency & Trauma', desc: 'Round-the-clock emergency triage and life support.', icon: Zap },
  { id: '3', name: 'Advanced ICU & CCU Beds', desc: 'Multi-parameter ventilator and cardiac monitoring units.', icon: Activity },
  { id: '4', name: 'Advanced Ambulance Fleet', desc: 'GPS-tracked ACLS ambulances equipped with paramedic care.', icon: Truck },
  { id: '5', name: 'NABL Diagnostic Lab', desc: 'In-house automated blood analyzers and pathology reporting.', icon: FlaskConical },
  { id: '6', name: '24x7 In-House Pharmacy', desc: 'Complete inventory of critical medicines and surgical supplies.', icon: Pill },
  { id: '7', name: 'Digital Radiology & CT/MRI', desc: 'Ultra-low radiation 3D scanning and digital X-rays.', icon: Bone },
  { id: '8', name: 'NICU & PICU Neonatal Unit', desc: 'Specialized intensive care for infants and young children.', icon: Baby },
  { id: '9', name: 'High-Speed Wi-Fi & VIP Rooms', desc: 'Private luxury suites with patient lounge & guest amenities.', icon: Wifi },
  { id: '10', name: 'Multi-Cuisine Cafeteria', desc: 'Dietitian-approved hygienic meal services for patients & guests.', icon: Coffee },
];

export default function HospitalInfoModal({ visible, onClose, hospitalName, location, phone }: HospitalInfoModalProps) {
  const { colors, isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable 
          style={[styles.modalCard, { backgroundColor: isDark ? '#1E1E24' : '#FFFFFF' }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{hospitalName}</Text>
              <Text style={[styles.modalSub, { color: colors.textSecondary }]}>Facilities & Key Information</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDark ? '#2D2D38' : '#F1F5F9' }]}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Accreditation Badge Row */}
            <View style={[styles.badgeBox, { backgroundColor: isDark ? '#2A2315' : '#FEF3C7', borderColor: isDark ? '#78350F' : '#FCD34D' }]}>
              <Award size={18} color="#D97706" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.badgeTitle, { color: isDark ? '#FBBF24' : '#92400E' }]}>NABH & JCI Accredited Facility</Text>
                <Text style={[styles.badgeSub, { color: isDark ? '#FCD34D' : '#B45309' }]}>Certified for Highest International Patient Safety & Quality Care</Text>
              </View>
            </View>

            {/* Quick Info Grid */}
            <View style={styles.infoGrid}>
              <View style={[styles.infoCard, { backgroundColor: isDark ? '#272730' : '#F8FAFC' }]}>
                <Clock size={16} color={colors.accent} />
                <Text style={[styles.infoCardTitle, { color: colors.text }]}>Emergency</Text>
                <Text style={[styles.infoCardVal, { color: colors.textSecondary }]}>Open 24/7</Text>
              </View>

              <View style={[styles.infoCard, { backgroundColor: isDark ? '#272730' : '#F8FAFC' }]}>
                <Building2 size={16} color={colors.accent} />
                <Text style={[styles.infoCardTitle, { color: colors.text }]}>Bed Capacity</Text>
                <Text style={[styles.infoCardVal, { color: colors.textSecondary }]}>350+ Beds</Text>
              </View>

              <View style={[styles.infoCard, { backgroundColor: isDark ? '#272730' : '#F8FAFC' }]}>
                <PhoneCall size={16} color={colors.accent} />
                <Text style={[styles.infoCardTitle, { color: colors.text }]}>Helpline</Text>
                <Text style={[styles.infoCardVal, { color: colors.textSecondary }]}>{phone || '1800-102-456'}</Text>
              </View>
            </View>

            {/* Facilities List Title */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Comprehensive Facilities</Text>

            {ALL_FACILITIES.map((item) => {
              const IconComp = item.icon;
              return (
                <View key={item.id} style={[styles.facilityItem, { borderColor: isDark ? '#2D2D38' : '#F1F5F9' }]}>
                  <View style={[styles.facilityIconWrap, { backgroundColor: colors.accent + '15' }]}>
                    <IconComp size={20} color={colors.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.facilityName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.facilityDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  modalSub: { fontSize: 13, marginTop: 2 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingVertical: 16, paddingBottom: 40 },
  badgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  badgeTitle: { fontSize: 13, fontWeight: '700' },
  badgeSub: { fontSize: 11, marginTop: 2 },
  infoGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  infoCard: { flex: 1, padding: 12, borderRadius: 14, alignItems: 'center' },
  infoCardTitle: { fontSize: 12, fontWeight: '700', marginTop: 6 },
  infoCardVal: { fontSize: 11, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  facilityIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  facilityName: { fontSize: 14, fontWeight: '700' },
  facilityDesc: { fontSize: 12, marginTop: 2, lineHeight: 16 },
});
