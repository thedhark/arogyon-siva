import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Share } from 'react-native';
import { Plus, ChevronRight, Bookmark, Share2, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';

export interface PackageItemCardData {
  id: string;
  title: string;
  subtitle?: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image: string;
  inclusions?: string[];
  hospitalName?: string;
}

interface PackageItemCardProps {
  item: PackageItemCardData;
  onPress: (id: string) => void;
  onAddPress?: (item: PackageItemCardData) => void;
  ctaText?: string;
  layout?: 'horizontal' | 'vertical';
  variant?: 'default' | 'hospital';
}

export default function PackageItemCard({
  item,
  onPress,
  onAddPress,
  ctaText,
  layout = 'vertical',
  variant = 'default',
}: PackageItemCardProps) {
  const { colors, isDark } = useTheme();
  const [isSaved, setIsSaved] = useState(false);
  const displayTitle = (item.title || '').replace(/^1\s*x\s*/i, '');
  const buttonLabel = ctaText ?? (layout === 'vertical' ? 'Book' : 'Book Package');

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${displayTitle} (${item.price}) on Arogyon!`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const isHospitalVariant = variant === 'hospital';
  const btnGradientColors = isHospitalVariant
    ? ['#9BF229', '#14CE65']
    : (isDark ? ['#2A2C33', '#16171B', '#0B0C0E'] : ['#1E293B', '#0F172A']);
  const btnTextColor = isHospitalVariant ? '#052E16' : '#FFFFFF';

  if (layout === 'horizontal') {
    return (
      <View
        style={[
          styles.horizontalZomatoCard,
          {
            backgroundColor: isDark ? '#1E1E24' : '#FFFFFF',
            borderColor: isDark ? '#27272A' : '#F1F5F9',
          },
        ]}
      >
        {/* Top Info Row: Left Details + Right Thumbnail Image */}
        <View style={styles.zomatoTopInfoRow}>
          {/* Left Content Column */}
          <View style={styles.zomatoLeftColumn}>
            {/* Item Category Indicator & Title */}
            <Text style={[styles.zomatoTitleText, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
              {displayTitle}
            </Text>

            {/* Description & ...more trigger */}
            <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(item.id)}>
              <Text style={[styles.zomatoDescText, { color: isDark ? '#9CA3AF' : '#64748B' }]} numberOfLines={2}>
                {item.subtitle || (item.inclusions ? item.inclusions.join(', ') : 'Comprehensive health checkup package with lab tests and specialist consultation.')}
                <Text style={styles.zomatoMoreText}> ...more</Text>
              </Text>
            </TouchableOpacity>

            {/* Price & Discount Row (Now below subtitle/description) */}
            <View style={styles.zomatoPriceRow}>
              <Text style={[styles.zomatoPriceText, { color: colors.text }]}>{item.price}</Text>

              {item.originalPrice ? (
                <Text style={styles.originalPriceText}>{item.originalPrice}</Text>
              ) : null}

              {item.discount ? (
                <View style={[styles.discountTag, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.18)' : '#FEF2F2' }]}>
                  <Text style={styles.discountTagText}>{item.discount}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Right Image Column */}
          <View style={styles.zomatoRightImageCol}>
            <View style={styles.zomatoImageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.zomatoThumbnailImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Bottom Baseline Action Row (Bookmark & Share on Left, ADD + & Customisable on Right in the EXACT SAME LINE as Bookmark!) */}
        <View style={styles.zomatoBottomActionRow}>
          {/* Left Action Icons: Bookmark & Share */}
          <View style={styles.zomatoLeftIcons}>
            <TouchableOpacity 
              style={[
                styles.zomatoIconCircle, 
                { borderColor: isDark ? '#333338' : '#E2E8F0', backgroundColor: isDark ? '#27272A' : '#FFFFFF' }
              ]} 
              onPress={() => setIsSaved(!isSaved)}
              activeOpacity={0.7}
            >
              <Bookmark 
                size={15} 
                color={isSaved ? '#E11D48' : (isDark ? '#CBD5E1' : '#475569')} 
                fill={isSaved ? '#E11D48' : 'none'} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.zomatoIconCircle, 
                { borderColor: isDark ? '#333338' : '#E2E8F0', backgroundColor: isDark ? '#27272A' : '#FFFFFF' }
              ]} 
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Share2 size={14} color={isDark ? '#CBD5E1' : '#475569'} />
            </TouchableOpacity>
          </View>

          {/* Right Action: ADD + Button in the EXACT SAME HORIZONTAL LINE as Bookmark! */}
          <View style={styles.zomatoRightAddWrapper}>
            <TouchableOpacity
              style={[
                styles.zomatoRowAddBtn,
                { backgroundColor: isDark ? '#2D1B28' : '#FFF5F7', borderColor: '#E11D48' }
              ]}
              onPress={() => onAddPress ? onAddPress(item) : onPress(item.id)}
              activeOpacity={0.82}
            >
              <Text style={styles.zomatoAddText}>BOOK</Text>
              <Plus size={14} color="#E11D48" strokeWidth={3} />
            </TouchableOpacity>
            <Text style={styles.zomatoCustomisableText}>customisable</Text>
          </View>
        </View>
      </View>
    );
  }

  // Default Vertical Banner Layout (For Packages tab & Category screens)
  return (
    <TouchableOpacity
      style={[
        styles.verticalCard,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
        },
      ]}
      activeOpacity={0.9}
      onPress={() => onPress(item.id)}
    >
      {/* Top Full-Width Cover Banner Image */}
      <View style={styles.verticalImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      {/* Card Content Body */}
      <View style={styles.verticalCardBody}>
        <View style={styles.verticalTitleWrapper}>
          <Text style={[styles.verticalPackageTitle, { color: colors.text }]} numberOfLines={2} ellipsizeMode="tail">
            {displayTitle}
          </Text>
        </View>

        {/* Footer Row: Price Breakdown & Reshaped Tactile Gradient Pill CTA */}
        <View style={styles.verticalCardFooter}>
          <View style={styles.priceColumn}>
            <Text style={[styles.verticalCurrentPrice, { color: colors.text }]} numberOfLines={1}>{item.price}</Text>

            <View style={styles.subPriceRow}>
              {item.originalPrice ? (
                <Text style={styles.originalPriceText} numberOfLines={1}>{item.originalPrice}</Text>
              ) : null}

              {item.discount ? (
                <View style={[styles.discountTag, { backgroundColor: isDark ? '#3B1E1E' : '#FEF2F2' }]}>
                  <Text style={styles.discountTagText}>{item.discount}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Reshaped Tactile Gradient Pill Action Button */}
          <TouchableOpacity
            style={[
              styles.reshapedPillBtn,
              isHospitalVariant && { shadowColor: '#14CE65', shadowOpacity: 0.35 },
            ]}
            onPress={() => onAddPress ? onAddPress(item) : onPress(item.id)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={btnGradientColors as [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.reshapedPillBtnGradient}
            >
              <Text style={[styles.reshapedPillBtnText, { color: btnTextColor }]}>{buttonLabel}</Text>
              <ChevronRight size={11} color={btnTextColor} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  horizontalZomatoCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  zomatoTopInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  zomatoLeftColumn: {
    flex: 1,
    paddingRight: 12,
  },
  zomatoRightImageCol: {
    width: 118,
    alignItems: 'center',
  },
  zomatoImageContainer: {
    width: '100%',
    height: 122,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  zomatoThumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  zomatoTitleText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.15,
    lineHeight: 21,
    marginBottom: 3,
  },

  zomatoPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 2,
    marginBottom: 4,
  },
  zomatoPriceText: {
    fontFamily: Fonts.semiBold,
    fontSize: 15.5,
    fontWeight: '600',
    letterSpacing: -0.15,
  },
  zomatoDescText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '400',
    marginBottom: 6,
  },
  zomatoMoreText: {
    fontFamily: Fonts.medium,
    fontWeight: '500',
    color: '#64748B',
  },
  zomatoBottomActionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  zomatoLeftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  zomatoIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zomatoRightAddWrapper: {
    alignItems: 'center',
    width: 118,
  },
  zomatoRowAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: 98,
    height: 34,
    borderRadius: 10,
    borderWidth: 1.5,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  zomatoAddText: {
    fontFamily: Fonts.bold,
    color: '#E11D48',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  zomatoCustomisableText: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 3,
  },
  verticalCard: {
    width: 174,
    height: 198,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    marginVertical: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    justifyContent: 'space-between',
  },
  verticalImageContainer: {
    width: '100%',
    height: 105,
    backgroundColor: '#E2E8F0',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  verticalCardBody: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: 'space-between',
  },
  verticalTitleWrapper: {
    marginBottom: 4,
  },
  verticalPackageTitle: {
    fontFamily: Fonts.bold,
    fontSize: 12.5,
    fontWeight: '700',
    lineHeight: 16,
    marginBottom: 2,
    letterSpacing: -0.15,
  },
  verticalCardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
  },
  priceColumn: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 2,
  },
  verticalCurrentPrice: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  originalPriceText: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '400',
  },
  discountTag: {
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
  },
  discountTagText: {
    fontFamily: Fonts.semiBold,
    color: '#EF4444',
    fontSize: 8.5,
    fontWeight: '700',
  },
  reshapedPillBtn: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    flexShrink: 0,
  },
  reshapedPillBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 7,
    paddingVertical: 4.5,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  reshapedPillBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
});
