import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Star, ArrowRight, BadgeCheck, MapPin, Search, SlidersHorizontal, ChevronRight, Globe, Truck, Users } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const MOCK_HOSPITALS = [
  {
    id: 'h1',
    name: 'Cloudnine Hospitals',
    location: 'Jayanagar, Bangalore',
    logo: require('../../../assets/images/cloudnine_logo.png'), // Will fallback if missing
    rating: '4.8',
    reviews: 'By 15K+',
    packages: [
      {
        id: 'premium-delivery-package',
        title: '1 x Premium Delivery Package',
        price: '₹75,999',
        originalPrice: '₹90,000',
        discount: '15% OFF',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600',
        tokenAvailable: true,
        deliveryAvailable: true,
        guests: 2,
      },
      {
        id: 'standard-maternity-care',
        title: '1 x Standard Maternity Care',
        price: '₹55,000',
        originalPrice: '₹65,000',
        discount: '15% OFF',
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600',
        tokenAvailable: true,
        deliveryAvailable: true,
        guests: 2,
      }
    ]
  },
  {
    id: 'h2',
    name: 'Apollo Hospitals',
    location: 'Jubilee Hills, Hyderabad',
    logo: require('../../../assets/images/apollo_logo.png'),
    rating: '4.7',
    reviews: 'By 12K+',
    packages: [
      {
        id: 'advanced-pregnancy-package',
        title: '1 x Advanced Pregnancy Package',
        price: '₹89,999',
        originalPrice: '₹1,20,000',
        discount: '25% OFF',
        image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=600',
        tokenAvailable: true,
        deliveryAvailable: true,
        guests: 6,
      },
      {
        id: 'trimester-1-2-checkup',
        title: '1 x Trimester 1 & 2 Checkup',
        price: '₹15,999',
        originalPrice: '₹22,000',
        discount: '27% OFF',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600',
        tokenAvailable: true,
        deliveryAvailable: true,
        guests: 4,
      }
    ]
  },
  {
    id: 'h3',
    name: 'Yashoda Hospitals',
    location: 'Somajiguda, Hyderabad',
    logo: require('../../../assets/images/apollo_logo.png'), // placeholder
    rating: '4.6',
    reviews: 'By 8K+',
    packages: [
      {
        id: 'basic-delivery-package',
        title: '1 x Basic Delivery Package',
        price: '₹45,999',
        originalPrice: '₹60,000',
        discount: '23% OFF',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600',
        tokenAvailable: true,
        deliveryAvailable: true,
        guests: 2,
      },
      {
        id: 'complete-maternity-care',
        title: '1 x Complete Maternity Care',
        price: '₹95,000',
        originalPrice: '₹1,25,000',
        discount: '24% OFF',
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600',
        tokenAvailable: true,
        deliveryAvailable: true,
        guests: 4,
      }
    ]
  }
];

