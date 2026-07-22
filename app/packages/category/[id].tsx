import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Star, ArrowRight, BadgeCheck, MapPin, Search, SlidersHorizontal, ChevronRight, Globe, Truck, Users } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const CATEGORY_NAMES: Record<string, { title: string; subtitle: string }> = {
  pregnancy: { title: 'Pregnancy Care', subtitle: 'Maternity packages & specialist doctor consultations' },
  knee: { title: 'Knee Recovery', subtitle: 'Joint surgery, recovery & physical rehab packages' },
  diabetes: { title: 'Diabetes Management', subtitle: 'HbA1c tests, insulin plans & endocrinologist consults' },
  weight: { title: 'Weight Loss', subtitle: 'Metabolic panels, nutritionist guidance & fitness plans' },
  cardiac: { title: 'Cardiac & Heart Care', subtitle: 'ECG, Echo, Angiography & preventive heart packages' },
  hernia: { title: 'Hernia Care & Surgery', subtitle: 'Minimal invasive & 3D mesh hernia repair packages' },
  skin: { title: 'Skin & Dermatology', subtitle: 'Clinical acne treatment, laser & dermatology packages' },
  dental: { title: 'Dental & Smile Care', subtitle: 'Root canal, clear aligners & smile design packages' },
  ortho: { title: 'Orthopedic & Joint Care', subtitle: 'Bone density, joint replacement & spine care' },
  rehab: { title: 'Rehab & Physiotherapy', subtitle: 'Sports rehab, stroke recovery & physical therapy' },
  pediatrics: { title: 'Pediatric & Child Care', subtitle: 'Growth assessment, vaccinations & child care' },
  spine: { title: 'Spine & Back Care', subtitle: 'Slip disc treatment, spine therapy & posture care' },
  gastro: { title: 'Gastro & Digestive Health', subtitle: 'Endoscopy, gut health & liver care packages' },
  eye: { title: 'Eye & Vision Care', subtitle: 'Contoura vision, cataract surgery & eye checkups' },
  mental: { title: 'Mental Wellness', subtitle: 'Therapy, stress relief & psychiatric care plans' },
  oncology: { title: 'Cancer Screening & Care', subtitle: 'Full body PET scan, biopsy & oncology care' },
  senior: { title: 'Senior Citizen Health', subtitle: 'Geriatric comprehensive screening & home visits' },
  womens: { title: "Women's Health", subtitle: 'PCOS screening, mammography & wellness care' },
  urology: { title: 'Kidney & Urology Care', subtitle: 'Kidney stone laser treatment & urology care' },
  thyroid: { title: 'Thyroid & Hormonal Care', subtitle: 'Complete thyroid panel & hormonal balancing' },
};

