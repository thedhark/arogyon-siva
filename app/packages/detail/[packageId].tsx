import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Share2, ShieldCheck, CheckCircle2, Hospital, MapPin, Sparkles, ChevronRight, Award, Stethoscope, Clock } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { getPackageById } from '@/constants/package-data';

export default function DynamicPackageDetailScreen() {
  const { packageId } = useLocalSearchParams<{ packageId: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const pkg = getPackageById(packageId || 'default-package');

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${pkg.title} on Arogyon Premium for ${pkg.price}!`,
      });
    } catch (error) {
      console.warn(error);
    }
  };

  const handleBookNow = () => {
    router.push({
      pathname: `/packages/checkout/${pkg.id}` as any,
      params: { title: pkg.title, price: pkg.price },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FA' }]}>
      <SafeAreaView edges={['top']} style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>Package Details</Text>
        <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
          <Share2 size={20} color={colors.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Banner Image */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.imageContainer}>
          <Image source={{ uri: pkg.image }} style={styles.bannerImage} contentFit="cover" />
          <View style={styles.discountTag}>
            <Text style={styles.discountTagText}>{pkg.discount}</Text>
          </View>
        </Animated.View>

        {/* Title & Pricing Card */}
        <Animated.View entering={FadeInDown.delay(150)} style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <Text style={[styles.packageTitle, { color: colors.text }]}>{pkg.title}</Text>
          <Text style={styles.summaryText}>{pkg.summary}</Text>

          <View style={styles.providerRow}>
            <Hospital size={16} color="#0D9488" />
            <Text style={[styles.providerName, { color: colors.text }]}>{pkg.hospitalName}</Text>
            <Text style={styles.providerDot}>•</Text>
            <MapPin size={14} color="#666" />
            <Text style={styles.providerLocation}>{pkg.hospitalLocation}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Package Price</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                <Text style={[styles.currentPrice, { color: colors.text }]}>{pkg.price}</Text>
                <Text style={styles.originalPrice}>{pkg.originalPrice}</Text>
              </View>
            </View>

            <View style={styles.testsBadge}>
              <Sparkles size={14} color="#0D9488" />
              <Text style={styles.testsBadgeText}>{pkg.testsCount}+ Inclusions</Text>
            </View>
          </View>
        </Animated.View>

        {/* Key Inclusions List */}
        <Animated.View entering={FadeInDown.delay(200)} style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>What's Included in this Package</Text>
          
          <View style={styles.inclusionsList}>
            {pkg.inclusions.map((item, index) => (
              <View key={index} style={styles.inclusionRow}>
                <CheckCircle2 size={18} color="#10B981" />
                <Text style={[styles.inclusionItemText, { color: colors.text }]}>{item}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Arogyon Promise / Guarantee */}
        <Animated.View entering={FadeInDown.delay(250)} style={[styles.card, styles.promiseCard, { backgroundColor: isDark ? '#1E1E1E' : '#F0FDFA' }]}>
          <ShieldCheck size={28} color="#0D9488" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.promiseTitle, { color: colors.text }]}>100% Arogyon Quality Assurance</Text>
            <Text style={styles.promiseSub}>NABH Accredited Hospitals, verified doctor consults & zero hidden charges.</Text>
          </View>
        </Animated.View>

      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View>
          <Text style={styles.bottomPriceLabel}>Total Amount</Text>
          <Text style={[styles.bottomPriceValue, { color: colors.text }]}>{pkg.price}</Text>
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Package</Text>
          <ChevronRight size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  scrollContent: { padding: 16, paddingBottom: 120 },
  imageContainer: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  bannerImage: { width: '100%', height: '100%' },
  discountTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountTagText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  packageTitle: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  summaryText: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 12 },
  providerRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  providerName: { fontSize: 13, fontWeight: '700' },
  providerDot: { color: '#AAA' },
  providerLocation: { fontSize: 12, color: '#666' },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginVertical: 14 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 12, color: '#666', fontWeight: '500' },
  currentPrice: { fontSize: 22, fontWeight: '900' },
  originalPrice: { fontSize: 14, color: '#9CA3AF', textDecorationLine: 'line-through' },
  testsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  testsBadgeText: { fontSize: 13, fontWeight: '700', color: '#0D9488' },
  sectionHeading: { fontSize: 16, fontWeight: '800', marginBottom: 14 },
  inclusionsList: { gap: 10 },
  inclusionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inclusionItemText: { fontSize: 14, fontWeight: '600', flex: 1 },
  promiseCard: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  promiseTitle: { fontSize: 14, fontWeight: '800' },
  promiseSub: { fontSize: 12, color: '#666', marginTop: 2, lineHeight: 16 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomPriceLabel: { fontSize: 11, color: '#666' },
  bottomPriceValue: { fontSize: 22, fontWeight: '900' },
  bookButton: {
    backgroundColor: '#0D9488',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 20,
    gap: 6,
  },
  bookButtonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
