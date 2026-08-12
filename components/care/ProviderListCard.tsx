import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, MapPin, Calendar, CheckCircle2 } from 'lucide-react-native';

interface Props {
  image: string;
  name: string;
  verified?: boolean;
  topRated?: boolean;
  speciality: string;
  experience?: string;
  rating: string;
  reviews: string;
  location: string;
  distance: string;
  nextAvailable: string;
  price: string;
  onPress: () => void;
  colors: any;
  isDark: boolean;
}

export default function ProviderListCard({
  image, name, verified, topRated, speciality, experience, rating, reviews,
  location, distance, nextAvailable, price, onPress, colors, isDark
}: Props) {
  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={styles.topSection}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
            {topRated && (
              <View style={[styles.topRatedBadge, { borderColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
                <Text style={styles.topRatedText}>Top Rated</Text>
              </View>
            )}
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{name}</Text>
              {verified && <CheckCircle2 size={14} color="#10B981" fill="#D1FAE5" style={{ marginLeft: 4 }} />}
            </View>
            
            <Text style={styles.speciality} numberOfLines={1}>{speciality}</Text>
            {experience && <Text style={styles.experience}>{experience}</Text>}
            
            <View style={styles.statsRow}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{rating}</Text>
              <Text style={styles.reviewsText}>({reviews} reviews)</Text>
            </View>
            
            <View style={styles.locationRow}>
              <MapPin size={12} color="#6B7280" />
              <Text style={styles.locationText}>{location}, {distance}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]} />
      
      <View style={styles.bottomSection}>
        <View style={styles.timeRow}>
          <Calendar size={14} color="#6B7280" />
          <Text style={[styles.timeText, { color: colors.text }]}>{nextAvailable}</Text>
        </View>
        
        <View style={styles.actionRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>From</Text>
            <Text style={[styles.priceText, { color: colors.text }]}>{price}</Text>
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={onPress}>
            <Text style={styles.bookButtonText}>Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  topSection: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '34%',
    marginRight: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  topRatedBadge: {
    position: 'absolute',
    top: -8,
    left: -4,
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
  },
  topRatedText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  detailsContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
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
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
  },
  reviewsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
  },
  bookButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  }
});
