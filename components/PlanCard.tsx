import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { resolveImageSource } from '@/utils/imageUtils';
import { useTheme } from '@/hooks/useTheme';
import { scale, moderateScale } from '@/utils/responsive';

export const PLAN_CARD_WIDTH = scale(110);
export const PLAN_CARD_HEIGHT = scale(158);

interface PlanCardProps {
  image: any;
  title: string;
  tag?: string;
  colors?: [string, string, ...string[]];
  categorySlug?: string;
  onPress?: () => void;
}

export default function PlanCard({ image, title, tag, colors = ['transparent', 'rgba(0, 0, 0, 0.78)'], categorySlug, onPress }: PlanCardProps) {
  const router = useRouter();
  const { isDark } = useTheme();

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
      activeOpacity={0.88}
      style={[
        styles.planCard,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
      onPress={handlePress}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={resolveImageSource(image)}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={200}
        />

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
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  planCard: {
    width: PLAN_CARD_WIDTH,
    height: PLAN_CARD_HEIGHT,
    borderRadius: scale(12),
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
        shadowColor: '#000',
      },
    }),
  },
  imageWrapper: {
    flex: 1,
    borderRadius: scale(11),
    overflow: 'hidden',
    position: 'relative',
  },
  planTagContainer: {
    padding: scale(6),
    zIndex: 2,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: scale(64),
    paddingHorizontal: scale(8),
    paddingBottom: scale(8),
    justifyContent: 'flex-end',
    borderBottomLeftRadius: scale(11),
    borderBottomRightRadius: scale(11),
    zIndex: 2,
  },
  planTag: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignSelf: 'flex-start',
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    borderRadius: scale(5),
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



