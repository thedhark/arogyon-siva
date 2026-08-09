import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Star, ShieldCheck, MapPin } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export const PARTNER_LABS = [
  {
    id: 'lab-center-1',
    name: 'Thyrocare Central Lab',
    location: 'Koramangala, Bengaluru',
    rating: '4.9',
    reviews: '3.8k',
    accreditation: 'NABL & CAP Certified',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=400',
    tat: 'Same-day Results',
  },
  {
    id: 'lab-center-2',
    name: 'Apollo Diagnostics',
    location: 'Indiranagar, Bengaluru',
    rating: '4.8',
    reviews: '5.2k',
    accreditation: 'NABL Accredited',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e024?q=80&w=400',
    tat: '24h Digital Delivery',
  },
  {
    id: 'lab-center-3',
    name: 'Dr. Lal PathLabs',
    location: 'HSR Layout, Bengaluru',
    rating: '4.7',
    reviews: '2.9k',
    accreditation: 'ISO & NABL Certified',
    image: 'https://images.unsplash.com/photo-1579152276503-3467b6eb98bb?q=80&w=400',
    tat: 'Free Phlebotomist Visit',
  },
];

export default function LabCentersSection() {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Verified Partner Labs</Text>
          <Text style={styles.subtitle}>Strict NABL quality benchmarks & sterile sample handling</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PARTNER_LABS.map((lab) => (
          <View
            key={lab.id}
            style={[
              styles.centerCard,
              {
                backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              },
            ]}
          >
            <Image source={{ uri: lab.image }} style={styles.centerImage} contentFit="cover" />

            <View style={styles.centerDetails}>
              <View style={styles.ratingRow}>
                <View style={styles.starBadge}>
                  <Star size={11} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>{lab.rating}</Text>
                  <Text style={styles.reviewsText}>({lab.reviews})</Text>
                </View>
                <View style={styles.accredBadge}>
                  <ShieldCheck size={10} color="#10B981" />
                  <Text style={styles.accredText}>NABL</Text>
                </View>
              </View>

              <Text style={[styles.centerName, { color: colors.text }]} numberOfLines={1}>
                {lab.name}
              </Text>

              <View style={styles.locRow}>
                <MapPin size={11} color="#6B7280" />
                <Text style={styles.locText} numberOfLines={1}>{lab.location}</Text>
              </View>

              <View style={[styles.tatBanner, { backgroundColor: isDark ? '#27272A' : '#ECFDF5' }]}>
                <Text style={styles.tatBannerText}>{lab.tat}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  headerRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  centerCard: {
    width: 210,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  centerImage: {
    width: '100%',
    height: 100,
  },
  centerDetails: {
    padding: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F59E0B',
  },
  reviewsText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  accredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  accredText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10B981',
  },
  centerName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locText: {
    fontSize: 11,
    color: '#6B7280',
    flex: 1,
  },
  tatBanner: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  tatBannerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
});