export default function WeightLossScreen() {
  
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} bounces={false}>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image source={require('../../../assets/images/pregnancy_hero.png')} style={styles.heroImage} contentFit="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          />
          
          <SafeAreaView edges={['top']} style={styles.headerBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#FFF" />
            </TouchableOpacity>
          </SafeAreaView>

          <View style={styles.heroOfferContainer}>
            <Text style={styles.heroOfferHighlight}>50% OFF UP TO ₹1,500</Text>
            <Text style={styles.heroOfferHighlight}>UNLOCKED</Text>
            <Text style={styles.heroOfferSub}>Ends Tomorrow</Text>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={[styles.titleLine, { backgroundColor: isDark ? '#333' : '#E5E5E5' }]} />
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#1A1A1A' }]}>
            WEIGHT LOSS PLANS
          </Text>
          <View style={[styles.titleLine, { backgroundColor: isDark ? '#333' : '#E5E5E5' }]} />
        </View>

        {/* Filters */}
        <View style={styles.filtersWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScrollContent}>
            <TouchableOpacity style={[styles.filterPill, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E5E5' }]}>
              <SlidersHorizontal size={14} color={isDark ? '#FFF' : '#1A1A1A'} />
              <Text style={[styles.filterPillText, { color: isDark ? '#FFF' : '#1A1A1A' }]}>Filters</Text>
            </TouchableOpacity>
            
            {['All', 'Popular', 'Budget', 'Premium'].map((filter) => {
              const isActive = filter === 'All';
              return (
                <TouchableOpacity 
                  key={filter}
                  style={[
                    styles.filterPill, 
                    isActive 
                      ? { backgroundColor: '#005C4B', borderColor: '#005C4B' }
                      : { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E5E5' }
                  ]}
                >
                  <Text style={[
                    styles.filterPillText, 
                    { color: isActive ? '#FFFFFF' : (isDark ? '#FFF' : '#1A1A1A') }
                  ]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* Hospital Sections */}
        <View style={styles.hospitalsContainer}>
          {MOCK_HOSPITALS.map((hospital, index) => (
            <Animated.View key={hospital.id} entering={FadeInDown.delay(index * 150)} style={styles.hospitalSection}>
              
              {/* Hospital Header */}
              <View style={styles.hospitalHeader}>
                <View style={styles.hospitalInfoLeft}>
                  <View style={styles.hospitalLogoContainer}>
                    <Image source={hospital.logo} style={styles.hospitalLogo} contentFit="contain" />
                  </View>
                  <View style={styles.hospitalTitleBox}>
                    <View style={styles.hospitalNameRow}>
                      <Text style={styles.hospitalName}>{hospital.name}</Text>
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
                {hospital.packages.map((pkg) => (
                  <View key={pkg.id} style={styles.packageCard}>
                    
                    {/* Top Image */}
                    <View style={styles.packageImageContainer}>
                      <Image source={{ uri: pkg.image }} style={styles.packageImage} contentFit="cover" />
                    </View>

                    {/* Content */}
                    <View style={styles.packageContent}>
                      <View style={styles.typeIconRow}>
                        <Text style={styles.packageTitle} numberOfLines={1}>{pkg.title}</Text>
                      </View>

                      {/* Price & Action Row */}
                      <View style={styles.priceAndActionRow}>
                        <View style={styles.priceLeft}>
                          <Text style={styles.currentPrice}>{pkg.price}</Text>
                          <Text style={styles.originalPrice}>{pkg.originalPrice}</Text>
                          <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{pkg.discount}</Text>
                          </View>
                        </View>

                        <TouchableOpacity 
                          style={styles.viewPackageBtn}
                          onPress={() => router.push(`/packages/detail/${pkg.id}` as any)}
                        >
                          <Text style={styles.viewPackageText}>View package</Text>
                          <ChevronRight size={14} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>

              {/* View Full Menu Button */}
              <View style={styles.fullMenuBtnWrapper}>
                <TouchableOpacity style={styles.fullMenuBtn}>
                  <Text style={styles.fullMenuText}>View full menu</Text>
                  <ChevronRight size={16} color="#1A1A1A" />
                </TouchableOpacity>
              </View>

              {/* Divider between hospitals */}
              <View style={styles.sectionDivider} />

            </Animated.View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

// Simple icon for chevron down
const ChevronDownIcon = ({ size, color }: { size: number, color: string }) => (
  <View style={{ transform: [{ rotate: '90deg' }] }}>
    <ChevronRight size={size} color={color} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  heroSection: {
    height: 340,
    position: 'relative',
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    overflow: 'hidden',
  },
  headerBar: {
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOfferContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  heroOfferHighlight: {
    fontSize: 20,
    fontWeight: '900',
    color: '#84E034',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  heroOfferSub: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
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
    color: '#1A1A1A',
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
  packagesScrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  packageCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  packageImageContainer: {
    width: '100%',
    height: 120,
  },
  packageImage: {
    width: '100%',
    height: '100%',
  },
  packageContent: {
    padding: 16,
  },
  typeIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  typeIconOuter: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#00A981',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  typeIconInner: {
    width: 6,
    height: 6,
    backgroundColor: '#00A981',
    borderRadius: 3,
  },
  packageTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    flex: 1,
  },
  priceAndActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    gap: 4,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  discountBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '800',
  },
  viewPackageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  viewPackageText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
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
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  fullMenuText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  sectionDivider: {
    height: 1,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#CCC',
    marginBottom: 24,
    width: '100%',
  }
});
