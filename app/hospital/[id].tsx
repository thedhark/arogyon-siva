import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Modal, Pressable, Platform, Share, Linking } from 'react-native';
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
  Info
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useBookingStore } from '@/hooks/useBookingStore';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import AndroidGlassView from '@/components/AndroidGlassView';

import HospitalHeader from '@/components/HospitalHeader';
import HospitalDoctors from '@/components/hospital/HospitalDoctors';
import HospitalPackages from '@/components/hospital/HospitalPackages';
import HospitalInfoModal from '@/components/hospital/HospitalInfoModal';

const MENU_SECTIONS = [
  { id: 'experts', tab: 'Experts', categorySlug: 'all', title: 'Top Specialist Experts', count: 18 },
  { id: 'all_packages', tab: 'Packages', categorySlug: 'all', title: 'All Health Packages', count: 7 },
  { id: 'pregnancy', tab: 'Packages', categorySlug: 'pregnancy', title: 'Pregnancy & Maternity', count: 2 },
  { id: 'cardiac', tab: 'Packages', categorySlug: 'cardiac', title: 'Cardiac Care', count: 1 },
  { id: 'knee', tab: 'Packages', categorySlug: 'knee', title: 'Knee & Joint Recovery', count: 1 },
  { id: 'diabetes', tab: 'Packages', categorySlug: 'diabetes', title: 'Diabetes & Metabolism', count: 1 },
  { id: 'gastro', tab: 'Packages', categorySlug: 'gastro', title: 'Gastro & Digestive', count: 1 },
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

  const [activeTab, setActiveTab] = useState(
    initialTab && initialTab.toLowerCase() === 'packages' ? 'Packages' : 'Experts'
  );
  const [selectedPackageCategory, setSelectedPackageCategory] = useState(
    initialCategory || 'all'
  );
  const [searchFilterText, setSearchFilterText] = useState('');

  React.useEffect(() => {
    if (initialTab && initialTab.toLowerCase() === 'packages') {
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
    if (tab === 'Packages') {
      setSelectedPackageCategory('all');
    }
    scrollViewRef.current?.scrollTo({ y: 220, animated: true });
  };

  const handleSelectMenuSection = (item: typeof MENU_SECTIONS[0]) => {
    setActiveTab(item.tab);
    if (item.tab === 'Packages') {
      setSelectedPackageCategory(item.categorySlug);
    }
    setIsMenuOpen(false);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 220, animated: true });
    }, 100);
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
        <View style={styles.coverWrapper}>
          <Image source={{ uri: hospitalData.image }} style={styles.coverImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent']}
            style={styles.coverGradient}
          />
          <HospitalHeader 
            onBackPress={() => router.back()}
            onSearchChange={(text) => setSearchFilterText(text)}
            isDark={isDark}
          />
          <View style={styles.imageCountBadge}>
            <Text style={styles.imageCountText}>1/15</Text>
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
                <View style={styles.infoTriggerBtn}>
                  <Info size={18} color={isDark ? '#9CA3AF' : '#475569'} />
                </View>
              </View>

              {/* Location Pin Row */}
              <View style={styles.subwayLocationRow}>
                <MapPin size={14} color="#64748B" />
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

          {/* Top Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tabItem, activeTab === 'Experts' && styles.tabItemActive]}
              onPress={() => handleTabChange('Experts')}
            >
              <Users size={18} color={activeTab === 'Experts' ? (isDark ? '#38BDF8' : '#0F172A') : (isDark ? '#9CA3AF' : '#64748B')} style={{ marginRight: 8 }} />
              <Text style={[styles.tabText, activeTab === 'Experts' && styles.tabTextActive, { color: activeTab === 'Experts' ? (isDark ? '#38BDF8' : '#0F172A') : (isDark ? '#9CA3AF' : '#64748B') }]}>Doctors</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tabItem, activeTab === 'Packages' && styles.tabItemActive]}
              onPress={() => handleTabChange('Packages')}
            >
              <Briefcase size={18} color={activeTab === 'Packages' ? (isDark ? '#38BDF8' : '#0F172A') : (isDark ? '#9CA3AF' : '#64748B')} style={{ marginRight: 8 }} />
              <Text style={[styles.tabText, activeTab === 'Packages' && styles.tabTextActive, { color: activeTab === 'Packages' ? (isDark ? '#38BDF8' : '#0F172A') : (isDark ? '#9CA3AF' : '#64748B') }]}>Packages</Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'Experts' && (
          <HospitalDoctors 
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
          <AndroidGlassView style={[StyleSheet.absoluteFill, { borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.85)' }]} />
        ) : supportsLiquidGlass ? (
          <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)' }]} />
        ) : (
          <BlurView intensity={90} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.6)' }]} />
        )}
        <Menu size={18} color="#FFFFFF" />
        <Text style={styles.floatingMenuText}>Care Menu</Text>
      </TouchableOpacity>

      {/* Menu Sheet Modal */}
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

      {/* Hospital Facilities & Info Modal */}
      <HospitalInfoModal
        visible={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        hospitalName={hospitalData.name}
        location={hospitalData.location}
        phone={(hospitalData as any)?.phone}
        image={hospitalData.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverWrapper: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverGradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 100,
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: 30,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  topSection: {
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
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
    borderRadius: 14,
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#0F172A',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabTextActive: {
    fontWeight: '800',
  },
  floatingMenuBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
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
    borderRadius: 20,
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
