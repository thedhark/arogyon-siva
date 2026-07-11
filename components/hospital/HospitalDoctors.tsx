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
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB' }]}>
          <Search color="#9CA3AF" size={20} />
          <Text style={styles.searchTextPlaceholder}>Search doctors...</Text>
        </View>
        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB' }]}>
          <Filter color="#4B5563" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.specialtiesScroll}>
        <TouchableOpacity style={styles.specItem}>
          <View style={[styles.specIconBox, styles.specActive]}>
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
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Top Doctors</Text>
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
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
  },
  searchTextPlaceholder: {
    marginLeft: 8,
    color: '#9CA3AF',
    fontSize: 15,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
  },
  specActive: {
    backgroundColor: '#F3E8FF',
    borderColor: '#E9D5FF',
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
    gap: 16,
  },
});
