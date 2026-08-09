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
          <View>
            <Text style={[styles.price, { color: colors.text }]}>{item.price}</Text>
            {item.originalPrice ? (
              <Text style={styles.originalPrice}>{item.originalPrice}</Text>
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
                <Check size={14} color="#10B981" />
                <Text style={[styles.actionBtnText, { color: '#10B981' }]}>Added</Text>
              </>
            ) : (
              <>
                <Plus size={14} color="#F43F5E" />
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
    width: 240,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginRight: 12,
  },
  imageContainer: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#F43F5E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  body: {
    padding: 12,
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  summary: {
    fontSize: 11.5,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 10,
    height: 32,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
  },
  originalPrice: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
