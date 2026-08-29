import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Modal, Pressable, Platform, Share, Linking, Animated } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  HeartPulse, 
  Calendar, 
  Menu, 
  X, 
  ChevronRight, 
  Sparkles, 
  Users, 
  Briefcase, 
  Info,
  BadgeCheck
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useBookingStore } from '@/hooks/useBookingStore';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';

import HospitalHeader from '@/components/HospitalHeader';
import HospitalExperts from '@/components/hospital/HospitalExperts';
import HospitalPackages from '@/components/hospital/HospitalPackages';
import HospitalInfoModal from '@/components/hospital/HospitalInfoModal';
import HospitalOffersBanner from '@/components/hospital/HospitalOffersBanner';
import HospitalOffersModal from '@/components/hospital/HospitalOffersModal';

import AddVisitModal from '@/components/booking/AddVisitModal';
import AddPackageModal from '@/components/booking/AddPackageModal';
import FloatingCartBar from '@/components/booking/FloatingCartBar';
import { HOSPITALS_DATA } from '@/constants/directory-data';

const MENU_SECTIONS = [
  { id: 'experts', tab: 'Experts', categorySlug: 'all', title: 'Top Specialist Experts', count: 18 },
  { id: 'all_packages', tab: 'Packages', categorySlug: 'all', title: 'All Health Packages', count: 7 },
  { id: 'pregnancy', tab: 'Packages', categorySlug: 'pregnancy', title: 'Pregnancy & Maternity', count: 2 },
  { id: 'cardiac', tab: 'Packages', categorySlug: 'cardiac', title: 'Cardiac Care', count: 1 },
  { id: 'knee', tab: 'Packages', categorySlug: 'knee', title: 'Knee & Joint Recovery', count: 1 },
  { id: 'diabetes', tab: 'Packages', categorySlug: 'diabetes', title: 'Diabetes & Metabolism', count: 1 },
];

