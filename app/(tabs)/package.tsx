import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import AnimatedScreen from '@/components/AnimatedScreen';
import WidePlanCard from '@/components/WidePlanCard';
import TopCategoryCard from '@/components/TopCategoryCard';
import HomeHeader from '@/components/HomeHeader';
import TopFogOverlay from '@/components/TopFogOverlay';
import PremiumSearchBar from '@/components/PremiumSearchBar';
import { MEDICAL_ILLUSTRATIONS } from '@/constants/medical-illustrations';

const PLANS_DATA = [
  {
    title: 'Pregnancy Care Plan',
    subtitle: 'Complete care for you & your baby',
    duration: '40 Weeks',
    image: MEDICAL_ILLUSTRATIONS.pregnancy,
    colors: ['#FDEEF4', '#EED2DF'] as [string, string],
  },
  {
    title: 'Knee Recovery Plan',
    subtitle: 'Recover faster with expert guidance',
    duration: '45 Days',
    image: MEDICAL_ILLUSTRATIONS.orthopedics,
    colors: ['#EBF5F3', '#D0EAE6'] as [string, string],
  },
  {
    title: 'Diabetes Management Plan',
    subtitle: 'Control sugar. Live better.',
    duration: '90 Days',
    image: MEDICAL_ILLUSTRATIONS.diabetes,
    colors: ['#EDF1F7', '#D1DEEB'] as [string, string],
  },
  {
    title: 'Weight Loss Plan',
    subtitle: 'Nutrition, workouts & lifestyle',
    duration: '60 Days',
    image: MEDICAL_ILLUSTRATIONS.weightLoss,
    colors: ['#FFF6EB', '#F2E2CF'] as [string, string],
  }
];

const TOP_CATEGORIES = [
  {
    title: 'Maternity',
    programs: '12 Programs',
    image: MEDICAL_ILLUSTRATIONS.pregnancy,
  },
  {
    title: 'Surgery Recovery',
    programs: '8 Programs',
    image: MEDICAL_ILLUSTRATIONS.postSurgery,
  },
  {
    title: 'Chronic Care',
    programs: '15 Programs',
    image: MEDICAL_ILLUSTRATIONS.diabetes,
  },
  {
    title: 'Eldercare',
    programs: '6 Programs',
    image: MEDICAL_ILLUSTRATIONS.homeCare,
  },
  {
    title: 'Pediatrics',
    programs: '10 Programs',
    image: MEDICAL_ILLUSTRATIONS.pediatrics,
  },
  {
    title: 'Health Checks',
    programs: '24 Programs',
    image: MEDICAL_ILLUSTRATIONS.labs,
  }
];

export default function PlansScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <AnimatedScreen entrance="up">
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <TopFogOverlay />
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never" contentContainerStyle={styles.scrollContent}>
          
          <HomeHeader currentCity="Bangalore" avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" />

          <Animated.View entering={FadeInDown.delay(150)}>
            <PremiumSearchBar />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)} style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Plans</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)}>
            {PLANS_DATA.map((plan, index) => (
              <WidePlanCard 
                key={index}
                title={plan.title}
                subtitle={plan.subtitle}
                duration={plan.duration}
                image={plan.image}
                colors={plan.colors}
              />
            ))}
          </Animated.View>

          {/* Top Categories Section */}
          <Animated.View entering={FadeInDown.delay(500)} style={[styles.sectionHeader, { marginTop: 24 }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Categories</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600)} style={styles.gridContainer}>
            {TOP_CATEGORIES.map((cat, index) => (
              <TopCategoryCard
                key={index}
                title={cat.title}
                programs={cat.programs}
                image={cat.image}
                onPress={() => router.push(`/category/${index + 1}` as any)}
              />
            ))}
          </Animated.View>

        </ScrollView>
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 120,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  }
});
