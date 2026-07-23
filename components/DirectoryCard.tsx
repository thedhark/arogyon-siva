import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, MapPin, Navigation, ShieldCheck, Calendar, Stethoscope, Heart, Activity, Baby } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function DirectoryCard({ id = 'hosp-2', image, logo, typeTag, title, subtitle, address, distance, fee, nextAvailable, insurance, trustedCount, rating, reviews }: any) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity 
      activeOpacity={1} 
      style={styles.premiumHospitalCard}
      onPress={() => router.push(`/hospital/${id}`)}
    >
      {/* Top Image Section */}
      <View style={styles.phcImageWrapper}>
        <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.phcImage} contentFit="cover" />

        <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
            style={styles.phcImageGradient}
        />

        {/* Rating Badge */}
        <LinearGradient
          colors={['#9BF229', '#14CE65']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.phcRatingBadge}
        >
          <View style={styles.phcRatingRow}>
            <Star size={12} color="#052E16" fill="#052E16" />
            <Text style={styles.phcRatingText}>{rating}</Text>
          </View>
          <Text style={styles.phcReviewsText}>({reviews} reviews)</Text>
        </LinearGradient>
      </View>

      {/* Content Section */}
      <View style={styles.phcContent}>

        {/* Title Row */}
        <View style={styles.phcTitleRow}>
          {logo && (
            <Image 
              source={typeof logo === 'string' ? { uri: logo } : logo} 
              style={{ width: 20, height: 20, borderRadius: 4, marginRight: 8 }} 
              contentFit="contain" 
            />
          )}
          <Text style={[styles.phcTitle, { color: isDark ? '#fff' : '#1A237E', marginBottom: 0 }]} numberOfLines={1}>{title}</Text>
        </View>

        {/* Location Row */}
        <View style={styles.phcLocationRow}>
          <View style={[styles.phcLocationItem, { flex: 1 }]}>
            <Text style={styles.phcLocationText} numberOfLines={1}>{address}</Text>
          </View>
          <View style={styles.phcLocationDivider} />
          <View style={styles.phcLocationItem}>
            <Text style={styles.phcLocationText}>{distance}</Text>
          </View>
          <View style={styles.phcLocationDivider} />
          <View style={styles.phcLocationItem}>
            <Text style={styles.phcOpenText}>Open 24x7</Text>
          </View>
        </View>

        {/* Info Blocks */}
        <View style={styles.phcInfoRow}>
          
          <View style={styles.phcInfoBlock}>
            <View style={{ flex: 1 }}>
              <Text style={styles.phcInfoLabel} numberOfLines={1} adjustsFontSizeToFit>Consultation</Text>
              <Text style={[styles.phcInfoValue, { color: isDark ? '#fff' : '#333' }]} numberOfLines={1} adjustsFontSizeToFit>{fee}</Text>
            </View>
          </View>
          
          <View style={styles.phcInfoBlock}>
            <View style={{ flex: 1 }}>
              <Text style={styles.phcInfoLabel} numberOfLines={1} adjustsFontSizeToFit>Next Avail</Text>
              <Text style={[styles.phcInfoValue, { color: isDark ? '#fff' : '#333' }]} numberOfLines={1} adjustsFontSizeToFit>{nextAvailable}</Text>
            </View>
          </View>

          
          <View style={styles.phcInfoBlock}>
            <View style={{ flex: 1 }}>
              <Text style={styles.phcInfoLabel} numberOfLines={1} adjustsFontSizeToFit>Departments</Text>
              <View style={[styles.phcAvatars, { marginTop: 2 }]}>
                <View style={[styles.phcAvatarImg, { width: 18, height: 18, borderRadius: 9, marginLeft: 0, backgroundColor: '#FFEbee', alignItems: 'center', justifyContent: 'center', borderWidth: 1 }]}>
                  <Heart size={10} color="#F44336" />
                </View>
                <View style={[styles.phcAvatarImg, { width: 18, height: 18, borderRadius: 9, marginLeft: -6, backgroundColor: '#E3F2FD', alignItems: 'center', justifyContent: 'center', borderWidth: 1 }]}>
                  <Activity size={10} color="#2196F3" />
                </View>
                <View style={[styles.phcAvatarImg, { width: 18, height: 18, borderRadius: 9, marginLeft: -6, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', borderWidth: 1 }]}>
                  <Baby size={10} color="#4CAF50" />
                </View>
                <View style={[styles.phcAvatarImg, styles.phcAvatarCount, { width: 18, height: 18, borderRadius: 9, marginLeft: -6, borderWidth: 1 }]}>
                  <Text style={[styles.phcAvatarCountText, { fontSize: 7 }]}>+12</Text>
                </View>
              </View>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  phcImageWrapper: {
    height: 190,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
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
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  phcRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 1,
  },
  phcRatingText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#052E16',
  },
  phcReviewsText: {
    fontSize: 9,
    color: '#052E16',
    fontWeight: '700',
  },
  phcContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: 0,
    paddingHorizontal: 12,
    paddingBottom: 6,
    paddingTop: 4,
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  phcTitleRow: {
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  phcImageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
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
    fontSize: 18,
    fontWeight: '900',
    flex: 1,
  },
  phcLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    marginBottom: 1,
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
    paddingTop: 0,
    gap: 8,
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
