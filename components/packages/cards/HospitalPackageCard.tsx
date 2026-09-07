import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { resolveImageSource } from '@/utils/imageUtils';
import { useBookingStore } from '@/hooks/useBookingStore';
import BookVisitSelector from '@/components/booking/BookVisitSelector';
import { PackageItemCardData } from './PackageItemCard';

interface HospitalPackageCardProps {
  item: PackageItemCardData;
  onPress: (id: string) => void;
  onAddPress?: (item: PackageItemCardData) => void;
  titleNumberOfLines?: number;
}

export default function HospitalPackageCard({
  item,
  onPress,
  onAddPress,
  titleNumberOfLines = 2,
}: HospitalPackageCardProps) {
  const { isDark } = useTheme();
  const displayTitle = (item.title || '').replace(/^1\s*x\s*/i, '');
  const displaySubtitle =
    item.subtitle ||
    (item.inclusions && item.inclusions.length > 0
      ? `Includes ${item.inclusions.slice(0, 3).join(', ')}`
      : 'Complete health checkup with accredited lab tests to assess your overall health.');

  // Check if item is already added to cart in central booking store
  const cartItems = useBookingStore((state) => state.cartItems);
  const pkgCartItems = cartItems.filter(
    (ci) =>
      ci.type === 'package' &&
      (ci.itemId === item.id || ci.title.toLowerCase() === displayTitle.toLowerCase())
  );
  const storeAssignedIds = pkgCartItems.map((ci) => ci.assignedPatientId || 'me');

  // Local immediate selection tracking for instant UI responsiveness
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>([]);
  const effectiveSelectedIds = storeAssignedIds.length > 0 ? storeAssignedIds : localSelectedIds;
  const isSelected = effectiveSelectedIds.length > 0 || (item as any).isSelected;

  // Formatted discount string matching reference screenshot (e.g. 25%off)
  const discountDisplay = item.discount
    ? `${item.discount.replace(/\s*off/i, '').trim()}off`
    : null;

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? '#1E1E24' : '#FFFFFF',
          borderColor: isSelected
            ? (isDark ? '#3B82F6' : '#2563EB')
            : (isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'),
          borderWidth: isSelected ? 1.8 : 1,
        },
        isSelected && {
          shadowColor: '#2563EB',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: isDark ? 0.35 : 0.15,
          shadowRadius: 8,
          elevation: 4,
        },
      ]}
    >
      {/* Top Section: Square Thumbnail Box + Middle Title */}
      <View style={styles.topRow}>
        {/* Left: Square thumbnail box with rounded corners */}
        <TouchableOpacity
          style={[
            styles.thumbnailBox,
            {
              backgroundColor: isDark ? '#27272A' : '#F9FAFB',
              borderColor: isDark ? 'rgba(255,255,255,0.12)' : '#E5E7EB',
            },
          ]}
          activeOpacity={0.88}
          onPress={() => onPress(item.id)}
        >
          <Image
            source={resolveImageSource(item.image)}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Middle: Title (fills remaining width) */}
        <TouchableOpacity
          style={styles.titleCol}
          activeOpacity={0.88}
          onPress={() => onPress(item.id)}
        >
          <Text
            style={[
              styles.title,
              { color: isDark ? '#F9FAFB' : '#111827' },
            ]}
            numberOfLines={titleNumberOfLines}
            ellipsizeMode="tail"
          >
            {displayTitle}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Middle Section: About / Description text (in place of tags as instructed) */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => onPress(item.id)}
      >
        <Text
          style={[
            styles.aboutText,
            { color: isDark ? '#9CA3AF' : '#4B5563' },
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {displaySubtitle}
        </Text>
      </TouchableOpacity>

      {/* Bottom Row: Left (Strike Price + Green Discount & Bold Price) | Right (Outline Add Button) */}
      <View style={styles.bottomRow}>
        {/* Price Column */}
        <View style={styles.priceCol}>
          {item.originalPrice ? (
            <View style={styles.discountRow}>
              <Text
                style={[
                  styles.originalPriceText,
                  { color: isDark ? '#9CA3AF' : '#6B7280' },
                ]}
              >
                ({item.originalPrice})
              </Text>
              {discountDisplay ? (
                <Text style={styles.discountText}> {discountDisplay}</Text>
              ) : null}
            </View>
          ) : null}

          <Text
            style={[
              styles.priceVal,
              { color: isDark ? '#F9FAFB' : '#111827' },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {item.price}
          </Text>
        </View>

        {/* Add Button: Outline style button with ShoppingCart icon and 'Add' text */}
        <View style={styles.addBtnWrapper}>
          <BookVisitSelector
            buttonLabel="Add"
            icon={ShoppingCart}
            variant="outline"
            initialSelectedIds={effectiveSelectedIds}
            initialCount={effectiveSelectedIds.length}
            onBookPress={(patient, allPatients) => {
              const ids = allPatients ? allPatients.map((p) => p.id) : patient ? [patient.id] : ['me'];
              setLocalSelectedIds(ids);
              if (onAddPress) {
                onAddPress({
                  ...item,
                  assignedPatient: patient,
                  assignedPatients: allPatients,
                } as any);
              }
            }}
            onCountChange={(count, patient, allPatients) => {
              if (count > 0) {
                const ids = allPatients ? allPatients.map((p) => p.id) : patient ? [patient.id] : ['me'];
                setLocalSelectedIds(ids);
                if (onAddPress) {
                  onAddPress({
                    ...item,
                    assignedPatient: patient,
                    assignedPatients: allPatients,
                    quantity: count,
                  } as any);
                }
              } else {
                setLocalSelectedIds([]);
              }
            }}
            onMembersChange={(allMembers) => {
              setLocalSelectedIds(allMembers.map((m) => m.id));
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  // Increased 2x from 66 to 104 in the same frame
  thumbnailBox: {
    width: 104,
    height: 104,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  titleCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
    paddingTop: 4,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 16.5,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  aboutText: {
    fontFamily: Fonts.regular,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 10,
    marginBottom: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  priceCol: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  originalPriceText: {
    fontFamily: Fonts.medium,
    fontSize: 12.5,
    fontWeight: '500',
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  priceVal: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  addBtnWrapper: {
    flexShrink: 0,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});


