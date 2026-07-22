import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import AnimatedScreen from '@/components/AnimatedScreen';
import HomeHeader from '@/components/HomeHeader';
import PremiumSearchBar from '@/components/PremiumSearchBar';
import DoctorCard from '@/components/DoctorCard';
import ExpertCareModule from '@/components/ExpertCareModule';
import { useBookingStore } from '@/hooks/useBookingStore';
import { Search, HeartPulse, Bone, Brain, Baby, Eye } from 'lucide-react-native';

const SPECIALITY_FILTERS = [
  { id: 'all', label: 'All', icon: Search, color: '#7C3AED' },
  { id: 'Sports Physiotherapist', label: 'Physio', icon: Bone, color: '#D97706' },
  { id: 'Gynaecologist', label: 'Gynae', icon: Baby, color: '#EC4899' },
  { id: 'Dermatologist', label: 'Derma', icon: Eye, color: '#10B981' },
  { id: 'Cardiologist', label: 'Cardio', icon: HeartPulse, color: '#EF4444' },
  { id: 'Neurologist', label: 'Neuro', icon: Brain, color: '#3B82F6' },
];

export default function ExpertsScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [likedDocs, setLikedDocs] = useState<{[key: string]: boolean}>({});

  const doctors = useBookingStore(state => state.doctors);
  const allDoctors = Object.values(doctors);

  const filteredDoctors = activeFilter === 'all'
    ? allDoctors
    : allDoctors.filter(doc => doc.speciality === activeFilter);

  const toggleDocLike = (docId: string) => {
    setLikedDocs(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  // Map store doctors to DoctorCard format
  const mapDoctor = (doc: any) => ({
    id: doc.id,
    name: doc.name,
    speciality: doc.speciality,
    degrees: doc.experience,
    rating: doc.rating,
    reviews: doc.reviews,
    price: doc.fee,
    nextAvailable: 'Today',
    image: doc.image,
    tagType: Number(doc.rating) >= 4.9 ? 'fire' : Number(doc.rating) >= 4.7 ? 'zap' : 'thumb',
    tagText: Number(doc.rating) >= 4.9 ? 'Top Rated' : Number(doc.rating) >= 4.7 ? 'Popular' : 'Recommended',
  });

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <AnimatedScreen entrance="up">
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          contentContainerStyle={styles.scrollContent}
        >
          <HomeHeader currentCity="Bangalore" avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" />

          <Animated.View entering={FadeInDown.delay(150)}>
            <PremiumSearchBar />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(220)}>
            <ExpertCareModule colors={colors} isDark={isDark} onSpecialityPress={setActiveFilter} />
          </Animated.View>

          {/* Speciality Filter Chips */}
          <Animated.View entering={FadeInDown.delay(300)}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScroll}
              bounces={false}
              overScrollMode="never"
            >
              {SPECIALITY_FILTERS.map((filter) => {
                const isActive = activeFilter === filter.id;
                const Icon = filter.icon;
                return (
                  <TouchableOpacity
                    key={filter.id}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isActive
                          ? (isDark ? '#2D2D2D' : '#F0FDF4')
                          : (isDark ? '#1E1E1E' : '#F9FAFB'),
                        borderColor: isActive ? '#10B981' : (isDark ? '#333' : '#F3F4F6'),
                      },
                    ]}
                    onPress={() => setActiveFilter(filter.id)}
                    activeOpacity={0.7}
                  >
                    <Icon size={16} color={isActive ? '#10B981' : filter.color} />
                    <Text
                      style={[
                        styles.filterLabel,
                        {
                          color: isActive ? '#10B981' : (isDark ? '#D1D5DB' : '#4B5563'),
                          fontWeight: isActive ? '700' : '600',
                        },
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>

          {/* Section Header */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {activeFilter === 'all' ? 'All Experts' : SPECIALITY_FILTERS.find(f => f.id === activeFilter)?.label + ' Experts'}
            </Text>
            <Text style={styles.countText}>{filteredDoctors.length} found</Text>
          </Animated.View>

          {/* Doctor Cards */}
          <Animated.View entering={FadeInDown.delay(500)} style={styles.doctorList}>
            {filteredDoctors.map((doc) => {
              const mapped = mapDoctor(doc);
              return (
                <DoctorCard
                  key={doc.id}
                  doc={mapped}
                  isDark={isDark}
                  colors={colors}
                  isLiked={likedDocs[doc.id] || false}
                  onPress={() => router.push({ pathname: '/doctor/[id]', params: { id: doc.id } })}
                  onLikePress={() => toggleDocLike(doc.id)}
                />
              );
            })}
          </Animated.View>

          {filteredDoctors.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No experts found for this speciality.
              </Text>
            </View>
          )}
        </Animated.ScrollView>
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 120,
  },
  filtersScroll: {
    gap: 8,
    paddingVertical: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterLabel: {
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  doctorList: {
    gap: 12,
  },
  emptyState: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
