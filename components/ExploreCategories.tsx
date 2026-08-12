import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { MEDICAL_ILLUSTRATIONS } from '@/constants/medical-illustrations';
import Animated, { 
  FadeInRight, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export const EXPLORE_CATEGORIES = [
  { id: 'Hospitals', label: 'Hospitals', image: MEDICAL_ILLUSTRATIONS.hospital },
  { id: 'Eye Care', label: 'Eye Care', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=200' },
  { id: 'Dental Care', label: 'Dental Care', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=200' },
  { id: 'Skin & Hair', label: 'Skin & Hair', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=200' },
  { id: 'Ayurveda', label: 'Ayurveda', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200' },
  { id: 'Women Care', label: 'Women Care', image: MEDICAL_ILLUSTRATIONS.pregnancy },
  { id: 'Mental Health', label: 'Mental Health', image: MEDICAL_ILLUSTRATIONS.rehab },
  { id: 'Physiotherapy', label: 'Physiotherapy', image: MEDICAL_ILLUSTRATIONS.physiotherapy },
  { id: 'Nutrition', label: 'Nutrition', image: MEDICAL_ILLUSTRATIONS.weightLoss },
  { id: 'Sleep', label: 'Sleep', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=200' },
];

const ITEM_WIDTH = 68;
const GAP = 8;
const PADDING_LEFT = 16;
const SLIDER_WIDTH = 48;
const SLIDER_OFFSET = (ITEM_WIDTH - SLIDER_WIDTH) / 2; // 10

export default function ExploreCategories({ activeTab, onTabChange, style }: { activeTab: string, onTabChange: (t: string) => void, style?: any }) {
  const { colors, isDark } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const activeIndex = Math.max(0, EXPLORE_CATEGORIES.findIndex(cat => cat.id === activeTab));
  
  const sliderPosition = useSharedValue(PADDING_LEFT + activeIndex * (ITEM_WIDTH + GAP) + SLIDER_OFFSET);

  useEffect(() => {
    const targetX = PADDING_LEFT + activeIndex * (ITEM_WIDTH + GAP) + SLIDER_OFFSET;
    sliderPosition.value = withSpring(targetX, {
      damping: 18,
      stiffness: 220,
      mass: 0.6,
    });
  }, [activeIndex]);

  const handlePress = (id: string, index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabChange(id);
    
    // Auto scroll into view
    const scrollTarget = Math.max(0, index * (ITEM_WIDTH + GAP) - 100);
    scrollViewRef.current?.scrollTo({ x: scrollTarget, animated: true });
  };

  const animatedSliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: sliderPosition.value }],
    };
  });

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        overScrollMode="never"
      >
        {/* Premium Animated Green Gradient Slider */}
        <Animated.View style={[styles.sliderTrack, animatedSliderStyle]}>
          <LinearGradient
            colors={['#34D399', '#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBar}
          />
        </Animated.View>

        {EXPLORE_CATEGORIES.map((cat, index) => {
          const isActive = activeTab === cat.id;
          return (
            <Animated.View key={cat.id} entering={FadeInRight.delay(index * 40)}>
              <TouchableOpacity 
                style={styles.categoryItem}
                onPress={() => handlePress(cat.id, index)}
                activeOpacity={0.75}
              >
                <View style={[
                  styles.imageContainer, 
                  isActive && styles.activeImageContainer,
                  { backgroundColor: isDark ? '#252528' : '#F3F4F6' }
                ]}>
                  <Image 
                    source={typeof cat.image === 'string' ? { uri: cat.image } : cat.image} 
                    style={styles.categoryImage} 
                    resizeMode="cover"
                  />
                </View>
                <Text 
                  numberOfLines={1}
                  style={[
                    styles.categoryLabel, 
                    { color: isActive ? '#10B981' : (isDark ? '#9CA3AF' : '#6B7280') },
                    isActive && styles.activeLabel
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'flex-start',
    position: 'relative',
    paddingBottom: 10,
  },
  sliderTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  gradientBar: {
    width: SLIDER_WIDTH,
    height: 4,
    borderRadius: 2,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 6,
    width: ITEM_WIDTH,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  activeImageContainer: {
    transform: [{ scale: 1.05 }],
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeLabel: {
    fontWeight: '800',
  }
});
