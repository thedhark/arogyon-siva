import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { HeartPulse, ShieldCheck, Activity } from 'lucide-react-native';

interface ExpertFooterProps {
  isDark?: boolean;
}

export default function ExpertFooter({ isDark = false }: ExpertFooterProps) {
  const strokeColor = isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <View style={styles.container}>
      {/* Hospital Skyline Line-Art Illustration */}
      <View style={styles.skylineWrapper}>
        <Svg width="100%" height="45" viewBox="0 0 360 45" fill="none">
          {/* Small left tree */}
          <Path d="M12 40 C12 32, 20 32, 20 40 M16 40 L16 45" stroke={strokeColor} strokeWidth="1.2" />
          <Path d="M30 38 C30 28, 42 28, 42 38 M36 38 L36 45" stroke={strokeColor} strokeWidth="1.2" />

          {/* Hospital Building Left */}
          <Rect x="52" y="15" width="45" height="30" stroke={strokeColor} strokeWidth="1.2" rx="2" fill="none" />
          <Path d="M74.5 20 V26 M71.5 23 H77.5" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
          <Rect x="58" y="29" width="6" height="6" stroke={strokeColor} strokeWidth="1" />
          <Rect x="68" y="29" width="6" height="6" stroke={strokeColor} strokeWidth="1" />
          <Rect x="78" y="29" width="6" height="6" stroke={strokeColor} strokeWidth="1" />

          {/* Center Small Clinic */}
          <Rect x="155" y="22" width="28" height="23" stroke={strokeColor} strokeWidth="1.2" rx="1" fill="none" />
          <Rect x="164" y="25" width="10" height="8" stroke={strokeColor} strokeWidth="1" />

          {/* Right Hospital Tower */}
          <Rect x="195" y="20" width="30" height="25" stroke={strokeColor} strokeWidth="1.2" rx="1" fill="none" />
          <Path d="M210 23 V27 M208 25 H212" stroke={strokeColor} strokeWidth="1.2" />

          {/* Ambulance vehicle */}
          <Rect x="242" y="32" width="30" height="10" stroke={strokeColor} strokeWidth="1.2" rx="2" fill="none" />
          <Path d="M260 32 V42" stroke={strokeColor} strokeWidth="1" />
          <Path d="M251 35 V39 M249 37 H253" stroke={strokeColor} strokeWidth="1.2" />

          {/* Right Trees */}
          <Path d="M295 38 C295 28, 307 28, 307 38 M301 38 L301 45" stroke={strokeColor} strokeWidth="1.2" />
          <Path d="M320 40 C320 33, 328 33, 328 40 M324 40 L324 45" stroke={strokeColor} strokeWidth="1.2" />

          {/* Baseline */}
          <Path d="M0 44.5 H360" stroke={strokeColor} strokeWidth="1" />
        </Svg>
      </View>

      {/* Trusted Healthcare Partners Divider */}
      <View style={styles.dividerRow}>
        <View style={[styles.line, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }]} />
        <Text style={[styles.poweredText, { color: textColor }]}>
          Trusted Healthcare Partners
        </Text>
        <View style={[styles.line, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }]} />
      </View>

      {/* Partner Logos Row */}
      <View style={styles.partnersRow}>
        {/* Partner 1: Apollo */}
        <View style={styles.partnerItem}>
          <HeartPulse size={16} color="#1E3A8A" strokeWidth={2.5} />
          <Text style={[styles.apolloText, { color: isDark ? '#60A5FA' : '#1E3A8A' }]}>Apollo</Text>
        </View>

        {/* Partner 2: MaxCare Badge */}
        <View style={[styles.maxBadge, { borderColor: isDark ? '#0D9488' : '#0F766E' }]}>
          <ShieldCheck size={13} color={isDark ? '#2DD4BF' : '#0F766E'} strokeWidth={2.2} />
          <Text style={[styles.maxText, { color: isDark ? '#2DD4BF' : '#0F766E' }]}>MaxCare</Text>
        </View>

        {/* Partner 3: Fortis */}
        <View style={styles.partnerItem}>
          <Activity size={16} color="#581C87" strokeWidth={2.5} />
          <Text style={[styles.fortisText, { color: isDark ? '#C084FC' : '#581C87' }]}>Fortis</Text>
        </View>
      </View>

      {/* Bottom Brand Mark */}
      <View style={styles.brandRow}>
        <Svg width="26" height="26" viewBox="0 0 36 36" fill="none">
          <Path
            d="M18 30 C18 30, 6 22, 6 14 C6 9.5 9.5 6 14 6 C16.5 6 18 7.5 18 7.5 C18 7.5 19.5 6 22 6 C26.5 6 30 9.5 30 14 C30 22, 18 30, 18 30 Z"
            fill="#0D9488"
          />
          <Path
            d="M18 25 C18 25, 10 18.5, 10 12.5 C10 9.5 12 7.5 15.5 7.5 C17 7.5 18 8.5 18 8.5 C18 8.5 19 7.5 20.5 7.5 C24 7.5 26 9.5 26 12.5 C26 18.5, 18 25, 18 25 Z"
            fill="#06B6D4"
          />
        </Svg>
        <Text style={[styles.brandTitle, { color: isDark ? '#0D9488' : '#0F766E' }]}>
          Arogyan Premium
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 16,
  },
  skylineWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    opacity: 0.75,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '85%',
    marginBottom: 14,
  },
  line: {
    flex: 1,
    height: 1,
  },
  poweredText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  partnersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 18,
  },
  partnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  apolloText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  maxBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  maxText: {
    fontSize: 12,
    fontWeight: '800',
  },
  fortisText: {
    fontSize: 14,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});
