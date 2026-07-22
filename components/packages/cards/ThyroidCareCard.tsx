import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { MEDICAL_ILLUSTRATIONS } from '@/constants/medical-illustrations';

export interface CardProps {
  onPress?: () => void;
}

export default function ThyroidCareCard({ onPress }: CardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/packages/category/thyroid' as any);
    }
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && Platform.OS === 'ios' && { transform: [{ scale: 0.98 }], opacity: 0.9 }
      ]}
      android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: false }}
      onPress={handlePress}
    >
      <LinearGradient
        colors={['#FFF7ED', '#FFEDD5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardGradient}
      >
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>Thyroid & Hormonal Care</Text>
          <Text style={styles.subtitle} numberOfLines={2}>T3, T4, TSH panel & endocrinology guidance</Text>
        </View>
        
        <View style={styles.imageContainer}>
          <LinearGradient 
            colors={['#FFF7ED', 'transparent']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 0.6, y: 0 }} 
            style={styles.imageGradientOverlay} 
          />
          <Image source={{ uri: MEDICAL_ILLUSTRATIONS.thyroid }} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.btnWrapper}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="light" style={styles.btnGlass}>
              <ChevronRight size={16} color="#111" />
            </BlurView>
          ) : (
            <View style={styles.btn}>
              <ChevronRight size={16} color="#111" />
            </View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 135,
    borderRadius: Platform.OS === 'android' ? 22 : 16,
    marginBottom: 14,
    shadowColor: '#000',
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
    paddingHorizontal: 18,
    paddingVertical: 14,
    justifyContent: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: '#5a5a5a',
    fontWeight: '500',
    maxWidth: '85%',
  },
  imageContainer: {
    width: '45%',
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    borderTopLeftRadius: 60,
    borderBottomLeftRadius: 20,
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
