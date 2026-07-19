import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Play } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export default function WellnessCard({ image, title, desc, bgColor }: any) {
  const { isDark, colors } = useTheme();
  return (
    <TouchableOpacity activeOpacity={1} style={[styles.wellnessCard, { backgroundColor: isDark ? colors.surfaceElevated : bgColor }]}>
      <View style={styles.wellnessContent}>
        <Text style={styles.wellnessTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.wellnessDesc} numberOfLines={2}>{desc}</Text>
        <View style={styles.playBtn}>
          <Play size={14} color="#1b5e55" fill="#1b5e55" style={{ marginLeft: 2 }} />
        </View>
      </View>
      <Image source={{ uri: image }} style={styles.wellnessImage} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wellnessCard: {
    width: 260,
    height: 120,
    borderRadius: 24, // M3 fully rounded
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
    overflow: 'hidden', // Ensure image clips
  },
  wellnessContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  wellnessTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333',
    marginBottom: 6,
  },
  wellnessDesc: {
    fontSize: 12,
    color: '#555',
    marginBottom: 12,
    lineHeight: 16,
  },
  playBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  wellnessImage: {
    width: 110,
    height: '100%',
  },
});
