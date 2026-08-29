import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput, ScrollView } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedScrollHandler, runOnJS } from 'react-native-reanimated';
import { useTabBarStore } from '@/hooks/useTabBarStore';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDynamicTopInset } from '@/utils/responsive';
import AnimatedScreen from '@/components/AnimatedScreen';
import HomeHeader from '@/components/HomeHeader';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChip, setSelectedChip] = useState('all');
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const supportsLiquidGlass = isLiquidGlassAvailable();

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

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      cards = cards.filter(
        (card) =>
          card.name.toLowerCase().includes(query) ||
          card.keywords.some((kw) => kw.toLowerCase().includes(query))
      );
    }

    return cards;
  }, [searchQuery, selectedChip]);

  const textColor = isDark ? '#F3F4F6' : '#111827';
  const mutedColor = isDark ? '#9CA3AF' : '#6B7280';

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
          <HomeHeader currentCity="Bangalore" avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" />

          {/* Dynamic Search Bar */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.searchContainer}>
            <View
              style={[
                styles.searchInner,
                {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.08)',
                  backgroundColor: supportsLiquidGlass
                    ? 'transparent'
                    : Platform.OS === 'ios'
                    ? 'transparent'
                    : isDark
                    ? 'rgba(30,30,30,0.7)'
                    : 'rgba(255,255,255,0.7)',
                },
              ]}
            >
              {Platform.OS === 'android' ? null : supportsLiquidGlass ? (
                <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 16, overflow: 'hidden' }]} />
              ) : (
                Platform.OS === 'ios' && (
                  <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={[StyleSheet.absoluteFill, { borderRadius: 16, overflow: 'hidden' }]} />
                )
              )}

              <Search size={18} color={mutedColor} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: textColor }]}
                placeholder='Search care packages ("Heart", "Skin", "Diabetes")...'
                placeholderTextColor={mutedColor}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                  <X size={16} color={mutedColor} />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

          {/* Quick Category Filter Chips */}
          <Animated.View entering={FadeInDown.delay(150)} style={styles.chipsWrapper}>
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

          {/* Section Header */}
          <Animated.View entering={FadeInDown.delay(210)} style={styles.sectionHeader}>
            <View style={styles.titleRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {filteredCards.length} Medical & Health Categories
              </Text>
            </View>
          </Animated.View>

          {/* Cards Rendered Dynamically */}
          <Animated.View entering={FadeInDown.delay(250)}>
            {filteredCards.map((cardItem, index) => {
              const CardComponent = cardItem.component;
              return (
                <Animated.View key={cardItem.id} entering={FadeInDown.delay(100 + Math.min(index * 30, 300))}>
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
  searchContainer: {
    marginBottom: 14,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  clearBtn: {
    padding: 4,
  },
  chipsWrapper: {
    marginBottom: 14,
  },
  chipsScrollContent: {
    gap: 8,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
  },
});
