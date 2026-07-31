import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

interface Props {
  count?: number;
  isDark: boolean;
  colors: any;
}

const PARTNER_HOSPITALS = [
  {
    id: 'cloudnine',
    name: 'Cloudnine',
    sub: 'Hospitals',
    logo: require('../../../assets/images/cloudnine_logo.png'),
  },
  {
    id: 'apollo',
    name: 'Apollo',
    sub: 'Hospitals',
    logo: require('../../../assets/images/apollo_logo.png'),
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    sub: "Children's Hospital",
    logo: require('../../../assets/images/rainbow_logo.png'),
  },
  {
    id: 'fortis',
    name: 'Fortis',
    sub: 'Healthcare',
    logo: require('../../../assets/images/fortis_logo.png'),
  },
  {
    id: 'manipal',
    name: 'Manipal',
    sub: 'Hospitals',
    logo: require('../../../assets/images/manipal_logo.png'),
  },
];

export default function PartnerHospitalsCard({ count = 15, isDark, colors }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>
          Partner Hospitals ({count})
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
        {PARTNER_HOSPITALS.map((hosp) => (
          <TouchableOpacity
            key={hosp.id}
            activeOpacity={0.8}
            onPress={() => router.push('/hospital/1' as any)}
            style={[
              styles.hospitalCard,
              {
                backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                borderColor: isDark ? '#2E2E2E' : '#F1F5F9',
              },
            ]}
          >
            <View style={styles.logoWrapper}>
              <Image
                source={hosp.logo}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>
            <Text style={[styles.hospName, { color: colors.text }]} numberOfLines={1}>
              {hosp.name}
            </Text>
            <Text style={styles.hospSub} numberOfLines={1}>
              {hosp.sub}
            </Text>
          </TouchableOpacity>
        ))}

        {/* More Count Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/hospital/list' as any)}
          style={[
            styles.moreCard,
            {
              backgroundColor: isDark ? '#2E1065' : '#F5F3FF',
              borderColor: isDark ? '#4C1D95' : '#EDE9FE',
            },
          ]}
        >
          <Text style={styles.moreCountText}>+{count - 3}</Text>
          <Text style={styles.moreLabelText}>more</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
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
  hospitalCard: {
    width: 106,
    height: 110,
    borderRadius: 18,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  logoWrapper: {
    width: 50,
    height: 40,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  hospName: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  hospSub: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  moreCard: {
    width: 106,
    height: 110,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreCountText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#6527BE',
  },
  moreLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6527BE',
  },
});
