import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import ProviderPackageCard from '@/components/packages/ProviderPackageCard';

interface Props {
  colors: any;
  isDark: boolean;
  hospitalName?: string;
  selectedCategory?: string;
  onSelectCategory?: (catId: string) => void;
}

interface HealthPackage {
  id: string;
  category: string;
  categorySlug: string;
  title: string;
  subtitle: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  inclusions: string[];
  badge?: { text: string; icon: string; color: string; bgColor: string };
}

export const PACKAGE_CATEGORIES = [
  { id: 'all', name: 'All Packages', count: 7 },
  { id: 'pregnancy', name: 'Pregnancy & Maternity', count: 2 },
  { id: 'cardiac', name: 'Cardiac Care', count: 1 },
  { id: 'diabetes', name: 'Diabetes & Metabolism', count: 1 },
  { id: 'knee', name: 'Knee & Joint Recovery', count: 1 },
  { id: 'gastro', name: 'Gastro & Digestive', count: 1 },
  { id: 'hernia', name: 'Hernia Repair', count: 1 },
  { id: 'rehab', name: 'Rehab & Physio', count: 1 },
];

export const MOCK_PACKAGES: HealthPackage[] = [
  {
    id: 'pkg-preg-1',
    category: 'Pregnancy Care',
    categorySlug: 'pregnancy',
    title: 'Complete Maternity Care Package',
    subtitle: 'Full pregnancy cover, trimesters 1-3, scans & delivery',
    price: '₹45,000',
    originalPrice: '₹60,000',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600',
    inclusions: ['Gynaecologist Consults', '2D/3D Scans', 'Labor Room Stay', 'Postnatal Care'],
    badge: { text: 'Popular', icon: 'flame', color: '#EF4444', bgColor: '#FEE2E2' }
  },
  {
    id: 'pkg-preg-2',
    category: 'Pregnancy Care',
    categorySlug: 'pregnancy',
    title: 'Premium Delivery & Luxury Suite Package',
    subtitle: 'Private luxury suite delivery & pediatrician cover',
    price: '₹75,000',
    originalPrice: '₹95,000',
    discount: '21% OFF',
    image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=600',
    inclusions: ['Luxury Private Suite', 'Pediatrician On-Call', 'Gdm Screening', 'Baby Gift Hamper'],
    badge: { text: 'Premium', icon: 'sparkles', color: '#7C3AED', bgColor: '#F3E8FF' }
  },
  {
    id: 'pkg-cardiac-1',
    category: 'Cardiac Care',
    categorySlug: 'cardiac',
    title: 'Comprehensive Heart Checkup & Echo',
    subtitle: 'ECG, TMT, 2D Echo, Lipid profile & Cardiac consult',
    price: '₹4,999',
    originalPrice: '₹8,500',
    discount: '41% OFF',
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=600',
    inclusions: ['2D Echo Test', 'TMT Stress Test', 'Cardiologist Consult', 'Lipid Panel'],
  },
  {
    id: 'pkg-knee-1',
    category: 'Knee & Joint Recovery',
    categorySlug: 'knee',
    title: '3D Robot-Assisted Knee Surgery Package',
    subtitle: 'Robotic knee replacement, implant & 10 physio sessions',
    price: '₹1,85,000',
    originalPrice: '₹2,20,000',
    discount: '16% OFF',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=600',
    inclusions: ['Robotic Surgery', 'US FDA Implant', '4 Days Room Stay', '10 Physio Sessions'],
    badge: { text: 'Advanced', icon: 'diamond', color: '#3B82F6', bgColor: '#DBEAFE' }
  },
  {
    id: 'pkg-diab-1',
    category: 'Diabetes & Metabolism',
    categorySlug: 'diabetes',
    title: 'Annual Diabetes Reversal & Management',
    subtitle: 'HbA1c quarterly tests & continuous glucose monitor',
    price: '₹12,499',
    originalPrice: '₹16,000',
    discount: '22% OFF',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600',
    inclusions: ['4x HbA1c Tests', 'Endocrinologist Consult', 'Dietitian Plan', 'CGM Sensor'],
  },
  {
    id: 'pkg-gastro-1',
    category: 'Gastro & Digestive',
    categorySlug: 'gastro',
    title: 'Advanced Endoscopy & Gut Wellness',
    subtitle: 'Upper GI endoscopy, LFT & gastroenterology consult',
    price: '₹8,999',
    originalPrice: '₹12,000',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600',
    inclusions: ['Painless Endoscopy', 'LFT & Ultrasound', 'Gut Specialist Consult'],
  },
  {
    id: 'pkg-hernia-1',
    category: 'Hernia Repair',
    categorySlug: 'hernia',
    title: 'Laparoscopic 3D Mesh Hernia Surgery',
    subtitle: 'Keyhole hernia repair, 3D mesh implant & 1-day stay',
    price: '₹55,000',
    originalPrice: '₹70,000',
    discount: '21% OFF',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=600',
    inclusions: ['3D Mesh Implant', 'Keyhole Laparoscopic', 'Daycare Stay', 'Followup Visits'],
  },
];

export default function HospitalPackages({ colors, isDark, hospitalName = 'Hospital', selectedCategory: externalCategory, onSelectCategory }: Props) {
  const router = useRouter();
  const [internalCategory, setInternalCategory] = useState('all');

  const activeCategory = externalCategory !== undefined ? externalCategory : internalCategory;

  const handleCategoryPress = (catId: string) => {
    setInternalCategory(catId);
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  const filteredPackages = activeCategory === 'all'
    ? MOCK_PACKAGES
    : MOCK_PACKAGES.filter(p => p.categorySlug === activeCategory);

  return (
    <View style={styles.container}>
      {/* Category Pills Header */}
      <View style={styles.categoriesHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Health Packages Catalog</Text>
        <Text style={[styles.sectionSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Transparent package pricing with cashless insurance support
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.categoryPillsScroll}
      >
        {PACKAGE_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: isActive
                    ? '#7C3AED'
                    : isDark ? '#1E1E1E' : '#F3F4F6',
                  borderColor: isActive
                    ? '#7C3AED'
                    : isDark ? '#333333' : '#E5E7EB',
                }
              ]}
              onPress={() => handleCategoryPress(cat.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  { color: isActive ? '#FFFFFF' : isDark ? '#D1D5DB' : '#4B5563' }
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Top to Bottom Scroll List of Reusable Provider Package Cards */}
      <View style={styles.packageList}>
        {filteredPackages.map((pkg, idx) => (
          <ProviderPackageCard
            key={pkg.id}
            id={pkg.id}
            providerId="1"
            title={pkg.title}
            duration={pkg.subtitle}
            startingPrice={pkg.price}
            hospitalName={hospitalName}
            hospitalLogo={pkg.image}
            location="Bangalore"
            distance="2.5 km"
            badge={pkg.badge}
            inclusions={pkg.inclusions}
            image={pkg.image}
            index={idx}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  categoriesHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  categoryPillsScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  packageList: {
    gap: 16,
  },
  cardContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  cardInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  discountBadge: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#03543F',
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  packageTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
    lineHeight: 20,
  },
  packageSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  inclusionsBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    borderRadius: 10,
    gap: 10,
    marginBottom: 12,
  },
  inclusionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '47%',
  },
  inclusionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  priceCol: {
    justifyContent: 'center',
  },
  startsFromText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  priceVal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#10B981',
  },
  origPriceVal: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
