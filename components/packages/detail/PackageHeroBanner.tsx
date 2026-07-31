import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Star } from 'lucide-react-native';

interface Props {
  image?: string;
  title?: string;
  discount?: string;
  rating?: string;
  bookedCount?: string;
  isDark: boolean;
  colors: any;
}

const DEFAULT_BANNER_IMAGE = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000';

export default function PackageHeroBanner({
  image = DEFAULT_BANNER_IMAGE,
  title,
  discount = '25% OFF',
  rating = '4.9',
  bookedCount = '1.2K+ Booked',
  isDark,
  colors,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: image || DEFAULT_BANNER_IMAGE }}
          style={styles.bannerImage}
          contentFit="cover"
        />

        {/* Discount Badge */}
        {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}</Text>
          </View>
        )}

        {/* Rating & Bookings Badge */}
        <View style={styles.ratingBadge}>
          <Star size={13} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.ratingText}>
            {rating} ({bookedCount})
          </Text>
        </View>
      </View>

      {/* Package Main Title */}
      {title && (
        <View style={styles.titleSection}>
          <Text style={[styles.packageTitle, { color: colors.text }]}>{title}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  imageWrapper: {
    height: 200,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  titleSection: {
    marginTop: 14,
    marginBottom: 4,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 26,
  },
});
