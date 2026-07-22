import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, BedDouble, Clock, MapPin } from 'lucide-react-native';

interface Props {
  image: string;
  name: string;
  speciality: string;
  rating: string;
  reviews: string;
  distance: string;
  beds: string;
  care24x7: boolean;
  onPress: () => void;
  colors: any;
  isDark: boolean;
}

export default function HospitalListItem({
  image, name, speciality, rating, reviews, distance, beds, care24x7, onPress, colors, isDark
}: Props) {
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
      
      <View style={styles.details}>
        <View style={styles.headerRow}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{name}</Text>
          <View style={styles.distanceBadge}>
            <MapPin size={10} color="#6B7280" />
            <Text style={styles.distanceText}>{distance}</Text>
          </View>
        </View>
        
        <Text style={styles.speciality} numberOfLines={1}>{speciality}</Text>
        
        <View style={styles.statsRow}>
          <Star size={12} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.ratingText}>{rating}</Text>
          <Text style={styles.reviewsText}>({reviews})</Text>
        </View>
        
        <View style={styles.footerRow}>
          <View style={styles.amenityBadge}>
            <BedDouble size={12} color="#6B7280" />
            <Text style={styles.amenityText}>{beds}</Text>
          </View>
          
          {care24x7 && (
            <View style={styles.amenityBadge}>
              <Clock size={12} color="#6B7280" />
              <Text style={styles.amenityText}>24x7 Care</Text>
            </View>
          )}
          
          <View style={styles.flexSpacer} />
          
          <View style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  imageContainer: {
    width: 106,
    height: 106,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  distanceText: {
    fontSize: 11,
    color: '#6B7280',
  },
  speciality: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
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
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amenityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  amenityText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  flexSpacer: {
    flex: 1,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#6366F1',
  },
  viewButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  }
});
