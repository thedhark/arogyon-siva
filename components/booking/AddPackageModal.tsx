import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  Share as RNShare 
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/hooks/useBookingStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

import PackageHeroBanner from '@/components/packages/detail/PackageHeroBanner';
import PackagePricingCard from '@/components/packages/detail/PackagePricingCard';
import PackageFeaturesGrid from '@/components/packages/detail/PackageFeaturesGrid';
import PackageAssessmentCard from '@/components/packages/detail/PackageAssessmentCard';
import PackageAboutCard from '@/components/packages/detail/PackageAboutCard';
import PackageInclusionsCard from '@/components/packages/detail/PackageInclusionsCard';
import SimilarPackagesCard from '@/components/packages/detail/SimilarPackagesCard';
import StickyBookingPaymentBar from '@/components/booking/StickyBookingPaymentBar';

interface AddPackageModalProps {
  visible: boolean;
  packageItem: any;
  hospitalName?: string;
  onClose: () => void;
  onAdded?: () => void;
}

export default function AddPackageModal({ 
  visible, 
  packageItem, 
  hospitalName = 'Manipal Hospital', 
  onClose, 
  onAdded 
}: AddPackageModalProps) {
  const { colors, isDark } = useTheme();
  const addCartItem = useBookingStore(state => state.addCartItem);

  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!packageItem) return null;

  const pkgTitle = (packageItem.title || 'Health Package').replace(/^1\s*x\s*/i, '');
  const pkgSubtitle = packageItem.subtitle || packageItem.summary || 'Full-spectrum diagnostic checkup with accredited laboratory testing and senior physician consultation.';
  const pkgImage = packageItem.image || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600';
  
  const rawPriceStr = (packageItem.price || '4999').toString().replace(/[^0-9]/g, '');
  const pkgPrice = parseFloat(rawPriceStr) || 4999;
  
  const rawOrigStr = (packageItem.originalPrice || '').toString().replace(/[^0-9]/g, '');
  const originalPrice = parseFloat(rawOrigStr) || Math.round(pkgPrice * 1.35);
  const savings = Math.max(63, originalPrice - pkgPrice);

  const inclusions = packageItem.inclusions || [
    'Obstetrician / Specialist Consultations',
    'All Diagnostic Lab Tests & Scans',
    'Nutrition & Diet Guidance Plan',
    'Follow-up & Physician Support',
  ];

  const handleShare = async () => {
    try {
      await RNShare.share({
        message: `Check out ${pkgTitle} on Arogyon! Special Price: ₹${pkgPrice.toLocaleString('en-IN')}`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleReserveToken = () => {
    addCartItem({
      type: 'package',
      itemId: packageItem.id || `pkg-${Date.now()}`,
      title: pkgTitle,
      subtitle: `${packageItem.category || 'Package'} • Slot Reservation`,
      price: 499,
      originalPrice: pkgPrice,
      savingsAmount: savings,
      image: pkgImage,
      hospitalName: hospitalName,
    });

    onClose();
    if (onAdded) onAdded();
  };

  const handleConfirmAdd = () => {
    addCartItem({
      type: 'package',
      itemId: packageItem.id || `pkg-${Date.now()}`,
      title: pkgTitle,
      subtitle: `${packageItem.category || 'Package'} • Health Package`,
      price: pkgPrice,
      originalPrice: originalPrice,
      savingsAmount: savings,
      image: pkgImage,
      hospitalName: hospitalName,
    });

    onClose();
    if (onAdded) onAdded();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: isDark ? '#0D0E11' : '#F8FAFC' }]}>
          {/* Full Package Details View Content inside ScrollView */}
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
            {/* 1. Package Hero Image Banner */}
            <Animated.View entering={FadeInDown.delay(50)}>
              <PackageHeroBanner
                image={pkgImage}
                title={pkgTitle}
                subtitle={pkgSubtitle}
                hospitalName={hospitalName}
                isDark={isDark}
                colors={colors}
                onBackPress={onClose}
                onSharePress={handleShare}
                onBookmarkPress={() => setIsBookmarked(!isBookmarked)}
                isBookmarked={isBookmarked}
              />
            </Animated.View>

            {/* 2. Pricing Breakdown Card */}
            <Animated.View entering={FadeInDown.delay(75)}>
              <PackagePricingCard
                price={`₹${pkgPrice.toLocaleString('en-IN')}`}
                originalPrice={`₹${originalPrice.toLocaleString('en-IN')}`}
                discount={`${Math.round((savings / originalPrice) * 100)}% OFF`}
                tokenPrice="₹499"
              />
            </Animated.View>

            {/* 3. Four Guarantees/Features Grid (Reserve with ₹499, 100% Price Lock, Cashless, Insurance) */}
            <Animated.View entering={FadeInDown.delay(100)}>
              <PackageFeaturesGrid isDark={isDark} style={{ marginHorizontal: 16 }} />
            </Animated.View>

            {/* 4. Accordion Content Sections Container */}
            <View style={styles.bodySectionsContainer}>
              {/* About this plan Accordion */}
              <Animated.View entering={FadeInDown.delay(125)}>
                <PackageAboutCard
                  title="About this plan"
                  description={pkgSubtitle}
                  isDark={isDark}
                  colors={colors}
                />
              </Animated.View>

              {/* What's included Accordion */}
              <Animated.View entering={FadeInDown.delay(150)}>
                <PackageInclusionsCard
                  inclusions={inclusions}
                  isDark={isDark}
                  colors={colors}
                />
              </Animated.View>

              {/* Similar Packages Carousel */}
              <Animated.View entering={FadeInDown.delay(200)}>
                <SimilarPackagesCard
                  isDark={isDark}
                  colors={colors}
                />
              </Animated.View>

              {/* Important to know info card */}
              <Animated.View entering={FadeInDown.delay(250)}>
                <PackageAssessmentCard
                  isDark={isDark}
                  style={{ marginHorizontal: 0, marginTop: 10, marginBottom: 16 }}
                />
              </Animated.View>
            </View>
          </ScrollView>

          {/* Sticky Booking Action Bar with Dual Buttons matching Image 2 */}
          <StickyBookingPaymentBar
            priceDropText="Price dropped by ₹167"
            price={`₹${pkgPrice.toLocaleString('en-IN')}`}
            originalPrice={`₹${originalPrice.toLocaleString('en-IN')}`}
            discountText={`${Math.round((savings / originalPrice) * 100)}% OFF`}
            tokenCtaText="Reserve Slot (₹499)"
            ctaText="Confirm Package"
            ctaIcon="bag"
            onPressTokenCTA={handleReserveToken}
            onPressCTA={handleConfirmAdd}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingBottom: 130,
  },
  bodySectionsContainer: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
});
