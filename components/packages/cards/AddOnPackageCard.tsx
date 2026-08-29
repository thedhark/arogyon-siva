import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Plus, Check } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { PackageItem } from '@/constants/package-data';

interface AddOnPackageCardProps {
  item: PackageItem;
  isAdded: boolean;
  onToggle: (item: PackageItem) => void;
}

export default function AddOnPackageCard({ item, isAdded, onToggle }: AddOnPackageCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderColor: isAdded ? '#10B981' : (isDark ? '#333333' : '#E5E7EB'),
        },
      ]}
    >
      {/* Top Banner Image with Red Discount Badge */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.discountBadge}>
          <Text style={styles.discountBadgeText}>{item.discount}</Text>
        </View>
      </View>

      {/* Card Content Body */}
      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.summary} numberOfLines={2}>
          {item.summary}
        </Text>

        {/* Bottom Price & Add Action Row */}
        <View style={styles.bottomRow}>
          <View style={{ flex: 1, minWidth: 0, paddingRight: 6 }}>
            <Text
              style={[styles.price, { color: colors.text }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {item.price}
            </Text>
            {item.originalPrice ? (
              <Text style={styles.originalPrice} numberOfLines={1}>
                {item.originalPrice}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              isAdded
                ? { backgroundColor: '#ECFDF5', borderColor: '#10B981' }
                : { backgroundColor: '#FFFFFF', borderColor: '#F43F5E' },
            ]}
            onPress={() => onToggle(item)}
            activeOpacity={0.8}
          >
            {isAdded ? (
              <>
                <Check size={12} color="#10B981" />
                <Text style={[styles.actionBtnText, { color: '#10B981' }]}>Added</Text>
              </>
            ) : (
              <>
                <Plus size={12} color="#F43F5E" />
                <Text style={[styles.actionBtnText, { color: '#F43F5E' }]}>Add</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 190,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    marginRight: 10,
  },
  imageContainer: {
    height: 85,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#F43F5E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  body: {
    padding: 10,
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  summary: {
    fontSize: 10.5,
    color: '#6B7280',
    lineHeight: 14,
    marginBottom: 8,
    height: 28,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  originalPrice: {
    fontSize: 10,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  actionBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
});
