import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Heart, Activity, Stethoscope, Calendar, Baby } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Props {
  id?: string;
  name?: string;
  image?: string;
  location?: string;
  distance?: string;
  speciality?: string;
  rating?: string;
  departments?: string;
  logo?: string | any;
  fee?: string;
  nextAvailable?: string;
}

export default function HospitalDetailCard({
  id = 'hosp-1',
  name = "Hitas Super Speciality Hospital",
  image = "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop",
  location = "Banjara Hills, Hyderabad",
  distance = "< 2.5 km",
  speciality = "Multi Speciality Hospital",
  rating = "4.6",
  departments = "Cardiology • Neurology • +12 more",
  logo = "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
  fee = "₹1500 onwards",
  nextAvailable = "Today, 02:00 PM"
}: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      activeOpacity={1} 
      style={styles.outerContainer}
      onPress={() => router.push(`/hospital/${id}`)}
    >
      <View style={styles.cardContainer}>
        
        {/* Top Image Section */}
        <View style={styles.imageSection}>
          <Image 
            source={{ uri: image }} 
            style={styles.mainImage}
            resizeMode="cover"
          />
          


          {/* Top Right Bookmark */}
          <View style={styles.topRightBookmark}>
            <Svg width={18} height={18} fill="none" stroke="#FFFFFF" strokeWidth={2} viewBox="0 0 24 24">
              <Path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </Svg>
          </View>
        </View>

        {/* Bottom Content Section */}
        <View style={styles.bottomSection}>
          {/* Header Row: Title and Rating */}
          <View style={styles.headerRow}>
            {logo && <Image source={typeof logo === 'string' ? { uri: logo } : logo} style={{ width: 22, height: 22, marginRight: 8, borderRadius: 4 }} resizeMode="contain" />}
            <Text style={styles.hospitalName} numberOfLines={1}>{name}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{rating}</Text>
              <Svg width={10} height={10} fill="white" viewBox="0 0 24 24">
                <Path fillRule="evenodd" clipRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" />
              </Svg>
            </View>
          </View>

          {/* Info Rows */}
          <View style={styles.infoRowContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.subTextLeft} numberOfLines={1}>{location}</Text>
              <Text style={styles.subTextRight}>{distance}</Text>
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.phcInfoRow}>
              <View style={[styles.phcInfoBlock, { alignItems: 'flex-start' }]}>
                <Text style={styles.phcInfoLabel} numberOfLines={1} adjustsFontSizeToFit>Consultation</Text>
                <Text style={styles.phcInfoValue} numberOfLines={1} adjustsFontSizeToFit>{fee}</Text>
              </View>
              
              <View style={styles.verticalDivider} />
              
              <View style={[styles.phcInfoBlock, { alignItems: 'center' }]}>
                <Text style={styles.phcInfoLabel} numberOfLines={1} adjustsFontSizeToFit>Timings</Text>
                <Text style={styles.phcInfoValue} numberOfLines={1} adjustsFontSizeToFit>{nextAvailable}</Text>
              </View>
              
              <View style={styles.verticalDivider} />
              
              <View style={[styles.phcInfoBlock, { alignItems: 'flex-end' }]}>
                <Text style={styles.phcInfoLabel} numberOfLines={1} adjustsFontSizeToFit>Departments</Text>
                <View style={[styles.phcAvatars, { marginTop: 2 }]}>
                    <View style={[styles.phcAvatarImg, { width: 18, height: 18, borderRadius: 9, marginLeft: 0, backgroundColor: '#FFEbee' }]}>
                      <Heart size={10} color="#F44336" />
                    </View>
                    <View style={[styles.phcAvatarImg, { width: 18, height: 18, borderRadius: 9, marginLeft: -6, backgroundColor: '#E3F2FD' }]}>
                      <Activity size={10} color="#2196F3" />
                    </View>
                    <View style={[styles.phcAvatarImg, { width: 18, height: 18, borderRadius: 9, marginLeft: -6, backgroundColor: '#E8F5E9' }]}>
                      <Baby size={10} color="#4CAF50" />
                    </View>
                    <View style={[styles.phcAvatarImg, styles.phcAvatarCount, { width: 18, height: 18, borderRadius: 9, marginLeft: -6 }]}>
                      <Text style={[styles.phcAvatarCountText, { fontSize: 7 }]}>+12</Text>
                    </View>
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
  outerContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  imageSection: {
    width: '100%',
    height: 240,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  topRightBookmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: 0,
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 16,
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hospitalName: {
    flex: 1,
    fontSize: 22,
    fontWeight: '900',
    color: '#1C1C1E',
    marginRight: 8,
  },
  ratingBadge: {
    backgroundColor: '#1B5E20',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoRowContainer: {
    gap: 0,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subTextLeft: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    flexShrink: 1,
  },
  subTextRight: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
  },
  phcAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phcAvatarImg: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phcAvatarCount: {
    backgroundColor: '#F5F5F5',
  },
  phcAvatarCountText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#333',
  },
  phcInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
    gap: 0,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    width: '100%',
    marginVertical: 5,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  phcInfoBlock: {
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
    color: '#1C1C1E',
  }
});
