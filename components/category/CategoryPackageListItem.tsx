import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ChevronRight, ShieldCheck, Tag } from 'lucide-react-native';
import { resolveImageSource } from '@/utils/imageUtils';

interface Props {
  image?: any;
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  onPress: () => void;
  colors: any;
  isDark: boolean;
}

export default function CategoryPackageListItem({
  image,
  title,
  price,
  originalPrice,
  discount,
  onPress,
  colors,
  isDark,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderColor: isDark ? '#2C2C2E' : '#E5E7EB',
          shadowColor: isDark ? '#000000' : '#1E293B',
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        {/* Left Image with Discount Tag */}
        <View style={styles.imageContainer}>
          <Image
            source={resolveImageSource(image, 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=200')}
            style={styles.packageImage}
            resizeMode="cover"
          />
          {discount && (
            <View style={styles.discountBadge}>
              <Tag size={10} color="#FFFFFF" />
              <Text style={styles.discountBadgeText}>{discount}</Text>
            </View>
          )}
        </View>

        {/* Right Info Section */}
        <View style={styles.infoSection}>
          {/* Title */}
          <Text style={[styles.packageTitle, { color: colors.text }]} numberOfLines={2}>
            {title}
          </Text>

          {/* Feature Highlight Pill */}
          <View style={styles.featureRow}>
            <ShieldCheck size={12} color="#10B981" />
            <Text style={[styles.featureText, { color: isDark ? '#9CA3AF' : '#64748B' }]}>
              Expert Doctor Verified
            </Text>
          </View>

          {/* Pricing & CTA Row */}
          <View style={styles.bottomRow}>
            <View style={styles.priceColumn}>
              <View style={styles.priceInline}>
                <Text
                  style={[styles.currentPrice, { color: colors.text }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                >
                  {price}
                </Text>
                {originalPrice && (
                  <Text style={[styles.originalPrice, { color: isDark ? '#6B7280' : '#94A3B8' }]} numberOfLines={1}>
                    {originalPrice}
                  </Text>
                )}
              </View>
            </View>

            <TouchableOpacity style={styles.viewBtn} onPress={onPress} activeOpacity={0.8}>
              <Text style={styles.viewBtnText}>View Details</Text>
              <ChevronRight size={13} color="#6366F1" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  packageImage: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  discountBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.92)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  infoSection: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 96,
  },
  packageTitle: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 19,
    letterSpacing: -0.1,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 2,
  },
  priceColumn: {
    justifyContent: 'flex-end',
  },
  priceInline: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  currentPrice: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 2,
  },
  viewBtnText: {
    color: '#6366F1',
    fontSize: 12,
    fontWeight: '700',
  },
});
