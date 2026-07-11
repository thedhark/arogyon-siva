import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, ArrowUpDown } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

import ProviderListCard from '@/components/care/ProviderListCard';
import ServiceListingHeader from '@/components/care/ServiceListingHeader';

const PROVIDERS = [
  {
    id: 'physio-1',
    name: 'Dr. Arjun Mehta',
    verified: true,
    topRated: true,
    speciality: 'Sports Physiotherapist',
    experience: '7+ Years Experience',
    rating: '4.9',
    reviews: '256',
    location: 'Koramangala',
    distance: '1.2 km',
    nextAvailable: 'Today, 10:00 AM',
    price: '₹699',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200',
    type: 'doctor'
  },
  {
    id: 'physio-2',
    name: 'Dr. Neha Sharma',
    verified: false,
    topRated: false,
    speciality: 'Neurological Physiotherapist',
    experience: '5+ Years Experience',
    rating: '4.8',
    reviews: '182',
    location: 'HSR Layout',
    distance: '2.1 km',
    nextAvailable: 'Today, 11:30 AM',
    price: '₹699',
    image: 'https://images.unsplash.com/photo-1594824436998-d50d0eb3f3df?q=80&w=200',
    type: 'doctor'
  },
  {
    id: 'physio-3',
    name: 'PhysioMotion Clinic',
    verified: false,
    topRated: false,
    speciality: 'Multi Speciality Rehab Center',
    experience: '',
    rating: '4.7',
    reviews: '312',
    location: 'Koramangala',
    distance: '1.5 km',
    nextAvailable: 'Today, 09:00 AM',
    price: '₹499',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200',
    type: 'clinic'
  },
];

const FILTERS = ['All', 'Clinic', 'At Home', 'Rehab Center'];

export default function ServiceListing() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  const title = id === 'physio' ? 'Physiotherapy' : 'Service';
  const subtitle = 'Find expert care to help you move better';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#FDFDFD' }}>
      
      <ServiceListingHeader 
        title={title} 
        subtitle={subtitle} 
        colors={colors} 
        isDark={isDark} 
      />

      {/* Filters Row */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {FILTERS.map(f => (
            <TouchableOpacity 
              key={f} 
              style={[
                styles.filterPill, 
                { 
                  backgroundColor: activeFilter === f ? '#10B981' : isDark ? '#1E1E1E' : '#FFFFFF',
                  borderColor: activeFilter === f ? '#10B981' : isDark ? '#333' : '#E5E7EB'
                }
              ]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[
                styles.filterText, 
                { color: activeFilter === f ? '#FFFFFF' : colors.text }
              ]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Location Bar */}
      <View style={[styles.locationBar, { borderBottomColor: isDark ? '#333' : '#F3F4F6' }]}>
        <View style={styles.locationLeft}>
          <MapPin size={16} color="#6B7280" />
          <Text style={[styles.locationText, { color: colors.text }]}>Koramangala, Bangalore</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: colors.text }]}>Top Physiotherapists</Text>
          <TouchableOpacity style={styles.sortBtn}>
            <Text style={styles.sortText}>Sort</Text>
            <ArrowUpDown size={14} color="#6B7280" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {PROVIDERS.map(p => (
          <ProviderListCard 
            key={p.id}
            image={p.image}
            name={p.name}
            verified={p.verified}
            topRated={p.topRated}
            speciality={p.speciality}
            experience={p.experience}
            rating={p.rating}
            reviews={p.reviews}
            location={p.location}
            distance={p.distance}
            nextAvailable={p.nextAvailable}
            price={p.price}
            onPress={() => router.push({ pathname: '/doctor/[id]', params: { id: p.id } })}
            colors={colors}
            isDark={isDark}
          />
        ))}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filtersScroll: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  locationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  changeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  }
});
