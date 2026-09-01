import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { CategoryIndex } from '@/constants/package-data';
import { moderateScale } from '@/utils/responsive';
import { useTheme } from '@/hooks/useTheme';

export interface CategoryMainCardProps {
  category: CategoryIndex;
  onPress?: () => void;
}

export default function CategoryMainCard({ category, onPress }: CategoryMainCardProps) {
  const router = useRouter();
  const { isDark } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/packages/category/${category.id}` as any);
    }
  };

  const artwork = category.heroImage;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.shadowWrapper,
        pressed && Platform.OS === 'ios' && { transform: [{ scale: 0.985 }], opacity: 0.94 },
      ]}
      android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: false }}
      onPress={handlePress}
    >
      {/* Inner Clipped Card Container */}
      <View
        style={[
          styles.innerCard,
          {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(226, 232, 240, 0.95)',
            backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
          },
        ]}
      >
        {/* Full-bleed Banner Artwork */}
        <Image source={artwork} style={styles.artwork} resizeMode="cover" />

        {/* Floating Capsule Dock with Dedicated Shadow Layer for iOS */}
        <View style={styles.capsuleShadowWrap}>
          <View
            style={[
              styles.capsuleInner,
              {
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.90)' : 'rgba(255, 255, 255, 0.96)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.28)' : '#FFFFFF',
              },
            ]}
          >
            <BlurView
              intensity={Platform.OS === 'ios' ? 45 : 20}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />

            <Text
              style={[
                styles.title,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
              numberOfLines={1}
            >
              {category.title}
            </Text>

            <View
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isDark ? 'rgba(13, 148, 136, 0.3)' : '#F0FDFA',
                  borderColor: isDark ? 'rgba(45, 212, 191, 0.6)' : '#99F6E4',
                },
              ]}
            >
              <ArrowRight
                size={16}
                color={isDark ? '#2DD4BF' : '#0D9488'}
                strokeWidth={2.5}
              />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Outer shadow wrapper (NO overflow: 'hidden' so iOS shadows render with full depth)
  shadowWrapper: {
    width: '100%',
    height: moderateScale(285, 0.15),
    borderRadius: 26,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 5,
    backgroundColor: 'transparent',
  },
  // Inner clipped container (clips artwork to rounded corners)
  innerCard: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  artwork: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  // Capsule floating shadow container (NO overflow: 'hidden')
  capsuleShadowWrap: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    height: 64,
    borderRadius: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
    backgroundColor: 'transparent',
  },
  // Capsule inner clipped layout with frosted glass and borders
  capsuleInner: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    borderWidth: 1.5,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 12,
  },
  title: {
    flex: 1,
    fontSize: moderateScale(14.5, 0.2),
    fontWeight: '800',
    letterSpacing: 0.1,
    lineHeight: 20,
    includeFontPadding: false,
    marginRight: 14,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});



