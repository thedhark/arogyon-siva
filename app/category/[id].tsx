import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, SlidersHorizontal, ChevronDown } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

import CategoryHeader from '@/components/category/CategoryHeader';
import CategoryTabs from '@/components/category/CategoryTabs';
import RecommendationCard from '@/components/category/RecommendationCard';
import DoctorListItem from '@/components/category/DoctorListItem';

const TABS = ['Recommended', 'Doctors', 'Packages'];

const MOCK_DATA = {
  recommended: [
    {
      id: 'doc-1',
      type: 'doctor' as const,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200',
      title: 'Dr. Arjun Reddy',
      subtitle: 'Orthopedic Specialist',
      experience: '12+ Years Exp.',
      rating: '4.8',
      reviews: '1.2K',
      price: '₹800',
      priceLabel: 'Consultation',
      buttonText: 'Book Now',
    },
    {
      id: 'hosp-1',
      type: 'hospital' as const,
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=200',
      title: 'Manipal Hospital',
      subtitle: 'Orthopedic Care',
      distance: '2.1 km away',
      rating: '4.7',
      reviews: '2.5K',
      price: '₹600',
      priceLabel: 'Consultation from',
      buttonText: 'View Details',
    },
    {
      id: 'knee-care',
      type: 'package' as const,
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=200',
      title: 'Knee Treatment Care Package',
      subtitle: 'Includes Consultation, Physiotherapy & More',
      price: '₹18,999',
      originalPrice: '₹25,999',
      discount: 'Save 27%',
      buttonText: 'View Package',
    }
  ],
  doctors: [
    {
      id: 'doc-1',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200',
      name: 'Dr. Arjun Reddy',
      speciality: 'Orthopedic Specialist',
      rating: '4.8',
      reviews: '1.2K',
      experience: '12+ Years Exp.',
      price: '₹800',
    },
    {
      id: 'doc-3',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200',
      name: 'Dr. Vivek Shetty',
      speciality: 'Orthopedic Specialist',
      rating: '4.7',
      reviews: '982',
      experience: '10+ Years Exp.',
      price: '₹700',
    },
    {
      id: 'doc-2',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200',
      name: 'Dr. Priya Sharma',
      speciality: 'Joint Replacement Surgeon',
      rating: '4.9',
      reviews: '1.5K',
      experience: '15+ Years Exp.',
      price: '₹1000',
    }
  ],
  packages: [
    {
      id: 'knee-care',
      title: 'Complete Knee Care & Surgery Package',
      subtitle: 'Includes MRI, Pre-op Consultation & 3 Physio Sessions',
      price: '₹18,999',
      originalPrice: '₹25,999',
    },
    {
      id: 'ortho-rehab',
      title: 'Advanced Joint Rehabilitation',
      subtitle: 'Post-op rehabilitation with dedicated specialist',
      price: '₹12,499',
      originalPrice: '₹16,000',
    }
  ]
};

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('Recommended');

  const handleItemPress = (item: any) => {
    if (item.type === 'doctor' || item.id?.startsWith('doc')) {
      router.push({ pathname: '/doctor/[id]', params: { id: item.id } });
    } else if (item.type === 'hospital' || item.id?.startsWith('hosp')) {
      router.push({ pathname: '/hospital/[id]', params: { id: item.id } });
    } else {
      router.push({ pathname: '/packages/category/[id]', params: { id: 'ortho' } });
    }
  };

  const renderRecommended = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended for you</Text>
          <Text style={styles.sectionSubtitle}>AI picks based on your condition</Text>
        </View>
        <View style={styles.bestMatchBadge}>
          <Text style={styles.bestMatchText}>Best Match</Text>
        </View>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={styles.horizontalScrollContent}>
        {MOCK_DATA.recommended.map((item) => (
          <RecommendationCard 
            key={item.id}
            {...item}
            onPress={() => handleItemPress(item)}
            colors={colors}
            isDark={isDark}
          />
        ))}
      </ScrollView>

      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Orthopedic Doctors</Text>
        <TouchableOpacity onPress={() => setActiveTab('Doctors')}>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.listContainer}>
        {MOCK_DATA.doctors.map((doctor) => (
          <DoctorListItem 
            key={doctor.id}
            {...doctor}
            onPress={() => router.push({ pathname: '/doctor/[id]', params: { id: doctor.id } })}
            colors={colors}
            isDark={isDark}
          />
        ))}
      </View>
    </View>
  );

  const renderDoctorsList = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>Specialists in this Category</Text>
      <View style={styles.listContainer}>
        {MOCK_DATA.doctors.map((doctor) => (
          <DoctorListItem 
            key={doctor.id}
            {...doctor}
            onPress={() => router.push({ pathname: '/doctor/[id]', params: { id: doctor.id } })}
            colors={colors}
            isDark={isDark}
          />
        ))}
      </View>
    </View>
  );

  const renderPackagesList = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Packages</Text>
      {MOCK_DATA.packages.map((pkg) => (
        <TouchableOpacity
          key={pkg.id}
          style={[styles.packageCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}
          onPress={() => router.push({ pathname: '/packages/category/[id]', params: { id: 'ortho' } })}
        >
          <Text style={[styles.packageTitle, { color: colors.text }]}>{pkg.title}</Text>
          <Text style={styles.packageSubtitle}>{pkg.subtitle}</Text>
          <View style={styles.packagePriceRow}>
            <Text style={[styles.packagePrice, { color: colors.text }]}>{pkg.price}</Text>
            <Text style={styles.packageOriginalPrice}>{pkg.originalPrice}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#FDFDFD' }}>
      <CategoryHeader 
        title="Knee Pain"
        subtitle="Find the best care for your knee pain"
        icon="https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=200"
        isDark={isDark}
        colors={colors}
      />
      
      <CategoryTabs 
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        colors={colors}
      />
      
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.locationSelector}>
          <MapPin size={16} color={colors.text} />
          <Text style={[styles.locationText, { color: colors.text }]}>Bangalore, Karnataka</Text>
          <ChevronDown size={16} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.filterButton, { borderColor: isDark ? '#333' : '#E5E7EB' }]}>
          <SlidersHorizontal size={14} color="#6366F1" />
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'Recommended' && renderRecommended()}
        {activeTab === 'Doctors' && renderDoctorsList()}
        {activeTab === 'Packages' && renderPackagesList()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  tabContent: {
    paddingHorizontal: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  bestMatchBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bestMatchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6366F1',
  },
  horizontalScroll: {
    marginHorizontal: 0,
  },
  horizontalScrollContent: {
    paddingHorizontal: 12,
  },
  listContainer: {
    gap: 0,
  },
  placeholderContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  packageCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  packageSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  packagePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: '900',
  },
  packageOriginalPrice: {
    fontSize: 13,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  }
});