export default function HospitalProfile() {
  const { id, tab: initialTab, category: initialCategory } = useLocalSearchParams<{ id: string; tab?: string; category?: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
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
  const [searchFilterText, setSearchFilterText] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const tabIndexMap: Record<string, number> = { Experts: 0, Packages: 1 };
  const tabAnim = useRef(new Animated.Value(tabIndexMap[getInitialTabVal()] || 0)).current;
  const [trackWidth, setTrackWidth] = useState(0);

  const [packagesYPos, setPackagesYPos] = useState(0);
  const [expertsYPos, setExpertsYPos] = useState(240);
  const isManualScrolling = useRef(false);

  React.useEffect(() => {
    if (initialTab) {
      const targetVal = getInitialTabVal();
      Animated.timing(tabAnim, { toValue: tabIndexMap[targetVal] || 0, duration: 200, useNativeDriver: false }).start();
      if (targetVal === 'Packages') {
        setTimeout(() => {
          const targetY = packagesYPos > 0 ? packagesYPos - 20 : 650;
          scrollViewRef.current?.scrollTo({ y: targetY, animated: true });
        }, 350);
      } else {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: 220, animated: true });
        }, 200);
      }
    }
  }, [initialTab, packagesYPos]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [likedDocs, setLikedDocs] = useState<{[key: string]: boolean}>({});

  const [selectedDoctorForVisit, setSelectedDoctorForVisit] = useState<any>(null);
  const [selectedPackageForAdd, setSelectedPackageForAdd] = useState<any>(null);
  const prevScrollYRef = useRef(0);

  const toggleDocLike = (docId: any) => {
    setLikedDocs(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const targetIdx = tabIndexMap[tab] ?? 0;
    Animated.spring(tabAnim, {
      toValue: targetIdx,
      useNativeDriver: false,
      friction: 8,
      tension: 50,
    }).start();

    isManualScrolling.current = true;
    if (tab === 'Packages') {
      setSelectedPackageCategory('all');
      const targetY = packagesYPos > 0 ? packagesYPos - 20 : 650;
      scrollViewRef.current?.scrollTo({ y: targetY, animated: true });
    } else {
      const targetY = Math.max(expertsYPos - 20, 220);
      scrollViewRef.current?.scrollTo({ y: targetY, animated: true });
    }
    setTimeout(() => {
      isManualScrolling.current = false;
    }, 600);
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    prevScrollYRef.current = scrollY;

    if (isManualScrolling.current) return;
    if (packagesYPos > 0) {
      if (scrollY >= packagesYPos - 140 && activeTab !== 'Packages') {
        setActiveTab('Packages');
        Animated.spring(tabAnim, {
          toValue: 1,
          useNativeDriver: false,
          friction: 8,
          tension: 50,
        }).start();
      } else if (scrollY < packagesYPos - 140 && activeTab !== 'Experts') {
        setActiveTab('Experts');
        Animated.spring(tabAnim, {
          toValue: 0,
          useNativeDriver: false,
          friction: 8,
          tension: 50,
        }).start();
      }
    }
  };

  const handleSelectMenuSection = (item: typeof MENU_SECTIONS[0]) => {
    handleTabChange(item.tab);
    if (item.tab === 'Packages') {
      setSelectedPackageCategory(item.categorySlug);
    }
    setIsMenuOpen(false);
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

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        ref={scrollViewRef}
        bounces={true} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {/* Full Bleed Hero Cover Banner with Rounded Bottom Curves */}
        <View style={styles.coverContainer}>
          <View style={styles.coverWrapper}>
            <Image source={{ uri: hospitalData.image }} style={styles.coverImage} />
            <LinearGradient
              colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.45)']}
              style={styles.coverGradient}
            />
            <HospitalHeader 
              title={hospitalData.name}
              onBackPress={() => router.back()}
              onSearchChange={(text) => setSearchFilterText(text)}
              isFavorite={isFavorite}
              onFavoriteToggle={() => setIsFavorite(!isFavorite)}
              onSharePress={handleShare}
              isDark={isDark}
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

          {/* 2-Segment Pill Tab Switcher: Experts | Packages */}
          <View style={styles.segmentWrapper}>
            <View 
              style={[
                styles.segmentTrack, 
                { 
                  backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : '#F0F7FF',
                  borderColor: isDark ? 'rgba(59, 130, 246, 0.25)' : '#DBEAFE',
                }
              ]}
              onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
            >
              {trackWidth > 0 && (
                <Animated.View 
                  style={[
                    styles.segmentCapsule,
                    {
                      width: (trackWidth - 12) / 2,
                      transform: [{
                        translateX: tabAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [4, ((trackWidth - 12) / 2) + 4],
                        })
                      }],
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      shadowColor: '#2563EB',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0.35 : 0.1,
                      shadowRadius: 5,
                      elevation: 3,
                    }
                  ]}
                />
              )}

              <TouchableOpacity 
                style={styles.segmentButton}
                onPress={() => handleTabChange('Experts')}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.segmentText, 
                  { 
                    color: activeTab === 'Experts' ? (isDark ? '#60A5FA' : '#1D4ED8') : (isDark ? '#94A3B8' : '#64748B'),
                    fontWeight: activeTab === 'Experts' ? '800' : '600'
                  }
                ]}>
                  Experts
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.segmentButton}
                onPress={() => handleTabChange('Packages')}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.segmentText, 
                  { 
                    color: activeTab === 'Packages' ? (isDark ? '#60A5FA' : '#1D4ED8') : (isDark ? '#94A3B8' : '#64748B'),
                    fontWeight: activeTab === 'Packages' ? '800' : '600'
                  }
                ]}>
                  Packages
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View onLayout={(e) => setExpertsYPos(e.nativeEvent.layout.y)}>
          <HospitalExperts 
            doctors={doctors} 
            likedDocs={likedDocs as any} 
            toggleDocLike={toggleDocLike} 
            colors={colors} 
            isDark={isDark} 
            searchQuery={searchFilterText}
            onAddVisitPress={(doc) => {
              router.push({
                pathname: '/doctor/[id]',
                params: { id: doc.id },
              });
            }}
          />
        </View>

        {/* Middle Framed Section Heading for Health Packages */}
        <View 
          onLayout={(e) => setPackagesYPos(e.nativeEvent.layout.y)}
          style={styles.packagesHeadingContainer}
        >
          <View style={styles.packagesHeadingDivider}>
            <View style={[styles.headingLine, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#CBD5E1' }]} />
            <View style={[styles.headingBadge, { backgroundColor: isDark ? '#1E293B' : '#E0F2FE' }]}>
              <Sparkles size={14} color={isDark ? '#38BDF8' : '#0284C7'} />
              <Text style={[styles.headingBadgeText, { color: isDark ? '#38BDF8' : '#0369A1' }]}>
                HEALTH PACKAGES
              </Text>
            </View>
            <View style={[styles.headingLine, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#CBD5E1' }]} />
          </View>

          <Text style={[styles.packagesMainTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Specialized Packages & Surgery Care
          </Text>
          <Text style={[styles.packagesSubTitle, { color: isDark ? '#9CA3AF' : '#64748B' }]}>
            Comprehensive checkups, maternity suites & recovery plans with transparent pricing
          </Text>
        </View>

        <HospitalPackages 
          hospitalName={hospitalData.name} 
          colors={colors} 
          isDark={isDark}
          selectedCategory={selectedPackageCategory}
          onSelectCategory={(slug: string) => setSelectedPackageCategory(slug)}
          searchQuery={searchFilterText}
          onAddPackagePress={(pkg) => setSelectedPackageForAdd(pkg)}
        />
      </ScrollView>

      {/* Menu Filter Button */}
      {!hasCartItems && (
        <TouchableOpacity 
          style={styles.floatingMenuBtn}
          onPress={() => setIsMenuOpen(true)}
          activeOpacity={0.88}
        >
          {Platform.OS === 'android' ? (
            <View style={[StyleSheet.absoluteFill, { borderRadius: 25, backgroundColor: 'rgba(20,20,24,0.92)' }]} />
          ) : supportsLiquidGlass ? (
            <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)' }]} />
          ) : (
            <BlurView intensity={90} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.6)' }]} />
          )}
          <Menu size={18} color="#FFFFFF" />
          <Text style={styles.floatingMenuText}>Care Menu</Text>
        </TouchableOpacity>
      )}

      {/* Menu Sheet Modal */}
      {isMenuOpen && (
        <Modal
          visible={isMenuOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsMenuOpen(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setIsMenuOpen(false)}>
            <Pressable 
              style={[styles.modalCard, { backgroundColor: isDark ? '#1C1929' : '#FFFFFF' }]}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Menu</Text>
                <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 350 }}>
                {MENU_SECTIONS.map((sec) => {
                  const isActive = activeTab === sec.tab && (sec.tab === 'Experts' || selectedPackageCategory === sec.categorySlug);
                  return (
                    <TouchableOpacity
                      key={sec.id}
                      style={[
                        styles.menuItemRow,
                        isActive && { backgroundColor: isDark ? '#172554' : '#EFF6FF' }
                      ]}
                      onPress={() => handleSelectMenuSection(sec)}
                    >
                      <Text
                        style={[
                          styles.menuItemTitle,
                          { color: isActive ? (isDark ? '#60A5FA' : '#1D4ED8') : colors.text, fontWeight: isActive ? '800' : '600' }
                        ]}
                        numberOfLines={1}
                      >
                        {sec.title}
                      </Text>
                      <Text
                        style={[
                          styles.menuItemCount,
                          { color: isActive ? (isDark ? '#60A5FA' : '#1D4ED8') : (isDark ? '#9CA3AF' : '#6B7280'), fontWeight: isActive ? '800' : '600' }
                        ]}
                      >
                        {sec.count}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      )}

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
  segmentWrapper: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
  },
  segmentTrack: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    padding: 4,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    alignItems: 'center',
  },
  segmentCapsule: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: 20,
  },
  segmentButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    height: '100%',
  },
  segmentText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14.5,
    letterSpacing: -0.1,
  },
  floatingMenuBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  floatingMenuText: {
    fontFamily: Fonts.semiBold,
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
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
