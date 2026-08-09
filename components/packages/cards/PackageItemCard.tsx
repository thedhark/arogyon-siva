import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Plus, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

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
  ctaText?: string;
  layout?: 'horizontal' | 'vertical';
}

export default function PackageItemCard({
  item,
  onPress,
  ctaText = 'View package',
  layout = 'vertical',
}: PackageItemCardProps) {
  const { colors, isDark } = useTheme();
  const displayTitle = (item.title || '').replace(/^1\s*x\s*/i, '');

  if (layout === 'horizontal') {
    return (
      <TouchableOpacity
        style={[
          styles.horizontalCardContainer,
          {
            backgroundColor: isDark ? '#1C1929' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
          },
        ]}
        activeOpacity={0.88}
        onPress={() => onPress(item.id)}
      >
        {/* Left Rounded Thumbnail Image */}
        <View style={[styles.horizontalImageWrapper, { backgroundColor: isDark ? '#27272A' : '#F8FAFC' }]}>
          <Image
            source={{ uri: item.image }}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
        </View>

        {/* Middle Details Section */}
        <View style={styles.horizontalDetailsColumn}>
          <Text style={[styles.horizontalTitleText, { color: colors.text }]} numberOfLines={1}>
            {displayTitle}
          </Text>

          {item.subtitle ? (
            <Text style={[styles.horizontalSubtitleText, { color: isDark ? '#9CA3AF' : '#64748B' }]} numberOfLines={2}>
              {item.subtitle}
            </Text>
          ) : item.inclusions && item.inclusions.length > 0 ? (
            <Text style={[styles.horizontalSubtitleText, { color: isDark ? '#9CA3AF' : '#64748B' }]} numberOfLines={2}>
              {item.inclusions.join(' • ')}
            </Text>
          ) : null}

          {/* Price & Discount Row */}
          <View style={styles.horizontalPriceRow}>
            <Text style={styles.horizontalPriceHighlight}>{item.price}</Text>

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

        {/* Right Circular Plus Action Button */}
        <TouchableOpacity
          style={styles.actionBtnCircle}
          onPress={() => onPress(item.id)}
          activeOpacity={0.8}
        >
          <Plus size={18} color="#FFFFFF" strokeWidth={2.8} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  // Default Vertical Banner Layout (For Packages tab & Category screens)
  return (
    <TouchableOpacity
      style={[
        styles.verticalCard,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderColor: isDark ? '#2C2C2E' : '#EAEAEA',
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
        <Text style={[styles.verticalPackageTitle, { color: colors.text }]} numberOfLines={2}>
          {displayTitle}
        </Text>

        {/* Footer Row: Price Breakdown & Red Outlined View Package CTA */}
        <View style={styles.verticalCardFooter}>
          <View style={styles.priceColumn}>
            <Text style={[styles.verticalCurrentPrice, { color: colors.text }]}>{item.price}</Text>

            <View style={styles.subPriceRow}>
              {item.originalPrice ? (
                <Text style={styles.originalPriceText}>{item.originalPrice}</Text>
              ) : null}

              {item.discount ? (
                <View style={[styles.discountTag, { backgroundColor: isDark ? '#3B1E1E' : '#FEF2F2' }]}>
                  <Text style={styles.discountTagText}>{item.discount}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Red Outlined Pill Action Button */}
          <TouchableOpacity
            style={[
              styles.redOutlineBtn,
              { backgroundColor: isDark ? '#1E1E24' : '#FFFFFF' },
            ]}
            onPress={() => onPress(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.redOutlineBtnText}>{ctaText}</Text>
            <ChevronRight size={14} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Horizontal Layout Styles (Hospital Page)
  horizontalCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  horizontalImageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  horizontalDetailsColumn: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
    justifyContent: 'center',
  },
  horizontalTitleText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  horizontalSubtitleText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  horizontalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  horizontalPriceHighlight: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FF6B00',
    letterSpacing: -0.4,
  },
  actionBtnCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },

  // Vertical Layout Styles (Packages Module & Category Screens)
  verticalCard: {
    borderRadius: 20,
    borderWidth: 0,
    borderColor: 'transparent',
    marginVertical: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  verticalImageContainer: {
    width: '100%',
    height: 145,
    backgroundColor: '#E2E8F0',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  verticalCardBody: {
    padding: 14,
  },
  verticalPackageTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    lineHeight: 21,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  verticalCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  priceColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  verticalCurrentPrice: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  originalPriceText: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  discountTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountTagText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
  },
  redOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    flexShrink: 0,
  },
  redOutlineBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
});
