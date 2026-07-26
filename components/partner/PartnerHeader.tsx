import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePartnerStore } from '../../hooks/usePartnerStore';
import { useTheme } from '../../hooks/useTheme';

export const PartnerHeader: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { profile, togglePartnerMode } = usePartnerStore();

  const handleSwitchToConsumer = () => {
    togglePartnerMode(false);
    router.push('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.leftSection}>
        <Image source={{ uri: profile.logo }} style={styles.logo} />
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.hospitalName, { color: colors.text }]} numberOfLines={1}>
              {profile.name}
            </Text>
            {profile.verified && (
              <Ionicons name="checkmark-circle" size={16} color="#10B981" style={styles.badgeIcon} />
            )}
          </View>
          <View style={styles.statusRow}>
            <View style={styles.tierPill}>
              <Ionicons name="star" size={10} color="#F59E0B" />
              <Text style={styles.tierText}>{profile.tier}</Text>
            </View>
            {profile.activeBoost && (
              <View style={styles.boostPill}>
                <Ionicons name="flash" size={10} color="#EC4899" />
                <Text style={styles.boostText}>BOOST ACTIVE</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, { backgroundColor: colors.background, opacity: pressed ? 0.8 : 1 }]}
        >
          <Ionicons name="notifications-outline" size={18} color={colors.text} />
          <View style={styles.unreadDot} />
        </Pressable>

        <Pressable
          onPress={handleSwitchToConsumer}
          style={({ pressed }) => [styles.switchBtn, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Ionicons name="swap-horizontal" size={14} color="#FFFFFF" />
          <Text style={styles.switchText}>Patient Mode</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1E293B',
  },
  infoContainer: {
    marginLeft: 10,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalName: {
    fontSize: 15,
    fontWeight: '700',
    maxWidth: '85%',
  },
  badgeIcon: {
    marginLeft: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F59E0B',
  },
  boostPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  boostText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#EC4899',
    letterSpacing: 0.3,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  switchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
