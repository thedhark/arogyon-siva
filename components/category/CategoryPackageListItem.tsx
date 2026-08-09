import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface Props {
  image?: string;
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
    <View
      style={[
        styles.verticalPackageCard,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderColor: 'transparent',
        },
      ]}
    >
      <View style={styles.cardRow}>
        {/* Image */}
        <Image
          source={{
            uri:
              image ||
              'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=200',
          }}
          style={styles.verticalPackageImage}
          resizeMode="cover"
        />

        {/* Content */}
        <View style={styles.verticalPackageContent}>
          <Text style={[styles.packageTitle, { color: colors.text }]} numberOfLines={2}>
            {title}
          </Text>

          {/* Price & View Package Action Row */}
          <View style={styles.priceAndActionRow}>
            <View style={styles.priceLeft}>
              <Text style={[styles.currentPrice, { color: colors.text }]}>{price}</Text>
              {originalPrice && (
                <Text style={[styles.originalPrice, { color: isDark ? '#9CA3AF' : '#999999' }]}>
                  {originalPrice}
                </Text>
              )}
              {discount && (
                <View style={[styles.discountBadge, { backgroundColor: isDark ? '#3B1E1E' : '#FEF2F2' }]}>
                  <Text style={styles.discountText}>{discount}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.viewPackageBtn}
              onPress={onPress}
              activeOpacity={0.8}
            >
              <Text style={styles.viewPackageText}>View package</Text>
              <ChevronRight size={14} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  verticalPackageCard: {
    borderRadius: 16,
    borderWidth: 0,
    padding: 12,
    marginBottom: 12,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  verticalPackageImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  verticalPackageContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  packageTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
    lineHeight: 18,
  },
  priceAndActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  priceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    gap: 4,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '800',
  },
  originalPrice: {
    fontSize: 11,
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  discountBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
  },
  viewPackageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 4,
  },
  viewPackageText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
});
