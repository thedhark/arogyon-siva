import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';

interface Props {
  isDark: boolean;
  colors: any;
}

const SIMILAR_HOSPITAL_PACKAGES = [
  {
    id: 'cloudnine',
    hospitalName: 'Cloudnine',
    packageTitle: 'Luxury Maternity Suite',
    price: '₹ 24,999',
    rating: '4.9',
    logo: require('../../../assets/images/cloudnine_logo.png'),
    route: '/packages/detail/complete-maternity-care',
  },
  {
    id: 'apollo',
    hospitalName: 'Apollo Cradle',
    packageTitle: 'Trimester 1-3 Complete',
    price: '₹ 22,499',
    rating: '4.8',
    logo: require('../../../assets/images/apollo_logo.png'),
    route: '/packages/detail/standard-maternity-care',
  },
  {
    id: 'rainbow',
    hospitalName: 'Rainbow Hospitals',
    packageTitle: 'Advanced Pregnancy Plan',
    price: '₹ 26,999',
    rating: '4.9',
    logo: require('../../../assets/images/rainbow_logo.png'),
    route: '/packages/detail/advanced-pregnancy-package',
  },
  {
    id: 'fortis',
    hospitalName: 'Fortis La Femme',
    packageTitle: 'Premium Delivery Care',
    price: '₹ 28,000',
    rating: '4.7',
    logo: require('../../../assets/images/fortis_logo.png'),
    route: '/packages/detail/premium-delivery-package',
  },
  {
    id: 'manipal',
    hospitalName: 'Manipal Hospitals',
    packageTitle: 'Basic Maternity Care',
    price: '₹ 19,999',
    rating: '4.7',
    logo: require('../../../assets/images/manipal_logo.png'),
    route: '/packages/detail/basic-delivery-package',
  },
];

export default function SimilarPackagesCard({ isDark, colors }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>
          Similar Packages
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/hospital/list' as any)}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {SIMILAR_HOSPITAL_PACKAGES.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => router.push(item.route as any)}
            style={[
              styles.card,
              {
                backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                borderColor: isDark ? '#2E2E2E' : '#F1F5F9',
              },
            ]}
          >
            <View style={styles.logoWrapper}>
              <Image
                source={item.logo}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>

            <Text style={[styles.hospName, { color: colors.text }]} numberOfLines={1}>
              {item.hospitalName}
            </Text>

            <Text style={styles.pkgTitle} numberOfLines={1}>
              {item.packageTitle}
            </Text>

            <View style={styles.bottomRow}>
              <Text style={[styles.priceText, { color: colors.text }]}>{item.price}</Text>
              <View style={styles.ratingBadge}>
                <Star size={10} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: -16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  seeAllText: {
    color: '#6527BE',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 144,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  logoWrapper: {
    width: 44,
    height: 34,
    marginBottom: 8,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  hospName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  pkgTitle: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  priceText: {
    fontSize: 13,
    fontWeight: '800',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
});
