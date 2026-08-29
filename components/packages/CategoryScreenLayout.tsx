import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Star, BadgeCheck, SlidersHorizontal, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { getCategoryById } from '@/constants/package-data';
import PackageItemCard from '@/components/packages/cards/PackageItemCard';
import AddPackageModal from '@/components/booking/AddPackageModal';
import FloatingCartBar from '@/components/booking/FloatingCartBar';
import { resolveImageSource } from '@/utils/imageUtils';
import { scale } from '@/utils/responsive';

const MOCK_HOSPITALS = [
  {
    id: 'h1',
    name: 'Cloudnine Hospitals',
    location: 'Jayanagar, Bangalore',
    logo: require('../../assets/images/cloudnine_logo.png'),
    rating: '4.8',
    reviews: 'By 15K+',
  },
  {
    id: 'h2',
    name: 'Apollo Hospitals',
    location: 'Jubilee Hills, Hyderabad',
    logo: require('../../assets/images/apollo_logo.png'),
    rating: '4.7',
    reviews: 'By 12K+',
  },
  {
    id: 'h3',
    name: 'Yashoda Hospitals',
    location: 'Somajiguda, Hyderabad',
    logo: require('../../assets/images/apollo_logo.png'),
    rating: '4.6',
    reviews: 'By 8K+',
  }
];

export interface SubCategoryFilter {
  id: string;
  name: string;
  iconName: string;
}

interface CategoryScreenLayoutProps {
  categorySlug: string;
}

