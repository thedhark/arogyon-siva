import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Pressable 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  X,
  Glasses
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';

import LabHeader from '@/components/labs/LabHeader';
import LabCategoryFilter from '@/components/labs/LabCategoryFilter';
import LabPackageCard, { LabPackageItem } from '@/components/labs/LabPackageCard';
import LabCentersSection from '@/components/labs/LabCentersSection';
import LabsBanner from '@/components/LabsBanner';

export const LAB_PACKAGES_MASTER: LabPackageItem[] = [
  {
    id: 'lp-1',
    name: 'Full Body Health Checkup',
    tag: 'POPULAR',
    testCount: 64,
    tests: ['Liver Function (LFT)', 'Kidney Function (KFT)', 'HbA1c Diabetes', 'Complete Lipid Profile', 'Thyroid Profile'],
    image: 'https://images.unsplash.com/photo-1579152276503-3467b6eb98bb?w=400&q=80',
    price: '₹1,599',
    oldPrice: '₹2,999',
    available: 'Today',
    type: 'popular',
    homeCollection: true,
    tat: '24h Digital Report',
  },
  {
    id: 'lp-lenskart-1',
    name: 'Lenskart Vision & Eye Health Screening',
    tag: 'LENSKART EXCLUSIVE',
    testCount: 8,
    tests: ['Retinal Vascular Health', 'Ocular Blood Glucose', 'Dry Eye Biomarkers', 'Vitamin A Level'],
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&q=80',
    price: '₹799',
    oldPrice: '₹1,999',
    available: 'Today',
    type: 'vision',
    homeCollection: true,
    tat: 'Same-day Report',
  },
  {
    id: 'lp-2',
    name: 'Advanced Heart & Cardiac Panel',
    tag: 'BEST VALUE',
    testCount: 16,
    tests: ['Apolipoprotein A1 & B', 'High-Sensitivity CRP', 'Lipid Profile', 'ECG Analysis', 'TMT Treadmill'],
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e024?w=400&q=80',
    price: '₹2,499',
    oldPrice: '₹4,500',
    available: 'Tomorrow',
    type: 'cardiac',
    homeCollection: true,
    tat: '12h Fast Track',
  },
  {
    id: 'lp-3',
    name: 'Women Comprehensive Care Package',
    tag: 'SPECIAL CARE',
    testCount: 48,
    tests: ['Total Thyroid (T3, T4, TSH)', 'Vitamin D3 & B12', 'CBC Blood Count', 'Iron Deficiency Profile'],
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&q=80',
    price: '₹1,899',
    oldPrice: '₹3,200',
    available: 'Today',
    type: 'women',
    homeCollection: true,
    tat: '24h Digital Report',
  },
  {
    id: 'lp-4',
    name: 'Diabetes Control & HbA1c Monitor',
    tag: 'ESSENTIAL',
    testCount: 12,
    tests: ['HbA1c Glycated Hemoglobin', 'Fasting Blood Glucose', 'Post-Prandial Sugar', 'Urine Microalbumin'],
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',
    price: '₹899',
    oldPrice: '₹1,499',
    available: 'Today',
    type: 'diabetes',
    homeCollection: true,
    tat: 'Same-day Report',
  },
  {
    id: 'lp-5',
    name: 'Vitamin D3 & B12 Deficiency Panel',
    tag: 'WELLNESS',
    testCount: 6,
    tests: ['25-Hydroxy Vitamin D', 'Vitamin B12 Serum', 'Calcium & Phosphorus'],
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&q=80',
    price: '₹1,199',
    oldPrice: '₹1,999',
    available: 'Today',
    type: 'vitamin',
    homeCollection: true,
    tat: '24h Digital Report',
  },
];

