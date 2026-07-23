import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import PremiumSearchBar from '@/components/PremiumSearchBar';
import FamilyBanner from '@/components/FamilyBanner';
import CategoryGrid from '@/components/CategoryGrid';
import DirectoryHeader from '@/components/DirectoryHeader';
import DirectoryContent from '@/components/DirectoryContent';
import Animated, { FadeInDown, SlideInDown, useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, useAnimatedProps, interpolate, Extrapolation, withTiming } from 'react-native-reanimated';

// Extracted sections
import HomeHeader from '@/components/HomeHeader';

import RecommendedPlans from '@/components/RecommendedPlans';
import WellnessForYou from '@/components/WellnessForYou';
import ExploreCategories from '@/components/ExploreCategories';
import ExploreFilters from '@/components/ExploreFilters';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { useGlass } from '@/contexts/GlassContext';
import AndroidGlassView from '@/components/AndroidGlassView';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const { width } = Dimensions.get('window');

const USER_NAME = 'Ananya';
const AVATAR_URL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { settings } = useGlass();
  const insets = useSafeAreaInsets();
  const [activeDirectoryTab, setActiveDirectoryTab] = useState('Hospitals');
  const [currentCity, setCurrentCity] = useState<string>('Detecting location...');

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
  const statusBarHeight = insets.top > 0 ? insets.top : 24;

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
      paddingTop: interpolate(progress, [0, 1], [12, 0]),
      paddingBottom: interpolate(progress, [0, 1], [12, 24]),
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
    if (supportsLiquidGlass || Platform.OS === 'ios') {
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
      borderWidth: StyleSheet.hairlineWidth * progress,
      borderColor: isDark ? `rgba(255,255,255,${progress * 0.15})` : `rgba(0,0,0,${progress * 0.08})`,
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

  const animatedFiltersStyle = useAnimatedStyle(() => {
    const triggerPoint = categoriesY.value > 0 ? categoriesY.value - statusBarHeight : 99999;
    const isSticky = scrollY.value >= triggerPoint;
    // Only hide if sticky AND scrolling down
    const shouldHide = isSticky && isScrollingDown.value;
    
    // The filter pill itself is now ~28px tall. We use 38px to keep it tight and minimal.
    return {
      height: withTiming(shouldHide ? 0 : 38, { duration: 300 }),
      opacity: withTiming(shouldHide ? 0 : 1, { duration: 250 }),
      overflow: 'hidden',
    };
  });

  return (
    <AnimatedScreen entrance="up">
      <View style={[styles.screen, { backgroundColor: isDark ? '#121212' : '#FDFDFD' }]}>
        <Animated.ScrollView 
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          stickyHeaderIndices={[5]}
          bounces={false}
          overScrollMode="never"
        >
          
          {/* Index 0: Header & Search Bar */}
          <View style={{ marginBottom: 12, paddingHorizontal: 12 }}>
            <View style={{ marginBottom: 4 }}>
              <HomeHeader currentCity={currentCity} avatarUrl={AVATAR_URL} />
            </View>
            <Animated.View entering={SlideInDown.delay(150)}>
              <PremiumSearchBar />
            </Animated.View>
          </View>

          {/* Index 1: Recommended Plans */}
          <View style={{ paddingHorizontal: 12 }}>
            <RecommendedPlans />
          </View>

          {/* Index 2: Family Banner (Spotlight) */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Spotlight</Text>
            </View>
            <FamilyBanner />
          </Animated.View>

          {/* Index 3: Category Grid (Specialties) */}
          <Animated.View entering={FadeInDown.delay(300)} style={{ paddingHorizontal: 12, marginBottom: 12 }}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
            </View>
            <CategoryGrid />
          </Animated.View>

          {/* Index 4: Wellness For You */}
          <View style={{ paddingHorizontal: 12 }}>
            <WellnessForYou />
          </View>

          {/* Index 5: Sticky Explore Categories & Filters */}
          <View
            onLayout={(e) => {
              const y = e.nativeEvent.layout.y;
              if (Math.abs(categoriesY.value - y) > 1) {
                categoriesY.value = y;
              }
            }} 
            style={{ zIndex: 10 }}
          >
            <Animated.View style={categoriesStickyStyle}>
              <Animated.View style={categoriesWrapperStyle}>
                <Animated.View style={backgroundContainerStyle} pointerEvents="none">
                  {Platform.OS === 'android' ? (
                    <AndroidGlassView animatedProps={animatedBlurProps} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                  ) : supportsLiquidGlass ? (
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
                  style={{ marginBottom: 0, paddingVertical: 12 }}
                />
                <Animated.View style={animatedFiltersStyle}>
                  <ExploreFilters />
                </Animated.View>
              </Animated.View>
            </Animated.View>
          </View>

          {/* Index 7: Directory Content */}
          <View style={{ paddingHorizontal: 12 }}>
            <DirectoryContent activeTab={activeDirectoryTab} />
          </View>

        </Animated.ScrollView>
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 50 : 32,
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
    fontSize: 18,
    fontWeight: '800',
  },
});
