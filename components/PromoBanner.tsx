import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface PromoBannerProps {
  isDark: boolean;
}

export default function PromoBanner({ isDark }: PromoBannerProps) {
  return (
    <View style={[styles.promoBanner, { backgroundColor: isDark ? '#1E1E1E' : '#F8FAFC', borderColor: isDark ? '#333' : 'rgba(0,0,0,0.02)' }]}>
      <View style={styles.promoContent}>
        <Text style={[styles.promoTitle, { color: isDark ? '#F3F4F6' : '#1E293B' }]}>Health Checkup Packages</Text>
        <Text style={styles.promoHighlight}>Up to 30% OFF</Text>
        <TouchableOpacity>
          <Text style={styles.promoLink}>View Packages &gt;</Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=200' }} style={styles.promoImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  promoBanner: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 14,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
  },
  promoContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  promoHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 8,
  },
  promoLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  promoImage: {
    width: 120,
    height: '100%',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
});
