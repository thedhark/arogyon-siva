import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import PlanCard, { PLAN_CARD_WIDTH, PLAN_CARD_HEIGHT } from '@/components/PlanCard';
import { scale, moderateScale } from '@/utils/responsive';

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
        <PlanCard 
          image="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=800"
          title="Pregnancy Care"
          categorySlug="pregnancy"
        />
        <PlanCard 
          image="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800"
          title="Weight Loss"
          categorySlug="weight"
        />
        <PlanCard 
          image="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800"
          title="Derma & Skin"
          categorySlug="skin"
        />
        <PlanCard 
          image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800"
          title="Joint Health"
          categorySlug="knee"
        />
        <PlanCard 
          image="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800"
          title="Heart Care"
          categorySlug="heart"
        />
        <PlanCard 
          image="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800"
          title="Dental Care"
          categorySlug="dental"
        />
        <PlanCard 
          image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800"
          title="Diabetes Care"
          categorySlug="diabetes"
        />
        <PlanCard 
          image="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800"
          title="Full Body Checkup"
          categorySlug="health-checkups"
        />
        
        {/* See All card at the end of horizontal scrolling */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.seeAllCard,
            {
              backgroundColor: isDark ? 'rgba(47, 168, 130, 0.12)' : '#EDF8F5',
              borderColor: isDark ? 'rgba(47, 168, 130, 0.3)' : 'rgba(47, 168, 130, 0.25)',
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
    borderRadius: scale(14),
    borderWidth: 1,
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

