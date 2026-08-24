import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { resolveImageSource } from '@/utils/imageUtils';
import { useTheme } from '@/hooks/useTheme';
import { scale, moderateScale } from '@/utils/responsive';

export const PLAN_CARD_WIDTH = scale(110);
export const PLAN_CARD_HEIGHT = scale(164);

interface PlanCardProps {
  image: string;
  title: string;
  tag?: string;
  colors?: [string, string, ...string[]];
  categorySlug?: string;
  onPress?: () => void;
}

export default function PlanCard({ image, title, tag, colors = ['transparent', 'rgba(0, 0, 0, 0.75)'], categorySlug, onPress }: PlanCardProps) {
  const router = useRouter();
  const { colors: themeColors, isDark } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (categorySlug) {
      router.push(`/packages/category/${categorySlug}` as any);
    } else {
      router.push('/packages/category/pregnancy' as any);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.planCard,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
      onPress={handlePress}
    >
      <ImageBackground
        source={resolveImageSource(image)}
        style={styles.planCardImage}
        imageStyle={{ borderRadius: scale(20) }}
      >
        {tag ? (
          <View style={styles.planTagContainer}>
            <View style={styles.planTag}>
              <Text style={styles.planTagText}>{tag}</Text>
            </View>
          </View>
        ) : null}

        <LinearGradient colors={colors} style={styles.bottomGradient}>
          <Text style={styles.planCardTitle} numberOfLines={2}>
            {title}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  planCard: {
    width: PLAN_CARD_WIDTH,
    height: PLAN_CARD_HEIGHT,
    borderRadius: scale(20),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  planCardImage: {
    flex: 1,
    borderRadius: scale(20),
    overflow: 'hidden',
  },
  planTagContainer: {
    padding: scale(6),
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: scale(58),
    paddingHorizontal: scale(8),
    paddingBottom: scale(8),
    justifyContent: 'flex-end',
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
  },
  planTag: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignSelf: 'flex-start',
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    borderRadius: scale(6),
  },
  planTagText: {
    color: '#333',
    fontSize: moderateScale(8, 0.2),
    fontWeight: '800',
  },
  planCardTitle: {
    color: '#FFFFFF',
    fontSize: moderateScale(11.5, 0.2),
    fontWeight: '700',
    lineHeight: moderateScale(14.5, 0.2),
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});


