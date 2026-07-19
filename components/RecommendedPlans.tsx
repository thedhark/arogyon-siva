import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import PlanCard from '@/components/PlanCard';

export default function RecommendedPlans() {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended Packages</Text>
        <TouchableOpacity><Text style={[styles.seeAll, { color: '#2FA882' }]}>See All</Text></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false} overScrollMode="never" style={styles.fullWidthScroll} contentContainerStyle={styles.plansGrid}>
        <PlanCard 
          image="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=800"
          title="Pregnancy Care"
          duration="280 Days"
          tag="Popular"
          colors={['rgba(110, 87, 186, 0.4)', 'rgba(110, 87, 186, 0.9)']}
        />
        <PlanCard 
          image="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800"
          title="Weight Loss"
          duration="90 Days"
          tag="Trending"
          colors={['rgba(31, 119, 180, 0.4)', 'rgba(31, 119, 180, 0.9)']}
        />
        <PlanCard 
          image="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800"
          title="Stress Relief"
          duration="21 Days"
          tag="New"
          colors={['rgba(217, 119, 67, 0.4)', 'rgba(217, 119, 67, 0.9)']}
        />
        <PlanCard 
          image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800"
          title="Joint Health"
          duration="30 Days"
          tag="Recovery"
          colors={['rgba(27, 94, 85, 0.4)', 'rgba(27, 94, 85, 0.9)']}
        />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
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
    fontWeight: '700',
  },
  fullWidthScroll: {
    marginHorizontal: -12,
  },
  plansGrid: {
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});
