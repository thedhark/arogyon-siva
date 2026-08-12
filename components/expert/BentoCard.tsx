import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight, ShieldCheck, HeartPulse, Activity, Stethoscope, Baby, Globe, FileText } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export interface BentoCardProps {
  id: string;
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  badgeBg?: string;
  badgeTextColor?: string;
  badgeIconName?: 'shield-check' | 'heart-pulse' | 'activity' | 'stethoscope';
  aspectRatio?: number;
  height?: number;
  imageUri?: string;
  iconName?: 'baby' | 'activity' | 'globe' | 'file-text';
  isDark?: boolean;
  onPress?: (id: string) => void;
}

export default function BentoCard({
  id,
  title,
  subtitle,
  badgeLabel,
  badgeBg = '#E8F5E9',
  badgeTextColor = '#2E7D32',
  badgeIconName = 'shield-check',
  aspectRatio,
  height,
  imageUri,
  iconName,
  isDark = false,
  onPress,
}: BentoCardProps) {
  const [imageError, setImageError] = useState(false);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) {
      onPress(id);
    }
  };

  const renderBadgeIcon = () => {
    const iconSize = 11;
    switch (badgeIconName) {
      case 'shield-check':
        return <ShieldCheck size={iconSize} color={badgeTextColor} strokeWidth={3} />;
      case 'heart-pulse':
        return <HeartPulse size={iconSize} color={badgeTextColor} strokeWidth={3} />;
      case 'activity':
        return <Activity size={iconSize} color={badgeTextColor} strokeWidth={3} />;
      case 'stethoscope':
        return <Stethoscope size={iconSize} color={badgeTextColor} strokeWidth={3} />;
      default:
        return <ShieldCheck size={iconSize} color={badgeTextColor} strokeWidth={3} />;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handlePress}
      style={[
        styles.cardWrapper,
        aspectRatio ? { aspectRatio } : null,
        height ? { height } : null,
        {
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#F1F5F9',
        },
      ]}
    >
      {/* Top Header Section */}
      <View style={styles.headerStack}>
        {badgeLabel && (
          <View style={[styles.badgePill, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : badgeBg }]}>
            {renderBadgeIcon()}
            <Text style={[styles.badgeText, { color: isDark ? '#F8FAFC' : badgeTextColor }]}>
              {badgeLabel}
            </Text>
          </View>
        )}

        {subtitle && (
          <Text style={[styles.subtitleText, { color: isDark ? '#94A3B8' : '#64748B' }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}

        <View style={styles.titleRow}>
          <Text
            style={[
              styles.titleText,
              { color: isDark ? '#F8FAFC' : '#0F172A' },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <ChevronRight size={15} color={isDark ? '#94A3B8' : '#64748B'} strokeWidth={2.2} />
        </View>
      </View>

      {/* Bottom Corner Illustration Image */}
      {imageUri && !imageError ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.cornerImage}
            contentFit="cover"
            transition={200}
            onError={() => setImageError(true)}
          />
        </View>
      ) : (
        /* Fallback Watermark Icon */
        <View style={styles.iconWatermark}>
          {iconName === 'baby' && <Baby size={44} color={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.06)'} />}
          {iconName === 'activity' && <Activity size={44} color={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.06)'} />}
          {iconName === 'globe' && <Globe size={44} color={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.06)'} />}
          {iconName === 'file-text' && <FileText size={44} color={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.06)'} />}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    padding: 12,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
    borderWidth: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerStack: {
    alignItems: 'flex-start',
    zIndex: 10,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: -0.1,
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  titleText: {
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  imageContainer: {
    position: 'absolute',
    right: -10,
    bottom: -4,
    width: 95,
    height: 72,
    borderTopLeftRadius: 16,
    overflow: 'hidden',
  },
  cornerImage: {
    width: '100%',
    height: '100%',
  },
  iconWatermark: {
    position: 'absolute',
    right: 8,
    bottom: 6,
    zIndex: 1,
  },
});
