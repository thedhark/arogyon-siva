import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Phone } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface Props {
  isDark?: boolean;
  style?: any;
}

function CalendarClockGraphic({ isDark }: { isDark: boolean }) {
  return (
    <View style={styles.graphicWrap}>
      <Svg width={72} height={58} viewBox="0 0 72 58" fill="none">
        {/* Soft leaf/bubble background element */}
        <Path
          d="M58 14 C67 18 68 32 58 40 C52 44 45 40 47 32 Z"
          fill={isDark ? 'rgba(52, 211, 153, 0.15)' : '#D1FAE5'}
        />

        {/* Calendar body */}
        <Rect
          x="6"
          y="10"
          width="44"
          height="38"
          rx="7"
          fill={isDark ? '#1E293B' : '#FFFFFF'}
          stroke={isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}
          strokeWidth="1.2"
        />

        {/* Calendar header bar */}
        <Path
          d="M6 16 C6 12.6863 8.68629 10 12 10 H44 C47.3137 10 50 12.6863 50 16 V20 H6 V16 Z"
          fill={isDark ? '#0F766E' : '#6EE7B7'}
        />

        {/* Calendar rings/pins */}
        <Rect x="13" y="6" width="3.5" height="7" rx="1.75" fill={isDark ? '#34D399' : '#0D9488'} />
        <Rect x="24" y="6" width="3.5" height="7" rx="1.75" fill={isDark ? '#34D399' : '#0D9488'} />
        <Rect x="35" y="6" width="3.5" height="7" rx="1.75" fill={isDark ? '#34D399' : '#0D9488'} />

        {/* Calendar grid dots */}
        <Rect x="12" y="24" width="4.5" height="4.5" rx="1" fill={isDark ? '#64748B' : '#CBD5E1'} />
        <Rect x="20" y="24" width="4.5" height="4.5" rx="1" fill={isDark ? '#64748B' : '#CBD5E1'} />
        <Rect x="28" y="24" width="4.5" height="4.5" rx="1" fill={isDark ? '#64748B' : '#CBD5E1'} />
        <Rect x="36" y="24" width="4.5" height="4.5" rx="1" fill={isDark ? '#64748B' : '#CBD5E1'} />

        <Rect x="12" y="32" width="4.5" height="4.5" rx="1" fill={isDark ? '#64748B' : '#CBD5E1'} />
        <Rect x="20" y="32" width="4.5" height="4.5" rx="1" fill={isDark ? '#64748B' : '#CBD5E1'} />
        <Rect x="28" y="32" width="4.5" height="4.5" rx="1" fill={isDark ? '#64748B' : '#CBD5E1'} />

        {/* Clock badge overlay on bottom-right */}
        <Circle
          cx="46"
          cy="38"
          r="12"
          fill={isDark ? '#064E3B' : '#ECFDF5'}
          stroke={isDark ? '#34D399' : '#065F46'}
          strokeWidth="2"
        />
        {/* Clock hands */}
        <Path
          d="M46 31 V38 L50 41"
          stroke={isDark ? '#34D399' : '#065F46'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

export default function PackageAssessmentCard({ isDark, style }: Props) {
  const theme = useTheme();
  const activeDark = isDark ?? theme.isDark;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: activeDark ? '#0D221D' : '#F0FDF9',
          borderColor: activeDark ? 'rgba(52, 211, 153, 0.2)' : '#CCFBF1',
        },
        style,
      ]}
    >
      {/* Left Icon: Phone in circle */}
      <View style={[styles.phoneIconCircle, { backgroundColor: activeDark ? '#064E3B' : '#065F46' }]}>
        <Phone size={18} color="#FFFFFF" fill="#FFFFFF" />
      </View>

      {/* Middle Text Info */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: activeDark ? '#34D399' : '#065F46' }]}>
          Important to know
        </Text>
        <Text style={[styles.bulletText, { color: activeDark ? '#E2E8F0' : '#1E293B' }]}>
          Our hospital coordinator will contact you.
        </Text>
        <Text style={[styles.bulletText, { color: activeDark ? '#E2E8F0' : '#1E293B' }]}>
          Dates and times can be scheduled as per you.
        </Text>
      </View>

      {/* Subtle Divider */}
      <View
        style={[
          styles.divider,
          { backgroundColor: activeDark ? 'rgba(52, 211, 153, 0.2)' : '#CCFBF1' },
        ]}
      />

      {/* Right Graphic: Calendar with Clock */}
      <CalendarClockGraphic isDark={activeDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  phoneIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  bulletText: {
    fontSize: 12,
    lineHeight: 16.5,
    fontWeight: '400',
  },
  divider: {
    width: 1,
    height: 44,
    marginHorizontal: 8,
  },
  graphicWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
