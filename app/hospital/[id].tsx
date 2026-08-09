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
import { LinearGradient } from 'expo-linear-gradient';
import { useBookingStore } from '@/hooks/useBookingStore';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import AndroidGlassView from '@/components/AndroidGlassView';

import HospitalHeader from '@/components/HospitalHeader';
import HospitalExperts from '@/components/hospital/HospitalExperts';
import HospitalPackages from '@/components/hospital/HospitalPackages';
import HospitalInfoModal from '@/components/hospital/HospitalInfoModal';

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
  
  const hospitalData = useMemo(() => storeHospitals[id as string], [storeHospitals, id]);
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

  React.useEffect(() => {
    if (initialTab) {
      const targetVal = getInitialTabVal();
      Animated.timing(tabAnim, { toValue: tabIndexMap[targetVal] || 0, duration: 200, useNativeDriver: false }).start();
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 220, animated: true });
      }, 200);
    }
  }, [initialTab]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [likedDocs, setLikedDocs] = useState<{[key: string]: boolean}>({});

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
    if (tab === 'Packages') {
      setSelectedPackageCategory('all');
    }
    scrollViewRef.current?.scrollTo({ y: 220, animated: true });
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
        contentContainerStyle={{ paddingBottom: 100 }}
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
            { borderColor: isDark ? '#121212' : '#FFFFFF', backgroundColor: isDark ? '#1E1E24' : '#FFFFFF' }
          ]}>
            {(hospitalData as any).logo ? (
              <Image source={{ uri: (hospitalData as any).logo }} style={styles.profileLogoImage} resizeMode="contain" />
            ) : (
              <View style={[styles.profileLogoPlaceholder, { backgroundColor: isDark ? '#E11D48' : '#00A981' }]}>
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

          {/* 2-Segment Pill Tab Switcher: Experts | Packages */}
          <View style={styles.segmentWrapper}>
            <View 
              style={[
                styles.segmentTrack, 
                { 
                  backgroundColor: isDark ? '#1C1929' : '#F1F5F9',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
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
                      backgroundColor: isDark ? '#2D283E' : '#FFFFFF',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0.35 : 0.08,
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
                    color: activeTab === 'Experts' ? (isDark ? '#FFFFFF' : '#0F172A') : (isDark ? '#9CA3AF' : '#64748B'),
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
                    color: activeTab === 'Packages' ? (isDark ? '#FFFFFF' : '#0F172A') : (isDark ? '#9CA3AF' : '#64748B'),
                    fontWeight: activeTab === 'Packages' ? '800' : '600'
                  }
                ]}>
                  Packages
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {activeTab === 'Experts' && (
          <HospitalExperts 
            doctors={doctors} 
            likedDocs={likedDocs as any} 
            toggleDocLike={toggleDocLike} 
            colors={colors} 
            isDark={isDark} 
            searchQuery={searchFilterText}
          />
        )}

        {activeTab === 'Packages' && (
          <HospitalPackages 
            hospitalName={hospitalData.name} 
            colors={colors} 
            isDark={isDark}
            selectedCategory={selectedPackageCategory}
            onSelectCategory={(slug: string) => setSelectedPackageCategory(slug)}
            searchQuery={searchFilterText}
          />
        )}
      </ScrollView>

      {/* Menu Filter Button */}
      <TouchableOpacity 
        style={styles.floatingMenuBtn}
        onPress={() => setIsMenuOpen(true)}
        activeOpacity={0.88}
      >
        {Platform.OS === 'android' ? (
          <AndroidGlassView tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.85)' }]} />
        ) : supportsLiquidGlass ? (
          <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)' }]} />
        ) : (
          <BlurView intensity={90} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.6)' }]} />
        )}
        <Menu size={18} color="#FFFFFF" />
        <Text style={styles.floatingMenuText}>Care Menu</Text>
      </TouchableOpacity>

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
                        isActive && { backgroundColor: isDark ? '#2A1F3D' : '#F3E8FF' }
                      ]}
                      onPress={() => handleSelectMenuSection(sec)}
                    >
                      <Text
                        style={[
                          styles.menuItemTitle,
                          { color: isActive ? '#E11D48' : colors.text, fontWeight: isActive ? '800' : '600' }
                        ]}
                        numberOfLines={1}
                      >
                        {sec.title}
                      </Text>
                      <Text
                        style={[
                          styles.menuItemCount,
                          { color: isActive ? '#E11D48' : (isDark ? '#9CA3AF' : '#6B7280'), fontWeight: isActive ? '800' : '600' }
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
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  coverGradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  profileBadgeWrapper: {
    position: 'absolute',
    left: 20,
    bottom: -22,
    width: 68,
    height: 68,
    borderRadius: 18,
    borderWidth: 3.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 9,
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
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
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
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
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
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
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
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  subwayReviewsText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
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
    fontSize: 15,
    letterSpacing: -0.2,
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
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
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
    fontSize: 17,
    fontWeight: '800',
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
});
