import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useProfileStore } from '@/hooks/useProfileStore';

export default function ProfileCard() {
  const { colors, isDark } = useTheme();
  const userProfile = useProfileStore((state) => state.userProfile);

  return (
    <View style={styles.wrapper}>
      {/* Background Stacked Card 2 (Bottom layer) */}
      <View style={[styles.bgCard2, { backgroundColor: isDark ? '#141414' : '#E8EEF5', borderColor: isDark ? '#262626' : '#D1DBE8' }]} />
      {/* Background Stacked Card 1 (Middle layer) */}
      <View style={[styles.bgCard1, { backgroundColor: isDark ? '#181818' : '#F1F5F9', borderColor: isDark ? '#2D2D2D' : '#E2E8F0' }]} />

      <View style={[
        styles.card, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderColor: isDark ? '#333' : 'transparent',
          borderWidth: isDark ? 1 : 0,
        }
      ]}>
        {/* Top Profile Info */}
        <View style={styles.topRow}>
          {userProfile.avatar ? (
            <Image 
              source={{ uri: userProfile.avatar }} 
              style={styles.avatar} 
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.accent }]}>
              <Text style={styles.initialsText}>
                {userProfile.name
                  ? userProfile.name.trim().split(' ').length >= 2
                    ? `${userProfile.name.trim().split(' ')[0][0]}${userProfile.name.trim().split(' ')[1][0]}`.toUpperCase()
                    : userProfile.name.substring(0, 2).toUpperCase()
                  : 'U'}
              </Text>
            </View>
          )}
          <View style={styles.infoCol}>
            <Text style={[styles.name, { color: colors.text }]}>{userProfile.name}</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              {userProfile.age} Yrs • {userProfile.gender} • {userProfile.bloodGroup}
            </Text>
            
            <View style={styles.verifiedBadge}>
              <CheckCircle2 size={13} color="#10B981" fill="#10B981" style={styles.verifiedIcon} />
              <Text style={styles.verifiedText}>Profile Verified</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginBottom: 24,
  },
  bgCard1: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: -8,
    height: '100%',
    borderRadius: 24,
    borderWidth: 1,
    zIndex: -1,
  },
  bgCard2: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: -14,
    height: '100%',
    borderRadius: 24,
    borderWidth: 1,
    zIndex: -2,
  },
  card: {
    borderRadius: 24,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 14,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 13.5,
    fontWeight: '500',
    marginBottom: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  verifiedIcon: {
    marginRight: 4,
    color: '#FFFFFF',
  },
  verifiedText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#10B981',
  },
});

