import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { resolveImageSource } from '@/utils/imageUtils';
import { scale, verticalScale } from '@/utils/responsive';

export interface WideCardTemplateProps {
  title: string;
  subtitle: string;
  badgeText: string;
  badgeColor?: string;
  image: any;
  colors: [string, string, ...string[]];
  categorySlug: string;
  onPress?: () => void;
}

export default function WideCardTemplate({
  title,
  subtitle,
  badgeText,
  badgeColor = '#0D9488',
  image,
  colors,
  categorySlug,
  onPress,
}: WideCardTemplateProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/packages/category/${categorySlug}` as any);
    }
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && Platform.OS === 'ios' && { transform: [{ scale: 0.98 }], opacity: 0.9 }
      ]}
      android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }}
      onPress={handlePress}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardGradient}
      >
        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <Sparkles size={11} color={badgeColor} />
            <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeText}</Text>
          </View>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
        </View>
        
        <View style={styles.imageContainer}>
          <LinearGradient 
            colors={[colors[0], 'transparent']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 0.6, y: 0 }} 
            style={styles.imageGradientOverlay} 
          />
          <Image source={resolveImageSource(image)} style={styles.image} contentFit="cover" />
        </View>

        <View style={styles.btnWrapper}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="light" style={styles.btnGlass}>
              <ChevronRight size={16} color="#000" />
            </BlurView>
          ) : (
            <View style={styles.btn}>
              <ChevronRight size={16} color="#000" />
            </View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    height: verticalScale(158),
    borderRadius: 22,
    marginBottom: 16,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
    zIndex: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#4a4a4a',
    fontWeight: '500',
  },
  imageContainer: {
    width: '48%',
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradientOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  }
});
