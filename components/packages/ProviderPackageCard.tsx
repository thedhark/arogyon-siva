import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Flame, Star, Sparkles, Gift, BadgeCheck, MapPin, Baby, Bed, Stethoscope, Check, CreditCard, ArrowRight, ShieldCheck, Activity, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

interface Props {
  id: string;
  providerId: string;
  title: string;
  duration: string;
  startingPrice: string;
  image?: string;
  hospitalName?: string;
  hospitalLogo?: any;
  logoBg?: string;
  location?: string;
  distance?: string;
  badge?: { text: string; icon: string; color: string; bgColor: string };
  inclusions?: string[];
  extraInclusions?: string;
  index?: number;
}

const BORDER_COLORS = ['#7C3AED', '#10B981', '#3B82F6', '#E91E63', '#F59E0B'];

const getBadgeIcon = (iconName: string, color: string, size = 11) => {
  switch (iconName) {
    case 'flame': return <Flame size={size} color={color} />;
    case 'diamond': return <ShieldCheck size={size} color={color} />;
    case 'star': return <Star size={size} color={color} />;
    case 'sparkles': return <Sparkles size={size} color={color} />;
    case 'gift': return <Gift size={size} color={color} />;
    default: return <Star size={size} color={color} />;
  }
};

const getInclusionIcon = (name: string, color: string, size = 12) => {
  const n = name.toLowerCase();
  if (n.includes('delivery')) return <Baby size={size} color={color} />;
  if (n.includes('stay')) return <Bed size={size} color={color} />;
  if (n.includes('consultation')) return <Stethoscope size={size} color={color} />;
  if (n.includes('scan') || n.includes('test')) return <Activity size={size} color={color} />;
  return <Check size={size} color={color} />;
};

export default function ProviderPackageCard({
  id,
  providerId,
  title,
  duration,
  startingPrice,
  hospitalName,
  hospitalLogo,
  logoBg,
  location,
  distance,
  badge,
  inclusions,
  extraInclusions,
  image,
  index = 0,
}: Props) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.cardContainer,
        { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' },
        pressed && Platform.OS === 'ios' && { transform: [{ scale: 0.98 }], opacity: 0.9 }
      ]}
      android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }}
      onPress={() => router.push(`/packages/detail/${id}` as any)}
    >
      <View style={styles.cardContent}>
        {/* Left Side: Hospital Logo */}
        {hospitalLogo && (
          <View style={[styles.imageContainer, { backgroundColor: logoBg || (isDark ? '#2C2C2E' : '#F9FAFB') }]}>
            <Image source={typeof hospitalLogo === 'string' ? { uri: hospitalLogo } : hospitalLogo} style={styles.image} contentFit="cover" />
          </View>
        )}

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.topRow}>
            {/* Title and Location */}
            <View style={styles.titleSection}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{title}</Text>
              
              {hospitalName && (
                <View style={styles.hospitalRow}>
                  <Text style={[styles.hospitalName, { color: isDark ? '#E5E7EB' : '#374151' }]} numberOfLines={1}>{hospitalName}</Text>
                  <BadgeCheck size={12} color="#3B82F6" />
                </View>
              )}

              <View style={styles.locationRow}>
                <MapPin size={11} color="#6B7280" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {location ? `${location}, Bangalore` : 'Bangalore'} • {distance || '2.5 km'}
                </Text>
              </View>
            </View>

            {/* Price and Badge at Top Right */}
            <View style={styles.priceSection}>
              {badge && (
                <View style={[styles.badge, { backgroundColor: badge.bgColor }]}>
                  {getBadgeIcon(badge.icon, badge.color)}
                  <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
                </View>
              )}
              <Text style={[styles.priceLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Package Price</Text>
              <Text
                style={[styles.priceValue, { color: colors.text }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
              >
                {startingPrice}
              </Text>
            </View>
          </View>

          {/* Inclusions and Features at Bottom */}
          <View style={styles.bottomRow}>
            <View style={styles.inclusionsList}>
              {inclusions?.map((inc, i) => (
                <View key={i} style={[styles.inclusionChip, { backgroundColor: isDark ? '#2C2C2E' : '#F9FAFB', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
                  {getInclusionIcon(inc, isDark ? '#D1D5DB' : '#4B5563')}
                  <Text style={[styles.inclusionText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>{inc}</Text>
                </View>
              ))}
              {extraInclusions && (
                <View style={[styles.extraInclusionChip, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]}>
                  <Text style={[styles.extraInclusionText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>{extraInclusions}</Text>
                </View>
              )}
            </View>

            <View style={styles.featuresRow}>
              <View style={styles.featureItem}>
                <Check size={9} color={isDark ? '#9CA3AF' : '#6B7280'} />
                <Text style={[styles.featureText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Cashless</Text>
              </View>
              <View style={styles.featureItem}>
                <CreditCard size={9} color={isDark ? '#9CA3AF' : '#6B7280'} />
                <Text style={[styles.featureText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>EMI</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,
    padding: 12,
    paddingLeft: 12,
  },
  imageContainer: {
    width: 85,
    borderRadius: 8,
    overflow: 'hidden',
    minHeight: 110,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mainContent: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleSection: {
    flex: 1,
  },
  priceSection: {
    alignItems: 'flex-end',
    minWidth: 85,
    flexShrink: 0,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '700',
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  hospitalName: {
    fontSize: 10,
    fontWeight: '600',
    flexShrink: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locationText: {
    fontSize: 9,
    color: '#6B7280',
    flexShrink: 1,
  },
  inclusionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flex: 1,
  },
  inclusionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.5,
    gap: 2,
  },
  inclusionText: {
    fontSize: 8,
    fontWeight: '500',
  },
  extraInclusionChip: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    justifyContent: 'center',
  },
  extraInclusionText: {
    fontSize: 8,
    fontWeight: '600',
  },
  priceLabel: {
    fontSize: 8,
    fontWeight: '600',
    marginBottom: 1,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  featureText: {
    fontSize: 8,
    fontWeight: '600',
  }
});
