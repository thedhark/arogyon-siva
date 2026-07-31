import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Share2, Heart, ShieldCheck } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import PackageHeroBanner from '@/components/packages/detail/PackageHeroBanner';
import PackageCategoryNav from '@/components/packages/detail/PackageCategoryNav';
import PackageAboutCard from '@/components/packages/detail/PackageAboutCard';
import PackageInclusionsCard from '@/components/packages/detail/PackageInclusionsCard';
import SimilarPackagesCard from '@/components/packages/detail/SimilarPackagesCard';
import StickyBookingPaymentBar from '@/components/booking/StickyBookingPaymentBar';

interface PackageDetailProps {
  packageId: string;
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image?: string;
  rating?: string;
  bookedCount?: string;
  summary?: string;
  inclusions?: string[];
  hospitalName?: string;
  hospitalLocation?: string;
  hospitalsCount?: number;
}

export default function RedesignedPackageDetailView({
  packageId,
  title,
  price,
  originalPrice = '₹ 35,000',
  discount = '25% OFF',
  image = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000',
  rating = '4.9',
  bookedCount = '1.2K+ Booked',
  summary = 'Full-spectrum diagnostic checkup with accredited laboratory testing and senior physician consultation.',
  inclusions = [
    'Obstetrician Consultations',
    'All Lab Tests & Scans',
    'Nutrition & Diet Guidance',
    'Physiotherapy & Yoga',
    'Delivery & Hospitalization',
    'Postpartum & Lactation Support',
  ],
  hospitalName = 'Cloudnine Hospitals',
  hospitalsCount = 15,
}: PackageDetailProps) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('cashless');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${title} on Arogyon App! Special Price: ${price}`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleBookNow = () => {
    router.push(`/packages/checkout/${packageId}` as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8FAFC' }]}>
      {/* Top Navigation Bar */}
      <View style={[styles.headerBar, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {hospitalName || 'Cloudnine Hospitals'}
        </Text>
        <View style={styles.headerRightActions}>
          <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)} style={styles.iconBtn}>
            <Heart
              size={20}
              color={isBookmarked ? '#EF4444' : colors.text}
              fill={isBookmarked ? '#EF4444' : 'none'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
            <Share2 size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Professional Hero Image Banner */}
        <Animated.View entering={FadeInDown.delay(50)}>
          <PackageHeroBanner
            image={image}
            title={title}
            discount={discount}
            rating={rating}
            bookedCount={bookedCount}
            isDark={isDark}
            colors={colors}
          />
        </Animated.View>

        {/* 2. Category Icon Carousel */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <PackageCategoryNav
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            isDark={isDark}
            colors={colors}
          />
        </Animated.View>

        {/* 3. About this plan Card */}
        <Animated.View entering={FadeInDown.delay(150)}>
          <PackageAboutCard
            title="About this plan"
            description={summary}
            isDark={isDark}
            colors={colors}
          />
        </Animated.View>

        {/* 4. What's included Card */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <PackageInclusionsCard
            inclusions={inclusions}
            isDark={isDark}
            colors={colors}
          />
        </Animated.View>

        {/* 5. Hospitals with Similar Packages Carousel */}
        <Animated.View entering={FadeInDown.delay(250)}>
          <SimilarPackagesCard
            isDark={isDark}
            colors={colors}
          />
        </Animated.View>


        {/* 7. Arogyon Assurance Promise */}
        <Animated.View
          entering={FadeInDown.delay(350)}
          style={[
            styles.promiseCard,
            {
              backgroundColor: isDark ? '#1F192E' : '#F5F3FF',
              borderColor: isDark ? '#4C1D95' : '#EDE9FE',
            },
          ]}
        >
          <ShieldCheck size={28} color="#6527BE" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.promiseTitle, { color: isDark ? '#DDD6FE' : '#6527BE' }]}>
              100% Quality & Price Guarantee
            </Text>
            <Text style={[styles.promiseSub, { color: isDark ? '#A7F3D0' : '#4B5563' }]}>
              NABH Accredited Hospital partners, verified specialist consults & zero hidden charges.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Sticky Bottom Booking Payment Action Bar */}
      <StickyBookingPaymentBar
        priceDropText="Price dropped by ₹167"
        price={price}
        originalPrice={originalPrice}
        discountText={discount}
        ctaText="Book Visit"
        ctaIcon="bag"
        onPressCTA={handleBookNow}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginHorizontal: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  promiseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  promiseTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  promiseSub: {
    fontSize: 12,
    lineHeight: 16,
  },
});
