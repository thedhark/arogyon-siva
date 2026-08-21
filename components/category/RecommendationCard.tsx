import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';

import { resolveImageSource } from '@/utils/imageUtils';

interface Props {
  type: 'doctor' | 'hospital' | 'package';
  image: any;
  title: string;
  subtitle: string;
  rating?: string;
  reviews?: string;
  distance?: string;
  experience?: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  priceLabel?: string;
  buttonText: string;
  onPress: () => void;
  colors: any;
  isDark: boolean;
}

export default function RecommendationCard({
  type, image, title, subtitle, rating, reviews, distance, experience,
  price, originalPrice, discount, priceLabel, buttonText, onPress, colors, isDark
}: Props) {
  
  const isDoctor = type === 'doctor';
  
  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
      <View style={styles.imageContainer}>
        <Image source={resolveImageSource(image)} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
        
        {experience && <Text style={styles.infoText}>{experience}</Text>}
        
        {rating && (
          <View style={styles.ratingRow}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{rating}</Text>
            {reviews && <Text style={styles.reviewsText}>({reviews})</Text>}
          </View>
        )}
        
        {distance && <Text style={styles.infoText}>{distance}</Text>}
        
        <View style={styles.priceContainer}>
          {priceLabel && <Text style={styles.priceLabel}>{priceLabel}</Text>}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.text }]}>{price}</Text>
            {originalPrice && <Text style={styles.originalPrice}>{originalPrice}</Text>}
          </View>
          {discount && <Text style={styles.discountText}>{discount}</Text>}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            isDoctor ? styles.solidButton : styles.outlineButton,
            { borderColor: isDoctor ? 'transparent' : '#6366F1' }
          ]} 
          onPress={onPress}
        >
          <Text style={[
            styles.buttonText, 
            { color: isDoctor ? '#FFFFFF' : '#6366F1' }
          ]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 12,
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 6,
    height: 30, // Fixed height for 2 lines
  },
  infoText: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
  priceContainer: {
    marginTop: 'auto',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
  },
  originalPrice: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 2,
  },
  button: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solidButton: {
    backgroundColor: '#6366F1',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '700',
  }
});
