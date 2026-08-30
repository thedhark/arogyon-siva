import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Heart, Share2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Defs, LinearGradient as SvgGradient, Stop, G } from 'react-native-svg';

interface Props {
  image?: any;
  title?: string;
  subtitle?: string;
  categoryBadge?: string;
  hospitalName?: string;
  isDark: boolean;
  colors: any;
  onBackPress?: () => void;
  onSharePress?: () => void;
  onBookmarkPress?: () => void;
  isBookmarked?: boolean;
}

function MedicalShieldGraphic({ isDark }: { isDark: boolean }) {
  return (
    <View style={styles.graphicContainer}>
      <Svg width={150} height={140} viewBox="0 0 150 140" fill="none">
        <Defs>
          {/* Silver/Chrome Rim Gradient */}
          <SvgGradient id="shieldRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="30%" stopColor="#E2E8F0" />
            <Stop offset="70%" stopColor="#94A3B8" />
            <Stop offset="100%" stopColor="#64748B" />
          </SvgGradient>

          {/* Deep Green Inner Shield Gradient */}
          <SvgGradient id="shieldFillGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <Stop offset="0%" stopColor="#0D9488" />
            <Stop offset="40%" stopColor="#0F766E" />
            <Stop offset="100%" stopColor="#064E3B" />
          </SvgGradient>

          {/* Subtle Shield Highlight */}
          <SvgGradient id="shieldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </SvgGradient>
        </Defs>

        {/* Background ECG Heartbeat Line */}
        <Path
          d="M0 72 H25 L32 58 L38 88 L46 36 L54 100 L62 60 L68 76 L74 72 H150"
          stroke={isDark ? 'rgba(52, 211, 153, 0.25)' : 'rgba(16, 185, 129, 0.35)'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3D Shield Drop Shadow & Rim */}
        <G transform="translate(36, 10)">
          {/* Outer Chrome Rim */}
          <Path
            d="M 12 8 Q 50 -2 88 8 Q 94 56 50 114 Q 6 56 12 8 Z"
            fill="url(#shieldRimGrad)"
          />

          {/* Inner Green Shield Body */}
          <Path
            d="M 17 13 Q 50 4 83 13 Q 88 53 50 107 Q 12 53 17 13 Z"
            fill="url(#shieldFillGrad)"
          />

          {/* Inner Highlight Layer */}
          <Path
            d="M 18 14 Q 50 6 82 14 Q 86 38 50 64 Q 14 38 18 14 Z"
            fill="url(#shieldHighlight)"
          />

          {/* 3D Bold White Medical Cross */}
          {/* Vertical Bar */}
          <Rect
            x="43"
            y="35"
            width="14"
            height="44"
            rx="3"
            fill="#FFFFFF"
          />
          {/* Horizontal Bar */}
          <Rect
            x="28"
            y="50"
            width="44"
            height="14"
            rx="3"
            fill="#FFFFFF"
          />
        </G>
      </Svg>
    </View>
  );
}

export default function PackageHeroBanner({
  title = 'Annual Diabetes Protection & Organ Shield Package',
  subtitle = 'Comprehensive diabetes care with organ protection, specialist consultation and continuous support.',
  categoryBadge,
  isDark,
  colors,
  onBackPress,
  onSharePress,
  onBookmarkPress,
  isBookmarked = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'ios' ? 44 : 20);

  const cleanTitle = (title || 'Annual Diabetes Protection & Organ Shield Package').replace(/^1\s*x\s*/i, '');
  
  // Derive badge if not provided
  const badgeText = categoryBadge || (
    cleanTitle.toLowerCase().includes('diabetes') ? 'DIABETES CARE' :
    cleanTitle.toLowerCase().includes('skin') || cleanTitle.toLowerCase().includes('derma') ? 'DERMA CARE' :
    cleanTitle.toLowerCase().includes('heart') || cleanTitle.toLowerCase().includes('cardiac') ? 'CARDIAC CARE' :
    cleanTitle.toLowerCase().includes('women') || cleanTitle.toLowerCase().includes('pregnancy') ? "WOMEN'S CARE" :
    'HEALTH PACKAGE'
  );

  const gradientColors = isDark
    ? ['#0A1D1A', '#0D2723', '#0F172A'] as const
    : ['#EBF8F5', '#E1F5EF', '#F8FAFC'] as const;

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={[styles.gradientBg, { paddingTop: topInset }]}>
        {/* Top Navigation Row */}
        <View style={styles.topActionsRow}>
          {/* Back Button (Solid White Circle) */}
          <TouchableOpacity style={styles.actionCircleBtn} onPress={onBackPress} activeOpacity={0.8}>
            <ChevronLeft size={20} color="#1E293B" />
          </TouchableOpacity>

          {/* Right Action Buttons */}
          <View style={styles.topRightBtns}>
            <TouchableOpacity style={styles.actionCircleBtn} onPress={onBookmarkPress} activeOpacity={0.8}>
              <Heart
                size={18}
                color={isBookmarked ? '#EF4444' : '#1E293B'}
                fill={isBookmarked ? '#EF4444' : 'none'}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCircleBtn} onPress={onSharePress} activeOpacity={0.8}>
              <Share2 size={18} color="#1E293B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Content Section: Left Title/Badge + Right 3D Shield Graphic */}
        <View style={styles.heroContentRow}>
          <View style={styles.textContent}>
            {/* Category Badge */}
            <View style={[styles.badgePill, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#E6F4EA' }]}>
              <Text style={[styles.badgeText, { color: isDark ? '#34D399' : '#047857' }]}>
                {badgeText}
              </Text>
            </View>

            {/* Package Title */}
            <Text style={[styles.packageTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              {cleanTitle}
            </Text>

            {/* Subtitle / Description */}
            {subtitle ? (
              <Text style={[styles.packageSubtitle, { color: isDark ? '#94A3B8' : '#475569' }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          {/* Right 3D Shield Graphic */}
          <MedicalShieldGraphic isDark={isDark} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  gradientBg: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    zIndex: 10,
  },
  topRightBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
    paddingRight: 10,
  },
  badgePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 8,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  packageTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  packageSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  graphicContainer: {
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
