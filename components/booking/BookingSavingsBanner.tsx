import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';

interface Props {
  savingsAmount?: number;
}

export default function BookingSavingsBanner({ savingsAmount = 155 }: Props) {
  const { isDark } = useTheme();

  const bgColor = isDark ? '#1E293B' : '#E0ECFF';
  const textColor = isDark ? '#93C5FD' : '#2563EB';

  // SVG wave paths for top and bottom scalloped ticket edges
  const waveTopPath = "M0,6 Q10,0 20,6 T40,6 T60,6 T80,6 T100,6 T120,6 T140,6 T160,6 T180,6 T200,6 T220,6 T240,6 T260,6 T280,6 T300,6 T320,6 T340,6 T360,6 T380,6 T400,6 L400,10 L0,10 Z";

  return (
    <View style={styles.outerContainer}>
      {/* Top Scalloped Wave */}
      <View style={styles.waveWrapper}>
        <Svg width="100%" height="8" viewBox="0 0 400 8" preserveAspectRatio="none">
          <Path d={waveTopPath} fill={bgColor} />
        </Svg>
      </View>

      {/* Main Banner Content */}
      <View style={[styles.bannerBody, { backgroundColor: bgColor }]}>
        <Text style={[styles.savingsText, { color: textColor }]}>
          🥳 You saved ₹{savingsAmount.toFixed(2)} on this booking!
        </Text>
      </View>

      {/* Bottom Scalloped Wave */}
      <View style={[styles.waveWrapper, styles.bottomWave]}>
        <Svg width="100%" height="8" viewBox="0 0 400 8" preserveAspectRatio="none">
          <Path d={waveTopPath} fill={bgColor} />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: 10,
    overflow: 'hidden',
    borderRadius: 16,
  },
  waveWrapper: {
    width: '100%',
    height: 8,
    overflow: 'hidden',
  },
  bottomWave: {
    transform: [{ rotate: '180deg' }],
  },
  bannerBody: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsText: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.1,
  },
});
