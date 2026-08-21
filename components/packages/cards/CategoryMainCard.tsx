import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { CategoryIndex } from '@/constants/package-data';
import { moderateScale } from '@/utils/responsive';

export interface CategoryMainCardProps {
  category: CategoryIndex;
  onPress?: () => void;
}

// Single uniform Kidney Care color gradient for all cards
const UNIFORM_KIDNEY_GRADIENT: [string, string, ...string[]] = ['#F0F9FF', '#E0F2FE', '#BAE6FD'];

export default function CategoryMainCard({ category, onPress }: CategoryMainCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/packages/category/${category.id}` as any);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && Platform.OS === 'ios' && { transform: [{ scale: 0.98 }], opacity: 0.9 }
      ]}
      android_ripple={{ color: 'rgba(0,0,0,0.04)', borderless: false }}
      onPress={handlePress}
    >
      <LinearGradient
        colors={UNIFORM_KIDNEY_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardGradient}
      >
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {category.title}
          </Text>
        </View>

        <View style={styles.btnWrapper}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="light" style={styles.btnGlass}>
              <ChevronRight size={16} color="#0284C7" />
            </BlurView>
          ) : (
            <View style={styles.btn}>
              <ChevronRight size={16} color="#0284C7" />
            </View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    minHeight: moderateScale(105, 0.3),
    height: moderateScale(115, 0.3),
    borderRadius: Platform.OS === 'android' ? 20 : 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(186, 230, 253, 0.4)',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingLeft: moderateScale(20, 0.3),
    paddingRight: moderateScale(56, 0.3),
    paddingVertical: 10,
    justifyContent: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: moderateScale(15.5, 0.2),
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0.3,
    lineHeight: moderateScale(21, 0.2),
  },
  btnWrapper: {
    position: 'absolute',
    right: 16,
    zIndex: 3,
    borderRadius: 16,
    overflow: 'hidden',
  },
  btnGlass: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
});
