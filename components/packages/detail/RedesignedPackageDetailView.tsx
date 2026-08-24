import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import PackageHeroBanner from '@/components/packages/detail/PackageHeroBanner';
import PackagePricingCard from '@/components/packages/detail/PackagePricingCard';
import PackageFeaturesGrid from '@/components/packages/detail/PackageFeaturesGrid';
import PackageAssessmentCard from '@/components/packages/detail/PackageAssessmentCard';
import PackageAboutCard from '@/components/packages/detail/PackageAboutCard';
import PackageInclusionsCard from '@/components/packages/detail/PackageInclusionsCard';
import SimilarPackagesCard from '@/components/packages/detail/SimilarPackagesCard';
import StickyBookingPaymentBar from '@/components/booking/StickyBookingPaymentBar';
import { useScrollFooter } from '@/hooks/useScrollFooter';

import { useBookingStore } from '@/hooks/useBookingStore';

interface PackageDetailProps {
  packageId: string;
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image?: any;
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
  hospitalName = 'Manipal Hospital',
  hospitalsCount = 15,
}: PackageDetailProps) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const addCartItem = useBookingStore(state => state.addCartItem);

  const { isFooterVisible, scrollProps } = useScrollFooter({ threshold: 12, topThreshold: 30 });
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

  const rawPriceStr = (price || '4999').toString().replace(/[^0-9]/g, '');
  const pkgPrice = parseFloat(rawPriceStr) || 4999;
  const rawOrigStr = (originalPrice || '').toString().replace(/[^0-9]/g, '');
  const origPrice = parseFloat(rawOrigStr) || Math.round(pkgPrice * 1.35);
  const savings = Math.max(63, origPrice - pkgPrice);

  const handleReserveToken = () => {
    addCartItem({
      type: 'package',
      itemId: packageId || `pkg-${Date.now()}`,
      title: title,
      subtitle: `${hospitalName} • Slot Reservation`,
      price: 499,
      originalPrice: pkgPrice,
      savingsAmount: savings,
      image: image,
      hospitalName: hospitalName,
    });
    router.push('/booking/checkout');
  };

  const handleBookFull = () => {
    addCartItem({
      type: 'package',
      itemId: packageId || `pkg-${Date.now()}`,
      title: title,
      subtitle: `${hospitalName} • Health Checkup`,
      price: pkgPrice,
      originalPrice: origPrice,
      savingsAmount: savings,
      image: image,
      hospitalName: hospitalName,
    });
    router.push('/booking/checkout');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D0E11' : '#F8FAFC' }]} edges={['bottom', 'left', 'right']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false} 
        bounces={false}
        {...scrollProps}
      >
        {/* 1. Edge-to-Edge Scenic Hero Image Banner */}
        <Animated.View entering={FadeInDown.delay(50)}>
          <PackageHeroBanner
            image={image}
            title={title}
            hospitalName={hospitalName || 'Manipal Hospital'}
            isDark={isDark}
            colors={colors}
            onBackPress={() => router.back()}
            onSharePress={handleShare}
            onBookmarkPress={() => setIsBookmarked(!isBookmarked)}
            isBookmarked={isBookmarked}
          />
        </Animated.View>

        {/* 2. Floating Price Card */}
        <Animated.View entering={FadeInDown.delay(75)}>
          <PackagePricingCard
            price={price}
            originalPrice={originalPrice}
            discount={discount}
            tokenPrice="₹499"
          />
        </Animated.View>

        {/* 3. Four Guarantees/Features Grid (Reserve with ₹499, 100% Price Lock, Cashless, Insurance) */}
        {/* Positioned below price and above Select Assessment Date & Time as requested */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <PackageFeaturesGrid isDark={isDark} />
        </Animated.View>

        {/* 4. Select Assessment Date & Time Selector */}
        <Animated.View entering={FadeInDown.delay(125)}>
          <PackageAssessmentCard
            isDark={isDark}
          />
        </Animated.View>

        {/* 5. Accordion Content Sections */}
        <View style={styles.bodySectionsContainer}>
          {/* About this plan Accordion */}
          <Animated.View entering={FadeInDown.delay(150)}>
            <PackageAboutCard
              title="About this plan"
              description={summary}
              isDark={isDark}
              colors={colors}
            />
          </Animated.View>

          {/* What's included Accordion */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <PackageInclusionsCard
              inclusions={inclusions}
              isDark={isDark}
              colors={colors}
            />
          </Animated.View>

          {/* Similar Packages Carousel */}
          <Animated.View entering={FadeInDown.delay(250)}>
            <SimilarPackagesCard
              isDark={isDark}
              colors={colors}
            />
          </Animated.View>

          {/* Quality Assurance Promise */}
          <Animated.View
            entering={FadeInDown.delay(300)}
            style={[
              styles.promiseCard,
              {
                backgroundColor: isDark ? '#1F192E' : '#F5F3FF',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#EDE9FE',
              },
            ]}
          >
            <ShieldCheck size={26} color={isDark ? '#A78BFA' : '#6527BE'} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.promiseTitle, { color: isDark ? '#DDD6FE' : '#6527BE' }]}>
                100% Price Lock & Quality Guarantee
              </Text>
              <Text style={[styles.promiseSub, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
                NABH Accredited Hospital partners, verified specialist consults & zero hidden charges.
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Payment Action Bar with Dual Buttons */}
      <StickyBookingPaymentBar
        priceDropText="Price dropped by ₹167"
        price={price}
        originalPrice={originalPrice}
        discountText={discount}
        tokenCtaText="Reserve Slot (₹499)"
        ctaText="Confirm Package"
        ctaIcon="bag"
        onPressTokenCTA={handleReserveToken}
        onPressCTA={handleBookFull}
        visible={isFooterVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingBottom: 130,
  },
  bodySectionsContainer: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
  promiseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginTop: 6,
    marginBottom: 16,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  promiseTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  promiseSub: {
    fontSize: 12,
    lineHeight: 16,
  },
});
