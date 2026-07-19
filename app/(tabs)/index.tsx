import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import PremiumSearchBar from '@/components/PremiumSearchBar';
import FamilyBanner from '@/components/FamilyBanner';
import CategoryGrid from '@/components/CategoryGrid';
import DirectoryHeader from '@/components/DirectoryHeader';
import DirectoryContent from '@/components/DirectoryContent';
import Animated, { FadeInDown, useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';

// Extracted sections
import HomeHeader from '@/components/HomeHeader';
import TopFogOverlay from '@/components/TopFogOverlay';
import RecommendedPlans from '@/components/RecommendedPlans';
import WellnessForYou from '@/components/WellnessForYou';
import ExploreCategories from '@/components/ExploreCategories';
import ExploreFilters from '@/components/ExploreFilters';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { useGlass } from '@/contexts/GlassContext';

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
  const [categoriesY, setCategoriesY] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const supportsLiquidGlass = isLiquidGlassAvailable();
  const statusBarHeight = insets.top > 0 ? insets.top : 24;
  const categoriesTriggerPoint = categoriesY > 0 ? categoriesY - statusBarHeight : 99999;

  const categoriesStickyStyle = useAnimatedStyle(() => {
    const isStuck = categoriesY > 0 && scrollY.value >= categoriesTriggerPoint;
    const progress = interpolate(
      scrollY.value,
      [categoriesTriggerPoint - 20, categoriesTriggerPoint],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      marginHorizontal: interpolate(progress, [0, 1], [0, -12]),
      marginTop: isStuck ? statusBarHeight : 0,
      paddingTop: 12,
      paddingBottom: 12,
    };
  });

  const categoriesWrapperStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [categoriesTriggerPoint - 20, categoriesTriggerPoint],
      [0, 1],
      Extrapolation.CLAMP
    );
    
    let backgroundColor = 'transparent';
    if (supportsLiquidGlass || Platform.OS === 'ios') {
      backgroundColor = isDark ? `rgba(18,18,18,${progress * 0.2})` : `rgba(253,253,253,${progress * 0.2})`;
    } else {
      backgroundColor = isDark ? `rgba(30,30,30,${progress * 1})` : `rgba(255,255,255,${progress * 1})`;
    }

    return {
      borderRadius: interpolate(progress, [0, 1], [14, 0]),
      borderCurve: 'continuous',
      backgroundColor,
      borderWidth: StyleSheet.hairlineWidth * progress,
      borderColor: isDark ? `rgba(255,255,255,${progress * 0.15})` : `rgba(0,0,0,${progress * 0.08})`,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: progress * 4 },
      shadowOpacity: progress * 0.08,
      shadowRadius: progress * 10,
      elevation: progress * 6,
      overflow: 'hidden',
    };
  });

  const categoriesGlassStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [categoriesTriggerPoint - 20, categoriesTriggerPoint],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity: progress,
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
          
          {/* Index 0: Header & Search Bar (Not sticky, scrolls out naturally) */}
          <View style={{ marginBottom: 16 }}>
            <View style={{ marginBottom: 4 }}>
              <HomeHeader currentCity={currentCity} avatarUrl={AVATAR_URL} />
            </View>
            <Animated.View entering={FadeInDown.delay(150)}>
              <PremiumSearchBar />
            </Animated.View>
          </View>

          {/* Index 1: Recommended Plans */}
          <RecommendedPlans />

          {/* Index 2: Family Banner */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <FamilyBanner />
          </Animated.View>

          {/* Index 3: Category Grid (Specialties) */}
          <Animated.View entering={FadeInDown.delay(300)}>
            <CategoryGrid />
          </Animated.View>

          {/* Index 4: Wellness For You */}
          <WellnessForYou />

          {/* Index 5: Sticky Explore Categories & Filters */}
          <Animated.View 
            onLayout={(e) => {
              if (categoriesY === 0) setCategoriesY(e.nativeEvent.layout.y);
            }} 
            style={[categoriesStickyStyle, { zIndex: 10 }]}
          >
            <Animated.View style={categoriesWrapperStyle}>
              <Animated.View style={[StyleSheet.absoluteFill, categoriesGlassStyle]} pointerEvents="none">
                {supportsLiquidGlass && (
                  <GlassView glassEffectStyle="regular" colorScheme={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                )}
                {!supportsLiquidGlass && Platform.OS === 'ios' && (
                  <BlurView intensity={85} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                )}
              </Animated.View>
              <ExploreCategories 
                activeTab={activeDirectoryTab} 
                onTabChange={setActiveDirectoryTab} 
                style={{ marginBottom: 0, paddingVertical: 12 }}
              />
              <ExploreFilters style={{ marginBottom: 12 }} />
            </Animated.View>
          </Animated.View>

          {/* Index 7: Directory Content */}
          <DirectoryContent activeTab={activeDirectoryTab} />

        </Animated.ScrollView>
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 32,
  },
});
