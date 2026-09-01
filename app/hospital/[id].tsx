import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Modal, Pressable, Platform, Share, Linking, Animated } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  HeartPulse, 
  Calendar, 
  X, 
  ChevronRight, 
  Sparkles, 
  Users, 
  Briefcase, 
  Info, 
  BadgeCheck, 
  Stethoscope, 
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useBookingStore } from '@/hooks/useBookingStore';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';

import HospitalHeader from '@/components/HospitalHeader';
import HospitalExperts from '@/components/hospital/HospitalExperts';
import HospitalPackages, { PACKAGE_CATEGORIES, ALL_PACKAGE_CATEGORIES } from '@/components/hospital/HospitalPackages';
import HospitalFilterBar from '@/components/hospital/HospitalFilterBar';
import HospitalInfoModal from '@/components/hospital/HospitalInfoModal';
import HospitalOffersBanner from '@/components/hospital/HospitalOffersBanner';
import HospitalOffersModal from '@/components/hospital/HospitalOffersModal';

import AddVisitModal from '@/components/booking/AddVisitModal';
import AddPackageModal from '@/components/booking/AddPackageModal';
import FloatingCartBar from '@/components/booking/FloatingCartBar';
import { HOSPITALS_DATA } from '@/constants/directory-data';



const ALL_DOCTOR_SPECIALTIES = [
  { id: 'All', name: 'All Specialties', count: 18, emoji: '🏥' },
  { id: 'Cardiology', name: 'Cardiology', count: 4, emoji: '🫀' },
  { id: 'Nephrology', name: 'Nephrology & Urology', count: 3, emoji: '🫘' },
  { id: 'Neurology', name: 'Neurology', count: 3, emoji: '🧠' },
  { id: 'Orthopedics', name: 'Orthopedics', count: 3, emoji: '🦴' },
  { id: 'Gastroenterology', name: 'Gastroenterology', count: 2, emoji: '🩺' },
  { id: 'Dermatology', name: 'Dermatology', count: 3, emoji: '✨' },
];

