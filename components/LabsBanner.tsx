import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { scale, verticalScale } from '@/utils/responsive';

import { useTheme } from '@/hooks/useTheme';

// Native exact replica of Lenskart Double-Lens Logo from the user's HTML SVG
const LenskartLogo = () => (
  <View style={styles.logoContainer}>
    <View style={styles.lensOuter}>
      <View style={styles.lensInnerDot} />
    </View>
    <View style={[styles.lensOuter, { marginLeft: -7 }]}>
      <View style={styles.lensInnerDot} />
    </View>
  </View>
);

export default function LabsBanner() {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <View style={styles.wrapper}>
      {/* Main Banner Container */}
      <TouchableOpacity 
        activeOpacity={0.92} 
        style={styles.touchable}
        onPress={() => {
          router.push('/labs' as any);
        }}
      >
        <View style={styles.bannerContainer}>
          {/* Background Image Wrapper */}
          <View style={styles.imageBackgroundWrapper}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80' }} 
              style={styles.backgroundImage} 
              contentFit="cover" 
              contentPosition={{ top: '50%', left: '80%' }}
            />
            {/* Gradient Overlay for smooth blending into pure black background on left */}
            <LinearGradient
              colors={[
                'rgba(0, 0, 0, 1.0)', 
                'rgba(0, 0, 0, 0.95)', 
                'rgba(0, 0, 0, 0.7)', 
                'rgba(0, 0, 0, 0.2)', 
                'rgba(0, 0, 0, 0)'
              ]}
              locations={[0, 0.25, 0.45, 0.65, 0.85]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFillObject}
            />
          </View>

          {/* Content Container */}
          <View style={styles.contentContainer}>
            {/* Lenskart Logo Section */}
            <View style={styles.logoRow}>
              <LenskartLogo />
              <Text style={styles.brandName}>lenskart</Text>
            </View>

            {/* Main Heading: RUN FOR FRAME */}
            <View style={styles.headingRow}>
              <Text style={styles.headingWhite}>RUN </Text>
              <Text style={styles.headingOrange}>FOR </Text>
              <Text style={styles.headingWhite}>FRAME</Text>
            </View>

            {/* Subheading: COMPLETE STEP GOALS & GET A FREE FRAME* */}
            <View style={styles.subheadingContainer}>
              <Text style={styles.subheadingLine1}>COMPLETE STEP GOALS</Text>
              <Text style={styles.subheadingLine2}>& GET A FREE FRAME*</Text>
            </View>
          </View>

          {/* Terms and Conditions small text at bottom right */}
          <View style={styles.tcContainer}>
            <Text style={styles.tcText}>*T&C Apply</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Bottom Indicator Lines (placed below banner) */}
      <View style={styles.indicatorContainer}>
        <View style={[styles.indicatorBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB' }]} />
        <View style={[styles.indicatorBar, { backgroundColor: isDark ? '#60A5FA' : '#0B1A45' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 4,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 10,
  },
  indicatorBar: {
    height: 4,
    width: 44,
    borderRadius: 2,
  },
  touchable: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  bannerContainer: {
    width: '100%',
    height: verticalScale(131),
    backgroundColor: '#000000',
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#000000',
    position: 'relative',
    justifyContent: 'center',
  },
  imageBackgroundWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    position: 'relative',
    zIndex: 10,
    width: '68%',
    paddingLeft: 20,
    paddingRight: 6,
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  lensOuter: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  lensInnerDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
    backgroundColor: '#FFFFFF',
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.4,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  headingWhite: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.4,
    fontFamily: Platform.OS === 'ios' ? 'Montserrat' : 'sans-serif',
  },
  headingOrange: {
    color: '#F05845',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.4,
    fontFamily: Platform.OS === 'ios' ? 'Montserrat' : 'sans-serif',
  },
  subheadingContainer: {
    marginTop: 1,
  },
  subheadingLine1: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: -0.2,
    lineHeight: 14.5,
  },
  subheadingLine2: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: -0.2,
    lineHeight: 15.5,
  },
  tcContainer: {
    position: 'absolute',
    bottom: 10,
    right: 16,
    zIndex: 20,
  },
  tcText: {
    color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 8.5,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
});
