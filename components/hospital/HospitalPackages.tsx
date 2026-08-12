import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Search, SlidersHorizontal, X, CheckCircle2, HeartPulse, Stethoscope, Activity } from 'lucide-react-native';
import PackageItemCard from '@/components/packages/cards/PackageItemCard';
import { Fonts } from '@/constants/theme';

interface Props {
  colors: any;
  isDark: boolean;
  hospitalName?: string;
  selectedCategory?: string;
  onSelectCategory?: (catId: string) => void;
  searchQuery?: string;
  onAddPackagePress?: (packageItem: any) => void;
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
}

export const PACKAGE_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'pregnancy', name: 'Pregnancy & Maternity' },
  { id: 'cardiac', name: 'Cardiac Care' },
  { id: 'diabetes', name: 'Diabetes' },
  { id: 'knee', name: 'Knee & Joint' },
];

export const ALL_PACKAGE_CATEGORIES = [
  { id: 'all', name: 'All Packages' },
  { id: 'pregnancy', name: 'Pregnancy & Maternity' },
  { id: 'cardiac', name: 'Cardiac Care' },
  { id: 'diabetes', name: 'Diabetes & Metabolism' },
  { id: 'knee', name: 'Knee & Joint Recovery' },
  { id: 'gastro', name: 'Gastro & Digestive' },
  { id: 'hernia', name: 'Hernia Repair' },
  { id: 'rehab', name: 'Rehab & Physio' },
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
  },
  {
    id: 'pkg-preg-2',
    category: 'Pregnancy Care',
    categorySlug: 'pregnancy',
    title: 'Premium Delivery Suite Package',
    subtitle: 'Private luxury suite delivery & pediatrician cover',
    price: '₹75,999',
    originalPrice: '₹90,000',
    discount: '15% OFF',
    image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=600',
    inclusions: ['Luxury Private Suite', 'Pediatrician On-Call', 'Gdm Screening', 'Baby Gift Hamper'],
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
    title: '3D Robot-Assisted Knee Surgery',
    subtitle: 'Robotic knee replacement, implant & 10 physio sessions',
    price: '₹1,85,000',
    originalPrice: '₹2,20,000',
    discount: '16% OFF',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=600',
    inclusions: ['Robotic Surgery', 'US FDA Implant', '4 Days Room Stay', '10 Physio Sessions'],
  },
  {
    id: 'pkg-diab-1',
    category: 'Diabetes & Metabolism',
    categorySlug: 'diabetes',
    title: 'Annual Diabetes Reversal Plan',
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

export default function HospitalPackages({ colors, isDark, hospitalName = 'Hospital', selectedCategory: externalCategory, onSelectCategory, searchQuery: externalSearchQuery = '', onAddPackagePress }: Props) {
  const router = useRouter();
  const [internalCategory, setInternalCategory] = useState('all');
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const activeCategory = externalCategory !== undefined ? externalCategory : internalCategory;

  const handleCategoryPress = (catId: string) => {
    setInternalCategory(catId);
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  const filteredPackages = useMemo(() => {
    const query = (externalSearchQuery || '').trim().toLowerCase();
    return MOCK_PACKAGES.filter(p => {
      const matchCat = activeCategory === 'all' || p.categorySlug === activeCategory;
      const matchQuery = !query || p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });
  }, [activeCategory, externalSearchQuery]);

  const groupedPackages = useMemo(() => {
    const groups: { [key: string]: { categoryName: string; packages: HealthPackage[] } } = {};
    filteredPackages.forEach((pkg) => {
      if (!groups[pkg.categorySlug]) {
        groups[pkg.categorySlug] = {
          categoryName: pkg.category,
          packages: [],
        };
      }
      groups[pkg.categorySlug].packages.push(pkg);
    });
    return Object.values(groups);
  }, [filteredPackages]);

  const handleViewPackage = (pkgId: string) => {
    router.push(`/packages/detail/${pkgId}` as any);
  };

  return (
    <View style={styles.container}>

      {/* Sleek, Compact Category Scroll Pills matching Doctors module */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.categoryPillsScroll}
      >
        {PACKAGE_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          if (cat.id === 'all') {
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.allPill,
                  {
                    backgroundColor: isActive ? (isDark ? '#38BDF8' : '#0F172A') : (isDark ? '#27272A' : '#F8FAFC'),
                    borderColor: isActive ? 'transparent' : (isDark ? '#3F3F46' : '#E2E8F0'),
                  },
                ]}
                onPress={() => handleCategoryPress('all')}
                activeOpacity={0.8}
              >
                <Text style={[styles.allPillText, { color: isActive ? (isDark ? '#0F172A' : '#FFFFFF') : colors.text }]}>
                  All
                </Text>
                {isActive && <View style={[styles.allUnderline, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]} />}
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: isActive ? (isDark ? '#2E1065' : '#F3E8FF') : (isDark ? '#1E1E24' : '#FFFFFF'),
                  borderColor: isActive ? '#7C3AED' : (isDark ? '#333333' : '#E2E8F0'),
                }
              ]}
              onPress={() => handleCategoryPress(cat.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  { color: isActive ? '#7C3AED' : (isDark ? '#E2E8F0' : '#1E293B'), fontWeight: isActive ? '700' : '600' }
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* "+More" Pill (Interactive) */}
        <TouchableOpacity
          style={[styles.morePill, { borderColor: isDark ? '#3F3F46' : '#E2E8F0', backgroundColor: isDark ? '#1E1E24' : '#FFFFFF' }]}
          activeOpacity={0.7}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={[styles.morePillText, { color: isDark ? '#CBD5E1' : '#334155' }]}>+More</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Vertical Top-to-Bottom Category-Wise List of Package Cards */}
      <View style={styles.verticalContainer}>
        {groupedPackages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: isDark ? '#9CA3AF' : '#64748B' }]}>
              No packages found for this category.
            </Text>
          </View>
        ) : (
          groupedPackages.map((group) => (
            <View key={group.categoryName} style={styles.categorySectionGroup}>
              {/* Department / Category Section Header ABOVE Cards */}
              <View style={styles.categorySectionHeader}>
                <Text style={[styles.categorySectionTitle, { color: colors.text }]}>
                  {group.categoryName}
                </Text>
                <View style={[styles.categoryBadgeCount, { backgroundColor: isDark ? '#2E1065' : '#F3E8FF' }]}>
                  <Text style={[styles.categoryBadgeCountText, { color: '#7C3AED' }]}>
                    {group.packages.length} {group.packages.length === 1 ? 'Package' : 'Packages'}
                  </Text>
                </View>
              </View>

              {group.packages.map((pkg) => (
                <PackageItemCard
                  key={pkg.id}
                  item={pkg}
                  layout="horizontal"
                  variant="hospital"
                  onPress={(id) => onAddPackagePress ? onAddPackagePress(pkg) : handleViewPackage(id)}
                  onAddPress={(p) => onAddPackagePress ? onAddPackagePress(p) : handleViewPackage(p.id)}
                />
              ))}
            </View>
          ))
        )}
      </View>

      {/* Category Selection Modal */}
      {showCategoryModal && (
        <Modal visible={showCategoryModal} transparent animationType="slide" onRequestClose={() => setShowCategoryModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: isDark ? '#1E1E24' : '#FFFFFF' }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Select Package Category</Text>
                <TouchableOpacity onPress={() => setShowCategoryModal(false)} style={styles.closeBtn}>
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
                {ALL_PACKAGE_CATEGORIES.map((item) => {
                  const isSelected = activeCategory === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.modalItemRow,
                        isSelected && { backgroundColor: isDark ? '#2E1065' : '#F3E8FF' },
                      ]}
                      onPress={() => {
                        handleCategoryPress(item.id);
                        setShowCategoryModal(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalItemText,
                          { color: isSelected ? '#7C3AED' : colors.text, fontWeight: isSelected ? '800' : '600' },
                        ]}
                      >
                        {item.name}
                      </Text>
                      {isSelected && <CheckCircle2 size={18} color="#7C3AED" />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  filterBtn: {
    paddingLeft: 6,
  },
  categoryPillsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  allPill: {
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 0.8,
    height: 28,
  },
  allPillText: {
    fontFamily: Fonts.bold,
    fontSize: 11.5,
    fontWeight: '700',
  },
  allUnderline: {
    width: 10,
    height: 2,
    borderRadius: 1,
    marginTop: 1,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 0.8,
    height: 28,
  },
  categoryChipText: {
    fontFamily: Fonts.medium,
    fontSize: 11.5,
    fontWeight: '500',
  },
  morePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  morePillText: {
    fontFamily: Fonts.bold,
    fontSize: 11.5,
    fontWeight: '700',
  },
  verticalContainer: {
    paddingHorizontal: 0,
    gap: 12,
    marginTop: 4,
  },
  emptyContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Fonts.medium,
    fontSize: 13.5,
    fontWeight: '500',
  },
  verticalPackageCard: {
    borderRadius: 16,
    borderWidth: 0,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderCategory: {
    marginBottom: 8,
  },
  cardCategoryTagText: {
    fontFamily: Fonts.semiBold,
    fontSize: 10.5,
    fontWeight: '600',
    color: '#7C3AED',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  verticalPackageImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  verticalPackageContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  packageTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 14.5,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 19,
    letterSpacing: -0.1,
  },
  packageSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  priceAndActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  priceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    gap: 4,
  },
  currentPrice: {
    fontFamily: Fonts.semiBold,
    fontSize: 15.5,
    fontWeight: '600',
  },
  originalPrice: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    textDecorationLine: 'line-through',
    fontWeight: '400',
  },
  discountBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontFamily: Fonts.semiBold,
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '600',
  },
  viewPackageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 4,
  },
  viewPackageText: {
    fontFamily: Fonts.semiBold,
    color: '#EF4444',
    fontSize: 11.5,
    fontWeight: '600',
  },
  fullMenuBtnWrapper: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  fullMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  fullMenuText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 2,
  },
  modalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginVertical: 2,
  },
  categorySectionGroup: {
    marginBottom: 16,
  },
  categorySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  categorySectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16.5,
    fontWeight: '600',
    letterSpacing: -0.15,
  },
  categoryBadgeCount: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryBadgeCountText: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    fontWeight: '600',
  },
  modalItemText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
});
