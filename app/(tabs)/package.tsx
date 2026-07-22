import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Search, X, Sparkles } from 'lucide-react-native';
import AnimatedScreen from '@/components/AnimatedScreen';
import HomeHeader from '@/components/HomeHeader';

import {
  PregnancyCareCard,
  KneeCareCard,
  DiabetesCareCard,
  WeightCareCard,
  CardiacCareCard,
  HerniaCareCard,
  SkinCareCard,
  DentalCareCard,
  OrthoCareCard,
  RehabCareCard,
  PediatricCareCard,
  SpineCareCard,
  GastroCareCard,
  EyeCareCard,
  MentalCareCard,
  OncologyCareCard,
  SeniorCareCard,
  WomensCareCard,
  UrologyCareCard,
  ThyroidCareCard,
  ALL_CATEGORY_CARDS
} from '@/components/packages/cards';

export default function PlansScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) {
      return ALL_CATEGORY_CARDS;
    }
    const query = searchQuery.toLowerCase().trim();
    return ALL_CATEGORY_CARDS.filter((card) => {
      return (
        card.name.toLowerCase().includes(query) ||
        card.keywords.some((kw) => kw.toLowerCase().includes(query))
      );
    });
  }, [searchQuery]);

  return (
    <AnimatedScreen entrance="up">
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <Animated.ScrollView 
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false} 
          bounces={false} 
          overScrollMode="never" 
          contentContainerStyle={styles.scrollContent}
        >
          <HomeHeader currentCity="Bangalore" avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" />

          {/* Dynamic Search Bar */}
          <Animated.View entering={FadeInDown.delay(150)} style={styles.searchContainer}>
            <View style={styles.searchInner}>
              <Search size={18} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder='Search categories ("Pregnancy", "Dental", "Heart")...'
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                  <X size={16} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

          {/* Section Header */}
          <Animated.View entering={FadeInDown.delay(250)} style={styles.sectionHeader}>
            <View style={styles.titleRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Categories</Text>
              <View style={styles.badge}>
                <Sparkles size={12} color="#10B981" />
                <Text style={styles.badgeText}>{filteredCards.length} Care Plans</Text>
              </View>
            </View>
          </Animated.View>

          {/* Modular Cards Rendered Explicitly */}
          <Animated.View entering={FadeInDown.delay(350)}>
            {filteredCards.map((cardItem, index) => {
              const CardComponent = cardItem.component;
              return (
                <Animated.View key={cardItem.id} entering={FadeInDown.delay(350 + index * 40)}>
                  <CardComponent />
                </Animated.View>
              );
            })}
          </Animated.View>
        </Animated.ScrollView>
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 120,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  clearBtn: {
    padding: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
});
