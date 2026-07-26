import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PartnerPackageListing } from '../../constants/partner-data';
import { usePartnerStore } from '../../hooks/usePartnerStore';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  item: PartnerPackageListing;
}

export const PackageManagementCard: React.FC<Props> = ({ item }) => {
  const { colors } = useTheme();
  const { togglePackageActive, togglePackagePromote } = usePartnerStore();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.topRow}>
        <View style={styles.titleArea}>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={styles.category}>{item.category} • {item.testsCount} Parameters</Text>
        </View>
        <Switch
          value={item.active}
          onValueChange={() => togglePackageActive(item.id)}
          trackColor={{ false: '#64748B', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.priceRow}>
        <View style={styles.priceContainer}>
          <Text style={[styles.discountPrice, { color: colors.text }]}>₹{item.partnerPrice}</Text>
          <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discountPercentage}% OFF</Text>
          </View>
        </View>

        <Pressable
          onPress={() => togglePackagePromote(item.id)}
          style={[
            styles.promoteBtn,
            item.promoted
              ? { backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: '#F59E0B' }
              : { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Ionicons name="sparkles" size={12} color={item.promoted ? '#F59E0B' : colors.text} />
          <Text style={[styles.promoteText, { color: item.promoted ? '#F59E0B' : colors.text }]}>
            {item.promoted ? 'Featured Deal' : 'Feature Deal'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleArea: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
  },
  category: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.1)',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  discountPrice: {
    fontSize: 17,
    fontWeight: '900',
  },
  originalPrice: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  promoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  promoteText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
