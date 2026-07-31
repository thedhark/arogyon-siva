import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, MapPin, ChevronRight } from 'lucide-react-native';

interface Props {
  image: string;
  name: string;
  rating: string;
  reviews: string;
  location?: string;
  distance: string;
  fee?: string;
  onPress: () => void;
  colors: any;
  isDark: boolean;
}

export default function HospitalListItem({
  image,
  name,
  rating,
  reviews,
  location,
  distance,
  fee = '₹800 onwards',
  onPress,
  colors,
  isDark,
}: Props) {
  return (
    <TouchableOpacity 
      activeOpacity={0.88}
      style={[
        styles.container, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', 
          borderColor: isDark ? '#333' : '#F3F4F6' 
        }
      ]}
      onPress={onPress}
    >
      <View style={styles.topSection}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.details}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {name}
          </Text>

          <View style={styles.statsRow}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{rating}</Text>
            <Text style={styles.reviewsText}>({reviews} reviews)</Text>
          </View>

          <View style={styles.locationRow}>
            <MapPin size={11} color="#6B7280" />
            <Text style={styles.locationText} numberOfLines={1}>
              {location ? `${location} • ` : ''}{distance}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: isDark ? '#2A2A2A' : '#F3F4F6' }]} />

      <View style={styles.footer}>
        <View style={styles.feeContainer}>
          <Text style={styles.feeLabel}>Consultation</Text>
          <Text style={[styles.feeText, { color: colors.text }]}>{fee}</Text>
        </View>

        <TouchableOpacity style={styles.viewButton} onPress={onPress}>
          <Text style={styles.viewButtonText}>View Details</Text>
          <ChevronRight size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  topSection: {
    flexDirection: 'row',
    padding: 14,
  },
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  reviewsText: {
    fontSize: 11,
    color: '#6B7280',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  feeContainer: {
    flex: 1,
  },
  feeLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  feeText: {
    fontSize: 15,
    fontWeight: '800',
  },
  viewButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
