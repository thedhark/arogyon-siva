import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

import CategoryHeader from '@/components/category/CategoryHeader';
import CategoryTabs from '@/components/category/CategoryTabs';
import RecommendationCard from '@/components/category/RecommendationCard';
import DoctorListItem from '@/components/category/DoctorListItem';
import HospitalListItem from '@/components/category/HospitalListItem';
import CategoryPackageListItem from '@/components/category/CategoryPackageListItem';

import { HOSPITALS_DATA } from '@/constants/directory-data';
import { doctors as HEALTH_DOCTORS } from '@/constants/health';
import { CATEGORY_INDEX_REGISTRY } from '@/constants/package-data';

import PlannedSurgeryCare from '@/components/care/PlannedSurgeryCare';
import InternationalPatientCare from '@/components/care/InternationalPatientCare';
import WomensHealthCare from '@/components/care/WomensHealthCare';
import MensHealthCare from '@/components/care/MensHealthCare';
import PreventiveHealthCare from '@/components/care/PreventiveHealthCare';
import SecondOpinionCare from '@/components/care/SecondOpinionCare';

const TABS = ['Recommended', 'Doctors', 'Hospitals', 'Packages'];

const CATEGORY_META: Record<string, { title: string; subtitle: string; icon: string }> = {
  knee: {
    title: 'Knee Care & Pain Relief',
    subtitle: 'Find top orthopedic doctors, hospitals & surgery packages',
    icon: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=200',
  },
  ortho: {
    title: 'Orthopedics & Joint Care',
    subtitle: 'Expert bone, joint & spine care specialists',
    icon: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=200',
  },
  cardiac: {
    title: 'Cardiology & Heart Care',
    subtitle: 'Comprehensive cardiac checkups & surgery packages',
    icon: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=200',
  },
  skin: {
    title: 'Dermatology & Skin Care',
    subtitle: 'Clinical acne treatments, laser & skincare care plans',
    icon: 'https://images.unsplash.com/photo-1512290900676-26c2a4d4b5b3?q=80&w=200',
  },
  pregnancy: {
    title: 'Pregnancy & Maternity',
    subtitle: 'Maternity packages, 40-week screening & specialist consults',
    icon: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200',
  },
  labs: {
    title: 'Arogyon Labs & Diagnostic Tests',
    subtitle: 'Book NABL certified lab tests, full body checkups & home sample collection',
    icon: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=400',
  },
};

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const rawSlug = (typeof id === 'string' ? id : '').toLowerCase().trim();
  const normalizedId = rawSlug.replace(/[-_]/g, '');

  if (['opinion', 'secondopinion', '2ndopinion', 'second-opinion'].includes(normalizedId)) {
    return <SecondOpinionCare colors={colors} isDark={isDark} />;
  }

  if (['postsurgery', 'plannedsurgery', 'surgery', 'generalsurgery', '5'].includes(normalizedId)) {
    return <PlannedSurgeryCare colors={colors} isDark={isDark} />;
  }

  if (['international', 'internationalcare', 'internationalpatientcare', 'medicaltourism', 'globalcare'].includes(normalizedId)) {
    return <InternationalPatientCare colors={colors} isDark={isDark} />;
  }

  if (['women', 'womens', 'womenshealth', 'gynaecologist', 'gynecology', 'maternity', 'maternitycare', '9'].includes(normalizedId)) {
    return <WomensHealthCare colors={colors} isDark={isDark} />;
  }

  if (['men', 'mens', 'menshealth', 'executivewellness'].includes(normalizedId)) {
    return <MensHealthCare colors={colors} isDark={isDark} />;
  }

  if (['preventive', 'preventivehealth', 'fitness', 'fullbody', 'wellness', 'wellnesscare'].includes(normalizedId)) {
    return <PreventiveHealthCare colors={colors} isDark={isDark} />;
  }

  const categoryId = rawSlug || 'knee';
  const meta = CATEGORY_META[categoryId] ?? {
    title: `${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} Care`,
    subtitle: `Find the best care and specialists for ${categoryId}`,
    icon: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=200',
  };

  const [activeTab, setActiveTab] = useState('Recommended');

  // SSOT Raw Data Sets
  const rawDoctors = useMemo(() => {
    return HEALTH_DOCTORS.map((d, index) => ({
      id: d.id ?? `doc-${index}`,
      name: d.name ?? 'Doctor',
      speciality: d.specialty ?? d.title ?? 'Specialist',
      rating: d.rating ?? '4.8',
      reviews: '1.2K',
      location: d.area ?? 'Bangalore',
      distance: d.distance ?? '2.5 km',
      nextAvailable: 'Today, 4:00 PM',
      verified: true,
      price: d.fee ?? '₹800',
      image: d.image ?? 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200',
    }));
  }, []);

  const rawHospitals = useMemo(() => {
    return HOSPITALS_DATA.map((h, index) => ({
      id: `hosp-${index}`,
      name: h.name,
      rating: h.rating ?? '4.6',
      reviews: '2.4K',
      location: h.location,
      distance: h.distance ?? '< 3.0 km',
      fee: h.fee ?? '₹800 onwards',
      image: h.image,
    }));
  }, []);

  const rawPackages = useMemo(() => {
    const regCategory = CATEGORY_INDEX_REGISTRY[categoryId] ?? CATEGORY_INDEX_REGISTRY['skin'];
    if (regCategory?.packages && regCategory.packages.length > 0) {
      return regCategory.packages.map((pkg) => ({
        id: pkg.id,
        title: pkg.title,
        price: pkg.price,
        originalPrice: pkg.originalPrice,
        discount: pkg.discount,
        image: pkg.image,
      }));
    }
    return [
      {
        id: 'knee-care-pkg-1',
        title: 'Complete Joint & Knee Rehabilitation Care',
        price: '₹18,999',
        originalPrice: '₹25,999',
        discount: 'Save 27%',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=200',
      },
      {
        id: 'knee-care-pkg-2',
        title: 'Advanced Robotic Knee Surgery & Recovery',
        price: '₹1,25,000',
        originalPrice: '₹1,50,000',
        discount: 'Save ₹25,000',
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=200',
      },
    ];
  }, [categoryId]);

  const handleDoctorPress = (docId: string) => {
    router.push({ pathname: '/doctor/[id]', params: { id: docId } });
  };

  const handleHospitalPress = (hospId: string) => {
    router.push({ pathname: '/hospital/[id]', params: { id: hospId } });
  };

  const handlePackagePress = (pkgId: string) => {
    router.push({ pathname: '/packages/category/[id]', params: { id: categoryId } });
  };

  // Tab Content Renderers
  const renderRecommended = () => (
    <View style={styles.tabContent}>
      {/* AI Pick Carousel */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended for you</Text>
          <Text style={styles.sectionSubtitle}>AI picks based on your condition & location</Text>
        </View>
        <View style={styles.bestMatchBadge}>
          <Text style={styles.bestMatchText}>Best Match</Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.horizontalScrollContent}
        style={styles.horizontalScroll}
      >
        <RecommendationCard 
          type="doctor"
          image={rawDoctors[0]?.image ?? 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200'}
          title={rawDoctors[0]?.name ?? 'Dr. Arjun Reddy'}
          subtitle={rawDoctors[0]?.speciality ?? 'Orthopedic Specialist'}
          rating={rawDoctors[0]?.rating ?? '4.8'}
          reviews="1.2K"
          price={rawDoctors[0]?.price ?? '₹800'}
          priceLabel="Consultation"
          buttonText="Book Now"
          onPress={() => handleDoctorPress(rawDoctors[0]?.id ?? 'doc-1')}
          colors={colors}
          isDark={isDark}
        />
        <RecommendationCard 
          type="hospital"
          image={rawHospitals[0]?.image ?? 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=200'}
          title={rawHospitals[0]?.name ?? 'Manipal Hospital'}
          subtitle="Orthopedic Care Center"
          distance={rawHospitals[0]?.distance ?? '2.1 km away'}
          rating={rawHospitals[0]?.rating ?? '4.7'}
          reviews="2.5K"
          price={rawHospitals[0]?.fee ?? '₹600'}
          priceLabel="Consultation from"
          buttonText="View Details"
          onPress={() => handleHospitalPress(rawHospitals[0]?.id ?? 'hosp-1')}
          colors={colors}
          isDark={isDark}
        />
        <RecommendationCard 
          type="package"
          image={rawPackages[0]?.image ?? 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=200'}
          title={rawPackages[0]?.title ?? 'Knee Treatment Package'}
          subtitle="Consultation, Physio & MRI Care"
          price={rawPackages[0]?.price ?? '₹18,999'}
          originalPrice={rawPackages[0]?.originalPrice ?? '₹25,999'}
          discount={rawPackages[0]?.discount ?? 'Save 27%'}
          buttonText="View Package"
          onPress={() => handlePackagePress(rawPackages[0]?.id ?? 'pkg-1')}
          colors={colors}
          isDark={isDark}
        />
      </ScrollView>

      {/* Top Doctors Section */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Doctors</Text>
        <TouchableOpacity onPress={() => setActiveTab('Doctors')}>
          <Text style={styles.viewAllText}>View all ({rawDoctors.length})</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {rawDoctors.slice(0, 3).map((doctor) => (
          <DoctorListItem 
            key={doctor.id}
            {...doctor}
            onPress={() => handleDoctorPress(doctor.id)}
            colors={colors}
            isDark={isDark}
          />
        ))}
      </View>

      {/* Top Hospitals Section */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Hospitals</Text>
        <TouchableOpacity onPress={() => setActiveTab('Hospitals')}>
          <Text style={styles.viewAllText}>View all ({rawHospitals.length})</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {rawHospitals.slice(0, 3).map((hospital) => (
          <HospitalListItem 
            key={hospital.id}
            {...hospital}
            onPress={() => handleHospitalPress(hospital.id)}
            colors={colors}
            isDark={isDark}
          />
        ))}
      </View>

      {/* Top Packages Section */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Packages</Text>
        <TouchableOpacity onPress={() => setActiveTab('Packages')}>
          <Text style={styles.viewAllText}>View all ({rawPackages.length})</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {rawPackages.map((pkg) => (
          <CategoryPackageListItem
            key={pkg.id}
            {...pkg}
            onPress={() => handlePackagePress(pkg.id)}
            colors={colors}
            isDark={isDark}
          />
        ))}
      </View>
    </View>
  );

  const renderDoctorsList = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 14 }]}>
        Specialists in {meta.title} ({rawDoctors.length})
      </Text>
      <View style={styles.listContainer}>
        {rawDoctors.map((doctor) => (
          <DoctorListItem 
            key={doctor.id}
            {...doctor}
            onPress={() => handleDoctorPress(doctor.id)}
            colors={colors}
            isDark={isDark}
          />
        ))}
      </View>
    </View>
  );

  const renderHospitalsList = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 14 }]}>
        Partner Hospitals & Clinics ({rawHospitals.length})
      </Text>
      <View style={styles.listContainer}>
        {rawHospitals.map((hospital) => (
          <HospitalListItem 
            key={hospital.id}
            {...hospital}
            onPress={() => handleHospitalPress(hospital.id)}
            colors={colors}
            isDark={isDark}
          />
        ))}
      </View>
    </View>
  );

  const renderPackagesList = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 14 }]}>
        Care & Surgery Packages ({rawPackages.length})
      </Text>
      <View style={styles.listContainer}>
        {rawPackages.map((pkg) => (
          <CategoryPackageListItem 
            key={pkg.id}
            {...pkg}
            onPress={() => handlePackagePress(pkg.id)}
            colors={colors}
            isDark={isDark}
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#FDFDFD' }}>
      <CategoryHeader 
        title={meta.title}
        subtitle={meta.subtitle}
        icon={meta.icon}
        location="Bengaluru, Karnataka"
        isDark={isDark}
        colors={colors}
      />
      
      <CategoryTabs 
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        colors={colors}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'Recommended' && renderRecommended()}
        {activeTab === 'Doctors' && renderDoctorsList()}
        {activeTab === 'Hospitals' && renderHospitalsList()}
        {activeTab === 'Packages' && renderPackagesList()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  bestMatchBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  bestMatchText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6366F1',
  },
  horizontalScroll: {
    marginBottom: 8,
  },
  horizontalScrollContent: {
    paddingRight: 16,
  },
  listContainer: {
    gap: 0,
  },
});
