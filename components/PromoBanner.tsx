import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Platform } from 'react-native';
import { usePartnerStore } from '../hooks/usePartnerStore';

interface PromoBannerProps {
  isDark: boolean;
}

export default function PromoBanner({ isDark }: PromoBannerProps) {
  const { posts } = usePartnerStore();
  const latestPost = posts[0];

  return (
    <View style={[styles.promoBanner, { backgroundColor: isDark ? '#1E1E1E' : '#F8FAFC', borderColor: isDark ? '#333' : 'rgba(0,0,0,0.02)' }]}>
      <View style={styles.promoContent}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>{latestPost ? latestPost.category : 'Hospital Announcement'}</Text>
        </View>
        <Text style={[styles.promoTitle, { color: isDark ? '#F3F4F6' : '#1E293B' }]} numberOfLines={1}>
          {latestPost ? latestPost.title : 'Health Checkup Packages'}
        </Text>
        <Text style={styles.promoHighlight} numberOfLines={2}>
          {latestPost ? latestPost.content : 'Up to 30% OFF on Master Executive Checkups'}
        </Text>
        <Pressable 
          android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }}
          style={({ pressed }) => [
            styles.promoLinkWrapper,
            pressed && Platform.OS === 'ios' && { opacity: 0.7 }
          ]}
        >
          <Text style={styles.promoLink}>View Announcement &gt;</Text>
        </Pressable>
      </View>
      <Image
        source={{
          uri: latestPost?.image || 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=200',
        }}
        style={styles.promoImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  promoBanner: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: Platform.OS === 'android' ? 24 : 14,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Platform.OS === 'ios' ? 4 : 8 },
    shadowOpacity: Platform.OS === 'ios' ? 0.05 : 0.15,
    shadowRadius: Platform.OS === 'ios' ? 8 : 12,
    elevation: Platform.OS === 'android' ? 3 : 0,
    borderWidth: 1,
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  badgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3B82F6',
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
  promoLinkWrapper: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  promoLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  promoImage: {
    width: 120,
    height: '100%',
    borderTopRightRadius: Platform.OS === 'android' ? 24 : 16,
    borderBottomRightRadius: Platform.OS === 'android' ? 24 : 16,
  },
});
