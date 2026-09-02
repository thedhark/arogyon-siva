import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import PlanCard, { PLAN_CARD_WIDTH, PLAN_CARD_HEIGHT } from '@/components/PlanCard';
import { scale, moderateScale } from '@/utils/responsive';

const POPULAR_PACKAGES_DATA = [
  {
    id: 'health-checkups',
    title: 'Full Body Checkup',
    categorySlug: 'health-checkups',
    tag: '50% OFF',
    image: require('@/assets/images/package-banners/health_checkups.png'),
  },
  {
    id: 'pregnancy',
    title: 'Pregnancy Care',
    categorySlug: 'pregnancy',
    tag: 'Popular',
    image: require('@/assets/images/package-banners/pregnancy_care.png'),
  },
  {
    id: 'weight',
    title: 'Weight Loss',
    categorySlug: 'weight',
    tag: 'Trending',
    image: require('@/assets/images/package-banners/weight_management.png'),
  },
  {
    id: 'skin',
    title: 'Derma & Skin',
    categorySlug: 'skin',
    image: require('@/assets/images/package-banners/skin.png'),
  },
  {
    id: 'diabetes',
    title: 'Diabetes Care',
    categorySlug: 'diabetes',
    image: require('@/assets/images/package-banners/diabetics.png'),
  },
  {
    id: 'dental',
    title: 'Dental Care',
    categorySlug: 'dental',
    image: require('@/assets/images/package-banners/teeth.png'),
  },
  {
    id: 'women-health',
    title: "Women's Health",
    categorySlug: 'women-health',
    image: require('@/assets/images/package-banners/women_health.png'),
  },
  {
    id: 'knee',
    title: 'Joint Health',
    categorySlug: 'knee',
    image: require('@/assets/images/package-banners/bones_and_joints.png'),
  },
  {
    id: 'eye-care',
    title: 'Eye Care',
    categorySlug: 'eye-care',
    image: require('@/assets/images/package-banners/eye_care.png'),
  },
  {
    id: 'child-health',
    title: 'Child Health',
    categorySlug: 'child-health',
    image: require('@/assets/images/package-banners/child_health.png'),
  },
  {
    id: 'hair-care',
    title: 'Hair Transplant',
    categorySlug: 'hair-care',
    image: require('@/assets/images/package-banners/hair_plant.png'),
  },
  {
    id: 'lungs',
    title: 'Lungs & Pulmo',
    categorySlug: 'lungs',
    image: require('@/assets/images/package-banners/lungs.png'),
  },
];

export default function RecommendedPlans() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>POPULAR PACKAGES</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={styles.plansGrid}
      >
        {POPULAR_PACKAGES_DATA.map((pkg) => (
          <PlanCard
            key={pkg.id}
            image={pkg.image}
            title={pkg.title}
            tag={pkg.tag}
            categorySlug={pkg.categorySlug}
          />
        ))}
        
        {/* See All card at the end of horizontal scrolling */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.seeAllCard,
            {
              backgroundColor: isDark ? 'rgba(47, 168, 130, 0.12)' : '#EDF8F5',
            },
          ]}
          onPress={() => router.push('/(tabs)/package' as any)}
        >
          <View style={styles.seeAllIconContainer}>
            <ChevronRight size={scale(18)} color="#2FA882" />
          </View>
          <Text style={[styles.seeAllCardTitle, { color: isDark ? '#A3E6CD' : '#1B5E45' }]}>See All</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '500',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  plansGrid: {
    gap: scale(8),
    paddingLeft: 12,
    paddingRight: 16,
    paddingTop: scale(4),
    paddingBottom: scale(10),
  },
  seeAllCard: {
    width: PLAN_CARD_WIDTH,
    height: PLAN_CARD_HEIGHT,
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  seeAllIconContainer: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2FA882',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  seeAllCardTitle: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '700',
  },
});
