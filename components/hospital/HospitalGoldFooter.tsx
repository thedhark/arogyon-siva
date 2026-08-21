import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Truck, Crown, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/theme';

interface HospitalGoldFooterProps {
  onPress?: () => void;
  title?: string;
  subtitle?: string;
  isDark?: boolean;
}

export default function HospitalGoldFooter({
  onPress,
  title = 'Get FREE Home Pickup above ₹499',
  subtitle = 'with AROGYON GOLD',
  isDark: isDarkProp,
}: HospitalGoldFooterProps) {
  const theme = useTheme();
  const isDark = isDarkProp ?? theme.isDark;
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom > 0 ? insets.bottom : Platform.OS === 'ios' ? 12 : 8;

  return (
    <View style={styles.wrapper}>
      {/* Background LinearGradient spanning entire bottom edge seamlessly */}
      <LinearGradient
        colors={
          isDark
            ? ['#0B132B', '#1C2541', '#0B132B']
            : ['#FFFBEB', '#FEF3C7', '#FDE68A']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradientContainer,
          {
            borderTopColor: isDark ? 'rgba(245, 158, 11, 0.4)' : '#FBBF24',
            paddingBottom: bottomPadding,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={onPress}
          style={styles.touchableContent}
        >
          {/* Left Icon Pill with Golden Accent Halo */}
          <View style={[styles.iconContainer, isDark && styles.iconContainerDark]}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconInner}
            >
              <Truck size={17} color="#FFFFFF" strokeWidth={2.4} />
            </LinearGradient>
          </View>

          {/* Text Container with Arogyon Branding */}
          <View style={styles.textContainer}>
            <View style={styles.topRow}>
              <Text
                style={[
                  styles.mainTitle,
                  { color: isDark ? '#F8FAFC' : '#1E293B' },
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>
            </View>
            <View style={styles.subRow}>
              <Text
                style={[
                  styles.subText,
                  { color: isDark ? '#94A3B8' : '#78350F' },
                ]}
                numberOfLines={1}
              >
                with <Text style={styles.brandHighlight}>AROGYON GOLD</Text>
              </Text>
            </View>
          </View>

          {/* Right Glowing Arogyon Gold VIP Badge */}
          <View style={styles.rightBadgeContainer}>
            <LinearGradient
              colors={['#F59E0B', '#B45309']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.badgePill}
            >
              <Crown size={12} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.badgePillText}>GOLD</Text>
              <ChevronRight size={13} color="#FFFFFF" strokeWidth={2.6} />
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 90,
    backgroundColor: 'transparent',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 12,
  },
  gradientContainer: {
    width: '100%',
    borderTopWidth: 1.5,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  touchableContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainerDark: {
    backgroundColor: '#1E293B',
  },
  iconInner: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainTitle: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  subText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    fontWeight: '600',
  },
  brandHighlight: {
    fontFamily: Fonts.bold,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.4,
  },
  rightBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 100,
    gap: 4,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  badgePillText: {
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
