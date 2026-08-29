import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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

  const gradientColors: [string, string, ...string[]] = isDark
    ? ['#1E293B', '#1E293B']
    : ['#F0F9FF', '#E0F2FE'];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardContainer,
        {
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(186, 230, 253, 0.6)',
          backgroundColor: isDark ? '#1E293B' : '#F0F9FF',
        },
        pressed && Platform.OS === 'ios' && { transform: [{ scale: 0.985 }], opacity: 0.92 }
      ]}
      android_ripple={{ color: 'rgba(0,0,0,0.04)', borderless: false }}
      onPress={handlePress}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardGradient}
      >
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { color: isDark ? '#F1F5F9' : '#0F172A' },
            ]}
            numberOfLines={1}
          >
            {category.title}
          </Text>
        </View>

        <View style={styles.btnWrapper}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.btnGlass}>
              <ChevronRight size={15} color={isDark ? '#38BDF8' : '#0284C7'} />
            </BlurView>
          ) : (
            <View style={[styles.btn, { backgroundColor: isDark ? '#334155' : '#FFF' }]}>
              <ChevronRight size={15} color={isDark ? '#38BDF8' : '#0284C7'} />
            </View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    minHeight: moderateScale(60, 0.2),
    height: moderateScale(66, 0.2),
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  cardGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingLeft: moderateScale(16, 0.3),
    paddingRight: moderateScale(46, 0.3),
    paddingVertical: 8,
    justifyContent: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: moderateScale(15, 0.2),
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  btnWrapper: {
    position: 'absolute',
    right: 14,
    zIndex: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  btnGlass: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
