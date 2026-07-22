import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Heart, Star, MapPin, ShieldCheck, Clock, Briefcase, Baby, FileText, CreditCard, Users } from 'lucide-react-native';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

const DUMMY_PACKAGE = {
  id: 'pkg_1',
  title: '1 x Standard Maternity Care',
  hospital: 'Cloudnine Hospitals',
  location: 'HITECH City, Hyderabad',
  rating: '4.9',
  reviews: '2,340',
  distance: '2.3 km',
  duration: '40 Weeks',
  hospitalStay: '2 Days (Normal) / 4 Days (C-section)',
  suitableFor: 'Single Pregnancy',
  insurance: '20+ Insurance Accepted',
  emi: 'Yes',
  price: '₹ 24,999',
  image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2070&auto=format&fit=crop',
  hospitalLogo: require('../../../assets/images/cloudnine_logo.png'),
};

export default function StandardMaternityCareScreen() {
  
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FA' }]}>
      
      {/* Top Header */}
      <SafeAreaView edges={['top']} style={[styles.header, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{DUMMY_PACKAGE.hospital}</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Heart size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} bounces={false}>
        
        {/* Building Image */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: DUMMY_PACKAGE.image }} style={styles.buildingImage} contentFit="cover" />
        </View>

        {/* Main Info Card (Overlapping) */}
        <View style={[styles.infoCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.logoBox}>
              <Image source={DUMMY_PACKAGE.hospitalLogo} style={styles.hospitalLogo} contentFit="contain" />
            </View>
            <View style={styles.cardHeaderRight}>
              <View style={styles.ratingRow}>
                <Star size={14} color="#FF9800" fill="#FF9800" />
                <Text style={[styles.ratingText, { color: colors.text }]}>{DUMMY_PACKAGE.rating}</Text>
                <Text style={styles.reviewsText}>({DUMMY_PACKAGE.reviews} reviews)</Text>
              </View>
              <View style={styles.locationSmallRow}>
                <MapPin size={12} color="#666" />
                <Text style={styles.distanceText}>{DUMMY_PACKAGE.distance}</Text>
              </View>
            </View>
          </View>

          {/* Package Title replacing location as requested */}
          <Text style={[styles.packageTitle, { color: colors.text }]}>{DUMMY_PACKAGE.title}</Text>
          <View style={styles.locationFullRow}>
            <MapPin size={14} color="#666" />
            <Text style={styles.locationFullText}>{DUMMY_PACKAGE.location}</Text>
          </View>

          <View style={styles.badgesRow}>
            <View style={styles.badgeGreen}>
              <ShieldCheck size={14} color="#00A981" />
              <Text style={styles.badgeGreenText}>NABH Accredited</Text>
            </View>
            <View style={styles.badgeRed}>
              <Clock size={14} color="#EF4444" />
              <Text style={styles.badgeRedText}>24/7 Emergency</Text>
            </View>
          </View>

          <View style={styles.statsDivider} />

          <View style={styles.fourStatsRow}>
            <View style={styles.fourStatItem}>
              <View style={styles.fourStatIcon}><Briefcase size={20} color={colors.text} /></View>
              <Text style={[styles.fourStatVal, { color: colors.text }]}>200+</Text>
              <Text style={styles.fourStatLabel}>Beds</Text>
            </View>
            <View style={styles.fourStatItem}>
              <View style={styles.fourStatIcon}><Users size={20} color={colors.text} /></View>
              <Text style={[styles.fourStatVal, { color: colors.text }]}>45+</Text>
              <Text style={styles.fourStatLabel}>Doctors</Text>
            </View>
            <View style={styles.fourStatItem}>
              <View style={styles.fourStatIcon}><Baby size={20} color={colors.text} /></View>
              <Text style={[styles.fourStatVal, { color: colors.text }]}>NICU</Text>
              <Text style={styles.fourStatLabel}>Level 3</Text>
            </View>
            <View style={styles.fourStatItem}>
              <View style={styles.fourStatIcon}><FileText size={20} color={colors.text} /></View>
              <Text style={[styles.fourStatVal, { color: colors.text }]}>24/7</Text>
              <Text style={styles.fourStatLabel}>Lab</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          {['Overview', 'Includes', 'Doctors', 'Reviews'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}>
              <Text style={[styles.tabText, activeTab === tab ? styles.tabTextActive : { color: '#666' }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* About this Plan */}
        <View style={[styles.detailsSection, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About this Plan</Text>
          <Text style={styles.aboutDesc}>
            Complete care for you and your baby from conception to delivery. Includes consultations, scans, tests, delivery and postnatal care.
          </Text>

          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Clock size={20} color={colors.text} style={styles.listIcon} />
              <Text style={styles.listLabel}>Duration</Text>
              <Text style={[styles.listValue, { color: colors.text }]}>{DUMMY_PACKAGE.duration}</Text>
            </View>
            <View style={styles.listItem}>
              <Briefcase size={20} color={colors.text} style={styles.listIcon} />
              <Text style={styles.listLabel}>Hospital Stay</Text>
              <Text style={[styles.listValue, { color: colors.text }]}>{DUMMY_PACKAGE.hospitalStay}</Text>
            </View>
            <View style={styles.listItem}>
              <Users size={20} color={colors.text} style={styles.listIcon} />
              <Text style={styles.listLabel}>Suitable For</Text>
              <Text style={[styles.listValue, { color: colors.text }]}>{DUMMY_PACKAGE.suitableFor}</Text>
            </View>
            <View style={styles.listItem}>
              <ShieldCheck size={20} color={colors.text} style={styles.listIcon} />
              <Text style={styles.listLabel}>Insurance</Text>
              <Text style={[styles.listValue, { color: colors.text }]}>{DUMMY_PACKAGE.insurance}</Text>
            </View>
            <View style={[styles.listItem, styles.noBorder]}>
              <CreditCard size={20} color={colors.text} style={styles.listIcon} />
              <Text style={styles.listLabel}>EMI Available</Text>
              <Text style={[styles.listValue, { color: colors.text }]}>{DUMMY_PACKAGE.emi}</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.bottomBarContent}>
          <View>
            <Text style={[styles.bottomPriceValue, { color: colors.text }]}>{DUMMY_PACKAGE.price}</Text>
            <Text style={styles.bottomPriceLabel}>Onwards</Text>
          </View>
          <TouchableOpacity 
            style={styles.bookBtn}
            onPress={() => router.push(`/packages/checkout/standard-maternity-care` as any)}
          >
            <Text style={styles.bookBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageWrapper: {
    width: '100%',
    height: 220,
    position: 'relative',
    zIndex: 1,
  },
  buildingImage: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    marginTop: -30, // Overlap the building image
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 20,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginTop: -40, // overlap out of the card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  hospitalLogo: {
    width: 40,
    height: 40,
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '800',
  },
  reviewsText: {
    fontSize: 12,
    color: '#666',
  },
  locationSmallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  packageTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  locationFullRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  locationFullText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  badgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F6F2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeGreenText: {
    color: '#00A981',
    fontSize: 12,
    fontWeight: '700',
  },
  badgeRed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeRedText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
  statsDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 20,
  },
  fourStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fourStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  fourStatIcon: {
    marginBottom: 8,
  },
  fourStatVal: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  fourStatLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingHorizontal: 16,
  },
  tabItem: {
    paddingVertical: 16,
    marginRight: 24,
    position: 'relative',
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#EF4444',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#EF4444',
  },
  detailsSection: {
    padding: 24,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  aboutDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 24,
  },
  listContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  listIcon: {
    width: 24,
  },
  listLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginLeft: 12,
  },
  listValue: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomPriceLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  bottomPriceValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  bookBtn: {
    backgroundColor: '#E64478', // matching the pink/red in screenshot
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
