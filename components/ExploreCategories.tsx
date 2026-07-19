import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { MEDICAL_ILLUSTRATIONS } from '@/constants/medical-illustrations';
import { Siren, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

export const EXPLORE_CATEGORIES = [
  { id: 'Emergency', label: 'Emergency', image: 'https://images.unsplash.com/photo-1587559070757-f72a388edbba?q=80&w=200' }, // Red cross/emergency style image
  { id: 'Hospitals', label: 'Hospitals', image: MEDICAL_ILLUSTRATIONS.hospital },
  { id: 'Labs', label: 'Labs', image: MEDICAL_ILLUSTRATIONS.labs },
  { id: 'Pharmacy', label: 'Pharmacy', image: 'https://images.unsplash.com/photo-1587854692152-cbe668df9731?q=80&w=200' },
  { id: 'Ayurveda', label: 'Ayurveda', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200' },
  { id: 'Women Care', label: 'Women Care', image: MEDICAL_ILLUSTRATIONS.pregnancy },
  { id: 'Mental Health', label: 'Mental Health', image: MEDICAL_ILLUSTRATIONS.rehab },
  { id: 'Physiotherapy', label: 'Physiotherapy', image: MEDICAL_ILLUSTRATIONS.physiotherapy },
  { id: 'Nutrition', label: 'Nutrition', image: MEDICAL_ILLUSTRATIONS.weightLoss },
  { id: 'Checkups', label: 'Checkups', image: MEDICAL_ILLUSTRATIONS.scans },
  { id: 'Sleep', label: 'Sleep Clinics', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=200' },
  { id: 'Alternative', label: 'Alternative Med', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=200' },
];

export default function ExploreCategories({ activeTab, onTabChange }: { activeTab: string, onTabChange: (t: string) => void }) {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        overScrollMode="never"
      >
        {/* CATEGORY CIRCLES */}
        {EXPLORE_CATEGORIES.map((cat, index) => (
          <Animated.View key={cat.id} entering={FadeInRight.delay(index * 100)}>
            <TouchableOpacity 
              style={styles.categoryItem}
              onPress={() => onTabChange(cat.id)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.imageContainer, 
                activeTab === cat.id && styles.activeImageContainer,
                { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
                cat.id === 'Emergency' && { borderRadius: 12 }
              ]}>
                <Image 
                  source={{ uri: cat.image }} 
                  style={[
                    styles.categoryImage,
                    cat.id === 'Emergency' && { borderRadius: 10 }
                  ]} 
                />
              </View>
              <Text style={[
                styles.categoryLabel, 
                { color: colors.text },
                activeTab === cat.id && styles.activeLabel
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
    alignItems: 'center',
  },
  emergencyCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    width: 140,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  sirenContainer: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 24,
    marginBottom: 12,
  },
  emergencyTitle: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  emergencySubtitle: {
    color: '#6B7280',
    fontSize: 11,
    marginBottom: 12,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  exploreText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 12,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 8,
    width: 72,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  activeImageContainer: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeLabel: {
    color: '#10B981',
    fontWeight: '800',
  }
});
