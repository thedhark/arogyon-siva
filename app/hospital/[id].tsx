import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Modal, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ShieldCheck, Star, MapPin, HeartPulse, Calendar, Menu, X, ChevronRight, Sparkles, Users, Briefcase } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useBookingStore } from '@/hooks/useBookingStore';

import HospitalHeader from '@/components/HospitalHeader';
import HospitalFacilities from '@/components/hospital/HospitalFacilities';
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
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const storeHospitals = useBookingStore(state => state.hospitals);
  const storeDoctors = useBookingStore(state => state.doctors);
  
  const hospitalData = useMemo(() => storeHospitals[id as string], [storeHospitals, id]);
  const doctors = useMemo(() => {
    return Object.values(storeDoctors || {}).filter(doc => doc.hospitalId === (id as string));
  }, [storeDoctors, id]);

  const [activeTab, setActiveTab] = useState('Experts');
  const [selectedPackageCategory, setSelectedPackageCategory] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [likedDocs, setLikedDocs] = useState<{[key: string]: boolean}>({});
  const tabs = ['Experts', 'Packages'];

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
            onSharePress={() => {}}
            onCallPress={() => {}}
            onInfoPress={() => setIsInfoModalOpen(true)}
          />
          <View style={styles.imageCountBadge}>
            <Text style={styles.imageCountText}>1/15</Text>
          </View>
        </View>

        <View style={[styles.topSection, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
          <View style={styles.mainInfoRow}>
            <View style={[styles.logoBox, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E5E5' }]}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=200' }} style={styles.logo} />
            </View>
            <View style={styles.mainInfoText}>
              <View style={styles.titleRow}>
                <Text style={[styles.hospitalName, { color: colors.text }]}>{hospitalData.name}</Text>
              </View>
              <View style={styles.subInfoRow}>
                <Star size={12} color="#10B981" fill="#10B981" />
                <Text style={styles.ratingText}>{hospitalData.rating} ({hospitalData.ratingsCount})</Text>
                <Text style={styles.typeText}> •  {hospitalData.type}</Text>
              </View>
              <View style={styles.locationRow}>
                <MapPin size={12} color="#9CA3AF" />
                <Text style={styles.locationText}>{hospitalData.distance} • {hospitalData.location}</Text>
              </View>
            </View>
          </View>

          {/* Hospital Facilities Bar */}
          <HospitalFacilities 
            colors={colors} 
            isDark={isDark} 
            onViewAllPress={() => setIsInfoModalOpen(true)}
          />

          {/* Top Tabs matching Image 1 */}
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
          />
        )}

        {activeTab === 'Packages' && (
          <HospitalPackages 
            colors={colors} 
            isDark={isDark} 
            hospitalName={hospitalData.name}
            selectedCategory={selectedPackageCategory}
            onSelectCategory={(catId) => setSelectedPackageCategory(catId)}
          />
        )}
      </ScrollView>

      {/* Floating Menu Button at Bottom Right (Zomato/Swiggy Style) */}
      <TouchableOpacity 
        style={styles.floatingMenuBtn}
        activeOpacity={0.9}
        onPress={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <>
            <X size={18} color="#FFFFFF" />
            <Text style={styles.floatingMenuText}>Close</Text>
          </>
        ) : (
          <>
            <Menu size={18} color="#FFFFFF" />
            <Text style={styles.floatingMenuText}>Menu</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Zomato/Swiggy Section Menu Modal Overlay */}
      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsMenuOpen(false)}
        >
          <Pressable 
            style={[
              styles.modalCard,
              { backgroundColor: isDark ? '#1E1E24' : '#FFFFFF' }
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Menu Categories</Text>
              <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                <X size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              {MENU_SECTIONS.map((sec) => {
                const isActive = activeTab === sec.tab && (sec.tab !== 'Packages' || selectedPackageCategory === sec.categorySlug);
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

      {/* Hospital Facilities & Info Detailed Modal */}
      <HospitalInfoModal
        visible={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        hospitalName={hospitalData.name}
        location={hospitalData.location}
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
    paddingTop: 24,
  },
  mainInfoRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginRight: 16,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  mainInfoText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  hospitalName: {
    fontSize: 22,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
    lineHeight: 28,
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 4,
  },
  typeText: {
    fontSize: 13,
    color: '#6B7280',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
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
  tabDivider: {
    height: 1,
    width: '100%',
    marginTop: -1,
  },
  floatingMenuBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#1E1E2D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
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

