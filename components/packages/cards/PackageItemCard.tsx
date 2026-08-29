import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Share, Platform } from 'react-native';
import {
  Plus,
  ChevronRight,
  Bookmark,
  Share2,
  Bed,
  Baby,
  Headphones,
  Stethoscope,
  Activity,
  ShieldCheck,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import BookVisitSelector, { SelectedPatientInfo } from '@/components/booking/BookVisitSelector';

import { resolveImageSource } from '@/utils/imageUtils';
import { scale, verticalScale } from '@/utils/responsive';

export interface PackageItemCardData {
  id: string;
  title: string;
  subtitle?: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image: any;
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
  titleNumberOfLines?: number;
}

export default function PackageItemCard({
  item,
  onPress,
  onAddPress,
  ctaText,
  layout = 'vertical',
  variant = 'default',
  titleNumberOfLines,
}: PackageItemCardProps) {
  const { colors, isDark } = useTheme();
  const [isSaved, setIsSaved] = useState(false);
  const displayTitle = (item.title || '').replace(/^1\s*x\s*/i, '');
  const buttonLabel = ctaText ?? 'ADD';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${displayTitle} (${item.price}) on Arogyon!`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getPackageFeatureTags = () => {
    const lower = displayTitle.toLowerCase();
    if (lower.includes('maternity') || lower.includes('pregnancy') || lower.includes('delivery')) {
      return {
        tags: [
          { label: 'Private\nSuite', icon: Bed, color: '#E11D48', bg: '#FFF1F2' },
          { label: 'Pediatrician\nSupport', icon: Baby, color: '#EA580C', bg: '#FFF7ED' },
          { label: '24×7\nSupport', icon: Headphones, color: '#7C3AED', bg: '#F5F3FF' },
        ],
        moreCount: 8,
      };
    }
    if (lower.includes('cardiac') || lower.includes('heart')) {
      return {
        tags: [
          { label: 'Senior\nDoctor', icon: Stethoscope, color: '#E11D48', bg: '#FFF1F2' },
          { label: 'Echo &\nTMT', icon: Activity, color: '#EA580C', bg: '#FFF7ED' },
          { label: '24×7\nSupport', icon: Headphones, color: '#7C3AED', bg: '#F5F3FF' },
        ],
        moreCount: 6,
      };
    }
    if (lower.includes('knee') || lower.includes('surgery') || lower.includes('ortho')) {
      return {
        tags: [
          { label: 'Private\nRoom', icon: Bed, color: '#E11D48', bg: '#FFF1F2' },
          { label: 'Physio\nTherapy', icon: Activity, color: '#EA580C', bg: '#FFF7ED' },
          { label: '24×7\nSupport', icon: Headphones, color: '#7C3AED', bg: '#F5F3FF' },
        ],
        moreCount: 6,
      };
    }
    return {
      tags: [
        { label: 'Senior\nDoctor', icon: Stethoscope, color: '#E11D48', bg: '#FFF1F2' },
        { label: 'All Lab\nTests', icon: ShieldCheck, color: '#EA580C', bg: '#FFF7ED' },
        { label: '24×7\nSupport', icon: Headphones, color: '#7C3AED', bg: '#F5F3FF' },
      ],
      moreCount: item.inclusions ? Math.max(5, item.inclusions.length) : 8,
    };
  };

  const featureHighlights = getPackageFeatureTags();

  if (layout === 'horizontal') {
    const isHospital = variant === 'hospital';
    return (
      <View
        style={[
          styles.horizontalZomatoCard,
          isHospital
            ? styles.hospitalHorizontalCard
            : {
                backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
              },
        ]}
      >
        {/* Top Info Row: Left Thumbnail Image + Right Details */}
        <View style={styles.zomatoTopInfoRow}>
          {/* Left Image Column */}
          <View style={styles.zomatoLeftImageCol}>
            <TouchableOpacity
              style={styles.zomatoImageContainer}
              activeOpacity={0.88}
              onPress={() => onPress(item.id)}
            >
              <Image
                source={resolveImageSource(item.image)}
                style={styles.zomatoThumbnailImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          {/* Right Content Column */}
          <View style={styles.zomatoRightContentCol}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => onPress(item.id)}
            >
              {/* Item Title */}
              <Text
                style={[styles.zomatoTitleText, { color: colors.text }]}
                numberOfLines={titleNumberOfLines ?? 2}
                ellipsizeMode="tail"
              >
                {displayTitle}
              </Text>

              {/* Feature / Highlight Tags Row */}
              <View style={styles.highlightTagsRow}>
                {featureHighlights.tags.map((h, idx) => {
                  const IconComp = h.icon;
                  return (
                    <View key={idx} style={styles.tagItemCol}>
                      <View
                        style={[
                          styles.tagIconBox,
                          { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : h.bg },
                        ]}
                      >
                        <IconComp size={15} color={h.color} />
                      </View>
                      <Text
                        style={[styles.tagItemLabel, { color: isDark ? '#9CA3AF' : '#475569' }]}
                        numberOfLines={2}
                      >
                        {h.label}
                      </Text>
                    </View>
                  );
                })}

                {/* +X more Box */}
                <View
                  style={[
                    styles.tagMoreBox,
                    {
                      borderColor: isDark ? '#3F3F46' : '#E2E8F0',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                    },
                  ]}
                >
                  <Text
                    style={[styles.tagMoreCountText, { color: isDark ? '#F4F4F5' : '#1E293B' }]}
                  >
                    +{featureHighlights.moreCount}
                  </Text>
                  <Text
                    style={[styles.tagMoreLabelText, { color: isDark ? '#A1A1AA' : '#64748B' }]}
                  >
                    more
                  </Text>
                </View>
              </View>

              {/* Price & Discount Row */}
              <View style={styles.zomatoPriceRow}>
                <Text
                  style={[styles.zomatoPriceText, { color: colors.text }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                >
                  {item.price}
                </Text>

                {item.originalPrice ? (
                  <Text style={styles.originalPriceText} numberOfLines={1}>
                    {item.originalPrice}
                  </Text>
                ) : null}

                {item.discount ? (
                  <View
                    style={[
                      styles.discountTag,
                      { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.18)' : '#FEF2F2' },
                    ]}
                  >
                    <Text style={styles.discountTagText} numberOfLines={1}>{item.discount}</Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Actions Row: Left Bookmark/Share Box Buttons + Right Book Button */}
        <View style={styles.cardBottomActionsRow}>
          <View style={styles.leftActionButtons}>
            <TouchableOpacity
              style={[
                styles.actionBoxBtn,
                {
                  backgroundColor: isDark ? '#27272A' : '#FFFFFF',
                  borderColor: isDark ? '#3F3F46' : '#E2E8F0',
                },
              ]}
              onPress={() => setIsSaved(!isSaved)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Bookmark
                size={17}
                color={isSaved ? '#E11D48' : (isDark ? '#9CA3AF' : '#64748B')}
                fill={isSaved ? '#E11D48' : 'none'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBoxBtn,
                {
                  backgroundColor: isDark ? '#27272A' : '#FFFFFF',
                  borderColor: isDark ? '#3F3F46' : '#E2E8F0',
                },
              ]}
              onPress={handleShare}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Share2 size={17} color={isDark ? '#9CA3AF' : '#64748B'} />
            </TouchableOpacity>
          </View>

          {/* Right Action Button */}
          <View style={styles.rightActionBtnWrapper}>
            <BookVisitSelector
              buttonLabel={buttonLabel}
              onBookPress={(patient) => {
                if (onAddPress) onAddPress({ ...item, assignedPatient: patient } as any);
              }}
              onCountChange={(count, patient) => {
                if (count > 0 && onAddPress) {
                  onAddPress({ ...item, assignedPatient: patient, quantity: count } as any);
                }
              }}
            />
          </View>
        </View>

        {isHospital && (
          <View
            style={[
              styles.minimalDividerWithBreaks,
              { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' },
            ]}
          />
        )}
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
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
      activeOpacity={0.92}
      onPress={() => onPress(item.id)}
    >
      {/* Top Cover Banner Image */}
      <View style={styles.verticalImageContainer}>
        <Image
          source={resolveImageSource(item.image)}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        {item.discount ? (
          <View style={styles.topImageDiscountBadge}>
            <Text style={styles.topImageDiscountText}>{item.discount}</Text>
          </View>
        ) : null}
      </View>

      {/* Card Content Body - Framed seamlessly with the card container */}
      <View style={styles.verticalCardBody}>
        <View style={styles.verticalTitleWrapper}>
          <Text
            style={[styles.verticalPackageTitle, { color: isDark ? '#F1F5F9' : '#1E293B' }]}
            numberOfLines={titleNumberOfLines ?? 2}
            ellipsizeMode="tail"
          >
            {displayTitle}
          </Text>
        </View>

        {/* Footer Row: Price Breakdown & Hospital-Consistent BookVisitSelector Button */}
        <View style={styles.verticalCardFooter}>
          <View style={styles.priceColumn}>
            <Text
              style={[styles.verticalCurrentPrice, { color: colors.text }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {item.price}
            </Text>

            {item.originalPrice ? (
              <Text style={styles.verticalOriginalPriceText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
                {item.originalPrice}
              </Text>
            ) : null}
          </View>

          {/* Hospital-Consistent BookVisitSelector ADD Button */}
          <View style={styles.verticalActionBtnWrapper}>
            <BookVisitSelector
              buttonLabel={buttonLabel}
              compact
              onBookPress={(patient) => {
                if (onAddPress) onAddPress({ ...item, assignedPatient: patient } as any);
              }}
              onCountChange={(count, patient) => {
                if (count > 0 && onAddPress) {
                  onAddPress({ ...item, assignedPatient: patient, quantity: count } as any);
                }
              }}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  horizontalZomatoCard: {
    borderRadius: scale(12),
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  hospitalHorizontalCard: {
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 0,
  },
  minimalDividerWithBreaks: {
    height: 1,
    marginHorizontal: 16,
    marginTop: 14,
  },
  zomatoTopInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  zomatoLeftImageCol: {
    width: scale(163),
    alignItems: 'center',
    position: 'relative',
  },
  zomatoImageContainer: {
    width: '100%',
    height: verticalScale(156),
    borderRadius: scale(10),
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  zomatoThumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(9),
  },
  zomatoRightContentCol: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: 'space-between',
  },
  zomatoTitleText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.15,
    lineHeight: 22,
    marginBottom: 6,
  },
  highlightTagsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  tagItemCol: {
    alignItems: 'center',
    width: 44,
  },
  tagIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  tagItemLabel: {
    fontSize: 9,
    fontFamily: Fonts.medium,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 11.5,
  },
  tagMoreBox: {
    width: 34,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tagMoreCountText: {
    fontSize: 11.5,
    fontFamily: Fonts.bold,
    fontWeight: '800',
  },
  tagMoreLabelText: {
    fontSize: 8.5,
    fontFamily: Fonts.regular,
    marginTop: 1,
  },
  zomatoPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 7,
    marginTop: 6,
    flexWrap: 'nowrap',
  },
  originalPriceText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  discountTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountTagText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    color: '#E11D48',
  },
  cardDivider: {
    height: 1,
    borderTopWidth: 1,
    marginVertical: 12,
  },
  cardBottomActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  leftActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tagPill: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderRadius: 8,
    width: '31%',
    gap: 3,
  },
  tagIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontFamily: Fonts.medium,
    fontSize: 9.5,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 11.5,
  },
  zomatoPricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  zomatoPriceCol: {
    flex: 1,
  },
  zomatoPriceText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  zomatoOriginalPriceText: {
    fontFamily: Fonts.regular,
    fontSize: 11.5,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '400',
    marginTop: 1,
  },
  zomatoDiscountTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 2,
  },
  zomatoDiscountText: {
    fontFamily: Fonts.bold,
    color: '#EF4444',
    fontSize: 9.5,
    fontWeight: '700',
  },
  zomatoBottomActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  zomatoActionLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBoxBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightActionBtnWrapper: {
    width: scale(163),
    alignItems: 'center',
  },
  verticalCard: {
    width: '100%',
    marginVertical: 4,
    borderRadius: scale(12),
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  verticalImageContainer: {
    width: '100%',
    height: verticalScale(120),
    position: 'relative',
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: scale(11),
    borderTopRightRadius: scale(11),
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: scale(11),
    borderTopRightRadius: scale(11),
  },
  topImageDiscountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(225, 29, 72, 0.92)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  topImageDiscountText: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  verticalCardBody: {
    padding: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },
  verticalTitleWrapper: {
    marginBottom: 8,
    minHeight: 38,
    justifyContent: 'center',
  },
  verticalPackageTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 18.5,
  },
  verticalCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  priceColumn: {
    flex: 1,
    minWidth: 0,
    paddingRight: 4,
    justifyContent: 'center',
  },
  verticalCurrentPrice: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  verticalOriginalPriceText: {
    fontFamily: Fonts.regular,
    fontSize: 10.5,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '400',
    marginTop: 1,
  },
  verticalActionBtnWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
