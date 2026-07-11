import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import PremiumSearchBar from '@/components/PremiumSearchBar';
import FamilyBanner from '@/components/FamilyBanner';
import CategoryGrid from '@/components/CategoryGrid';
import DirectoryHeader from '@/components/DirectoryHeader';
import DirectoryContent from '@/components/DirectoryContent';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Extracted sections
import HomeHeader from '@/components/HomeHeader';
import TopFogOverlay from '@/components/TopFogOverlay';
import RecommendedPlans from '@/components/RecommendedPlans';
import QuickActions from '@/components/QuickActions';
import WellnessForYou from '@/components/WellnessForYou';

const { width } = Dimensions.get('window');

const USER_NAME = 'Ananya';
const AVATAR_URL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
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

  return (
    <AnimatedScreen entrance="up">
      <View style={[styles.screen, { backgroundColor: isDark ? '#121212' : '#FDFDFD' }]}>
        <TopFogOverlay />
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          stickyHeaderIndices={[8]}
          bounces={false}
          overScrollMode="never"
        >
          
          {/* Location Header */}
          <HomeHeader currentCity={currentCity} avatarUrl={AVATAR_URL} />

          {/* Premium Search Bar */}
          <Animated.View entering={FadeInDown.delay(150)}>
            <PremiumSearchBar />
          </Animated.View>

          {/* Family Banner */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <FamilyBanner />
          </Animated.View>

          {/* Recommended Plans */}
          <RecommendedPlans />

          {/* Quick Actions */}
          <QuickActions />

          {/* Category Grid */}
          <Animated.View entering={FadeInDown.delay(450)}>
            <CategoryGrid />
          </Animated.View>

          {/* Wellness For You */}
          <WellnessForYou />

          {/* Directory Sticky Header */}
          <DirectoryHeader 
            activeTab={activeDirectoryTab} 
            onTabChange={setActiveDirectoryTab} 
            location="Bangalore" 
          />

          {/* Directory Content */}
          <DirectoryContent activeTab={activeDirectoryTab} />

        </ScrollView>
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
