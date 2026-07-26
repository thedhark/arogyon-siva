import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MapPin as MapIcon, ChevronDown, Heart, Menu } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { BlurView } from 'expo-blur';
import { useAddressStore } from '@/hooks/useAddressStore';
import { useProfileStore } from '@/hooks/useProfileStore';

const DEFAULT_FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80';

export default function HomeHeader({ currentCity, avatarUrl }: { currentCity: string; avatarUrl?: string }) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const addresses = useAddressStore((state) => state.addresses);
  const profileAvatar = useProfileStore((state) => state.userProfile?.avatar);

  const displayAvatar = profileAvatar || avatarUrl || DEFAULT_FALLBACK_AVATAR;


  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
  let displayCity = currentCity;
  if (defaultAddr && defaultAddr.address) {
    const parts = defaultAddr.address.split(',');
    if (parts.length >= 2) {
      displayCity = parts.slice(-2).join(',').trim();
    } else {
      displayCity = defaultAddr.address.trim();
    }
  }

  return (
    <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
      {/* Left side: Location button */}
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => router.push('/location')}
        style={styles.leftGroup}
      >
        <View style={[styles.glassPillContainer, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)', borderWidth: StyleSheet.hairlineWidth }]}>
          <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          <View style={styles.glassPill}>
            <MapIcon size={14} color="#F43F5E" strokeWidth={3} />
            <Text style={[styles.locationText, { color: colors.text, marginLeft: 6, maxWidth: 180 }]} numberOfLines={1}>
              {displayCity}
            </Text>
            <ChevronDown size={14} color={colors.textSecondary} style={{ marginLeft: 4 }} />
          </View>
        </View>
      </TouchableOpacity>

      {/* Right side: Profile avatar */}
      <View style={styles.rightGroup}>
        <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push('/profile')}>
          <View style={[styles.avatarBackdrop, { backgroundColor: isDark ? '#333' : '#E2E8F0' }]} />
          <Image source={{ uri: displayAvatar }} style={styles.avatar} />
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
    marginBottom: 12,
    paddingHorizontal: 0,
    height: 44,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: -6,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  glassPillContainer: {
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  glassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    minWidth: 40,
    paddingLeft: 10,
    paddingRight: 14,
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

