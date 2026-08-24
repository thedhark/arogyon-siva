import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Filter } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import OfferHeroBanner from '@/components/offers/OfferHeroBanner';
import OfferCategoryBar from '@/components/offers/OfferCategoryBar';
import RecommendedDoctorCard, { DoctorData } from '@/components/hospital/RecommendedDoctorCard';
import { OFFER_CATEGORIES, OFFER_DOCTORS } from '@/constants/offers-data';
import { useBookingStore } from '@/hooks/useBookingStore';
import { SelectedPatientInfo } from '@/components/booking/BookVisitSelector';

const { width } = Dimensions.get('window');

const QUICK_FILTERS = [
  { id: 'all', label: 'All Offers' },
  { id: 'top-rated', label: '⭐ 4.8+ Rated' },
  { id: 'budget', label: '💰 Under ₹500' },
  { id: 'available-today', label: '📅 Available Today' },
];

export default function ConsultationsOfferScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const addCartItem = useBookingStore((s) => s.addCartItem);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedQuickFilter, setSelectedQuickFilter] = useState('all');
  const [likedDocs, setLikedDocs] = useState<Record<string, boolean>>({});

  const toggleDocLike = (docId: string) => {
    setLikedDocs((prev) => ({ ...prev, [docId]: !prev[docId] }));
  };

  const handleBookVisit = (
    doctor: DoctorData,
    selectedSlot?: string,
    patient?: SelectedPatientInfo,
    count?: number
  ) => {
    addCartItem({
      type: 'visit',
      itemId: doctor.id,
      title: doctor.name,
      subtitle: `${doctor.speciality} • ${doctor.hospitalName || 'Arogyon Clinic'}`,
      price: typeof doctor.fee === 'number' ? doctor.fee : parseInt(String(doctor.fee).replace(/\D/g, '') || '500', 10),
      image: doctor.image,
      hospitalName: doctor.hospitalName || 'Arogyon Clinic',
      selectedTime: selectedSlot || doctor.nextAvailableTime || '10:00 AM',
      assignedPatientId: patient?.id,
      assignedPatientName: patient?.name,
      assignedPatientRelation: patient?.relation,
      assignedPatientAvatar: patient?.avatar,
    });

    router.push('/booking/checkout' as any);
  };

  const handleCardPress = (doctor: DoctorData) => {
    router.push(`/doctor/${doctor.id}` as any);
  };

  // Filter Doctors
  const filteredDoctors = useMemo(() => {
    return OFFER_DOCTORS.filter((doc) => {
      // Category filter
      if (selectedCategory !== 'all' && doc.specialtyId !== selectedCategory) {
        return false;
      }

      // Quick filter
      if (selectedQuickFilter === 'top-rated' && parseFloat(doc.rating) < 4.8) {
        return false;
      }
      if (selectedQuickFilter === 'budget' && doc.discountedPrice > 500) {
        return false;
      }
      if (
        selectedQuickFilter === 'available-today' &&
        !doc.nextAvailable?.toLowerCase().includes('today') &&
        !doc.nextAvailable?.toLowerCase().includes('min')
      ) {
        return false;
      }

      return true;
    });
  }, [selectedCategory, selectedQuickFilter]);

  return (
    <View style={[styles.screen, { backgroundColor: isDark ? '#10131A' : '#F8FAFC' }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[1]}
      >
        {/* Index 0: 50% OFF Hero Banner (Hospital Blue) */}
        <OfferHeroBanner
          variant="consultation"
          title="CONSULTATIONS AT"
          discountText="50% OFF"
          subtitle="Top Doctor Consultations"
          onBack={() => router.back()}
        />

        {/* Index 1: Sticky Horizontal Category Tab Filter Bar */}
        <OfferCategoryBar
          categories={OFFER_CATEGORIES}
          activeCategoryId={selectedCategory}
          onSelectCategory={(id) => setSelectedCategory(id)}
        />

        {/* Index 2: Quick Filters & Notice Bar */}
        <View style={styles.filterSectionWrapper}>
          {/* Quick Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickFiltersScroll}
          >
            {QUICK_FILTERS.map((qf) => {
              const isSelected = selectedQuickFilter === qf.id;
              return (
                <TouchableOpacity
                  key={qf.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedQuickFilter(qf.id)}
                  style={[
                    styles.quickFilterChip,
                    {
                      backgroundColor: isSelected
                        ? '#1E5AE6'
                        : isDark
                        ? '#1E2433'
                        : '#FFFFFF',
                      borderColor: isSelected
                        ? '#1E5AE6'
                        : isDark
                        ? '#2E384D'
                        : '#E2E8F0',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.quickFilterText,
                      {
                        color: isSelected
                          ? '#FFFFFF'
                          : isDark
                          ? '#CBD5E1'
                          : '#475569',
                        fontWeight: isSelected ? '700' : '600',
                      },
                    ]}
                  >
                    {qf.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Results Count & Coupon Notice Banner */}
          <View style={styles.noticeRow}>
            <View style={styles.resultsBadge}>
              <Sparkles size={13} color="#1E5AE6" />
              <Text
                style={[
                  styles.resultsCountText,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                {filteredDoctors.length} Specialists Available at 50% Off
              </Text>
            </View>

            <View style={styles.promoAppliedPill}>
              <Text style={styles.promoAppliedText}>Code: SAVE50 Applied</Text>
            </View>
          </View>
        </View>

        {/* Index 3: Filtered Doctors List */}
        <View style={styles.doctorsListContainer}>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc, index) => (
              <Animated.View
                key={doc.id}
                entering={FadeInDown.delay(index * 60).duration(300)}
                style={{ width: '100%' }}
              >
                <RecommendedDoctorCard
                  doctor={{
                    id: doc.id,
                    name: doc.name,
                    speciality: doc.specialty,
                    fee: doc.discountedPrice,
                    hospitalName: doc.hospital,
                    location: doc.location,
                    languages: doc.languages.join(' • '),
                    image: doc.image,
                    availableSlots: ['10:00 AM', '01:30 PM', '05:00 PM'],
                    nextAvailableTime: doc.nextAvailable,
                  }}
                  isBookmarked={likedDocs[doc.id] || false}
                  onBookmarkToggle={() => toggleDocLike(doc.id)}
                  onBookVisitPress={handleBookVisit}
                  onCardPress={handleCardPress}
                  hideLocation={false}
                />
              </Animated.View>
            ))
          ) : (
            <Animated.View entering={FadeIn} style={styles.emptyState}>
              <Text
                style={[
                  styles.emptyTitle,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                No Doctors Found
              </Text>
              <Text
                style={[
                  styles.emptySubtitle,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                Try switching the category or clearing the filters.
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedCategory('all');
                  setSelectedQuickFilter('all');
                }}
                style={styles.resetButton}
              >
                <Text style={styles.resetButtonText}>Reset All Filters</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  filterSectionWrapper: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 12,
  },
  quickFiltersScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  quickFilterChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickFilterText: {
    fontSize: 11.5,
    letterSpacing: 0.1,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  resultsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultsCountText: {
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  promoAppliedPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  promoAppliedText: {
    color: '#15803D',
    fontSize: 10.5,
    fontWeight: '800',
  },
  doctorsListContainer: {
    paddingHorizontal: 0,
    paddingTop: 8,
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: '75%',
    lineHeight: 18,
  },
  resetButton: {
    marginTop: 8,
    backgroundColor: '#1E5AE6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
