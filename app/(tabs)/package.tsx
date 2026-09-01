import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedScrollHandler, runOnJS } from 'react-native-reanimated';
import { useTabBarStore } from '@/hooks/useTabBarStore';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDynamicTopInset } from '@/utils/responsive';
import AnimatedScreen from '@/components/AnimatedScreen';
import PremiumSearchBar from '@/components/PremiumSearchBar';
import { SlideInDown } from 'react-native-reanimated';

import { ALL_CATEGORY_CARDS } from '@/components/packages/cards';

const CATEGORY_CHIPS = [
  { id: 'all', label: 'All Packages' },
  { id: 'health-checkups', label: 'Checkups' },
  { id: 'heart', label: 'Heart Care' },
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'skin', label: 'Skin Care' },
  { id: 'hair', label: 'Hair Care' },
  { id: 'women', label: "Women's Care" },
  { id: 'bone-joint', label: 'Bone & Joint' },
  { id: 'dental', label: 'Dental Care' },
  { id: 'child', label: 'Child Care' },
  { id: 'eye', label: 'Eye Care' },
  { id: 'physio', label: 'Physio & Rehab' },
];

export default function PlansScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const setTabBarVisible = useTabBarStore((s) => s.setTabBarVisible);
  const [selectedChip, setSelectedChip] = useState('all');
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      if (currentY > lastScrollY.value + 8 && currentY > 50) {
        runOnJS(setTabBarVisible)(false);
      } else if (currentY < lastScrollY.value - 6 || currentY <= 30) {
        runOnJS(setTabBarVisible)(true);
      }
      lastScrollY.value = currentY;
      scrollY.value = currentY;
    },
  });

  const filteredCards = useMemo(() => {
    let cards = ALL_CATEGORY_CARDS;

    if (selectedChip !== 'all') {
      cards = cards.filter(
        (c) =>
          c.id === selectedChip ||
          c.keywords.some((k) => k.toLowerCase().includes(selectedChip))
      );
    }

    return cards;
  }, [selectedChip]);

  return (
    <AnimatedScreen entrance="up">
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          contentContainerStyle={[styles.scrollContent, { paddingTop: getDynamicTopInset(insets.top) }]}
        >
          {/* Identical Search Bar from Home Screen */}
          <Animated.View entering={SlideInDown.delay(100)} style={styles.searchBarWrapper}>
            <PremiumSearchBar />
          </Animated.View>

          {/* Quick Category Filter Chips */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.chipsWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScrollContent}>
              {CATEGORY_CHIPS.map((chip) => {
                const isSelected = selectedChip === chip.id;
                return (
                  <TouchableOpacity
                    key={chip.id}
                    onPress={() => setSelectedChip(chip.id)}
                    activeOpacity={0.8}
                    style={[
                      styles.chipPill,
                      isSelected
                        ? { backgroundColor: '#0D9488', borderColor: '#0D9488' }
                        : {
                            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                            borderColor: isDark ? '#333' : '#E5E7EB',
                          },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipPillText,
                        { color: isSelected ? '#FFFFFF' : isDark ? '#D1D5DB' : '#4B5563' },
                      ]}
                    >
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>

          {/* Cards Rendered Dynamically - 1 Column Layout */}
          <Animated.View entering={FadeInDown.delay(150)} style={styles.cardsList}>
            {filteredCards.map((cardItem, index) => {
              const CardComponent = cardItem.component;
              return (
                <Animated.View
                  key={cardItem.id}
                  style={styles.cardItemWrapper}
                  entering={FadeInDown.delay(100 + Math.min(index * 30, 300))}
                >
                  <CardComponent category={cardItem.category} />
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
    paddingTop: Platform.OS === 'web' ? 16 : (Platform.OS === 'ios' ? 54 : 36),
    paddingBottom: Platform.OS === 'web' ? 40 : 140,
  },
  searchBarWrapper: {
    marginBottom: 10,
  },
  chipsWrapper: {
    marginTop: 4,
    marginBottom: 16,
  },
  chipsScrollContent: {
    gap: 8,
  },
  cardsList: {
    gap: 14,
  },
  cardItemWrapper: {
    width: '100%',
  },
  chipPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
  },
  chipPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
