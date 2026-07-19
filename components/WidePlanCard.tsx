import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

interface Props {
  title: string;
  subtitle: string;
  duration: string;
  image: string;
  colors: [string, string, ...string[]];
}

export default function WidePlanCard({ title, subtitle, duration, image, colors }: Props) {
  const router = useRouter();

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && Platform.OS === 'ios' && { transform: [{ scale: 0.98 }], opacity: 0.9 }
      ]}
      android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }}
      onPress={() => router.push('/plan/1' as any)}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardGradient}
      >
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
          <Text style={styles.duration}>{duration}</Text>
        </View>
        
        <View style={styles.imageContainer}>
          <LinearGradient 
            colors={[colors[0], 'transparent']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 0.6, y: 0 }} 
            style={styles.imageGradientOverlay} 
          />
          <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
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
    height: 140,
    borderRadius: Platform.OS === 'android' ? 24 : 14, // M3 uses larger border radii
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Platform.OS === 'ios' ? 4 : 8 },
    shadowOpacity: Platform.OS === 'ios' ? 0.15 : 0.25,
    shadowRadius: Platform.OS === 'ios' ? 8 : 12,
    elevation: Platform.OS === 'android' ? 8 : 0,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: '#4a4a4a',
    fontWeight: '500',
    marginBottom: 16,
  },
  duration: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5c5c5c',
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
