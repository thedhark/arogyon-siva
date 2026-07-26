import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import WellnessCard from '@/components/WellnessCard';

export default function WellnessForYou() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Wellness For You</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/package' as any)}>
          <Text style={[styles.seeAll, { color: '#2FA882' }]}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false} overScrollMode="never" style={styles.fullWidthScroll} contentContainerStyle={styles.horizontalList}>
        <WellnessCard 
          image="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=800"
          title="Morning Yoga"
          desc="Start your day with energy"
          bgColor="#DCEAD8"
          categorySlug="fitness"
        />
        <WellnessCard 
          image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800"
          title="Immunity Boost"
          desc="Foods & habits for stronger you"
          bgColor="#F5EDD7"
          categorySlug="diabetes"
        />
        <WellnessCard 
          image="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800"
          title="Sleep Better"
          desc="Improve sleep naturally"
          bgColor="#E2E2F0"
          categorySlug="senior"
        />
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
  horizontalList: {
    gap: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});
