import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BoostTier } from '../../constants/partner-data';
import { usePartnerStore } from '../../hooks/usePartnerStore';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  tier: BoostTier;
}

export const BoostCampaignCard: React.FC<Props> = ({ tier }) => {
  const { colors } = useTheme();
  const { activeBoostId, activateBoost } = usePartnerStore();
  const isActive = activeBoostId === tier.id;

  const handleActivate = () => {
    activateBoost(tier.id);
    Alert.alert(
      'Boost Activated!',
      `Your hospital is now operating under "${tier.title}" boost campaign for maximum patient reach.`
    );
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: isActive ? tier.accentColor : colors.border },
      ]}
    >
      {tier.recommended && (
        <View style={[styles.badge, { backgroundColor: tier.accentColor }]}>
          <Ionicons name="sparkles" size={10} color="#FFFFFF" />
          <Text style={styles.badgeText}>MOST POPULAR</Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={[styles.title, { color: colors.text }]}>{tier.title}</Text>
          <Text style={styles.tagline}>{tier.tagline}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: tier.accentColor }]}>{tier.price}</Text>
          <Text style={styles.duration}>/ {tier.duration}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Est. Patient Reach</Text>
          <Text style={[styles.statVal, { color: colors.text }]}>{tier.estimatedReach}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Expected Return</Text>
          <Text style={[styles.statVal, { color: '#10B981' }]}>{tier.roiEstimate}</Text>
        </View>
      </View>

      <View style={styles.featuresList}>
        {tier.features.map((feat, idx) => (
          <View key={idx} style={styles.featureItem}>
            <Ionicons name="checkmark-circle-sharp" size={14} color={tier.accentColor} />
            <Text style={[styles.featureText, { color: colors.text }]}>{feat}</Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={handleActivate}
        disabled={isActive}
        style={({ pressed }) => [
          styles.actionBtn,
          {
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.2)' : tier.accentColor,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Ionicons name={isActive ? 'checkmark-circle' : 'rocket-sharp'} size={16} color={isActive ? '#10B981' : '#FFFFFF'} />
        <Text style={[styles.actionBtnText, { color: isActive ? '#10B981' : '#FFFFFF' }]}>
          {isActive ? 'Active Campaign' : 'Launch Boost Campaign'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1.5,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleArea: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  tagline: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '900',
  },
  duration: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  statVal: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  featuresList: {
    marginVertical: 12,
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    marginTop: 4,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
