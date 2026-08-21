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
        styles.outerContainer,
        {
          backgroundColor: isDark ? '#141A29' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#EDF2F9',
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
      <View style={styles.offerHeaderSection}>
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
      </View>

      {/* Two Split Action Cards */}
      <View style={styles.cardsRow}>
        {/* Left Card: Consultations */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#1D2538' : '#EEF4FE',
            },
          ]}
          onPress={() => router.push('/(tabs)/directory' as any)}
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
            <ArrowRight size={16} color="#3B82F6" strokeWidth={2.5} />
          </View>

          <Image
            source={require('@/assets/images/spotlight_doctor.jpg')}
            style={styles.doctorImage}
            contentFit="contain"
          />
        </TouchableOpacity>

        {/* Right Card: Packages */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#1D2538' : '#EEF4FE',
            },
          ]}
          onPress={() => router.push('/(tabs)/package' as any)}
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
              { backgroundColor: isDark ? '#2B354D' : '#FFFFFF' },
            ]}
          >
            <ArrowRight size={16} color="#3B82F6" strokeWidth={2.5} />
          </View>

          <Image
            source={require('@/assets/images/spotlight_packages.jpg')}
            style={styles.packagesImage}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 12,
    borderWidth: 1,
    shadowColor: '#0B2050',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  topLeftDecoration: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  topRightDecoration: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    zIndex: 1,
  },
  floatIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
  },
  dotLeft: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#93C5FD',
    marginLeft: 14,
    marginTop: 24,
  },
  dotRight: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#93C5FD',
    marginRight: 14,
    marginTop: 24,
  },
  offerHeaderSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  discountTitle: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
    lineHeight: 44,
  },
  capsuleBadge: {
    marginTop: 4,
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  capsuleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  card: {
    flex: 1,
    height: 148,
    borderRadius: 18,
    padding: 12,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  cardTextContent: {
    maxWidth: '56%',
    zIndex: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  doctorImage: {
    position: 'absolute',
    right: -10,
    bottom: -2,
    width: 96,
    height: 136,
    zIndex: 1,
  },
  packagesImage: {
    position: 'absolute',
    right: -6,
    bottom: 2,
    width: 86,
    height: 108,
    zIndex: 1,
  },
});
