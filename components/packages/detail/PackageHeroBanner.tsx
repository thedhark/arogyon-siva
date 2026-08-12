import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Heart, Share2, CheckCircle2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  image?: string;
  title?: string;
  subtitle?: string;
  hospitalName?: string;
  isDark: boolean;
  colors: any;
  onBackPress?: () => void;
  onSharePress?: () => void;
  onBookmarkPress?: () => void;
  isBookmarked?: boolean;
}

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1000';

export default function PackageHeroBanner({
  image = DEFAULT_HERO_IMAGE,
  title = 'Comprehensive Health Package',
  subtitle = '',
  hospitalName = 'Arogyan Partner Hospital',
  isDark,
  colors,
  onBackPress,
  onSharePress,
  onBookmarkPress,
  isBookmarked = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'ios' ? 44 : 20);

  const cleanTitle = (title || 'Comprehensive Health Package').replace(/^1\s*x\s*/i, '');
  const displaySubtitle = subtitle && !subtitle.toLowerCase().includes('complete care. total peace of mind') ? subtitle : null;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: image || DEFAULT_HERO_IMAGE }}
        style={styles.heroBackground}
        imageStyle={styles.heroImageStyle}
        resizeMode="cover"
      >
        {/* Soft Dark Overlay Gradient for White Text Legibility */}
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.25)',
            'rgba(0, 0, 0, 0.15)',
            'rgba(0, 0, 0, 0.55)',
            'rgba(0, 0, 0, 0.80)',
          ]}
          locations={[0, 0.35, 0.7, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={[styles.bannerContent, { paddingTop: topInset }]}>
          {/* Top Navigation Row - All Solid White Circle Buttons */}
          <View style={styles.topActionsRow}>
            {/* Back Button (Solid White Circle) */}
            <TouchableOpacity style={styles.solidWhiteBtn} onPress={onBackPress} activeOpacity={0.8}>
              <ChevronLeft size={20} color="#1E293B" />
            </TouchableOpacity>

            {/* Right Action Buttons (Solid White Circles) */}
            <View style={styles.topRightBtns}>
              <TouchableOpacity style={styles.solidWhiteBtn} onPress={onBookmarkPress} activeOpacity={0.8}>
                <Heart
                  size={18}
                  color={isBookmarked ? '#EF4444' : '#1E293B'}
                  fill={isBookmarked ? '#EF4444' : 'none'}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.solidWhiteBtn} onPress={onSharePress} activeOpacity={0.8}>
                <Share2 size={18} color="#1E293B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Header Text Content */}
          <View style={styles.headerTextContainer}>
            {/* Partner Hospital Badge */}
            <View style={styles.hospitalBadge}>
              <Text style={styles.hospitalBadgeText}>{hospitalName}</Text>
              <CheckCircle2 size={16} color="#FFFFFF" fill="#3B82F6" />
            </View>

            {/* Main Package Title */}
            <Text style={styles.packageTitle}>{cleanTitle}</Text>

            {/* Subtitle */}
            {displaySubtitle ? (
              <Text style={styles.packageSubtitle}>{displaySubtitle}</Text>
            ) : null}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  heroBackground: {
    width: '100%',
    height: 300,
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  heroImageStyle: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 36,
    zIndex: 10,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  topRightBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  solidWhiteBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTextContainer: {
    marginTop: 'auto',
    zIndex: 10,
    marginBottom: 4,
  },
  hospitalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  hospitalBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.95,
  },
  packageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 32,
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  packageSubtitle: {
    fontSize: 13.5,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
});
