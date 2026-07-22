import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Star, MapPin, ShieldCheck, Clock, CircleParking, Stethoscope, Bed, Heart, Check, CreditCard, ArrowRight, Flame, Sparkles, Gift } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

interface Props {
  id: string;
  name: string;
  logo?: any;
  rating: string;
  reviews: string;
  location: string;
  distance: string;
  startingPrice: string;
  inclusions: string[];
  image: any;
  logoBg?: string;
  badge?: { text: string; icon: string; color: string; bgColor: string };
}

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
  if (n.includes('emergency') || n.includes('24x7')) return <Clock size={size} color={color} />;
  if (n.includes('bed')) return <Bed size={size} color={color} />;
  if (n.includes('year')) return <Clock size={size} color={color} />;
  if (n.includes('parking')) return <CircleParking size={size} color={color} />;
  return <Stethoscope size={size} color={color} />;
};

export default function HospitalPackageCard({
  id,
  name,
  rating,
  reviews,
  location,
  distance,
  startingPrice,
  inclusions,
  image,
  logoBg,
  badge,
}: Props) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.cardContainer,
        { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' },
        pressed && Platform.OS === 'ios' && { transform: [{ scale: 0.98 }], opacity: 0.9 }
      ]}
      android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }}
      onPress={() => router.push(`/packages/provider/${id}` as any)}
    >
      <View style={styles.cardContent}>
        {/* Left Side: Image */}
        <View style={[styles.imageContainer, { backgroundColor: logoBg || (isDark ? '#2C2C2E' : '#F9FAFB') }]}>
          <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.image} contentFit="cover" />
        </View>

        {/* Middle Section: Details */}
        <View style={styles.middleSection}>
          <View style={styles.headerArea}>
            {badge && (
              <View style={[styles.badge, { backgroundColor: badge.bgColor }]}>
                {getBadgeIcon(badge.icon, badge.color)}
                <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
              </View>
            )}
            <View style={styles.titleRow}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{name}</Text>
              <ShieldCheck size={12} color="#3B82F6" />
            </View>
            <Text style={styles.locationText} numberOfLines={1}>{location}, Bangalore • {distance}</Text>
            
            <View style={styles.ratingRow}>
              <Star size={10} color="#F59E0B" fill="#F59E0B" />
              <Text style={[styles.ratingText, { color: colors.text }]}>{rating}</Text>
              <Text style={styles.reviewsText}>({reviews})</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.specialityText}>Multi Speciality</Text>
            </View>
          </View>

          <View style={styles.inclusionsRow}>
            {inclusions.map((item, index) => (
              <View key={index} style={styles.inclusionItem}>
                {getInclusionIcon(item, '#6B7280')}
                <Text style={styles.inclusionText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]} />

        {/* Right Section: Packages */}
        <View style={styles.rightSection}>
          <View style={styles.heartIconWrapper}>
            <Heart size={16} color="#9CA3AF" />
          </View>

          <View style={styles.priceArea}>
            <Text style={styles.packagesLabel}>Packages</Text>
            <Text style={styles.startsFromLabel}>Starts from</Text>
            <Text style={styles.priceValue}>{startingPrice}</Text>
          </View>

          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Check size={9} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text style={[styles.featureText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Cashless</Text>
            </View>
            <View style={styles.featureItem}>
              <Check size={9} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text style={[styles.featureText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Insurance</Text>
            </View>
            <View style={styles.featureItem}>
              <CreditCard size={9} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text style={[styles.featureText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Easy EMI</Text>
            </View>
          </View>

          <View style={[styles.viewBtn, { borderColor: isDark ? '#8B5CF6' : '#7C3AED' }]}>
            <Text style={[styles.viewBtnText, { color: isDark ? '#8B5CF6' : '#7C3AED' }]}>View Packages</Text>
            <ArrowRight size={12} color={isDark ? '#8B5CF6' : '#7C3AED'} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
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
  middleSection: {
    flex: 1.2,
    paddingLeft: 8,
    paddingRight: 6,
    justifyContent: 'space-between',
  },
  headerArea: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '700',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: '800',
    flexShrink: 1,
  },
  locationText: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
  },
  reviewsText: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '500',
  },
  dotSeparator: {
    fontSize: 9,
    color: '#D1D5DB',
  },
  specialityText: {
    fontSize: 9,
    color: '#4B5563',
    fontWeight: '600',
  },
  inclusionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  inclusionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  inclusionText: {
    fontSize: 8,
    color: '#4B5563',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    marginVertical: 2,
  },
  rightSection: {
    flex: 0.9,
    paddingLeft: 8,
    justifyContent: 'space-between',
    position: 'relative',
  },
  heartIconWrapper: {
    position: 'absolute',
    top: -2,
    right: 0,
    zIndex: 2,
  },
  priceArea: {
    marginTop: 0,
  },
  packagesLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 1,
  },
  startsFromLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 1,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E91E63',
    marginBottom: 4,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  featureText: {
    fontSize: 8,
    fontWeight: '500',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 6,
    gap: 4,
  },
  viewBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
