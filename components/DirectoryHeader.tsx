import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Mask, Rect, Circle, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';

export const DIRECTORY_TABS = ['Hospitals', 'Rehabs'];

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  location: string;
}

export default function DirectoryHeader({ activeTab, onTabChange, location }: Props) {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FDFDFD' }]}>
      <View style={styles.headerTop}>
        <View style={styles.brandRow}>
          <Text style={[styles.brand, { color: '#2FA882' }]}>Arogy</Text>
          <View style={styles.logoContainer}>
            <Svg width={26} height={13} viewBox="0 0 88 44">
              <Defs>
                <LinearGradient id="o-grad-hdr" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#9bf229" />
                  <Stop offset="100%" stopColor="#14ce65" />
                </LinearGradient>
                <Mask id="heart-mask-hdr">
                  <Rect width="88" height="44" fill="white" />
                  <Path d="M 22 14 C 15 8, 7 13, 9 21 C 11 28, 19 33, 22 37 C 25 33, 33 28, 35 21 C 37 13, 29 8, 22 14 Z" fill="black" />
                </Mask>
                <LinearGradient id="n-grad-hdr" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#1ad561" />
                  <Stop offset="100%" stopColor="#009f68" />
                </LinearGradient>
              </Defs>
              <Circle cx="22" cy="22" r="22" fill="url(#o-grad-hdr)" mask="url(#heart-mask-hdr)" />
              <SvgText fill="url(#n-grad-hdr)" fontSize="68" fontWeight="800" x="48" y="44">n</SvgText>
            </Svg>
          </View>
        </View>
        <Text style={[styles.location, { color: colors.text }]}>{location}</Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        bounces={false}
        overScrollMode="never"
        style={styles.tabsScroll} 
        contentContainerStyle={styles.tabsContent}
      >
        {DIRECTORY_TABS.map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[
              styles.tab, 
              activeTab === tab ? styles.activeTab : { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }
            ]}
            onPress={() => onTabChange(tab)}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === tab ? '#fff' : colors.textMuted }
            ]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 16 : 8,
    paddingBottom: 12,
    zIndex: 100, // Important for sticky header
  },
  headerTop: {
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 4,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 1,
  },
  brand: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  location: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tabsScroll: {
    marginHorizontal: -12,
  },
  tabsContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#1b5e55',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  }
});
