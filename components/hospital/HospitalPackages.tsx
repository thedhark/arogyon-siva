import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Star, ShieldCheck, Clock, CircleParking, Stethoscope, Bed, Heart, Check, CreditCard, ArrowRight, Sparkles, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Props {
  colors: any;
  isDark: boolean;
  hospitalName?: string;
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
  badge?: string;
}

const PACKAGE_CATEGORIES = [
  { id: 'all', name: 'All Packages' },
  { id: 'pregnancy', name: 'Pregnancy & Maternity' },
  { id: 'cardiac', name: 'Cardiac Care' },
  { id: 'diabetes', name: 'Diabetes & Metabolism' },
  { id: 'knee', name: 'Knee & Joint Recovery' },
  { id: 'gastro', name: 'Gastro & Digestive' },
  { id: 'hernia', name: 'Hernia Repair' },
  { id: 'rehab', name: 'Rehab & Physio' },
];

const MOCK_PACKAGES: HealthPackage[] = [
  {
    id: 'pkg-preg-1',
    category: 'Pregnancy Care',
    categorySlug: 'pregnancy',
    title: 'Complete Maternity Care Package',
    subtitle: 'Full pregnancy cover, trimesters 1-3, ultrasound scans & normal/C-sec delivery',
    price: '₹45,000',
    originalPrice: '₹60,000',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600',
    inclusions: ['Gynaecologist Consults', '2D/3D Scans', 'Labor Room', 'Postnatal Care'],
    badge: 'Popular'
  },
  {
    id: 'pkg-preg-2',
    category: 'Pregnancy Care',
    categorySlug: 'pregnancy',
    title: 'Premium Delivery & Luxury Suite Package',
    subtitle: 'Private luxury room delivery, pediatrician cover, lactation therapy & baby care kit',
    price: '₹75,000',
    originalPrice: '₹95,000',
    discount: '21% OFF',
    image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=600',
    inclusions: ['Luxury Private Suite', 'Pediatrician On-Call', 'Gdm Screening', 'Baby Gift Hamper'],
    badge: 'Premium'
  },
  {
    id: 'pkg-cardiac-1',
    category: 'Cardiac Care',
    categorySlug: 'cardiac',
    title: 'Comprehensive Heart Checkup & Echo',
    subtitle: 'ECG, TMT, 2D Echo, Lipid profile, Cardiac consult & Risk Assessment',
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
    subtitle: 'Robotic total knee replacement, implant, 4-day room stay & 10 physio sessions',
    price: '₹1,85,000',
    originalPrice: '₹2,20,000',
    discount: '16% OFF',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=600',
    inclusions: ['Robotic Surgery', 'US FDA Implant', '4 Days Private Room', '10 Physio Sessions'],
    badge: 'Advanced'
  },
  {
    id: 'pkg-diab-1',
    category: 'Diabetes & Metabolism',
    categorySlug: 'diabetes',
    title: 'Annual Diabetes Reversal & Management',
    subtitle: 'HbA1c quarterly tests, endocrinologist visits, continuous glucose monitor & diet',
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
    subtitle: 'Upper GI endoscopy, liver function test, H. pylori scan & gastroenterology consult',
    price: '₹8,999',
    originalPrice: '₹12,000',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600',
    inclusions: ['Painless Endoscopy', 'LFT & Ultrasound', 'Gut Specialist Consult', 'Biopsy Included'],
  },
  {
    id: 'pkg-hernia-1',
    category: 'Hernia Repair',
    categorySlug: 'hernia',
    title: 'Laparoscopic 3D Mesh Hernia Surgery',
    subtitle: 'Keyhole minimally invasive hernia repair, 3D mesh implant & 1-day day care stay',
    price: '₹55,000',
    originalPrice: '₹70,000',
    discount: '21% OFF',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=600',
    inclusions: ['3D Mesh Implant', 'Keyhole Laparoscopic', 'Daycare Room Stay', 'Followup Visits'],
  },
];

export default function HospitalPackages({ colors, isDark, hospitalName }: Props) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPackages = selectedCategory === 'all'
    ? MOCK_PACKAGES
    : MOCK_PACKAGES.filter(p => p.categorySlug === selectedCategory);

  const handleCardPress = (pkg: HealthPackage) => {
    router.push({
      pathname: '/packages/category/[id]',
      params: { id: pkg.categorySlug },
    } as any);
  };

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
          const isActive = selectedCategory === cat.id;
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
              onPress={() => setSelectedCategory(cat.id)}
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

      {/* Top to Bottom Scroll List of Package Cards */}
      <View style={styles.packageList}>
        {filteredPackages.map((pkg) => (
          <Pressable
            key={pkg.id}
            style={({ pressed }) => [
              styles.cardContainer,
              {
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                borderColor: isDark ? '#2C2C2E' : '#E5E7EB',
              },
              pressed && Platform.OS === 'ios' && { transform: [{ scale: 0.98 }], opacity: 0.95 }
            ]}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            onPress={() => handleCardPress(pkg)}
          >
            {/* Top Banner Row */}
            <View style={styles.cardHeaderRow}>
              <Image source={{ uri: pkg.image }} style={styles.cardImage} contentFit="cover" />
              <View style={styles.cardInfoCol}>
                <View style={styles.badgeRow}>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{pkg.discount}</Text>
                  </View>
                  {pkg.badge && (
                    <View style={[styles.tagBadge, { backgroundColor: isDark ? '#3B0764' : '#F3E8FF' }]}>
                      <Sparkles size={10} color="#7C3AED" />
                      <Text style={[styles.tagText, { color: '#7C3AED' }]}>{pkg.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.packageTitle, { color: colors.text }]} numberOfLines={2}>
                  {pkg.title}
                </Text>
                <Text style={[styles.packageSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]} numberOfLines={2}>
                  {pkg.subtitle}
                </Text>
              </View>
            </View>

            {/* Inclusions Row */}
            <View style={[styles.inclusionsBox, { backgroundColor: isDark ? '#2A2A2D' : '#F9FAFB' }]}>
              {pkg.inclusions.map((item, idx) => (
                <View key={idx} style={styles.inclusionItem}>
                  <Check size={12} color="#10B981" />
                  <Text style={[styles.inclusionText, { color: isDark ? '#D1D5DB' : '#374151' }]} numberOfLines={1}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>

            {/* Price Footer */}
            <View style={styles.cardFooter}>
              <View style={styles.priceCol}>
                <Text style={styles.startsFromText}>Package Price</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceVal}>{pkg.price}</Text>
                  <Text style={styles.origPriceVal}>{pkg.originalPrice}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.bookBtn} 
                onPress={() => handleCardPress(pkg)}
              >
                <Text style={styles.bookBtnText}>Explore Catalog</Text>
                <ChevronRight size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Pressable>
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
