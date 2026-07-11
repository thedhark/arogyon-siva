import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';

interface TopCategoryCardProps {
  title: string;
  programs: string;
  image: string;
  onPress?: () => void;
}

export default function TopCategoryCard({ title, programs, image, onPress }: TopCategoryCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity style={styles.card} activeOpacity={1} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={isDark ? ['transparent', 'rgba(18,18,18,0.8)', '#121212'] : ['transparent', 'rgba(255,255,255,0.8)', '#ffffff']}
        locations={[0, 0.4, 1]}
        style={styles.gradientOverlay}
      >
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{programs}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '31%',
    height: 140,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  image: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '600',
  }
});