const MOCK_HOSPITALS = [
  {
    id: 'h1',
    name: 'Manipal Hospitals',
    location: 'HAL Old Airport Rd, Bangalore',
    rating: '4.8',
    reviews: 'By 18K+',
    packages: [
      {
        id: 'premium-package-1',
        title: 'Complete Advanced Specialized Care Plan',
        price: '₹14,999',
        originalPrice: '₹19,999',
        discount: '25% OFF',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=600',
        tokenAvailable: true,
        deliveryAvailable: true,
        guests: 2,
      },
      {
        id: 'standard-package-1',
        title: 'Essential Diagnostics & Consultation Package',
        price: '₹7,499',
        originalPrice: '₹9,999',
        discount: '25% OFF',
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600',
        tokenAvailable: true,
        deliveryAvailable: true,
        guests: 1,
      }
    ]
  },
  {
    id: 'h2',
    name: 'Apollo Hospitals',
    location: 'Bannerghatta Rd, Bangalore',
    rating: '4.7',
    reviews: 'By 14K+',
    packages: [
      {
        id: 'comprehensive-package-2',
        title: 'Comprehensive Executive Health Assessment',
        price: '₹18,500',
        originalPrice: '₹24,000',
        discount: '22% OFF',
        image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=600',
        tokenAvailable: true,
        deliveryAvailable: true,
        guests: 2,
      }
    ]
  },
  {
    id: 'h3',
    name: 'Fortis Healthcare',
    location: 'Cunningham Rd, Bangalore',
    rating: '4.9',
    reviews: 'By 10K+',
    packages: [
      {
        id: 'expert-consult-package-3',
        title: 'Specialist Consultation & Follow-up Plan',
        price: '₹4,999',
        originalPrice: '₹6,500',
        discount: '23% OFF',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600',
        tokenAvailable: true,
        deliveryAvailable: true,
        guests: 1,
      }
    ]
  }
];

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const categoryKey = (id || '').toLowerCase();
  const categoryInfo = CATEGORY_NAMES[categoryKey] || {
    title: (id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Health') + ' Care Plan',
    subtitle: 'Specialized medical packages and hospital consults',
  };

  const handleBookPackage = (pkgTitle: string, price: string) => {
    router.push({
      pathname: '/packages/checkout' as any,
      params: { title: pkgTitle, price, category: categoryInfo.title },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>{categoryInfo.title}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>{categoryInfo.subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Search size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
          {['All', 'Top Rated', 'Near Me', 'Best Savings', '24x7 Support'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, selectedFilter === filter && styles.filterChipActive]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[styles.filterChipText, selectedFilter === filter && styles.filterChipTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Hospital Card Listings */}
        {MOCK_HOSPITALS.map((hospital, idx) => (
          <Animated.View key={hospital.id} entering={FadeInDown.delay(idx * 150)} style={styles.hospitalCard}>
            <View style={styles.hospitalHeader}>
              <View style={styles.hospitalInfo}>
                <Text style={styles.hospitalName}>{hospital.name}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={12} color="#666" />
                  <Text style={styles.locationText}>{hospital.location}</Text>
                </View>
              </View>
              <View style={styles.ratingBadge}>
                <Star size={12} color="#FFB800" fill="#FFB800" />
                <Text style={styles.ratingText}>{hospital.rating}</Text>
                <Text style={styles.reviewText}>({hospital.reviews})</Text>
              </View>
            </View>

            {/* Packages under Hospital */}
            {hospital.packages.map((pkg) => (
              <View key={pkg.id} style={styles.packageItem}>
                <Image source={{ uri: pkg.image }} style={styles.packageImage} contentFit="cover" />
                <View style={styles.packageDetails}>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{pkg.discount}</Text>
                  </View>
                  <Text style={styles.packageTitle} numberOfLines={2}>{pkg.title}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>{pkg.price}</Text>
                    <Text style={styles.originalPrice}>{pkg.originalPrice}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => handleBookPackage(pkg.title, pkg.price)}
                  >
                    <Text style={styles.bookBtnText}>Book Package</Text>
                    <ChevronRight size={14} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F7',
  },
  headerCenter: { flex: 1, marginHorizontal: 12 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  headerSubtitle: { fontSize: 12, color: '#777', marginTop: 2 },
  scrollContent: { padding: 16, paddingBottom: 60 },
  filterScroll: { marginBottom: 16 },
  filterContainer: { gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 6,
  },
  filterChipActive: { backgroundColor: '#10B981' },
  filterChipText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },
  filterChipTextActive: { color: '#FFF' },
  hospitalCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  hospitalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  hospitalInfo: { flex: 1 },
  hospitalName: { fontSize: 16, fontWeight: '800', color: '#111' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  locationText: { fontSize: 12, color: '#666' },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#111' },
  reviewText: { fontSize: 11, color: '#888' },
  packageItem: {
    flexDirection: 'row',
    backgroundColor: '#FAF9F6',
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
    gap: 12,
  },
  packageImage: { width: 90, height: 90, borderRadius: 10 },
  packageDetails: { flex: 1, justifyContent: 'space-between' },
  discountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: { fontSize: 10, fontWeight: '800', color: '#03543F' },
  packageTitle: { fontSize: 13, fontWeight: '700', color: '#111', marginVertical: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  price: { fontSize: 15, fontWeight: '800', color: '#10B981' },
  originalPrice: { fontSize: 12, color: '#9CA3AF', textDecorationLine: 'line-through' },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 6,
    gap: 4,
  },
  bookBtnText: { fontSize: 12, fontWeight: '700', color: '#FFF' },
});
