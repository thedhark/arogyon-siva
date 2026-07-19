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
import FloatingBlurControl from '@/components/FloatingBlurControl';
import GlassTuner from '@/components/GlassTuner';
import { GlassView } from 'expo-glass-effect';
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

  const stickyY = insets.top + 56; // search bar height + padding

  const cloneStyle = useAnimatedStyle(() => {
    const isStuck = categoriesY > 0 && scrollY.value >= categoriesY - stickyY;
    return {
      opacity: isStuck ? 1 : 0,
      transform: [{ translateY: isStuck ? 0 : -9999 }],
    };
  });

  return (
    <AnimatedScreen entrance="up">
      <View style={[styles.screen, { backgroundColor: isDark ? '#121212' : '#FDFDFD' }]}>
        <FloatingBlurControl />
        <GlassTuner />
        <Animated.ScrollView 
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          stickyHeaderIndices={[1]}
          bounces={false}
          overScrollMode="never"
        >
          
          {/* Location Header */}
          <View style={{ marginBottom: -insets.top }}>
            <HomeHeader currentCity={currentCity} avatarUrl={AVATAR_URL} />
          </View>

          {/* Sticky Header Group: Search Only */}
          <View style={{ zIndex: 10, paddingTop: insets.top, marginHorizontal: -12 }}>
            <GlassView 
              glassEffectStyle="regular" 
              colorScheme={isDark ? 'dark' : 'light'} 
              style={StyleSheet.absoluteFill} 
            />
            
            <View style={{ paddingHorizontal: 12, paddingBottom: 8 }}>
              <Animated.View entering={FadeInDown.delay(150)}>
                <PremiumSearchBar />
              </Animated.View>
            </View>
            
            {/* Cloned Categories for Sticky Effect */}
            <Animated.View style={[cloneStyle, { 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              paddingBottom: 12
            }]}>
              <GlassView 
                glassEffectStyle="regular" 
                colorScheme={isDark ? 'dark' : 'light'} 
                style={StyleSheet.absoluteFill} 
              />
              <View style={{ paddingHorizontal: 12 }}>
                <ExploreCategories 
                  activeTab={activeDirectoryTab} 
                  onTabChange={setActiveDirectoryTab} 
                />
              </View>
            </Animated.View>
          </View>

          {/* Recommended Plans */}
          <RecommendedPlans />

          {/* Family Banner */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <FamilyBanner />
          </Animated.View>

          {/* Category Grid (Specialties) */}
          <Animated.View entering={FadeInDown.delay(300)}>
            <CategoryGrid />
          </Animated.View>

          {/* Wellness For You */}
          <WellnessForYou />

          {/* Explore Categories (Original) */}
          <View onLayout={(e) => setCategoriesY(e.nativeEvent.layout.y)} style={{ paddingBottom: 12 }}>
            <ExploreCategories 
              activeTab={activeDirectoryTab} 
              onTabChange={setActiveDirectoryTab} 
            />
          </View>

          {/* Explore Filters */}
          <ExploreFilters />

          {/* Directory Content */}
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
