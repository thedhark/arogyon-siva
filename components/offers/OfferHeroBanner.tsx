import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Polygon, G, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 270;

interface OfferHeroBannerProps {
  title?: string;
  subtitle?: string;
  discountText?: string;
  variant?: 'consultation' | 'package' | 'blue' | 'green' | 'red';
  onBack?: () => void;
}

export default function OfferHeroBanner({
  title = 'CONSULTATIONS AT',
  discountText = '50% OFF',
  subtitle = 'Top Specialist Doctors',
  variant = 'consultation',
  onBack,
}: OfferHeroBannerProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const topInset = Math.max(insets.top, Platform.OS === 'android' ? 24 : 44);

  const isGreen = variant === 'package' || variant === 'green';
  const isBlue = variant === 'consultation' || variant === 'blue';

  const baseColor = isBlue ? '#1E5AE6' : isGreen ? '#007A55' : '#E12B38';
  const rayColor = isBlue ? '#3B82F6' : isGreen ? '#10B981' : '#EE434F';
  const shadowColor = isBlue ? '#1E5AE6' : isGreen ? '#007A55' : '#E12B38';

  return (
    <View style={[styles.container, { shadowColor }]}>
      {/* Background Starburst SVG Graphic */}
      <View style={StyleSheet.absoluteFillObject}>
        <Svg width={width} height={BANNER_HEIGHT} viewBox={`0 0 ${width} ${BANNER_HEIGHT}`}>
          {/* Base Hospital Color Fill */}
          <Rect x="0" y="0" width={width} height={BANNER_HEIGHT} fill={baseColor} />

          {/* Starburst Explosion Rays */}
          <G fill={rayColor} opacity="0.95">
            {/* Multi-point explosive star burst centered in middle */}
            <Polygon
              points={`
                ${width * 0.5},${BANNER_HEIGHT * 0.5} 
                ${width * 0.5},0 
                ${width * 0.62},${BANNER_HEIGHT * 0.15} 
                ${width * 0.95},${BANNER_HEIGHT * 0.05} 
                ${width * 0.78},${BANNER_HEIGHT * 0.35} 
                ${width * 1.05},${BANNER_HEIGHT * 0.5} 
                ${width * 0.8},${BANNER_HEIGHT * 0.7} 
                ${width * 0.92},${BANNER_HEIGHT * 0.95} 
                ${width * 0.6},${BANNER_HEIGHT * 0.85} 
                ${width * 0.5},${BANNER_HEIGHT} 
                ${width * 0.38},${BANNER_HEIGHT * 0.85} 
                ${width * 0.08},${BANNER_HEIGHT * 0.95} 
                ${width * 0.22},${BANNER_HEIGHT * 0.68} 
                -10,${BANNER_HEIGHT * 0.48} 
                ${width * 0.2},${BANNER_HEIGHT * 0.32} 
                ${width * 0.05},${BANNER_HEIGHT * 0.08} 
                ${width * 0.38},${BANNER_HEIGHT * 0.15}
              `}
            />
          </G>
        </Svg>
      </View>

      {/* Floating Yellow Discount Coupon Left */}
      <View style={[styles.floatingCoupon, styles.couponLeft, { top: topInset + 38 }]}>
        <View style={styles.couponBody}>
          <Text style={styles.couponPercent}>%</Text>
          <View style={[styles.couponHoleLeft, { backgroundColor: baseColor }]} />
          <View style={[styles.couponHoleRight, { backgroundColor: baseColor }]} />
        </View>
      </View>

      {/* Floating Yellow Discount Coupon Right */}
      <View style={[styles.floatingCoupon, styles.couponRight, { top: topInset + 30 }]}>
        <View style={styles.couponBody}>
          <Text style={styles.couponPercent}>%</Text>
          <View style={[styles.couponHoleLeft, { backgroundColor: baseColor }]} />
          <View style={[styles.couponHoleRight, { backgroundColor: baseColor }]} />
        </View>
      </View>

      {/* Top Left Floating Back Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleBack}
        style={[styles.backButton, { top: topInset + 4 }]}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <ArrowLeft size={20} color="#333333" strokeWidth={2.4} />
      </TouchableOpacity>

      {/* Side Visual Left: 3D Doctor Consultation Plate */}
      <View style={styles.leftVisualContainer}>
        <Image
          source={require('@/assets/images/spotlight_doctor.jpg')}
          style={styles.plateImage}
          contentFit="cover"
        />
      </View>

      {/* Side Visual Right: 3D Healthcare Bowl Plate */}
      <View style={styles.rightVisualContainer}>
        <Image
          source={require('@/assets/images/spotlight_packages.jpg')}
          style={styles.plateImage}
          contentFit="cover"
        />
      </View>

      {/* Center 3D Big Typography Header */}
      <View style={[styles.centerContent, { paddingTop: topInset + 10 }]}>
        {/* Yellow 3D "ITEMS AT" text with extrusion/shadow */}
        <View style={styles.text3dContainer}>
          <Text style={styles.titleShadow}>{title}</Text>
          <Text style={styles.title3DLayer}>{title}</Text>
          <Text style={styles.titleFront}>{title}</Text>
        </View>

        {/* White 3D "50% OFF" text with dark outline & drop shadow */}
        <View style={[styles.text3dContainer, { marginTop: -2 }]}>
          <Text style={styles.discountShadow}>{discountText}</Text>
          <Text style={styles.discount3DLayer}>{discountText}</Text>
          <Text style={styles.discountFront}>{discountText}</Text>
        </View>

        {/* Subtitle Pill Badge */}
        <View style={styles.subtitlePill}>
          <Text style={styles.subtitleText}>{subtitle.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: BANNER_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#E12B38',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingCoupon: {
    position: 'absolute',
    zIndex: 10,
  },
  couponLeft: {
    left: 26,
    transform: [{ rotate: '-18deg' }],
  },
  couponRight: {
    right: 28,
    transform: [{ rotate: '22deg' }],
  },
  couponBody: {
    backgroundColor: '#FDD835',
    width: 32,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  couponPercent: {
    color: '#1E1E1E',
    fontWeight: '900',
    fontSize: 13,
    lineHeight: 14,
  },
  couponHoleLeft: {
    position: 'absolute',
    left: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E12B38',
  },
  couponHoleRight: {
    position: 'absolute',
    right: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E12B38',
  },
  leftVisualContainer: {
    position: 'absolute',
    left: -12,
    bottom: 12,
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
    zIndex: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  rightVisualContainer: {
    position: 'absolute',
    right: -10,
    bottom: 16,
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
    zIndex: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  plateImage: {
    width: '100%',
    height: '100%',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 12,
  },
  text3dContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleShadow: {
    position: 'absolute',
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 0.2,
    color: '#000000',
    top: 3.5,
    left: 2,
    textAlign: 'center',
  },
  title3DLayer: {
    position: 'absolute',
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 0.2,
    color: '#D49B00',
    top: 2,
    left: 1,
    textAlign: 'center',
  },
  titleFront: {
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 0.2,
    color: '#FFDF00',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 1,
  },
  discountShadow: {
    position: 'absolute',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
    color: '#000000',
    top: 5,
    left: 2,
    textAlign: 'center',
  },
  discount3DLayer: {
    position: 'absolute',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
    color: '#C2C2C2',
    top: 2,
    left: 1,
    textAlign: 'center',
  },
  discountFront: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  subtitlePill: {
    marginTop: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  subtitleText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
