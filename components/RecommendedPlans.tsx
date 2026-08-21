import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import PlanCard from '@/components/PlanCard';

const { width } = Dimensions.get('window');

export default function RecommendedPlans() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>RECOMMENDED PLANS</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false} overScrollMode="never" style={styles.fullWidthScroll} contentContainerStyle={styles.plansGrid}>
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
            <ChevronRight size={18} color="#2FA882" />
          </View>
          <Text style={[styles.seeAllCardTitle, { color: isDark ? '#A3E6CD' : '#1B5E45' }]}>See All</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  fullWidthScroll: {
    marginHorizontal: -12,
  },
  plansGrid: {
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  seeAllCard: {
    width: width * 0.28,
    height: 180,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  seeAllIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    fontSize: 12,
    fontWeight: '700',
  },
});
