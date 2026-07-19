import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';

interface Props {
  image: string;
  name: string;
  speciality: string;
  rating: string;
  reviews: string;
  experience: string;
  price: string;
  onPress: () => void;
  colors: any;
  isDark: boolean;
}

export default function DoctorListItem({
  image, name, speciality, rating, reviews, experience, price, onPress, colors, isDark
}: Props) {
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}
      onPress={onPress}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: image }} style={styles.avatar} />
        <View style={styles.onlineDot} />
      </View>
      
      <View style={styles.details}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{name}</Text>
        <Text style={styles.speciality} numberOfLines={1}>{speciality}</Text>
        
        <View style={styles.statsRow}>
          <Star size={12} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.ratingText}>{rating}</Text>
          <Text style={styles.reviewsText}>({reviews})</Text>
        </View>
      </View>
      
      <View style={styles.actionSection}>
        <Text style={[styles.price, { color: colors.text }]}>{price}</Text>
        <View style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  speciality: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  reviewsText: {
    fontSize: 11,
    color: '#6B7280',
  },

  actionSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  bookButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366F1',
    backgroundColor: 'transparent',
  },
  bookButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
  }
});
