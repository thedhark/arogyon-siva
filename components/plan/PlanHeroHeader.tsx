import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 280; // Match hospital page header height

interface Props {
  scrollY: SharedValue<number>;
  image: string;
  title: string;
  subtitle: string;
}

export default function PlanHeroHeader({ scrollY, image, title, subtitle }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const imageAnimatedStyle = useAnimatedStyle(() => {
    // scrollY > 0 means user is scrolling down the page (content goes up).
    // To make the image scroll up slower than the content, translateY must be negative.
    const translateY = interpolate(scrollY.value, [-100, 0, HEADER_HEIGHT], [50, 0, -HEADER_HEIGHT * 0.5], Extrapolation.CLAMP);
    const scale = interpolate(scrollY.value, [-100, 0], [1.5, 1], Extrapolation.CLAMP);

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const textColor = isDark ? '#FFF' : '#111827';

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
        <Animated.Image source={{ uri: image }} style={styles.image} />
        {/* Top gradient to ensure text readability if image is dark at top */}
        <LinearGradient
          colors={isDark ? ['rgba(18,18,18,0.8)', 'rgba(18,18,18,0.2)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.3)', 'transparent']}
          style={styles.topGradient}
        />

        {/* Bottom gradient to seamlessly blend into the content body */}
        <LinearGradient
          colors={['transparent', isDark ? 'rgba(18,18,18,0.4)' : 'rgba(255,255,255,0.6)', isDark ? '#121212' : '#FFFFFF']}
          style={styles.bottomGradient}
        />
        
        <View style={[styles.textContent, { top: insets.top + 60 }]}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#4B5563' }]}>{subtitle}</Text>
          
          <View style={styles.ratingRow}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={[styles.ratingScore, { color: textColor }]}>4.8</Text>
            <Text style={[styles.reviewCount, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>(230 reviews)</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    // zIndex removed so it stays behind the ScrollView
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140, // Reduced from 250
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80, // Reduced from 150
  },
  textContent: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '700',
  },
  reviewCount: {
    fontSize: 14,
  }
});
