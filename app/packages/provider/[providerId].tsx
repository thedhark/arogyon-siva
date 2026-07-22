import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Star, ShieldCheck } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import ProviderPackageCard from '@/components/packages/ProviderPackageCard';

const { width } = Dimensions.get('window');

const DUMMY_HOSPITAL = {
  id: '1',
  name: 'Cloudnine Hospitals',
  rating: '4.8',
  reviews: '3200',
  location: 'HSR Layout, Bengaluru',
  image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop',
};

const DUMMY_PACKAGES = [
  {
    id: 'pkg_1',
    providerId: '1',
    title: 'Complete Pregnancy Package',
    duration: '40 Weeks',
    startingPrice: '₹24,999',
    image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'pkg_3',
    providerId: '1',
    title: 'High Risk Pregnancy Package',
    duration: '40 Weeks',
    startingPrice: '₹29,999',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop',
  },
];

export default function ProviderPackagesScreen() {
  const { providerId } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} bounces={false}>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image source={{ uri: DUMMY_HOSPITAL.image }} style={styles.heroImage} contentFit="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', isDark ? colors.background : '#FDFDFD']}
            style={styles.heroGradient}
          />
          
          <SafeAreaView edges={['top']} style={styles.headerBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#FFF" />
            </TouchableOpacity>
          </SafeAreaView>

          <View style={styles.heroTitleContainer}>
            <Text style={[styles.heroTitle, { color: isDark ? '#FFF' : '#1A1A1A' }]}>{DUMMY_HOSPITAL.name}</Text>
            <View style={styles.metaRow}>
              <MapPin size={14} color={isDark ? '#CCC' : '#666'} />
              <Text style={[styles.metaText, { color: isDark ? '#CCC' : '#666' }]}>{DUMMY_HOSPITAL.location}</Text>
            </View>
            <View style={styles.ratingRow}>
              <View style={styles.ratingBadge}>
                <Star size={12} color="#FFF" fill="#FFF" />
                <Text style={styles.ratingText}>{DUMMY_HOSPITAL.rating}</Text>
              </View>
              <Text style={[styles.metaText, { color: isDark ? '#CCC' : '#666' }]}>{DUMMY_HOSPITAL.reviews} Reviews</Text>
            </View>
          </View>
        </View>

        {/* Packages List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Packages</Text>
          </View>
          
          <View style={styles.listContainer}>
            {DUMMY_PACKAGES.map((pkg, index) => (
              <Animated.View key={pkg.id} entering={FadeInDown.delay(index * 100)}>
                <ProviderPackageCard 
                  id={pkg.id}
                  providerId={pkg.providerId}
                  title={pkg.title}
                  duration={pkg.duration}
                  startingPrice={pkg.startingPrice}
                  image={pkg.image}
                />
              </Animated.View>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  heroSection: {
    height: 320,
    position: 'relative',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  heroTitleContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#047857',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});
