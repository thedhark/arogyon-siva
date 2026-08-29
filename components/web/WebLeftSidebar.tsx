import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Grid, HeartPulse, Award, Sparkles } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Mask, Rect, Circle } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { useRouter, usePathname } from 'expo-router';

interface WebLeftSidebarProps {
  onLogoPress?: () => void;
  state?: any;
  navigation?: any;
}

const TAB_CONFIG = [
  { name: 'index', route: '/', label: 'Home', icon: Grid },
  { name: 'package', route: '/package', label: 'Packages', icon: HeartPulse },
  { name: 'experts', route: '/experts', label: 'Experts', icon: Award },
];

function PremiumLogoSmall() {
  return (
    <Svg width={40} height={20} viewBox="0 0 91 44">
      <Defs>
        <LinearGradient id="web-o-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#38BDF8" />
          <Stop offset="100%" stopColor="#2563EB" />
        </LinearGradient>
        <Mask id="web-heart-mask">
          <Rect width="91" height="44" fill="white" />
          <Path d="M 22 14 C 15 8, 7 13, 9 21 C 11 28, 19 33, 22 37 C 25 33, 33 28, 35 21 C 37 13, 29 8, 22 14 Z" fill="black" />
        </Mask>
        <LinearGradient id="web-n-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#3B82F6" />
          <Stop offset="100%" stopColor="#1D4ED8" />
        </LinearGradient>
      </Defs>
      <Circle cx="22" cy="22" r="22" fill="url(#web-o-grad)" mask="url(#web-heart-mask)" />
      <Path 
        d="M 52 39.5 V 22 A 15.5 15.5 0 0 1 83 22 V 39.5" 
        fill="none" 
        stroke="url(#web-n-grad)" 
        strokeWidth="9" 
        strokeLinecap="round" 
      />
    </Svg>
  );
}

export default function WebLeftSidebar({ onLogoPress }: WebLeftSidebarProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const getIsActive = (tabName: string) => {
    if (tabName === 'index') {
      return (
        pathname === '/' ||
        pathname === '/(tabs)' ||
        pathname === '/(tabs)/' ||
        pathname === '/(tabs)/index' ||
        pathname === ''
      );
    }
    if (tabName === 'package') {
      return pathname.includes('package') || pathname.includes('offer');
    }
    if (tabName === 'experts') {
      return pathname.includes('expert') || pathname.includes('doctor') || pathname.includes('hospital') || pathname.includes('care');
    }
    return false;
  };

  return (
    <View style={[
      styles.sidebarContainer,
      {
        left: 0,
        width: 260,
        backgroundColor: isDark ? '#121212' : '#FFFFFF',
        borderRightColor: isDark ? '#262626' : '#F0F2F5',
      }
    ]}>
      {/* Brand Header */}
      <TouchableOpacity 
        activeOpacity={0.85} 
        onPress={() => router.push('/' as any)}
        style={styles.brandSection}
      >
        <View style={styles.brandRow}>
          <Text style={[styles.brandTitle, { color: colors.text }]}>AROGYON</Text>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        </View>
        <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>Healthcare Platform</Text>
      </TouchableOpacity>

      {/* Navigation Links */}
      <View style={styles.navList}>
        {TAB_CONFIG.map((tab) => {
          const isFocused = getIsActive(tab.name);
          const isHovered = hoveredTab === tab.name;
          const Icon = tab.icon;

          const onPress = () => {
            router.push(tab.route as any);
          };

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={onPress}
              activeOpacity={0.8}
              {...({
                onMouseEnter: () => setHoveredTab(tab.name),
                onMouseLeave: () => setHoveredTab(null),
              } as any)}
              style={[
                styles.navItem,
                isFocused && {
                  backgroundColor: isDark ? 'rgba(20, 206, 101, 0.12)' : 'rgba(20, 206, 101, 0.1)',
                },
                !isFocused && isHovered && {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
                }
              ]}
            >
              <View style={[
                styles.iconContainer,
                isFocused && { backgroundColor: '#14ce65' }
              ]}>
                <Icon
                  size={20}
                  color={isFocused ? '#FFFFFF' : (isDark ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.6)')}
                  strokeWidth={isFocused ? 2.5 : 2}
                />
              </View>
              <Text style={[
                styles.navLabel,
                {
                  color: isFocused ? (isDark ? '#FFFFFF' : '#0F172A') : colors.textSecondary,
                  fontWeight: isFocused ? '800' : '600',
                }
              ]}>
                {tab.label}
              </Text>
              {isFocused && <View style={styles.activeBar} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* AI Assistant "ON" Launcher Button */}
      <View style={styles.footerSection}>
        <TouchableOpacity
          onPress={onLogoPress}
          activeOpacity={0.85}
          style={[
            styles.aiButton,
            {
              backgroundColor: isDark ? '#1E1E1E' : '#F8FAFC',
              borderColor: isDark ? '#333' : '#E2E8F0',
            }
          ]}
        >
          <View style={styles.aiLogoRow}>
            <PremiumLogoSmall />
            <View style={styles.aiTextCol}>
              <View style={styles.aiHeaderRow}>
                <Sparkles size={14} color="#38BDF8" />
                <Text style={[styles.aiTitle, { color: colors.text }]}>Arogyon AI</Text>
              </View>
              <Text style={[styles.aiSubtitle, { color: colors.textSecondary }]}>Ask health queries</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebarContainer: {
    width: 260,
    borderRightWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    ...(Platform.OS === 'web' ? {
      position: 'fixed',
      top: 0,
      bottom: 0,
      zIndex: 100,
    } : { flex: 1 }) as any,
  },
  brandSection: {
    paddingHorizontal: 12,
    marginBottom: 28,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  proBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  proBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  navList: {
    flex: 1,
    gap: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    position: 'relative',
    gap: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 15,
    letterSpacing: 0.2,
  },
  activeBar: {
    position: 'absolute',
    right: 8,
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: '#14ce65',
  },
  footerSection: {
    marginTop: 'auto',
    paddingTop: 16,
  },
  aiButton: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  aiLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiTextCol: {
    flex: 1,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  aiSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});
