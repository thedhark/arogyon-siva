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
import Animated, { FadeInDown, SlideInDown, useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, useAnimatedProps, interpolate, Extrapolation, withTiming } from 'react-native-reanimated';

// Extracted sections
import HomeHeader from '@/components/HomeHeader';

import RecommendedPlans from '@/components/RecommendedPlans';
import ExploreCategories from '@/components/ExploreCategories';
import ExploreFilters from '@/components/ExploreFilters';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { useGlass } from '@/contexts/GlassContext';
import FloatingCartBar from '@/components/booking/FloatingCartBar';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

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

  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const isScrollingDown = useSharedValue(false);
  const categoriesY = useSharedValue(0);
  const filtersY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;

      // Track scroll direction with a small threshold to prevent jitter
      if (currentY > lastScrollY.value + 5 && currentY > 0) {
        isScrollingDown.value = true;
      } else if (currentY < lastScrollY.value - 5) {
        isScrollingDown.value = false;
      }

      lastScrollY.value = currentY;
      scrollY.value = currentY;
    },
  });

  const supportsLiquidGlass = isLiquidGlassAvailable();
  const statusBarHeight = insets.top > 0 ? insets.top : (Platform.OS === 'android' ? 24 : 44);

  // Status Bar Backdrop: Opacity increases smoothly from 0 to 1 as soon as user starts scrolling down
  const statusBarCoverStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 35],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
    };
  });

  const categoriesStickyStyle = useAnimatedStyle(() => {
    const triggerPoint = categoriesY.value > 0 ? categoriesY.value - statusBarHeight : 99999;
    const progress = interpolate(
      scrollY.value,
      [triggerPoint - 20, triggerPoint],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      paddingHorizontal: 0,
      paddingTop: interpolate(progress, [0, 1], [4, 0]),
      paddingBottom: interpolate(progress, [0, 1], [4, 6]),
    };
  });

  const backgroundContainerStyle = useAnimatedStyle(() => {
    const triggerPoint = categoriesY.value > 0 ? categoriesY.value - statusBarHeight : 99999;
    const progress = interpolate(
      scrollY.value,
      [triggerPoint - 20, triggerPoint],
      [0, 1],
      Extrapolation.CLAMP
    );

    let backgroundColor = 'transparent';
    if (Platform.OS === 'android') {
      backgroundColor = isDark ? (progress > 0.05 ? '#121212' : 'transparent') : (progress > 0.05 ? '#FFFFFF' : 'transparent');
    } else if (supportsLiquidGlass || Platform.OS === 'ios') {
      backgroundColor = isDark ? `rgba(18,18,18,${progress * 0.4})` : `rgba(255,255,255,${progress * 0.4})`;
    } else {
      backgroundColor = isDark ? `rgba(18,18,18,${progress * 0.4})` : `rgba(255,255,255,${progress * 0.4})`;
    }

    return {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      top: interpolate(progress, [0, 1], [0, -statusBarHeight * 0.8]),
      backgroundColor,
      borderRadius: 0,
      borderWidth: Platform.OS === 'android' ? 0 : StyleSheet.hairlineWidth * progress,
      borderBottomWidth: Platform.OS === 'android' ? (progress > 0.5 ? 1 : 0) : StyleSheet.hairlineWidth * progress,
      borderColor: isDark ? (Platform.OS === 'android' ? '#27272A' : `rgba(255,255,255,${progress * 0.15})`) : (Platform.OS === 'android' ? '#E5E7EB' : `rgba(0,0,0,${progress * 0.08})`),
      overflow: 'hidden',
    };
  });

  const categoriesWrapperStyle = useAnimatedStyle(() => {
    const triggerPoint = categoriesY.value > 0 ? categoriesY.value - statusBarHeight : 99999;
    const progress = interpolate(
      scrollY.value,
      [triggerPoint - 20, triggerPoint],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: progress * 4 },
      shadowOpacity: progress * 0.08,
      shadowRadius: progress * 10,
      elevation: Platform.OS === 'android' ? 0 : progress * 6,
      transform: [
        {
          translateY: interpolate(progress, [0, 1], [0, statusBarHeight * 0.8])
        }
      ]
    };
  });

  const categoriesGlassStyle = useAnimatedStyle(() => {
    const triggerPoint = categoriesY.value > 0 ? categoriesY.value - statusBarHeight : 99999;
    const progress = interpolate(
      scrollY.value,
      [triggerPoint - 20, triggerPoint],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity: progress,
    };
  });

  const animatedBlurProps = useAnimatedProps(() => {
    const triggerPoint = categoriesY.value > 0 ? categoriesY.value - statusBarHeight : 99999;
    const progress = interpolate(
      scrollY.value,
      [triggerPoint - 20, triggerPoint],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      intensity: progress * 85,
    };
  });

  const inlineFiltersY = useSharedValue(0);

  const stickyFiltersAnimatedStyle = useAnimatedStyle(() => {
    if (inlineFiltersY.value === 0) return { height: 0, opacity: 0 };
    const trigger = inlineFiltersY.value - statusBarHeight - 85;
    const progress = interpolate(
      scrollY.value,
      [trigger - 10, trigger + 15],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      height: interpolate(progress, [0, 1], [0, 36]),
      opacity: progress,
      overflow: 'hidden',
    };
  });

  const inlineFiltersAnimatedStyle = useAnimatedStyle(() => {
    if (inlineFiltersY.value === 0) return { opacity: 1 };
    const trigger = inlineFiltersY.value - statusBarHeight - 85;
    const progress = interpolate(
      scrollY.value,
      [trigger - 10, trigger + 15],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity: 1 - progress,
    };
  });

  return (
    <AnimatedScreen entrance="up">
      <View style={[styles.screen, { backgroundColor: isDark ? '#121212' : '#FDFDFD' }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

        {/* Dynamic Status Bar Shield: Fades smoothly from 0 to 1 as user scrolls down */}
        <Animated.View
          style={[
            styles.statusBarCover,
            {
              height: statusBarHeight,
              backgroundColor: isDark ? '#121212' : '#FFFFFF',
            },
            statusBarCoverStyle,
          ]}
          pointerEvents="none"
        >
          {Platform.OS === 'ios' && (
            <BlurView
              intensity={90}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          )}
        </Animated.View>

        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingTop: getDynamicTopInset(insets.top) }]}
          stickyHeaderIndices={[5]}
          bounces={false}
          overScrollMode="never"
        >

          {/* Index 0: Header & Search Bar */}
          <View style={{ marginBottom: 12, paddingHorizontal: 16 }}>
            <View style={{ marginBottom: 4 }}>
              <HomeHeader currentCity={currentCity} />
            </View>
            <Animated.View entering={SlideInDown.delay(150)}>
              <PremiumSearchBar />
            </Animated.View>
          </View>

          {/* Index 1: Recommended Plans */}
          <View style={{ paddingHorizontal: 16 }}>
            <RecommendedPlans />
          </View>

          {/* Index 2: Spotlight Banner (50% OFF Offers & Direct Access) */}
          <Animated.View entering={FadeInDown.delay(200)} style={{ marginBottom: 16 }}>
            <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>SPOTLIGHT</Text>
            </View>
            <SpotlightBanner />
          </Animated.View>


          {/* Index 4: Category Section Header: What's On Your Mind? (Scrolls naturally away when scrolling down) */}
          <Animated.View entering={FadeInDown.delay(280)} style={styles.categorySectionHeaderContainer}>
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
                17+ Specialties
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Index 5: Sticky Explore Categories & Dynamic Docked Filters (Now contains only pills without text clutter) */}
          <View
            onLayout={(e) => {
              const y = e.nativeEvent.layout.y;
              if (Math.abs(categoriesY.value - y) > 1) {
                categoriesY.value = y;
              }
            }}
            style={{ zIndex: 10, marginBottom: 8 }}
          >
            <Animated.View style={categoriesStickyStyle}>
              <Animated.View style={categoriesWrapperStyle}>
                <Animated.View style={backgroundContainerStyle} pointerEvents="none">
                  {Platform.OS === 'android' ? null : supportsLiquidGlass ? (
                    <Animated.View style={[StyleSheet.absoluteFill, categoriesGlassStyle]}>
                      <GlassView glassEffectStyle="regular" colorScheme={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                    </Animated.View>
                  ) : (
                    <AnimatedBlurView animatedProps={animatedBlurProps} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                  )}
                </Animated.View>
                <ExploreCategories
                  activeTab={activeDirectoryTab}
                  onTabChange={setActiveDirectoryTab}
                  isModalVisible={isCategoriesModalVisible}
                  onModalVisibilityChange={setIsCategoriesModalVisible}
                  style={{ marginBottom: 0, paddingVertical: 4 }}
                />
                <Animated.View style={stickyFiltersAnimatedStyle}>
                  <View style={{ paddingBottom: 4 }}>
                    <ExploreFilters />
                  </View>
                </Animated.View>
              </Animated.View>
            </Animated.View>
          </View>

          {/* Index 5: Inline Explore Filters (Below Banner) */}
          <Animated.View 
            onLayout={(e) => {
              const y = e.nativeEvent.layout.y;
              if (Math.abs(inlineFiltersY.value - y) > 1) {
                inlineFiltersY.value = y;
              }
            }}
            style={[{ marginBottom: 12 }, inlineFiltersAnimatedStyle]}
          >
            <ExploreFilters />
          </Animated.View>

          {/* Index 6: Directory Content */}
          <View style={{ paddingHorizontal: 12 }}>
            <DirectoryContent activeTab={activeDirectoryTab} />
          </View>

        </Animated.ScrollView>

        <FloatingCartBar variant="home" bottomOffset={Platform.OS === 'ios' ? 90 : 75} />
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 54 : 36,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    marginBottom: 8,
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
  statusBarCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99,
  },
});