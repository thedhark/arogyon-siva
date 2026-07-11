import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, ArrowRight } from 'lucide-react-native';

export default function CarePromoBanner() {
  return (
    <View style={styles.bannerContainer}>
      <LinearGradient colors={['#10B981', '#059669']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
        <View style={styles.bannerContent}>
          <View style={styles.bannerBadge}>
            <Activity size={10} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.bannerBadgeText}>Care that stays with you</Text>
          </View>
          <Text style={styles.bannerTitle}>From Consultation to Recovery</Text>
          <Text style={styles.bannerSubtitle}>All your healthcare needs in one place</Text>
          <TouchableOpacity style={styles.exploreBtn}>
            <Text style={styles.exploreText}>Explore Plans</Text>
            <ArrowRight size={14} color="#059669" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1576091160550-2173ff9e5eb3?q=80&w=300' }} style={styles.bannerImage} resizeMode="cover" />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    paddingHorizontal: 12,
    marginBottom: 32,
  },
  banner: {
    borderRadius: 20,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    padding: 20,
    zIndex: 1,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  bannerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
    lineHeight: 24,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginBottom: 16,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exploreText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 12,
  },
  bannerImage: {
    width: '40%',
    height: '100%',
    position: 'absolute',
    right: 0,
    opacity: 0.9,
  },
});
