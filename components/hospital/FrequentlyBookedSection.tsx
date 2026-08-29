import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Plus,
  Clock,
  Stethoscope,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { scale } from '@/utils/responsive';

export interface FrequentlyBookedItem {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image: string;
  type: string;
  description?: string;
  inclusions?: string[];
  duration?: string;
  doctorName?: string;
}

interface Props {
  items?: FrequentlyBookedItem[];
  title?: string;
  onItemPress?: (item: FrequentlyBookedItem) => void;
}

const FREQUENTLY_BOOKED_ITEMS: FrequentlyBookedItem[] = [
  {
    id: 'fb-1',
    title: 'Cardiology Consultation',
    price: '₹800',
    originalPrice: '₹1,200',
    discount: '33% OFF',
    image: 'https://cdn-icons-png.flaticon.com/512/2864/2864350.png',
    type: 'consultation',
    description:
      'Direct consultation with our senior cardiologist. Ideal for cardiovascular checks, symptoms like chest tightness, high blood pressure, or general heart care.',
    inclusions: [
      'Comprehensive Cardiac Assessment',
      'Blood Pressure & Vitals Evaluation',
      'Diet & Heart Health Guidance',
      'Digital Prescription & 7-Day Followup',
    ],
    duration: '30 mins session',
  },
  {
    id: 'fb-2',
    title: 'ECG + Consultation',
    price: '₹1,200',
    originalPrice: '₹1,600',
    discount: '25% OFF',
    image: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png',
    type: 'consultation',
    description:
      'Get a 12-lead Electrocardiogram (ECG) to monitor heart rhythms, followed by an immediate review and medical consultation with a specialist.',
    inclusions: [
      '12-Lead Clinical ECG Test',
      'Cardiologist Diagnostic Review',
      'Instant Digital ECG Graph Report',
      'Preventive Medication Roadmap',
    ],
    duration: '45 mins session',
  },
  {
    id: 'fb-3',
    title: 'Heart Health Check',
    price: '₹1,500',
    originalPrice: '₹2,200',
    discount: '31% OFF',
    image: 'https://cdn-icons-png.flaticon.com/512/865/865969.png',
    type: 'package',
    description:
      'A comprehensive preventive cardiac screening package. Includes ECG, sugar test, lipid cholesterol profile, and doctor review.',
    inclusions: [
      'Complete Lipid Profile & Glucose',
      'Clinical Resting ECG',
      'Doctor Clinical Consultation',
      'Personalized Cardiovascular Score',
    ],
    duration: 'Same-day report',
  },
];

