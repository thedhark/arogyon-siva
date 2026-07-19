import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Search, Filter, HeartPulse, Bone, Brain, ArrowUpDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import DoctorCard from '@/components/DoctorCard';

interface Props {
  doctors: any[];
  likedDocs: {[key: number]: boolean};
  toggleDocLike: (id: number) => void;
  colors: any;
  isDark: boolean;
}

export default function HospitalDoctors({ doctors, likedDocs, toggleDocLike, colors, isDark }: Props) {
  const router = useRouter();

  return (
    <View style={styles.tabContent}>


      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.specialtiesScroll}>
        <TouchableOpacity style={styles.specItem}>
          <View style={[styles.specIconBox, { backgroundColor: isDark ? '#3B0764' : '#F3E8FF', borderColor: isDark ? '#4C1D95' : '#E9D5FF' }]}>
            <Search color="#7C3AED" size={24} />
          </View>
          <Text style={[styles.specName, { color: '#7C3AED', fontWeight: '700' }]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.specItem}>
          <View style={[styles.specIconBox, { backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
            <HeartPulse color="#EF4444" size={24} />
          </View>
          <Text style={[styles.specName, { color: colors.text }]}>Cardiologist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.specItem}>
          <View style={[styles.specIconBox, { backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
            <Bone color="#D97706" size={24} />
          </View>
          <Text style={[styles.specName, { color: colors.text }]}>Orthopedic</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.specItem}>
          <View style={[styles.specIconBox, { backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
            <Brain color="#10B981" size={24} />
          </View>
          <Text style={[styles.specName, { color: colors.text }]}>Neurologist</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.topDoctorsHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Top Experts</Text>
        <TouchableOpacity style={[styles.sortBtn, { backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB' }]}>
          <ArrowUpDown size={14} color="#6B7280" />
          <Text style={[styles.sortText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>Sort</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.doctorList}>
        {doctors.map((doc) => (
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
    paddingVertical: 20,
  },

  specialtiesScroll: {
    gap: 16,
    paddingBottom: 24,
  },
  specItem: {
    alignItems: 'center',
    width: 72,
  },
  specIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
  },
  specName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  topDoctorsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
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
    gap: 8,
  },
});
