import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Search, HeartPulse, Bone, Brain, Stethoscope, ArrowUpDown, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import DoctorCard from '@/components/DoctorCard';
import { useBookingStore } from '@/hooks/useBookingStore';

interface Props {
  doctors: any[];
  likedDocs: {[key: string]: boolean};
  toggleDocLike: (id: string) => void;
  colors: any;
  isDark: boolean;
}

const SPECIALTIES = [
  { id: 'All', name: 'All', icon: Search, color: '#7C3AED' },
  { id: 'Cardiologist', name: 'Cardiologist', icon: HeartPulse, color: '#EF4444' },
  { id: 'Orthopedic', name: 'Orthopedic', icon: Bone, color: '#D97706' },
  { id: 'Neurologist', name: 'Neurologist', icon: Brain, color: '#10B981' },
  { id: 'Gynaecologist', name: 'Gynaecologist', icon: Stethoscope, color: '#EC4899' },
];

export default function HospitalDoctors({ doctors, likedDocs, toggleDocLike, colors, isDark }: Props) {
  const router = useRouter();
  const [selectedSpec, setSelectedSpec] = useState('All');
  const allStoreDoctors = useBookingStore(state => Object.values(state.doctors));

  const listToRender = (doctors && doctors.length > 0) ? doctors : allStoreDoctors;

  const filteredDoctors = selectedSpec === 'All'
    ? listToRender
    : listToRender.filter(d => 
        (d.speciality || '').toLowerCase().includes(selectedSpec.toLowerCase())
      );

  return (
    <View style={styles.tabContent}>
      {/* Specialty Filter Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.specialtiesScroll}>
        {SPECIALTIES.map((spec) => {
          const isActive = selectedSpec === spec.name;
          const IconComp = spec.icon;
          return (
            <TouchableOpacity 
              key={spec.id} 
              style={styles.specItem}
              onPress={() => setSelectedSpec(spec.name)}
            >
              <View 
                style={[
                  styles.specIconBox, 
                  { 
                    backgroundColor: isActive 
                      ? (isDark ? '#3B0764' : '#F3E8FF') 
                      : (isDark ? '#1E1E1E' : '#F9FAFB'), 
                    borderColor: isActive 
                      ? '#7C3AED' 
                      : (isDark ? '#333333' : '#F3F4F6') 
                  }
                ]}
              >
                <IconComp color={isActive ? '#7C3AED' : spec.color} size={22} />
              </View>
              <Text 
                style={[
                  styles.specName, 
                  { 
                    color: isActive ? '#7C3AED' : colors.text, 
                    fontWeight: isActive ? '700' : '500' 
                  }
                ]}
                numberOfLines={1}
              >
                {spec.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Header & Doctor List */}
      <View style={styles.topDoctorsHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Top Super Specialists</Text>
        <TouchableOpacity style={[styles.sortBtn, { backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB' }]}>
          <ArrowUpDown size={14} color="#6B7280" />
          <Text style={[styles.sortText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>Sort</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.doctorList}>
        {filteredDoctors.map((doc) => (
          <DoctorCard 
            key={doc.id}
            doc={doc}
            isDark={isDark}
            colors={colors}
            isLiked={likedDocs[doc.id] || false}
            onPress={() => router.push({ pathname: '/doctor/[id]', params: { id: doc.id.toString() } })}
            onLikePress={() => toggleDocLike(doc.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  specialtiesScroll: {
    gap: 14,
    paddingBottom: 20,
  },
  specItem: {
    alignItems: 'center',
    width: 76,
  },
  specIconBox: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1.5,
  },
  specName: {
    fontSize: 11,
    textAlign: 'center',
  },
  topDoctorsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  doctorList: {
    gap: 10,
  },
});

