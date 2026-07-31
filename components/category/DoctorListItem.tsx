import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, MapPin, Calendar, CheckCircle2 } from 'lucide-react-native';

interface Props {
  image: string;
  name: string;
  speciality: string;
  rating: string;
  reviews: string;
  location?: string;
  distance?: string;
  nextAvailable?: string;
  verified?: boolean;
  price: string;
  onPress: () => void;
  colors: any;
  isDark: boolean;
}

export default function DoctorListItem({
  image,
  name,
  speciality,
  rating,
  reviews,
  location,
  distance,
  nextAvailable = 'Today, 4:00 PM',
  verified = true,
  price,
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
        <View style={styles.avatarContainer}>
          <Image source={{ uri: image }} style={styles.avatar} />
          <View style={styles.onlineDot} />
        </View>

        <View style={styles.details}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{name}</Text>
            {verified && <CheckCircle2 size={14} color="#10B981" fill="#D1FAE5" style={styles.verifiedIcon} />}
          </View>

          <Text style={styles.speciality} numberOfLines={1}>{speciality}</Text>

          <View style={styles.statsRow}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{rating}</Text>
            <Text style={styles.reviewsText}>({reviews} reviews)</Text>
          </View>

          {location && (
            <View style={styles.locationRow}>
              <MapPin size={11} color="#6B7280" />
              <Text style={styles.locationText} numberOfLines={1}>
                {location} {distance ? `• ${distance}` : ''}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: isDark ? '#2A2A2A' : '#F3F4F6' }]} />

      <View style={styles.bottomSection}>
        <View style={styles.timeRow}>
          <Calendar size={13} color="#6366F1" />
          <Text style={[styles.timeText, { color: colors.text }]}>{nextAvailable}</Text>
        </View>

        <View style={styles.actionRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Consultation</Text>
            <Text style={[styles.price, { color: colors.text }]}>{price}</Text>
          </View>

          <TouchableOpacity style={styles.bookButton} onPress={onPress}>
            <Text style={styles.bookButtonText}>Book Consult</Text>
          </TouchableOpacity>
        </View>
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
  avatarContainer: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  speciality: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
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
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
  },
  bookButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
  bookButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
