import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Star, MapPin, Navigation, ShieldCheck, Calendar, Stethoscope } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function NearbyCard({ image, logo, typeTag, title, subtitle, address, distance, fee, nextAvailable, insurance, trustedCount, rating, reviews }: any) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity 
      activeOpacity={1} 
      style={[styles.premiumHospitalCard, { backgroundColor: isDark ? '#1A1A1A' : '#ffffff' }]}
      onPress={() => router.push('/hospital/1')}
    >
      {/* Top Image Section */}
      <View style={styles.phcImageWrapper}>
        <Image source={image} style={styles.phcImage} contentFit="cover" />
        
        {/* Wavy bottom overlay */}
        <View style={styles.phcWaveContainer}>
          <Svg height="30" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Path fill={isDark ? '#1A1A1A' : '#ffffff'} d="M0,50 Q30,50 50,80 T100,60 L100,105 L0,105 Z" />
          </Svg>
        </View>

        {/* Rating Badge */}
        <View style={styles.phcRatingBadge}>
          <View style={styles.phcRatingRow}>
            <Star size={14} color="#FF9800" fill="#FF9800" />
            <Text style={styles.phcRatingText}>{rating}</Text>
          </View>
          <Text style={styles.phcReviewsText}>({reviews} reviews)</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.phcContent}>
        {/* Logo and Tag Row */}
        <View style={styles.phcLogoRow}>
          <View style={[styles.phcLogoBox, { backgroundColor: isDark ? '#2A2A2A' : '#ffffff' }]}>
            <Image source={logo} style={styles.phcLogo} contentFit="contain" />
          </View>
          <View style={styles.phcTypeTag}>
            <Text style={styles.phcTypeTagText}>{typeTag}</Text>
          </View>
        </View>

        <Text style={[styles.phcTitle, { color: isDark ? '#fff' : '#1A237E' }]}>{title}</Text>

        {/* Location Row */}
        <View style={styles.phcLocationRow}>
          <View style={[styles.phcLocationItem, { flex: 1 }]}>
            <MapPin size={12} color="#666" />
            <Text style={styles.phcLocationText} numberOfLines={1}>{address}</Text>
          </View>
          <View style={styles.phcLocationDivider} />
          <View style={styles.phcLocationItem}>
            <Navigation size={12} color="#666" />
            <Text style={styles.phcLocationText}>{distance}</Text>
          </View>
          <View style={styles.phcLocationDivider} />
          <View style={styles.phcLocationItem}>
            <View style={styles.phcOpenDot} />
            <Text style={styles.phcOpenText}>Open 24x7</Text>
          </View>
        </View>

        {/* Info Blocks */}
        <View style={styles.phcInfoRow}>
          <View style={styles.phcInfoBlock}>
            <View style={[styles.phcInfoIcon, { backgroundColor: '#E8F5E9' }]}>
              <Stethoscope size={14} color="#4CAF50" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.phcInfoLabel} numberOfLines={1} adjustsFontSizeToFit>Consultation</Text>
              <Text style={[styles.phcInfoValue, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>{fee}</Text>
            </View>
          </View>
          
          <View style={styles.phcInfoBlock}>
            <View style={[styles.phcInfoIcon, { backgroundColor: '#E3F2FD' }]}>
              <Calendar size={14} color="#2196F3" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.phcInfoLabel} numberOfLines={1} adjustsFontSizeToFit>Next Avail</Text>
              <Text style={[styles.phcInfoValue, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>{nextAvailable}</Text>
            </View>
          </View>
          
          <View style={styles.phcInfoBlock}>
            <View style={[styles.phcInfoIcon, { backgroundColor: '#F3E5F5' }]}>
              <ShieldCheck size={14} color="#9C27B0" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.phcInfoLabel} numberOfLines={1} adjustsFontSizeToFit>Insurance</Text>
              <Text style={[styles.phcInfoValue, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>{insurance}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.phcFooter}>
          <View style={styles.phcTrusted}>
            <ShieldCheck size={14} color="#1A237E" />
            <Text style={styles.phcTrustedText}>Trusted by {trustedCount} patients</Text>
          </View>
          <View style={styles.phcAvatars}>
            {[1,2,3].map((i) => (
              <Image key={i} source={`https://i.pravatar.cc/100?img=${i+10}`} style={[styles.phcAvatarImg, { marginLeft: i === 1 ? 0 : -8 }]} />
            ))}
            <View style={[styles.phcAvatarImg, styles.phcAvatarCount]}>
              <Text style={styles.phcAvatarCountText}>+12K+</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  premiumHospitalCard: {
    width: '100%',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  phcImageWrapper: {
    height: 130,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: 'hidden',
  },
  phcImage: {
    width: '100%',
    height: '100%',
  },
  phcWaveContainer: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
  },
  phcRatingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  phcRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  phcRatingText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333',
  },
  phcReviewsText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  phcContent: {
    padding: 16,
    paddingTop: 0,
  },
  phcLogoRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: -30,
    marginBottom: 10,
    gap: 12,
  },
  phcLogoBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  phcLogo: {
    width: '100%',
    height: '100%',
  },
  phcTypeTag: {
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
  },
  phcTypeTagText: {
    color: '#3F51B5',
    fontSize: 10,
    fontWeight: '700',
  },
  phcTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 10,
  },
  phcLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  phcLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phcLocationText: {
    fontSize: 11,
    color: '#555',
    fontWeight: '600',
  },
  phcLocationDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  phcOpenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  phcOpenText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '700',
  },
  phcInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  phcInfoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  phcInfoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phcInfoLabel: {
    fontSize: 9,
    color: '#666',
    fontWeight: '600',
    marginBottom: 2,
  },
  phcInfoValue: {
    fontSize: 11,
    fontWeight: '800',
  },
  phcFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  phcTrusted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phcTrustedText: {
    fontSize: 11,
    color: '#444',
    fontWeight: '600',
  },
  phcAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phcAvatarImg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  phcAvatarCount: {
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  phcAvatarCountText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#333',
  },
});
