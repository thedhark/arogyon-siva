import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';

export default function SpotlightBanner() {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.outerShadowWrapper,
        {
          shadowOpacity: isDark ? 0.35 : 0.06,
        },
      ]}
    >
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: isDark ? '#151A26' : '#FFFFFF',
          },
        ]}
      >
        {/* 3D Frosted Float Icons in top corners */}
        <View style={styles.topLeftDecoration}>
          <Image
            source={require('@/assets/images/spotlight_heart_3d.jpg')}
            style={styles.floatIcon}
            contentFit="cover"
          />
          <View style={styles.dotLeft} />
        </View>

        <View style={styles.topRightDecoration}>
          <Image
            source={require('@/assets/images/spotlight_plus_3d.jpg')}
            style={styles.floatIcon}
            contentFit="cover"
          />
          <View style={styles.dotRight} />
        </View>

        {/* Center Discount Offer Headline */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/offers/consultations' as any)}
          style={styles.offerHeaderSection}
        >
          <Text
            style={[
              styles.discountTitle,
              { color: isDark ? '#FFFFFF' : '#0B1E48' },
            ]}
          >
            50% OFF
          </Text>

          <LinearGradient
            colors={['#5B92FC', '#427BF5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.capsuleBadge}
          >
            <Text style={styles.capsuleText}>UP TO ₹140</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Two Split Action Cards */}
        <View style={styles.cardsRow}>
          {/* Left Card: Consultations */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={[
              styles.card,
              {
                backgroundColor: isDark ? '#1E2536' : '#EDF3FE',
              },
            ]}
            onPress={() => router.push('/offers/consultations' as any)}
          >
            <View style={styles.cardTextContent}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDark ? '#FFFFFF' : '#0B1E48' },
                ]}
                numberOfLines={1}
              >
                Consultations
              </Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  { color: isDark ? '#94A3B8' : '#5A6E8D' },
                ]}
                numberOfLines={1}
              >
                Talk to Doctors
              </Text>
            </View>

            <View
              style={[
                styles.actionButton,
                { backgroundColor: isDark ? '#2B354D' : '#FFFFFF' },
              ]}
            >
              <ArrowRight size={13} color="#3B82F6" strokeWidth={2.5} />
            </View>

            <Image
              source={require('@/assets/images/spotlight_doctor.jpg')}
              style={styles.doctorImage}
              contentFit="contain"
            />
          </TouchableOpacity>

          {/* Right Card: Packages (Hospital Green) */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={[
              styles.card,
              {
                backgroundColor: isDark ? '#162822' : '#E8F8F2',
              },
            ]}
            onPress={() => router.push('/offers/packages' as any)}
          >
            <View style={styles.cardTextContent}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDark ? '#FFFFFF' : '#0B1E48' },
                ]}
                numberOfLines={1}
              >
                Packages
              </Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  { color: isDark ? '#94A3B8' : '#5A6E8D' },
                ]}
                numberOfLines={2}
              >
                Health Plans{'\n'}& More
              </Text>
            </View>

            <View
              style={[
                styles.actionButton,
                { backgroundColor: isDark ? '#223830' : '#FFFFFF' },
              ]}
            >
              <ArrowRight size={13} color="#00875A" strokeWidth={2.5} />
            </View>

            <Image
              source={require('@/assets/images/spotlight_packages.jpg')}
              style={styles.packagesImage}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerShadowWrapper: {
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
    backgroundColor: 'transparent',
  },
  cardContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  topLeftDecoration: {
    position: 'absolute',
    top: 10,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  topRightDecoration: {
    position: 'absolute',
    top: 10,
    right: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    zIndex: 1,
  },
  floatIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
  },
  dotLeft: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#93C5FD',
    marginLeft: 10,
    marginTop: 16,
  },
  dotRight: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#93C5FD',
    marginRight: 10,
    marginTop: 16,
  },
  offerHeaderSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  discountTitle: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
    lineHeight: 38,
  },
  capsuleBadge: {
    marginTop: 3,
    paddingHorizontal: 14,
    paddingVertical: 3.5,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  capsuleText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  card: {
    flex: 1,
    height: 118,
    borderRadius: 16,
    padding: 11,
    paddingBottom: 11,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  cardTextContent: {
    maxWidth: '58%',
    zIndex: 2,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 1,
  },
  cardSubtitle: {
    fontSize: 10.5,
    fontWeight: '500',
    lineHeight: 13,
  },
  actionButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  doctorImage: {
    position: 'absolute',
    right: -8,
    bottom: -1,
    width: 80,
    height: 108,
    zIndex: 1,
  },
  packagesImage: {
    position: 'absolute',
    right: -4,
    bottom: 2,
    width: 72,
    height: 88,
    zIndex: 1,
  },
});