export default function HospitalProfile() {
  const { id, tab: initialTab, category: initialCategory } = useLocalSearchParams<{ id: string; tab?: string; category?: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const supportsLiquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable && isLiquidGlassAvailable();
  const storeHospitals = useBookingStore(state => state.hospitals);
  const storeDoctors = useBookingStore(state => state.doctors);
  const cartItems = useBookingStore(state => state.cartItems);
  const hasCartItems = (cartItems?.length || 0) > 0;
  
  const hospitalData = useMemo(() => {
    if (id && storeHospitals[id as string]) {
      return storeHospitals[id as string];
    }
    const foundInDirectory = HOSPITALS_DATA.find(h => h.id === id);
    if (foundInDirectory) {
      return {
        id: foundInDirectory.id,
        name: foundInDirectory.name,
        image: foundInDirectory.image,
        rating: foundInDirectory.rating || '4.8',
        ratingsCount: '15.2K',
        type: foundInDirectory.speciality || 'Multi Speciality Hospital',
        distance: foundInDirectory.distance || '3.1 km',
        location: foundInDirectory.location || 'Bangalore',
        emergency: '24x7 Emergency',
        logo: (foundInDirectory as any).logo,
        phone: '08022223333',
      };
    }
    const defaultHosp = storeHospitals['hosp-1'] || HOSPITALS_DATA[0];
    return {
      id: (id as string) || 'hosp-1',
      name: defaultHosp.name || 'Apollo Hospitals',
      image: defaultHosp.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800',
      rating: defaultHosp.rating || '4.8',
      ratingsCount: '15.2K',
      type: defaultHosp.type || (defaultHosp as any).speciality || 'Multi Speciality Hospital',
      distance: defaultHosp.distance || '3.1 km',
      location: defaultHosp.location || 'Bangalore',
      emergency: '24x7 Emergency',
      logo: (defaultHosp as any).logo,
    };
  }, [storeHospitals, id]);
  const doctors = useMemo(() => {
    return Object.values(storeDoctors || {}).filter(doc => doc.hospitalId === (id as string));
  }, [storeDoctors, id]);

  const getInitialTabVal = () => {
    const raw = (initialTab || '').toLowerCase();
    if (raw === 'packages') return 'Packages';
    return 'Experts';
  };

  const [activeTab, setActiveTab] = useState(getInitialTabVal());
  const [selectedPackageCategory, setSelectedPackageCategory] = useState(
    initialCategory || 'all'
  );
  const [selectedDocSpec, setSelectedDocSpec] = useState('All');
  const [isHighlyRecommended, setIsHighlyRecommended] = useState(false);
  const [isAvailableToday, setIsAvailableToday] = useState(false);
  const [showDocCategoryModal, setShowDocCategoryModal] = useState(false);
  const [showDocFilterModal, setShowDocFilterModal] = useState(false);
  const [showPackageCategoryModal, setShowPackageCategoryModal] = useState(false);

  const [searchFilterText, setSearchFilterText] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const tabIndexMap: Record<string, number> = { Experts: 0, Packages: 1 };
  const tabAnim = useRef(new Animated.Value(tabIndexMap[getInitialTabVal()] || 0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = insets.top + (Platform.OS === 'ios' ? 44 : 52);

  const headerBackdropOpacity = scrollY.interpolate({
    inputRange: [40, 160],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [90, 160],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const stickyBarOpacity = scrollY.interpolate({
    inputRange: [295, 296],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const [isScrolledPast, setIsScrolledPast] = useState(false);

  React.useEffect(() => {
    if (initialTab) {
      const targetVal = getInitialTabVal();
      setActiveTab(targetVal);
      Animated.timing(tabAnim, { toValue: tabIndexMap[targetVal] || 0, duration: 200, useNativeDriver: false }).start();
    }
  }, [initialTab]);

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [likedDocs, setLikedDocs] = useState<{[key: string]: boolean}>({});

  const [selectedDoctorForVisit, setSelectedDoctorForVisit] = useState<any>(null);
  const [selectedPackageForAdd, setSelectedPackageForAdd] = useState<any>(null);

  const toggleDocLike = (docId: any) => {
    setLikedDocs(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  const handleTabChange = (tab: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
    const targetIdx = tabIndexMap[tab] ?? 0;
    Animated.spring(tabAnim, {
      toValue: targetIdx,
      useNativeDriver: false,
      friction: 8,
      tension: 50,
    }).start();

    if (tab === 'Packages') {
      setSelectedPackageCategory('all');
    }
  };

  const handleShare = async () => {
    try {
      if (hospitalData) {
        await Share.share({
          message: `Check out ${hospitalData.name} on Arogyon Premium! Location: ${hospitalData.location}`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'H';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 3).toUpperCase();
  };

  if (!hospitalData) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Hospital not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.accent }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleOpenInfoPage = () => {
    router.push({
      pathname: '/hospital/info',
      params: {
        id: id as string,
        hospitalName: hospitalData.name,
        location: hospitalData.location,
        phone: (hospitalData as any)?.phone,
        image: hospitalData.image,
      },
    });
  };

  const renderSwitcherAndFilters = () => (
    <View style={styles.switcherAndFiltersContainer}>
      {/* Row 1: Clean Underline Tab Switcher (Doctors | Packages) - No conflicting lines! */}
      <View style={styles.cleanTabBar}>
        <TouchableOpacity
          style={styles.cleanTabButton}
          onPress={() => handleTabChange('Experts')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.cleanTabText,
              {
                color: activeTab === 'Experts' ? (isDark ? '#F8FAFC' : '#0F172A') : (isDark ? '#64748B' : '#94A3B8'),
                fontWeight: activeTab === 'Experts' ? '800' : '600',
              }
            ]}
          >
            Doctors
          </Text>
          {activeTab === 'Experts' ? (
            <View 
              style={[
                styles.cleanTabIndicator,
                { backgroundColor: isDark ? '#818CF8' : '#6366F1' }
              ]} 
            />
          ) : (
            <View style={styles.cleanTabIndicatorPlaceholder} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cleanTabButton}
          onPress={() => handleTabChange('Packages')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.cleanTabText,
              {
                color: activeTab === 'Packages' ? (isDark ? '#F8FAFC' : '#0F172A') : (isDark ? '#64748B' : '#94A3B8'),
                fontWeight: activeTab === 'Packages' ? '800' : '600',
              }
            ]}
          >
            Packages
          </Text>
          {activeTab === 'Packages' ? (
            <View 
              style={[
                styles.cleanTabIndicator,
                { backgroundColor: isDark ? '#818CF8' : '#6366F1' }
              ]} 
            />
          ) : (
            <View style={styles.cleanTabIndicatorPlaceholder} />
          )}
        </TouchableOpacity>
      </View>

      {/* Row 2: Sub-Filter Bar seamlessly integrated */}
      <View style={styles.subFilterBarWrapper}>
        {activeTab === 'Experts' ? (
          <HospitalFilterBar
            selectedSpecialty={selectedDocSpec}
            isHighlyRecommended={isHighlyRecommended}
            isAvailableToday={isAvailableToday}
            onToggleHighlyRecommended={() => setIsHighlyRecommended(!isHighlyRecommended)}
            onToggleAvailableToday={() => setIsAvailableToday(!isAvailableToday)}
            onOpenFilterModal={() => setShowDocFilterModal(true)}
            onOpenSpecialtyModal={() => setShowDocCategoryModal(true)}
          />
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.packagePillsContainer}
          >
            {PACKAGE_CATEGORIES.map((cat) => {
              const isActive = selectedPackageCategory === cat.id;
              if (cat.id === 'all') {
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.allPill,
                      {
                        backgroundColor: isActive ? (isDark ? '#38BDF8' : '#0F172A') : (isDark ? '#27272A' : '#F8FAFC'),
                        borderColor: isActive ? 'transparent' : (isDark ? '#3F3F46' : '#E2E8F0'),
                      },
                    ]}
                    onPress={() => setSelectedPackageCategory('all')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.allPillText, { color: isActive ? (isDark ? '#0F172A' : '#FFFFFF') : colors.text }]}>
                      All
                    </Text>
                    {isActive && <View style={[styles.allUnderline, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]} />}
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isActive ? (isDark ? '#2E1065' : '#F3E8FF') : (isDark ? '#1E1E24' : '#FFFFFF'),
                      borderColor: isActive ? '#7C3AED' : (isDark ? '#333333' : '#E2E8F0'),
                    }
                  ]}
                  onPress={() => setSelectedPackageCategory(cat.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: isActive ? '#7C3AED' : (isDark ? '#E2E8F0' : '#1E293B'), fontWeight: isActive ? '700' : '600' }
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* "+More" Pill */}
            <TouchableOpacity
              style={[styles.morePill, { borderColor: isDark ? '#3F3F46' : '#E2E8F0', backgroundColor: isDark ? '#1E1E24' : '#FFFFFF' }]}
              activeOpacity={0.7}
              onPress={() => setShowPackageCategoryModal(true)}
            >
              <Text style={[styles.morePillText, { color: isDark ? '#CBD5E1' : '#334155' }]}>+More</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      {/* Dynamic Animated Header Solid Backdrop */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.fixedHeaderBackdrop,
          {
            height: headerHeight,
            backgroundColor: isDark ? '#121212' : '#FFFFFF',
            opacity: headerBackdropOpacity,
          },
        ]}
      />

      <HospitalHeader 
        title={hospitalData.name}
        onBackPress={() => router.back()}
        onSearchChange={(text) => setSearchFilterText(text)}
        isFavorite={isFavorite}
        onFavoriteToggle={() => setIsFavorite(!isFavorite)}
        onSharePress={handleShare}
        isDark={isDark}
        headerTitleOpacity={headerTitleOpacity}
      />
      
      <Animated.ScrollView 
        ref={scrollViewRef}
        bounces={true} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { 
            useNativeDriver: false,
            listener: (e: any) => {
              const y = e.nativeEvent.contentOffset.y;
              if (y >= 295 && !isScrolledPast) {
                setIsScrolledPast(true);
              } else if (y < 295 && isScrolledPast) {
                setIsScrolledPast(false);
              }
            }
          }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {/* Index 0: Hero Cover Banner + Main Hospital Details & Offers */}
        <View>
          {/* Full Bleed Hero Cover Banner */}
          <View style={styles.coverContainer}>
            <View style={styles.coverWrapper}>
              <Image source={{ uri: hospitalData.image }} style={styles.coverImage} />
              <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.45)']}
                style={styles.coverGradient}
              />
              <View style={styles.imageCountBadge}>
                <Text style={styles.imageCountText}>1/15</Text>
              </View>
            </View>

            {/* Overlapping Brand Badge / Profile Logo Floating Over Curved Bottom */}
            <View style={[
              styles.profileBadgeWrapper,
              { borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)', backgroundColor: isDark ? '#1E1E24' : '#FFFFFF' }
            ]}>
              {(hospitalData as any).logo ? (
                <Image source={{ uri: (hospitalData as any).logo }} style={styles.profileLogoImage} resizeMode="contain" />
              ) : (
                <View style={[styles.profileLogoPlaceholder, { backgroundColor: isDark ? '#2563EB' : '#1D4ED8' }]}>
                  <Text style={styles.profileLogoText}>
                    {getInitials(hospitalData.name)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Main Hospital Details Section */}
          <View style={[styles.topSection, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
            <View style={styles.mainInfoRow}>
              {/* Title & Info trigger button + Location pin */}
              <TouchableOpacity 
                style={styles.mainInfoText} 
                onPress={handleOpenInfoPage}
                activeOpacity={0.7}
              >
                <View style={styles.titleWithInfoRow}>
                  <Text style={[styles.hospitalName, { color: colors.text }]} numberOfLines={1}>
                    {hospitalData.name}
                  </Text>
                  <BadgeCheck size={18} color="#00A981" fill="#E6F6F2" />
                  <View style={styles.infoTriggerBtn}>
                    <Info size={16} color={isDark ? '#9CA3AF' : '#475569'} />
                  </View>
                </View>

                {/* Location Pin Row */}
                <View style={styles.subwayLocationRow}>
                  <MapPin size={13} color="#64748B" />
                  <Text style={styles.subwayLocationText}>
                    {hospitalData.distance || '3.7 km'} • {hospitalData.location || 'Bangalore'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Top Right Dark Green Rating Badge */}
              <View style={styles.subwayRatingContainer}>
                <View style={styles.subwayRatingPill}>
                  <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
                  <Text style={styles.subwayRatingVal}>{hospitalData.rating || '4.0'}</Text>
                </View>
                <Text style={styles.subwayReviewsText}>By {hospitalData.ratingsCount || '2.8K+'}</Text>
              </View>
            </View>

            {/* Hospital Offers Banner Bar */}
            <HospitalOffersBanner
              offersCount={5}
              onPress={() => setIsOffersModalOpen(true)}
              isDark={isDark}
            />
          </View>
        </View>

        {/* In-flow Switcher + Filters Bar (Normal 8px padding, zero gap!) */}
        <View 
          style={[
            styles.stickySegmentWrapper,
            { 
              backgroundColor: isDark ? '#121212' : '#FFFFFF',
              paddingTop: 8,
            }
          ]}
        >
          {renderSwitcherAndFilters()}
        </View>

        {/* Tab Content (Instant switch, no long scrolling!) */}
        {activeTab === 'Experts' ? (
          <View key="tab-experts">
            <HospitalExperts 
              doctors={doctors} 
              likedDocs={likedDocs as any} 
              toggleDocLike={toggleDocLike} 
              colors={colors} 
              isDark={isDark} 
              searchQuery={searchFilterText}
              hideFilterBar={true}
              selectedSpecialty={selectedDocSpec}
              isHighlyRecommended={isHighlyRecommended}
              isAvailableToday={isAvailableToday}
              onAddVisitPress={(doc) => {
                setSelectedDoctorForVisit(doc);
              }}
            />
          </View>
        ) : (
          <View key="tab-packages">
            <HospitalPackages 
              hospitalName={hospitalData.name} 
              colors={colors} 
              isDark={isDark}
              selectedCategory={selectedPackageCategory}
              onSelectCategory={(slug: string) => setSelectedPackageCategory(slug)}
              searchQuery={searchFilterText}
              hideFilterBar={true}
              onAddPackagePress={(pkg) => setSelectedPackageForAdd(pkg)}
            />
          </View>
        )}
      </Animated.ScrollView>

      {/* Floating Sticky Switcher & Filters Bar (Pinned right below navigation header with zIndex: 999 to cover all scrolling doctor cards) */}
      <Animated.View
        pointerEvents={isScrolledPast ? 'auto' : 'none'}
        style={[
          styles.floatingStickyBar,
          {
            top: headerHeight,
            backgroundColor: isDark ? '#121212' : '#FFFFFF',
            opacity: stickyBarOpacity,
            zIndex: 999,
            elevation: 15,
          },
        ]}
      >
        {renderSwitcherAndFilters()}
      </Animated.View>



      {/* Hospital Facilities & Info Modal */}
      {isInfoModalOpen && (
        <HospitalInfoModal
          visible={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          hospitalName={hospitalData.name}
          location={hospitalData.location}
          phone={(hospitalData as any)?.phone}
          image={hospitalData.image}
        />
      )}

      {/* Hospital Offers Bottom Sheet Modal */}
      <HospitalOffersModal
        visible={isOffersModalOpen}
        onClose={() => setIsOffersModalOpen(false)}
        hospitalName={hospitalData.name}
        isDark={isDark}
      />

      {/* Add Visit Slot Modal Popup */}
      <AddVisitModal
        visible={!!selectedDoctorForVisit}
        doctor={selectedDoctorForVisit}
        hospitalName={hospitalData.name}
        onClose={() => setSelectedDoctorForVisit(null)}
      />

      {/* Add Package Slot Modal Popup */}
      <AddPackageModal
        visible={!!selectedPackageForAdd}
        packageItem={selectedPackageForAdd}
        hospitalName={hospitalData.name}
        onClose={() => setSelectedPackageForAdd(null)}
      />

      {/* Doctor Specialty Selection Modal */}
      {showDocCategoryModal && (
        <Modal
          visible={showDocCategoryModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDocCategoryModal(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowDocCategoryModal(false)}>
            <Pressable 
              style={[styles.modalCard, { backgroundColor: isDark ? '#1E1E24' : '#FFFFFF' }]}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Select Specialty</Text>
                <TouchableOpacity onPress={() => setShowDocCategoryModal(false)}>
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 350 }}>
                {ALL_DOCTOR_SPECIALTIES.map((spec) => {
                  const isSelected = selectedDocSpec === spec.name || (spec.id === 'All' && selectedDocSpec === 'All');
                  return (
                    <TouchableOpacity
                      key={spec.id}
                      style={[
                        styles.menuItemRow,
                        isSelected && { backgroundColor: isDark ? '#172554' : '#EFF6FF' }
                      ]}
                      onPress={() => {
                        setSelectedDocSpec(spec.id === 'All' ? 'All' : spec.name);
                        setShowDocCategoryModal(false);
                      }}
                    >
                      <Text style={{ fontSize: 16, marginRight: 8 }}>{spec.emoji}</Text>
                      <Text
                        style={[
                          styles.menuItemTitle,
                          { color: isSelected ? (isDark ? '#60A5FA' : '#1D4ED8') : colors.text, fontWeight: isSelected ? '800' : '600' }
                        ]}
                        numberOfLines={1}
                      >
                        {spec.name}
                      </Text>
                      <Text
                        style={[
                          styles.menuItemCount,
                          { color: isSelected ? (isDark ? '#60A5FA' : '#1D4ED8') : (isDark ? '#9CA3AF' : '#6B7280'), fontWeight: isSelected ? '800' : '600' }
                        ]}
                      >
                        {spec.count}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* Package Category Selection Modal */}
      {showPackageCategoryModal && (
        <Modal
          visible={showPackageCategoryModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPackageCategoryModal(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowPackageCategoryModal(false)}>
            <Pressable 
              style={[styles.modalCard, { backgroundColor: isDark ? '#1E1E24' : '#FFFFFF' }]}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>All Package Categories</Text>
                <TouchableOpacity onPress={() => setShowPackageCategoryModal(false)}>
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 350 }}>
                {ALL_PACKAGE_CATEGORIES.map((cat) => {
                  const isSelected = selectedPackageCategory === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.menuItemRow,
                        isSelected && { backgroundColor: isDark ? '#2E1065' : '#F3E8FF' }
                      ]}
                      onPress={() => {
                        setSelectedPackageCategory(cat.id);
                        setShowPackageCategoryModal(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.menuItemTitle,
                          { color: isSelected ? '#7C3AED' : colors.text, fontWeight: isSelected ? '800' : '600' }
                        ]}
                        numberOfLines={1}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* Sticky Floating Cart Bar */}
      <FloatingCartBar variant="hospital" bottomOffset={0} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverContainer: {
    position: 'relative',
    zIndex: 20,
    marginBottom: 20,
  },
  coverWrapper: {
    width: '100%',
    height: 245,
    position: 'relative',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  coverGradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  profileBadgeWrapper: {
    position: 'absolute',
    left: 20,
    bottom: -22,
    width: 68,
    height: 68,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 35,
  },
  profileLogoImage: {
    width: '85%',
    height: '85%',
  },
  profileLogoPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  profileLogoText: {
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: 14,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  imageCountText: {
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
  topSection: {
    marginTop: 0,
    paddingTop: 12,
  },
  mainInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  mainInfoText: {
    flex: 1,
    paddingRight: 12,
  },
  titleWithInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  hospitalName: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.15,
  },
  infoTriggerBtn: {
    padding: 2,
  },
  subwayLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subwayLocationText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  subwayRatingContainer: {
    alignItems: 'flex-end',
  },
  subwayRatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F6D38',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  subwayRatingVal: {
    fontFamily: Fonts.semiBold,
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
  },
  subwayReviewsText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  fixedHeaderBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 60,
  },
  fixedHeaderTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  floatingStickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 40,
    paddingTop: 6,
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  switcherAndFiltersContainer: {
    width: '100%',
  },
  cleanTabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
    paddingHorizontal: 20,
  },
  cleanTabButton: {
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  cleanTabText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    letterSpacing: -0.2,
  },
  cleanTabIndicator: {
    height: 3,
    borderRadius: 2,
    marginTop: 6,
    width: '100%',
  },
  cleanTabIndicatorPlaceholder: {
    height: 3,
    marginTop: 6,
    width: '100%',
    backgroundColor: 'transparent',
  },
  stickySegmentWrapper: {
    paddingTop: 6,
    paddingBottom: 4,
    zIndex: 25,
  },
  subFilterBarWrapper: {
    marginTop: 8,
    marginBottom: 4,
  },
  packagePillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  allPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    position: 'relative',
  },
  allPillText: {
    fontSize: 12.5,
    fontFamily: Fonts.bold,
  },
  allUnderline: {
    position: 'absolute',
    bottom: 4,
    left: 14,
    right: 14,
    height: 2,
    borderRadius: 1,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12.5,
    fontFamily: Fonts.medium,
  },
  morePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  morePillText: {
    fontSize: 12.5,
    fontFamily: Fonts.semiBold,
  },
  segmentCapsule: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: 12,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    zIndex: 1,
    height: '100%',
  },
  segmentText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  countBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  modalTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    fontWeight: '600',
  },
  menuItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 2,
  },
  menuItemTitle: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  menuItemCount: {
    fontSize: 14,
  },
  packagesHeadingContainer: {
    paddingHorizontal: 16,
    marginTop: 28,
    marginBottom: 16,
    alignItems: 'center',
  },
  packagesHeadingDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  headingLine: {
    flex: 1,
    height: 1,
  },
  headingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  headingBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  packagesMainTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  packagesSubTitle: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 320,
  },
});
