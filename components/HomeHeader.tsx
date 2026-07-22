import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MapPin as MapIcon, Heart, Menu } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeHeader({ currentCity, avatarUrl }: { currentCity: string; avatarUrl: string }) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  return (
    <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
      {/* Left side: Location */}
      <View style={styles.leftGroup}>

        <View style={[styles.glassPillContainer, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)', borderWidth: StyleSheet.hairlineWidth }]}>
          <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          <View style={[styles.glassPill, { paddingHorizontal: 16 }]}>
            <MapIcon size={14} color="#10B981" strokeWidth={3} />
            <Text style={[styles.locationText, { color: colors.text, marginLeft: 6 }]}>{currentCity}</Text>
          </View>
        </View>
      </View>

      {/* Right side: Profile avatar */}
      <View style={styles.rightGroup}>
        <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push('/profile')}>
          <View style={[styles.avatarBackdrop, { backgroundColor: isDark ? '#333' : '#E2E8F0' }]} />
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  glassPillContainer: {
    borderRadius: 32, // Keep M3 fully rounded
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Premium white base
  },
  glassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    minWidth: 40,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '700',
  },
  avatarContainer: {
    position: 'relative',
    width: 44,
    height: 44,
  },
  avatarBackdrop: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 14,
    transform: [{ rotate: '12deg' }],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FDFDFD',
  },
});
