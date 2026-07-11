import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin as MapIcon } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export default function HomeHeader({ currentCity, avatarUrl }: { currentCity: string; avatarUrl: string }) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  return (
    <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
      <View style={styles.leftContent}>
        <View style={styles.locationContainer}>
          <MapIcon size={14} color="#10B981" strokeWidth={3} />
          <Text style={[styles.locationText, { color: colors.text }]}>{currentCity}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push('/profile')}>
        <View style={[styles.avatarBackdrop, { backgroundColor: isDark ? '#333' : '#E2E8F0' }]} />
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leftContent: {
    gap: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '800',
  },
  avatarContainer: {
    position: 'relative',
    width: 44,
    height: 52,
  },
  avatarBackdrop: {
    position: 'absolute',
    width: 44,
    height: 52,
    borderRadius: 14,
    transform: [{ rotate: '12deg' }],
  },
  avatar: {
    width: 44,
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FDFDFD',
  },
});
