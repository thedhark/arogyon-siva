import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, Heart, Share, Star, CheckCircle2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Props {
  doctorData: any;
  colors: any;
  isDark: boolean;
}

export default function DoctorProfileHeader({ doctorData, colors, isDark }: Props) {
  const router = useRouter();

  return (
    <>
      <View style={styles.heroSection}>
        <Image source={{ uri: doctorData.image }} style={styles.heroImage} resizeMode="cover" />
        
        <View style={styles.floatingHeader}>
          <TouchableOpacity 
            style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : '#FFFFFF' }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={isDark ? '#FFF' : '#000'} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : '#FFFFFF' }]}>
              <Heart size={20} color={isDark ? '#FFF' : '#000'} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : '#FFFFFF' }]}>
              <Share size={20} color={isDark ? '#FFF' : '#000'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.profileCardWrapper}>
        <View style={[styles.profileCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
          <View style={styles.cardTop}>
            <Image source={{ uri: doctorData.image }} style={styles.cardAvatar} />
            <View style={styles.cardInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{doctorData.name}</Text>
                {doctorData.verified && <CheckCircle2 size={16} color="#10B981" fill="#D1FAE5" style={{ marginLeft: 4 }} />}
              </View>
              <Text style={styles.speciality}>{doctorData.speciality}</Text>
              <Text style={styles.experience}>{doctorData.experience}</Text>
            </View>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingValue}>{doctorData.rating}</Text>
              <Star size={12} color="#10B981" fill="#10B981" />
              <Text style={styles.reviewsText}>({doctorData.reviews} reviews)</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    width: '100%',
    height: 280,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  profileCardWrapper: {
    paddingHorizontal: 16,
    marginTop: -40,
    zIndex: 2,
  },
  profileCard: {
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 16,
    paddingBottom: 0,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardAvatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
  },
  speciality: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 2,
  },
  experience: {
    fontSize: 12,
    color: '#6B7280',
  },
  ratingBox: {
    alignItems: 'flex-end',
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 2,
  },
  reviewsText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
});
