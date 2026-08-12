import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Truck, Crown, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HospitalGoldFooterProps {
  onPress?: () => void;
  minOrderText?: string;
  isDark?: boolean;
}

export default function HospitalGoldFooter({
  onPress,
  minOrderText = 'Get FREE Home Pickup above ₹499 with',
  isDark: isDarkProp,
}: HospitalGoldFooterProps) {
  const theme = useTheme();
  const isDark = isDarkProp ?? theme.isDark;
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 8);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.container, { paddingBottom: bottomPadding }]}
    >
      <LinearGradient
        colors={
          isDark 
            ? ['#1E293B', '#0F172A'] 
            : ['#EFF6FF', '#E0F2FE', '#F0F7FF']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.bannerGradient,
          { borderTopColor: isDark ? 'rgba(59, 130, 246, 0.35)' : 'rgba(186, 230, 253, 0.9)' }
        ]}
      >
        {/* Left Icon Pill (Delivery / Express Scooter / Pickup) */}
        <View style={styles.iconCircle}>
          <Truck size={17} color="#2563EB" strokeWidth={2.2} />
        </View>

        {/* Text Details */}
        <View style={styles.textContainer}>
          <Text style={[styles.mainText, { color: isDark ? '#E2E8F0' : '#1E293B' }]} numberOfLines={1}>
            {minOrderText}{' '}
            <Text style={styles.goldHighlight}>GOLD</Text>
          </Text>
        </View>

        {/* Gold Crown Badge & Arrow */}
        <View style={styles.rightGoldBadge}>
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.badgeGradient}
          >
            <Crown size={11} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.badgeText}>GOLD</Text>
          </LinearGradient>
          <ChevronRight size={15} color={isDark ? '#94A3B8' : '#64748B'} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 90,
    backgroundColor: 'transparent',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 10,
  },
  bannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopWidth: 1.2,
    gap: 10,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
  },
  mainText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  goldHighlight: {
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  rightGoldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
});
