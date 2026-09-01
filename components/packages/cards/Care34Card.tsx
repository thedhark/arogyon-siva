import React from 'react';
import { View, StyleSheet, Pressable, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { CategoryIndex } from '@/constants/package-data';
import { useTheme } from '@/hooks/useTheme';

export interface Care34CardProps {
  category: CategoryIndex;
  onPress?: () => void;
}

export default function Care34Card({ category, onPress }: Care34CardProps) {
  const router = useRouter();
  const { isDark } = useTheme();

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    if (onPress) {
      onPress();
    } else {
      router.push(`/packages/category/${category.id}` as any);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.shadowWrapper,
        pressed && Platform.OS === 'ios' && { transform: [{ scale: 0.985 }], opacity: 0.95 },
      ]}
      android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: false }}
      onPress={handlePress}
    >
      <View
        style={[
          styles.innerCard,
          {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(226, 232, 240, 0.95)',
            backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
          },
        ]}
      >
        <Image
          source={category.heroImage}
          style={styles.artwork}
          resizeMode="cover"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 28,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
    backgroundColor: 'transparent',
  },
  innerCard: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
});