export default function LabsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPackage, setSelectedPackage] = useState<LabPackageItem | null>(null);
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 8:00 AM');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Filter packages based on query and category
  const filteredPackages = useMemo(() => {
    return LAB_PACKAGES_MASTER.filter((pkg) => {
      const matchesCategory =
        activeCategory === 'all' ? true : pkg.type === activeCategory;
      const matchesSearch =
        searchQuery.trim() === ''
          ? true
          : pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.tests.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
            pkg.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const handleBookPackage = (pkg: LabPackageItem) => {
    setSelectedPackage(pkg);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setBookingSuccess(true);
    setTimeout(() => {
      setSelectedPackage(null);
      setBookingSuccess(false);
      router.push('/appointments' as any);
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: isDark ? '#121214' : '#F8FAFC' }]}>
      {/* Header */}
      <LabHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Lenskart & Arogyon Lab Feature Banner */}
        <View style={styles.bannerContainer}>
          <LabsBanner />
        </View>

        {/* Diagnostic Centers Section */}
        <LabCentersSection />

        {/* Category Filter Chips */}
        <LabCategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Packages Section List */}
        <View style={styles.packagesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {activeCategory === 'all'
                ? 'All Diagnostic Packages'
                : `${activeCategory.toUpperCase()} Packages`}
            </Text>
            <Text style={styles.packageCount}>{filteredPackages.length} Available</Text>
          </View>

          {filteredPackages.map((pkg) => (
            <LabPackageCard key={pkg.id} packageItem={pkg} onBook={handleBookPackage} />
          ))}

          {filteredPackages.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Diagnostic Packages Found</Text>
              <Text style={styles.emptySubtitle}>Try searching for blood test names like "Thyroid" or "HbA1c"</Text>
            </View>
          )}
        </View>

        {/* Trust Badges Footer */}
        <View style={[styles.trustSection, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <View style={styles.trustItem}>
            <ShieldCheck size={20} color="#10B981" />
            <Text style={[styles.trustText, { color: colors.text }]}>100% NABL Accredited</Text>
          </View>
          <View style={styles.trustItem}>
            <Sparkles size={20} color="#10B981" />
            <Text style={[styles.trustText, { color: colors.text }]}>Free Home Pickup</Text>
          </View>
        </View>
      </ScrollView>

      {/* Booking Confirmation Modal */}
      <Modal
        visible={selectedPackage !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedPackage(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedPackage(null)}>
          <Pressable
            style={[
              styles.modalSheet,
              { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {bookingSuccess ? (
              <View style={styles.successContainer}>
                <CheckCircle2 size={54} color="#10B981" />
                <Text style={[styles.successTitle, { color: colors.text }]}>Sample Pickup Booked!</Text>
                <Text style={styles.successSub}>
                  Phlebotomist assigned for {selectedDate}. Report will be updated in app.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Confirm Lab Booking</Text>
                  <TouchableOpacity onPress={() => setSelectedPackage(null)}>
                    <X size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  </TouchableOpacity>
                </View>

                {selectedPackage && (
                  <View style={styles.modalBody}>
                    <View style={[styles.pkgSummary, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                      <Text style={[styles.modalPkgName, { color: colors.text }]}>{selectedPackage.name}</Text>
                      <Text style={styles.modalPrice}>{selectedPackage.price}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Calendar size={16} color="#10B981" />
                      <Text style={[styles.infoRowText, { color: colors.text }]}>Slot: {selectedDate}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <MapPin size={16} color="#10B981" />
                      <Text style={[styles.infoRowText, { color: colors.text }]}>Home Sample Collection (Bengaluru)</Text>
                    </View>

                    <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmBooking}>
                      <Text style={styles.confirmBtnText}>Confirm Sample Collection</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: {
    paddingBottom: 40,
  },
  bannerContainer: {
    paddingHorizontal: 12,
    marginTop: 4,
  },
  packagesContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  packageCount: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  trustSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 16,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 280,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalBody: {
    gap: 14,
  },
  pkgSummary: {
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalPkgName: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  modalPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoRowText: {
    fontSize: 14,
    fontWeight: '600',
  },
  confirmBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  successContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    gap: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  successSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
