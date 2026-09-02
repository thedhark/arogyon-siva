import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { getDynamicTopInset } from '@/utils/responsive';
import AnimatedScreen from '@/components/AnimatedScreen';
import PremiumSearchBar from '@/components/PremiumSearchBar';
import SpotlightBanner from '@/components/SpotlightBanner';
import DirectoryHeader from '@/components/DirectoryHeader';
import DirectoryContent from '@/components/DirectoryContent';
import Animated, { FadeInDown, SlideInDown, useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolation, withTiming, runOnJS } from 'react-native-reanimated';
import { useTabBarStore } from '@/hooks/useTabBarStore';

// Extracted sections
import HomeHeader from '@/components/HomeHeader';

import RecommendedPlans from '@/components/RecommendedPlans';
import ExploreCategories from '@/components/ExploreCategories';
import ExploreFilters from '@/components/ExploreFilters';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { useGlass } from '@/contexts/GlassContext';
import FloatingCartBar from '@/components/booking/FloatingCartBar';


const { width } = Dimensions.get('window');



export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { settings } = useGlass();
  const insets = useSafeAreaInsets();
  const [activeDirectoryTab, setActiveDirectoryTab] = useState('All');
  const [currentCity, setCurrentCity] = useState<string>('Detecting location...');
  const [isCategoriesModalVisible, setIsCategoriesModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setCurrentCity('Bangalore'); // Fallback
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });

        if (geocode && geocode.length > 0) {
          setCurrentCity(geocode[0].city || geocode[0].region || 'Bangalore');
        } else {
          setCurrentCity('Bangalore');
        }
      } catch (error) {
        console.warn('Error fetching location:', error);
        setCurrentCity('Bangalore'); // Fallback
      }
    })();
  }, []);

  const setTabBarVisible = useTabBarStore((s) => s.setTabBarVisible);
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const isScrollingDown = useSharedValue(false);
  const categoriesY = useSharedValue(0);
  const filtersY = useSharedValue(0);


  const supportsLiquidGlass = isLiquidGlassAvailable();
  const statusBarHeight = insets.top > 0 ? insets.top : (Platform.OS === 'android' ? 24 : 44);
  const themeBgColor = isDark ? '#121212' : '#FDFDFD';

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;

      // Track scroll direction with a threshold to prevent jitter
      if (currentY > lastScrollY.value + 8 && currentY > 50) {
        isScrollingDown.value = true;
        runOnJS(setTabBarVisible)(false);
      } else if (currentY < lastScrollY.value - 6 || currentY <= 30) {
        isScrollingDown.value = false;
        runOnJS(setTabBarVisible)(true);
      }

      lastScrollY.value = currentY;
      scrollY.value = currentY;
    },
  });

  const animatedStatusBarBackdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 40],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  return (
    <AnimatedScreen entrance="up">
      <View style={[styles.screen, { backgroundColor: themeBgColor }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

        {/* Dynamic Status Bar Background: Opacity 0% to 100% smoothly on scroll */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.statusBarBackdrop,
            {
              height: statusBarHeight,
              backgroundColor: themeBgColor,
            },
            animatedStatusBarBackdropStyle,
          ]}
        />

        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={[styles.scrollView, { marginTop: statusBarHeight }]}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          overScrollMode="never"
        >

          {/* Header & Search Bar */}
          <View style={{ marginBottom: 8, paddingHorizontal: 16 }}>
            <View style={{ marginBottom: 4 }}>
              <HomeHeader currentCity={currentCity} />
            </View>
            <Animated.View entering={SlideInDown.delay(150)}>
              <PremiumSearchBar />
            </Animated.View>
          </View>

          {/* Recommended Plans */}
          <View style={{ marginBottom: 4 }}>
            <RecommendedPlans />
          </View>

          {/* Spotlight Banner (Offers & Direct Access) */}
          <Animated.View entering={FadeInDown.delay(200)} style={{ marginBottom: 12 }}>
            <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>SPOTLIGHT</Text>
            </View>
            <SpotlightBanner />
          </Animated.View>

          {/* Categories Section (Unified Natural Layout - No separate index or elevation) */}
          <View style={{ marginBottom: 2 }}>
            <View style={styles.categorySectionHeaderContainer}>
              <Text style={[styles.categorySectionTitle, { color: isDark ? '#9CA3AF' : '#71717A' }]}>
                WHAT'S ON YOUR MIND?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIsCategoriesModalVisible(true);
                }}
                activeOpacity={0.7}
                style={styles.categoryActionBtn}
              >
                <Text style={[styles.categoryActionLabel, { color: isDark ? '#34D399' : '#059669' }]}>
                  See More
                </Text>
              </TouchableOpacity>
            </View>

            <ExploreCategories
              activeTab={activeDirectoryTab}
              onTabChange={setActiveDirectoryTab}
              isModalVisible={isCategoriesModalVisible}
              onModalVisibilityChange={setIsCategoriesModalVisible}
              style={{ marginBottom: 2, paddingVertical: 2 }}
            />
          </View>

          {/* Inline Explore Filters (Below Categories) */}
          <View style={{ marginBottom: 6 }}>
            <ExploreFilters />
          </View>

          {/* Directory Content */}
          <View style={{ paddingHorizontal: 12, paddingTop: 6 }}>
            <DirectoryContent activeTab={activeDirectoryTab} />
          </View>

        </Animated.ScrollView>

        <FloatingCartBar variant="home" />
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollView: {
    flex: 1,
  },
  statusBarBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: Platform.OS === 'web' ? 40 : 140,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  categorySectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
    marginTop: 4,
  },
  categorySectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  categoryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});