import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  ShieldCheck, 
  Zap, 
  Activity, 
  Truck, 
  FlaskConical, 
  Baby, 
  Pill, 
  Bone
} from 'lucide-react-native';

interface Props {
  colors: any;
  isDark: boolean;
  onViewAllPress?: () => void;
}

interface FacilityItem {
  id: string;
  name: string;
  icon: any;
}

const FACILITIES_DATA: FacilityItem[] = [
  { id: 'cashless', name: 'Cashless\nInsurance', icon: ShieldCheck },
  { id: 'emergency', name: 'Emergency\nCare', icon: Zap },
  { id: 'icu', name: 'ICU', icon: Activity },
  { id: 'ambulance', name: 'Ambulance\nService', icon: Truck },
  { id: 'laboratory', name: 'Laboratory', icon: FlaskConical },
  { id: 'pharmacy', name: 'Pharmacy', icon: Pill },
  { id: 'radiology', name: 'Radiology', icon: Bone },
  { id: 'nicu_picu', name: 'NICU / PICU', icon: Baby },
];

export default function HospitalFacilities({ colors, isDark, onViewAllPress }: Props) {
  const visibleFacilities = FACILITIES_DATA.slice(0, 5);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      {/* Title */}
      <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#1E293B' }]}>
        Hospital Facilities
      </Text>

      {/* Sleek, Compact Horizontal Scroll of Facilities with Vertical Dividers */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {visibleFacilities.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <React.Fragment key={item.id}>
              <View style={styles.facilityCard}>
                <View style={styles.iconWrapper}>
                  <IconComponent size={20} color={isDark ? '#E2E8F0' : '#1E293B'} strokeWidth={1.8} />
                </View>
                <Text style={[styles.facilityName, { color: isDark ? '#CBD5E1' : '#334155' }]}>
                  {item.name}
                </Text>
              </View>

              {/* Thin Vertical Line Divider */}
              <View style={[styles.verticalDivider, { backgroundColor: isDark ? '#27272A' : '#E2E8F0' }]} />
            </React.Fragment>
          );
        })}

        {/* Compact +5 More Circle */}
        <TouchableOpacity 
          style={[styles.moreCircle, { borderColor: isDark ? '#3F3F46' : '#CBD5E1' }]}
          onPress={onViewAllPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.moreCountText, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>+5</Text>
          <Text style={[styles.moreSubText, { color: isDark ? '#94A3B8' : '#64748B' }]}>More</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    marginTop: 2,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
    paddingHorizontal: 16,
    letterSpacing: -0.2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  facilityCard: {
    width: 68,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconWrapper: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  facilityName: {
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 13,
  },
  verticalDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 8,
  },
  moreCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  moreCountText: {
    fontSize: 12,
    fontWeight: '800',
  },
  moreSubText: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: -2,
  },
});