export default function CategoryScreenLayout({ categorySlug }: CategoryScreenLayoutProps) {
  const router = useRouter();
  const { isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedPackageForAdd, setSelectedPackageForAdd] = useState<any>(null);

  // Load normalized category data from master index registry
  const categoryData = getCategoryById(categorySlug);

  // Filter packages based on subcategory or filter tag
  const filteredPackages = categoryData.packages.filter((pkg) => {
    if (selectedSubcategory && pkg.subcategory) {
      return pkg.subcategory.toLowerCase() === selectedSubcategory.toLowerCase();
    }
    return true;
  });

  // Display packages fallback if subcategory selected but specific package not defined
  const displayedPackages = filteredPackages.length > 0 ? filteredPackages : categoryData.packages;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0D0E11' : '#FFFFFF' }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} bounces={false}>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={resolveImageSource(categoryData.heroImage)}
            style={styles.heroImage}
            contentFit="cover"
          />
          
          <SafeAreaView edges={['top']} style={styles.headerBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#FFF" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Framed Category Title Section */}
        <View style={styles.titleSection}>
          <View style={[styles.titleLine, { backgroundColor: isDark ? '#333' : '#E5E5E5' }]} />
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#1A1A1A' }]}>
            {categoryData.title || `${categorySlug.toUpperCase()} CARE PLANS`}
          </Text>
          <View style={[styles.titleLine, { backgroundColor: isDark ? '#333' : '#E5E5E5' }]} />
        </View>

        {/* Circle Icons Subcategories Row (Below Banner / Header & Above Filters) */}
        {categoryData.subcategories && categoryData.subcategories.length > 0 && (
          <View style={styles.subcategoriesWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subcategoriesScrollContent}
            >
              {categoryData.subcategories.map((subName) => {
                const isSelected = selectedSubcategory === subName;
                return (
                  <TouchableOpacity
                    key={subName}
                    onPress={() => setSelectedSubcategory(isSelected ? null : subName)}
                    activeOpacity={0.8}
                    style={styles.circleItemWrapper}
                  >
                    <View
                      style={[
                        styles.circleContainer,
                        isSelected
                          ? {
                              backgroundColor: '#005C4B',
                              borderColor: '#005C4B',
                              shadowColor: '#005C4B',
                              shadowOffset: { width: 0, height: 4 },
                              shadowOpacity: 0.3,
                              shadowRadius: 6,
                              elevation: 4,
                            }
                          : {
                              backgroundColor: isDark ? '#1A1C23' : '#FFFFFF',
                              borderColor: isDark ? '#2D3039' : '#E2E8F0',
                            },
                      ]}
                    >
                      <Text style={styles.circleEmoji}>{categoryData.emoji || '🩺'}</Text>
                    </View>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.circleLabel,
                        {
                          color: isSelected
                            ? isDark
                              ? '#38BDF8'
                              : '#005C4B'
                            : isDark
                            ? '#CBD5E1'
                            : '#334155',
                          fontWeight: isSelected ? '700' : '600',
                        },
                      ]}
                    >
                      {subName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Filters */}
        <View style={styles.filtersWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScrollContent}>
            <TouchableOpacity style={[styles.filterPill, { backgroundColor: isDark ? '#1E1E22' : '#FFFFFF', borderColor: 'transparent' }]}>
              <SlidersHorizontal size={14} color={isDark ? '#FFF' : '#1A1A1A'} />
              <Text style={[styles.filterPillText, { color: isDark ? '#FFF' : '#1A1A1A' }]}>Filters</Text>
            </TouchableOpacity>
            
            {['All', 'Popular', 'Budget', 'Premium'].map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <TouchableOpacity 
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  style={[
                    styles.filterPill, 
                    isActive 
                      ? { backgroundColor: '#005C4B', borderColor: 'transparent' }
                      : { backgroundColor: isDark ? '#1E1E22' : '#FFFFFF', borderColor: 'transparent' }
                  ]}
                >
                  <Text style={[
                    styles.filterPillText, 
                    { color: isActive ? '#FFFFFF' : (isDark ? '#FFF' : '#1A1A1A') }
                  ]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Hospital Sections & Indexed Package Listings */}
        <View style={styles.hospitalsContainer}>
          {MOCK_HOSPITALS.map((hospital, index) => (
            <Animated.View key={hospital.id} entering={FadeInDown.delay(index * 150)} style={styles.hospitalSection}>
              
              {/* Hospital Header */}
              <View style={styles.hospitalHeader}>
                <View style={styles.hospitalInfoLeft}>
                  <View style={styles.hospitalLogoContainer}>
                    <Image source={resolveImageSource(hospital.logo)} style={styles.hospitalLogo} contentFit="contain" />
                  </View>
                  <View style={styles.hospitalTitleBox}>
                    <View style={styles.hospitalNameRow}>
                      <Text style={[styles.hospitalName, { color: isDark ? '#FFF' : '#1A1A1A' }]}>{hospital.name}</Text>
                      <BadgeCheck size={16} color="#00A981" fill="#E6F6F2" />
                    </View>
                    <Text style={styles.hospitalLocation}>{hospital.location}</Text>
                  </View>
                </View>

                <View style={styles.hospitalRatingBox}>
                  <View style={styles.ratingBadge}>
                    <Star size={10} color="#FFF" fill="#FFF" />
                    <Text style={styles.ratingText}>{hospital.rating}</Text>
                  </View>
                  <Text style={styles.reviewsText}>{hospital.reviews}</Text>
                </View>
              </View>

              {/* Horizontal Scroll of Packages */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.packagesScrollContent}>
                {displayedPackages.map((pkg) => (
                  <View key={pkg.id} style={styles.packageCardWrapper}>
                    <PackageItemCard
                      item={pkg}
                      layout="vertical"
                      onPress={(id) => router.push(`/packages/detail/${id}` as any)}
                      onAddPress={(item) => setSelectedPackageForAdd(item)}
                    />
                  </View>
                ))}
              </ScrollView>

              {/* View Full Menu Button */}
              <View style={styles.fullMenuBtnWrapper}>
                <TouchableOpacity 
                  style={[styles.fullMenuBtn, { backgroundColor: isDark ? '#1E1E22' : '#FFFFFF', borderColor: 'transparent' }]}
                  onPress={() => {
                    const targetHospId = hospital.id === 'h2' ? 'hosp-2' : hospital.id === 'h3' ? 'hosp-4' : 'hosp-1';
                    router.push(`/hospital/${targetHospId}?tab=Packages` as any);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.fullMenuText, { color: isDark ? '#FFF' : '#1A1A1A' }]}>View full menu</Text>
                  <ChevronRight size={16} color={isDark ? '#FFF' : '#1A1A1A'} />
                </TouchableOpacity>
              </View>

              {/* Clean Section Divider Line between Hospitals */}
              {index < MOCK_HOSPITALS.length - 1 && (
                <View style={styles.hospitalDividerWrapper}>
                  <View style={[styles.hospitalDividerLine, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0' }]} />
                </View>
              )}

            </Animated.View>
          ))}
        </View>

      </ScrollView>

      {/* Add Package Slot Modal Popup */}
      <AddPackageModal
        visible={!!selectedPackageForAdd}
        packageItem={selectedPackageForAdd}
        hospitalName={selectedPackageForAdd?.hospitalName || 'Cloudnine Hospital'}
        onClose={() => setSelectedPackageForAdd(null)}
      />

      {/* Sticky Floating Cart Bar */}
      <FloatingCartBar bottomOffset={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 60 },
  heroSection: {
    width: '100%',
    aspectRatio: 4 / 3,
    position: 'relative',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    marginBottom: 16,
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 14,
  },
  titleLine: {
    flex: 1,
    height: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    paddingHorizontal: 16,
  },
  subcategoriesWrapper: {
    marginBottom: 16,
  },
  subcategoriesScrollContent: {
    paddingHorizontal: 16,
    gap: 14,
    alignItems: 'flex-start',
  },
  circleItemWrapper: {
    alignItems: 'center',
    width: 76,
  },
  circleContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  circleEmoji: {
    fontSize: 26,
  },
  circleLabel: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  filtersWrapper: {
    marginBottom: 16,
  },
  filtersScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  hospitalsContainer: {
    paddingBottom: 24,
  },
  hospitalSection: {
    marginBottom: 0,
  },
  hospitalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  hospitalInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  hospitalLogoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  hospitalLogo: {
    width: 24,
    height: 24,
  },
  hospitalTitleBox: {
    flex: 1,
  },
  hospitalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: '800',
  },
  hospitalLocation: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  hospitalRatingBox: {
    alignItems: 'flex-end',
  },
  ratingBadge: {
    backgroundColor: '#00A981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  reviewsText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  packageCardWrapper: {
    width: scale(205),
    marginRight: 12,
  },
  packagesScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  fullMenuBtnWrapper: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  fullMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  fullMenuText: {
    fontSize: 13,
    fontWeight: '700',
  },
  hospitalDividerWrapper: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  hospitalDividerLine: {
    height: 1.5,
    width: '100%',
    borderRadius: 1,
  },
});