export default function FrequentlyBookedSection({
  items,
  title = 'Frequently booked together',
  onItemPress,
}: Props) {
  const { colors, isDark } = useTheme();
  const [selectedItem, setSelectedItem] = useState<FrequentlyBookedItem | null>(null);

  const displayItems = items && items.length > 0 ? items : FREQUENTLY_BOOKED_ITEMS;

  const handleOpenPopup = (item: FrequentlyBookedItem) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  const handleAddDirect = (item: FrequentlyBookedItem) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}
    }
    if (onItemPress) {
      onItemPress(item);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={styles.scrollContainer}
      >
        {displayItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: isDark ? '#1C1E26' : '#FFFFFF',
                borderColor: isDark ? '#2D313E' : '#EEF2F6',
              },
            ]}
            onPress={() => handleOpenPopup(item)}
            activeOpacity={0.85}
          >
            {/* Top Row: Icon on left, ADD pill button on right */}
            <View style={styles.topRow}>
              <View
                style={[
                  styles.imageWrapper,
                  { backgroundColor: isDark ? '#252936' : '#F1F5F9' },
                ]}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.illustrationImage}
                  resizeMode="contain"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.addBtn,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                    borderColor: isDark ? '#3B82F6' : '#BFDBFE',
                  },
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleAddDirect(item);
                }}
                activeOpacity={0.75}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Text style={[styles.addBtnText, { color: isDark ? '#60A5FA' : '#1D4ED8' }]}>
                  ADD
                </Text>
                <Plus size={11} color={isDark ? '#60A5FA' : '#1D4ED8'} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            {/* Middle Section: Title (max 2 lines, compact) */}
            <Text
              style={[styles.itemTitle, { color: isDark ? '#F1F5F9' : '#1E293B' }]}
              numberOfLines={2}
            >
              {item.title}
            </Text>

            {/* Bottom Row: Price display */}
            <View style={styles.bottomRow}>
              <Text style={[styles.priceText, { color: colors.text }]}>{item.price}</Text>
              {item.originalPrice ? (
                <Text style={styles.originalPriceText}>{item.originalPrice}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Rich Slide-Up Bottom Sheet Modal (Matching Doctor/Package Cards) */}
      {selectedItem && (
        <Modal
          visible={!!selectedItem}
          transparent={true}
          animationType="slide"
          onRequestClose={handleClosePopup}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={styles.backdropPressable} onPress={handleClosePopup} />

            <View
              style={[
                styles.modalSheet,
                { backgroundColor: isDark ? '#11141D' : '#FFFFFF' },
              ]}
            >
              {/* Drag Handle */}
              <View style={styles.dragHandleContainer}>
                <View
                  style={[
                    styles.dragHandle,
                    { backgroundColor: isDark ? '#374151' : '#E5E7EB' },
                  ]}
                />
              </View>

              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.badgeRow}>
                  <Sparkles size={13} color="#00A981" />
                  <Text style={styles.badgeText}>
                    {selectedItem.type === 'package' ? 'HEALTH PACKAGE' : 'VERIFIED CARE SERVICE'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleClosePopup}
                  style={[
                    styles.closeBtn,
                    { backgroundColor: isDark ? '#1F2430' : '#F1F5F9' },
                  ]}
                >
                  <X size={18} color={isDark ? '#CBD5E1' : '#475569'} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollBody}
                bounces={false}
              >
                {/* Hero Information */}
                <Animated.View entering={FadeInDown.delay(50)} style={styles.heroSection}>
                  <View
                    style={[
                      styles.heroIconWrapper,
                      { backgroundColor: isDark ? '#1A2133' : '#EFF6FF' },
                    ]}
                  >
                    <Image
                      source={{ uri: selectedItem.image }}
                      style={styles.heroImage}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.heroTextCol}>
                    <Text style={[styles.modalTitleText, { color: colors.text }]}>
                      {selectedItem.title}
                    </Text>
                    <View style={styles.durationRow}>
                      <Clock size={12} color="#64748B" />
                      <Text style={styles.durationText}>
                        {selectedItem.duration || 'Specialist Consultation'}
                      </Text>
                    </View>
                  </View>
                </Animated.View>

                {/* Pricing & Savings Card */}
                <Animated.View
                  entering={FadeInDown.delay(100)}
                  style={[
                    styles.priceCard,
                    {
                      backgroundColor: isDark ? '#181C28' : '#F8FAFC',
                      borderColor: isDark ? '#282F42' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={styles.priceLeft}>
                    <Text style={styles.priceLabel}>Total Fee</Text>
                    <View style={styles.priceValuesRow}>
                      <Text style={[styles.mainPrice, { color: colors.text }]}>
                        {selectedItem.price}
                      </Text>
                      {selectedItem.originalPrice ? (
                        <Text style={styles.modalOriginalPrice}>
                          {selectedItem.originalPrice}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  {selectedItem.discount ? (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{selectedItem.discount}</Text>
                    </View>
                  ) : null}
                </Animated.View>

                {/* What's Included Section */}
                <Animated.View entering={FadeInDown.delay(150)} style={styles.inclusionsSection}>
                  <Text style={[styles.sectionHeading, { color: colors.text }]}>
                    What's Included
                  </Text>
                  <View style={styles.inclusionsList}>
                    {(
                      selectedItem.inclusions || [
                        'Senior Specialist Medical Consultation',
                        'Clinical Diagnostic Evaluation',
                        'Digital Health Record & Prescription',
                        'Free Follow-up Review Support',
                      ]
                    ).map((inc, index) => (
                      <View key={index} style={styles.inclusionRow}>
                        <CheckCircle2 size={16} color="#00A981" />
                        <Text
                          style={[
                            styles.inclusionText,
                            { color: isDark ? '#D1D5DB' : '#334155' },
                          ]}
                        >
                          {inc}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Animated.View>

                {/* About & Description */}
                {selectedItem.description ? (
                  <Animated.View entering={FadeInDown.delay(200)} style={styles.aboutSection}>
                    <Text style={[styles.sectionHeading, { color: colors.text }]}>
                      About This Service
                    </Text>
                    <Text
                      style={[
                        styles.descText,
                        { color: isDark ? '#9CA3AF' : '#64748B' },
                      ]}
                    >
                      {selectedItem.description}
                    </Text>
                  </Animated.View>
                ) : null}

                {/* Quality & Safety Assurance */}
                <Animated.View
                  entering={FadeInDown.delay(250)}
                  style={[
                    styles.assuranceCard,
                    {
                      backgroundColor: isDark ? '#142328' : '#F0FDF4',
                      borderColor: isDark ? '#1E3A3A' : '#DCFCE7',
                    },
                  ]}
                >
                  <ShieldCheck size={20} color="#10B981" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.assuranceTitle, { color: isDark ? '#A7F3D0' : '#15803D' }]}>
                      100% Quality & Price Guarantee
                    </Text>
                    <Text style={[styles.assuranceSub, { color: isDark ? '#6EE7B7' : '#166534' }]}>
                      Verified doctors & NABH accredited partner facilities with zero hidden charges.
                    </Text>
                  </View>
                </Animated.View>
              </ScrollView>

              {/* Sticky Action Footer */}
              <View
                style={[
                  styles.stickyFooter,
                  {
                    backgroundColor: isDark ? '#161A24' : '#FFFFFF',
                    borderTopColor: isDark ? '#262C3D' : '#F1F5F9',
                  },
                ]}
              >
                <View style={styles.footerPriceCol}>
                  <Text style={styles.footerPriceLabel}>Total Amount</Text>
                  <Text style={[styles.footerPriceValue, { color: colors.text }]}>
                    {selectedItem.price}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.bookCtaBtn}
                  onPress={() => {
                    const itemToBook = selectedItem;
                    handleClosePopup();
                    handleAddDirect(itemToBook);
                  }}
                  activeOpacity={0.88}
                >
                  <Text style={styles.bookCtaText}>ADD TO BOOKING</Text>
                  <Plus size={16} color="#FFFFFF" strokeWidth={2.6} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 8,
    letterSpacing: -0.15,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 10,
    paddingVertical: 2,
  },
  card: {
    width: 136,
    height: 106,
    padding: 9,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
  },
  addBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  itemTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 11.5,
    fontWeight: '600',
    lineHeight: 14.5,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  priceText: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    fontWeight: '700',
  },
  originalPriceText: {
    fontFamily: Fonts.regular,
    fontSize: 10.5,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },

  // Modal / Bottom Sheet Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  backdropPressable: {
    flex: 1,
  },
  modalSheet: {
    maxHeight: '84%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    overflow: 'hidden',
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 169, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#00A981',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollBody: {
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginVertical: 12,
  },
  heroIconWrapper: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroTextCol: {
    flex: 1,
  },
  modalTitleText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  durationText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 10,
  },
  priceLeft: {},
  priceLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  priceValuesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  mainPrice: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    fontWeight: '800',
  },
  modalOriginalPrice: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: '#E11D48',
    fontSize: 11,
    fontWeight: '800',
  },
  inclusionsSection: {
    marginVertical: 10,
  },
  sectionHeading: {
    fontFamily: Fonts.bold,
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 10,
  },
  inclusionsList: {
    gap: 8,
  },
  inclusionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inclusionText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  aboutSection: {
    marginVertical: 10,
  },
  descText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '400',
  },
  assuranceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 6,
  },
  assuranceTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  assuranceSub: {
    fontSize: 11,
    lineHeight: 15,
  },
  stickyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  footerPriceCol: {},
  footerPriceLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  footerPriceValue: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    fontWeight: '800',
  },
  bookCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#00A981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#00A981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  bookCtaText: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});


