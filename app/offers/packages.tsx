import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import OfferHeroBanner from '@/components/offers/OfferHeroBanner';
import OfferCategoryBar from '@/components/offers/OfferCategoryBar';
import PackageItemCard, { PackageItemCardData } from '@/components/packages/cards/PackageItemCard';
import AddPackageModal from '@/components/booking/AddPackageModal';
import {
  OFFER_PACKAGE_CATEGORIES,
  OFFER_PACKAGES,
} from '@/constants/offers-data';
import { useBookingStore } from '@/hooks/useBookingStore';

const QUICK_FILTERS = [
  { id: 'all', label: 'All Packages' },
  { id: 'home-sample', label: '🏠 Free Home Sample' },
  { id: 'comprehensive', label: '🧪 50+ Tests' },
  { id: 'top-rated', label: '⭐ 4.8+ Rated' },
  { id: 'budget', label: '💰 Under ₹2,000' },
];

export default function PackagesOfferScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const addCartItem = useBookingStore((s) => s.addCartItem);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedQuickFilter, setSelectedQuickFilter] = useState('all');
  const [selectedPackageForAdd, setSelectedPackageForAdd] = useState<any>(null);

  const handlePackagePress = (pkg: typeof OFFER_PACKAGES[0]) => {
    setSelectedPackageForAdd(pkg);
  };

  const handleAddPackage = (pkg: typeof OFFER_PACKAGES[0]) => {
    setSelectedPackageForAdd(pkg);
  };

  // Filter Packages
  const filteredPackages = useMemo(() => {
    return OFFER_PACKAGES.filter((pkg) => {
      // Category filter
      if (selectedCategory !== 'all' && pkg.categoryId !== selectedCategory) {
        return false;
      }

      // Quick filter
      if (selectedQuickFilter === 'home-sample' && !pkg.hasHomeSample) {
        return false;
      }
      if (selectedQuickFilter === 'comprehensive' && pkg.testsCount < 50) {
        return false;
      }
      if (selectedQuickFilter === 'top-rated' && parseFloat(pkg.rating) < 4.8) {
        return false;
      }
      if (selectedQuickFilter === 'budget' && pkg.discountedPrice > 2000) {
        return false;
      }

      return true;
    });
  }, [selectedCategory, selectedQuickFilter]);

  return (
    <View
      style={[styles.screen, { backgroundColor: isDark ? '#10131A' : '#F8FAFC' }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[1]}
      >
        {/* Index 0: 50% OFF Hero Banner (Hospital Green) */}
        <OfferHeroBanner
          variant="package"
          title="PACKAGES AT"
          discountText="50% OFF"
          subtitle="Comprehensive Health Plans"
          onBack={() => router.back()}
        />

        {/* Index 1: Sticky Horizontal Category Tab Filter Bar */}
        <OfferCategoryBar
          categories={OFFER_PACKAGE_CATEGORIES}
          activeCategoryId={selectedCategory}
          onSelectCategory={(id) => setSelectedCategory(id)}
        />

        {/* Index 2: Quick Filters & Notice Bar */}
        <View style={styles.filterSectionWrapper}>
          {/* Quick Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickFiltersScroll}
          >
            {QUICK_FILTERS.map((qf) => {
              const isSelected = selectedQuickFilter === qf.id;
              return (
                <TouchableOpacity
                  key={qf.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedQuickFilter(qf.id)}
                  style={[
                    styles.quickFilterChip,
                    {
                      backgroundColor: isSelected
                        ? '#007A55'
                        : isDark
                        ? '#1E2433'
                        : '#FFFFFF',
                      borderColor: isSelected
                        ? '#007A55'
                        : isDark
                        ? '#2E384D'
                        : '#E2E8F0',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.quickFilterText,
                      {
                        color: isSelected
                          ? '#FFFFFF'
                          : isDark
                          ? '#CBD5E1'
                          : '#475569',
                        fontWeight: isSelected ? '700' : '600',
                      },
                    ]}
                  >
                    {qf.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Notice Row */}
          <View style={styles.noticeRow}>
            <View style={styles.resultsBadge}>
              <Sparkles size={13} color="#007A55" />
              <Text
                style={[
                  styles.resultsCountText,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                {filteredPackages.length} Health Packages at 50% Off
              </Text>
            </View>

            <View style={styles.promoAppliedPill}>
              <Text style={styles.promoAppliedText}>Code: SAVE50 Applied</Text>
            </View>
          </View>
        </View>

        {/* Index 3: Filtered Packages List */}
        <View style={styles.packagesListContainer}>
          {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg, index) => (
              <Animated.View
                key={pkg.id}
                entering={FadeInDown.delay(index * 60).duration(300)}
                style={{ width: '100%' }}
              >
                <PackageItemCard
                  item={{
                    id: pkg.id,
                    title: pkg.title,
                    subtitle: `${pkg.category} • ${pkg.testsCount} Tests • Free Doctor Consult`,
                    price: `₹${pkg.discountedPrice}`,
                    originalPrice: `₹${pkg.originalPrice}`,
                    discount: '50% OFF',
                    image: pkg.image,
                    inclusions: pkg.inclusions,
                    hospitalName: pkg.hospitalName,
                  }}
                  layout="horizontal"
                  variant="hospital"
                  onPress={() => handlePackagePress(pkg)}
                  onAddPress={() => handleAddPackage(pkg)}
                  ctaText="ADD"
                />
              </Animated.View>
            ))
          ) : (
            <Animated.View entering={FadeIn} style={styles.emptyState}>
              <Text
                style={[
                  styles.emptyTitle,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                No Packages Found
              </Text>
              <Text
                style={[
                  styles.emptySubtitle,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                Try switching the category or clearing the filters.
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedCategory('all');
                  setSelectedQuickFilter('all');
                }}
                style={styles.resetButton}
              >
                <Text style={styles.resetButtonText}>Reset All Filters</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {/* Add Package Modal Popup */}
      {!!selectedPackageForAdd && (
        <AddPackageModal
          visible={!!selectedPackageForAdd}
          packageItem={selectedPackageForAdd}
          hospitalName={selectedPackageForAdd?.hospitalName || selectedPackageForAdd?.hospital || 'Manipal Hospital'}
          onClose={() => setSelectedPackageForAdd(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  filterSectionWrapper: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 12,
  },
  quickFiltersScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  quickFilterChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickFilterText: {
    fontSize: 11.5,
    letterSpacing: 0.1,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  resultsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultsCountText: {
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  promoAppliedPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  promoAppliedText: {
    color: '#15803D',
    fontSize: 10.5,
    fontWeight: '800',
  },
  packagesListContainer: {
    paddingHorizontal: 0,
    paddingTop: 8,
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: '75%',
    lineHeight: 18,
  },
  resetButton: {
    marginTop: 8,
    backgroundColor: '#007A55',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
