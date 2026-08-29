import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Platform, Pressable, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { resolveImageSource } from '@/utils/imageUtils';
import { LayoutGrid, X, Check, Stethoscope, AlertCircle, Activity } from 'lucide-react-native';
import Animated, { 
  FadeInRight, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const CATEGORY_ICONS: Record<string, any> = {
  general: require('@/assets/images/category-icons/general-physician.png'),
  womens: require('@/assets/images/category-icons/womens-health.png'),
  skin: require('@/assets/images/category-icons/skin-specialist.png'),
  child: require('@/assets/images/category-icons/child-care.png'),
  dentist: require('@/assets/images/category-icons/dentist.png'),
  eye: require('@/assets/images/category-icons/eye-specialist.png'),
  ent: require('@/assets/images/category-icons/ent.png'),
  mental: require('@/assets/images/category-icons/mental-wellness.png'),
  bones: require('@/assets/images/category-icons/bones-joints.png'),
  brain: require('@/assets/images/category-icons/brain-nerves.png'),
  urinary: require('@/assets/images/category-icons/urinary-issues.png'),
  lungs: require('@/assets/images/category-icons/lungs-breathing.png'),
  heart: require('@/assets/images/category-icons/heart-specialist.png'),
  stomach: require('@/assets/images/category-icons/stomach-digestion.png'),
  diabetes: require('@/assets/images/category-icons/diabetes.png'),
  cancer: require('@/assets/images/category-icons/cancer-specialist.png'),
  hair: require('@/assets/images/category-icons/hair.png'),
  plastic: require('@/assets/images/category-icons/plastic-surgery.png'),
  mens: require('@/assets/images/category-icons/mens-health.png'),
  veterinary: require('@/assets/images/category-icons/veterinary.png'),
};

export const ALL_EXPLORE_CATEGORIES = [
  { id: 'All', label: 'All', image: CATEGORY_ICONS.general },
  { id: 'General Physician', label: 'General', image: CATEGORY_ICONS.general },
  { id: "Women's Health", label: "Women's", image: CATEGORY_ICONS.womens },
  { id: 'Skin', label: 'Skin', image: CATEGORY_ICONS.skin },
  { id: 'Child Care', label: 'Child Care', image: CATEGORY_ICONS.child },
  { id: 'Dentist', label: 'Dentist', image: CATEGORY_ICONS.dentist },
  { id: 'Eye', label: 'Eye', image: CATEGORY_ICONS.eye },
  { id: 'Ear Nose Throat', label: 'ENT', image: CATEGORY_ICONS.ent },
  { id: 'Mental Wellness', label: 'Mental', image: CATEGORY_ICONS.mental },
  { id: 'Joints & Bones', label: 'Joints & Bone', image: CATEGORY_ICONS.bones },
  { id: 'Brain & Nerves', label: 'Brain & Nerve', image: CATEGORY_ICONS.brain },
  { id: 'Urinary Issues', label: 'Urinary', image: CATEGORY_ICONS.urinary },
  { id: 'Lungs & Breathing', label: 'Lungs', image: CATEGORY_ICONS.lungs },
  { id: 'Heart Specialist', label: 'Heart', image: CATEGORY_ICONS.heart },
  { id: 'Stomach & Digestion', label: 'Stomach', image: CATEGORY_ICONS.stomach },
  { id: 'Diabetes Management', label: 'Diabetes', image: CATEGORY_ICONS.diabetes },
  { id: 'Cancer Specialist', label: 'Cancer', image: CATEGORY_ICONS.cancer },
];

export const SITUATIONS_DATA = [
  { id: 'fever', label: 'High Fever', mappedCategory: 'General Physician', image: CATEGORY_ICONS.general },
  { id: 'chestPain', label: 'Chest Pain', mappedCategory: 'Heart Specialist', image: CATEGORY_ICONS.heart },
  { id: 'breathing', label: 'Breathing Issue', mappedCategory: 'Lungs & Breathing', image: CATEGORY_ICONS.lungs },
  { id: 'stomachAche', label: 'Stomach Pain', mappedCategory: 'Stomach & Digestion', image: CATEGORY_ICONS.stomach },
  { id: 'fracture', label: 'Fracture & Injury', mappedCategory: 'Joints & Bones', image: CATEGORY_ICONS.bones },
  { id: 'migraine', label: 'Migraine / Head', mappedCategory: 'Brain & Nerves', image: CATEGORY_ICONS.brain },
  { id: 'pimpleAcne', label: 'Acne & Skin', mappedCategory: 'Skin', image: CATEGORY_ICONS.skin },
  { id: 'hairLoss', label: 'Hair Loss', mappedCategory: 'Skin', image: CATEGORY_ICONS.hair },
  { id: 'periodPain', label: 'Period Pain', mappedCategory: "Women's Health", image: CATEGORY_ICONS.womens },
  { id: 'stressAnxiety', label: 'Stress & Anxiety', mappedCategory: 'Mental Wellness', image: CATEGORY_ICONS.mental },
  { id: 'allergy', label: 'Severe Allergy', mappedCategory: 'Lungs & Breathing', image: CATEGORY_ICONS.lungs },
  { id: 'bpCrisis', label: 'BP / Heart Rate', mappedCategory: 'Heart Specialist', image: CATEGORY_ICONS.heart },
  { id: 'accident', label: 'Accident Trauma', mappedCategory: 'Joints & Bones', image: CATEGORY_ICONS.bones },
  { id: 'animalBite', label: 'Animal Bite', mappedCategory: 'General Physician', image: CATEGORY_ICONS.general },
  { id: 'weightCare', label: 'Weight Management', mappedCategory: 'Diabetes Management', image: CATEGORY_ICONS.diabetes },
];

export const SURGERIES_DATA = [
  { id: 'cataract', label: 'Cataract Surgery', mappedCategory: 'Eye', image: CATEGORY_ICONS.eye },
  { id: 'kneeReplacement', label: 'Knee Replacement', mappedCategory: 'Joints & Bones', image: CATEGORY_ICONS.bones },
  { id: 'hernia', label: 'Hernia Repair', mappedCategory: 'General Physician', image: CATEGORY_ICONS.general },
  { id: 'kidneyStone', label: 'Kidney Stone Laser', mappedCategory: 'Urinary Issues', image: CATEGORY_ICONS.urinary },
  { id: 'gallbladder', label: 'Gallbladder Removal', mappedCategory: 'Stomach & Digestion', image: CATEGORY_ICONS.stomach },
  { id: 'piles', label: 'Laser Piles Surgery', mappedCategory: 'Stomach & Digestion', image: CATEGORY_ICONS.stomach },
  { id: 'lasik', label: 'LASIK Eye Surgery', mappedCategory: 'Eye', image: CATEGORY_ICONS.eye },
  { id: 'acl', label: 'ACL Reconstruction', mappedCategory: 'Joints & Bones', image: CATEGORY_ICONS.bones },
  { id: 'plasticSurgery', label: 'Cosmetic / Plastic', mappedCategory: 'Skin', image: CATEGORY_ICONS.plastic },
  { id: 'hairTransplant', label: 'Hair Transplant', mappedCategory: 'Skin', image: CATEGORY_ICONS.hair },
  { id: 'dentalImplants', label: 'Dental Implants', mappedCategory: 'Dentist', image: CATEGORY_ICONS.dentist },
  { id: 'cardiacBypass', label: 'Cardiac Angioplasty', mappedCategory: 'Heart Specialist', image: CATEGORY_ICONS.heart },
  { id: 'spineSurgery', label: 'Spine & Disc Surgery', mappedCategory: 'Joints & Bones', image: CATEGORY_ICONS.bones },
  { id: 'appendectomy', label: 'Appendectomy', mappedCategory: 'Stomach & Digestion', image: CATEGORY_ICONS.stomach },
  { id: 'gynecSurgery', label: 'Gynecology Surgery', mappedCategory: "Women's Health", image: CATEGORY_ICONS.womens },
];

const TOP_CATEGORIES = ALL_EXPLORE_CATEGORIES.slice(0, 7);

const ITEM_WIDTH = 68;
const GAP = 6;
const PADDING_LEFT = 16;
const SLIDER_WIDTH = 26; // Proportional sleek 26px width
const SLIDER_OFFSET = (ITEM_WIDTH - SLIDER_WIDTH) / 2; // 21

interface ExploreCategoriesProps {
  activeTab: string;
  onTabChange: (t: string) => void;
  style?: any;
  isModalVisible?: boolean;
  onModalVisibilityChange?: (v: boolean) => void;
}

export default function ExploreCategories({ 
  activeTab, 
  onTabChange, 
  style,
  isModalVisible: isModalVisibleProp,
  onModalVisibilityChange,
}: ExploreCategoriesProps) {
  const { colors, isDark } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const modalCarouselRef = useRef<ScrollView>(null);

  const [internalModalVisible, setInternalModalVisible] = useState(false);
  const [modalTab, setModalTab] = useState<'specialties' | 'situations' | 'surgeries'>('specialties');

  const isModalVisible = isModalVisibleProp !== undefined ? isModalVisibleProp : internalModalVisible;
  const setModalVisible = (v: boolean) => {
    if (onModalVisibilityChange) {
      onModalVisibilityChange(v);
    } else {
      setInternalModalVisible(v);
    }
  };

  // The visible pills include top 7, plus any currently active category if not in top 7
  const visibleCategories = useMemo(() => {
    const isInsideTop7 = TOP_CATEGORIES.some(c => c.id === activeTab);
    if (isInsideTop7 || !activeTab) {
      return TOP_CATEGORIES;
    }
    const extraCategory = ALL_EXPLORE_CATEGORIES.find(c => c.id === activeTab);
    if (extraCategory) {
      return [...TOP_CATEGORIES, extraCategory];
    }
    return TOP_CATEGORIES;
  }, [activeTab]);

  const activeIndex = Math.max(0, visibleCategories.findIndex(cat => cat.id === activeTab));
  
  const sliderPosition = useSharedValue(PADDING_LEFT + activeIndex * (ITEM_WIDTH + GAP) + SLIDER_OFFSET);

  useEffect(() => {
    const targetX = PADDING_LEFT + activeIndex * (ITEM_WIDTH + GAP) + SLIDER_OFFSET;
    sliderPosition.value = withSpring(targetX, {
      damping: 18,
      stiffness: 220,
      mass: 0.6,
    });
  }, [activeIndex, visibleCategories]);

  const handlePress = (id: string, index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabChange(id);
    
    // Auto scroll into view
    const scrollTarget = Math.max(0, index * (ITEM_WIDTH + GAP) - 100);
    scrollViewRef.current?.scrollTo({ x: scrollTarget, animated: true });
  };

  const handleSelectFromModal = (categoryName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onTabChange(categoryName);
    setModalVisible(false);
  };

  const handleTabSwitch = (tab: 'specialties' | 'situations' | 'surgeries', index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalTab(tab);
    modalCarouselRef.current?.scrollTo({ x: index * screenWidth, animated: true });
  };

  const handleCarouselScroll = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / screenWidth);
    if (pageIndex === 0 && modalTab !== 'specialties') {
      setModalTab('specialties');
    } else if (pageIndex === 1 && modalTab !== 'situations') {
      setModalTab('situations');
    } else if (pageIndex === 2 && modalTab !== 'surgeries') {
      setModalTab('surgeries');
    }
  };

  const animatedSliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: sliderPosition.value }],
    };
  });

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        overScrollMode="never"
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Sleek, 50% Reduced Animated Green Gradient Slider */}
        <Animated.View pointerEvents="none" style={[styles.sliderTrack, animatedSliderStyle]}>
          <LinearGradient
            colors={['#34D399', '#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBar}
          />
        </Animated.View>

        {visibleCategories.map((cat, index) => {
          const isActive = activeTab === cat.id;
          return (
            <Animated.View key={cat.id} entering={FadeInRight.delay(index * 35)}>
              <TouchableOpacity 
                style={styles.categoryItem}
                onPress={() => handlePress(cat.id, index)}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              >
                <View style={styles.imageContainer}>
                  <Image 
                    source={typeof cat.image === 'string' ? { uri: cat.image } : cat.image} 
                    style={styles.categoryImage} 
                    resizeMode="cover"
                  />
                </View>
                <Text 
                  numberOfLines={1}
                  style={[
                    styles.categoryLabel, 
                    { color: isActive ? '#10B981' : (isDark ? '#9CA3AF' : '#6B7280') },
                    isActive && styles.activeLabel
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* "See All" Pill */}
        <Animated.View entering={FadeInRight.delay(visibleCategories.length * 35)}>
          <TouchableOpacity 
            style={styles.seeAllPill}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setModalVisible(true);
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <View style={[styles.seeAllIconBox, { backgroundColor: isDark ? '#232326' : '#F0FDF4', borderColor: isDark ? '#333' : '#BBF7D0' }]}>
              <LayoutGrid size={22} color="#10B981" />
            </View>
            <Text style={[styles.seeAllLabel, { color: '#10B981' }]}>
              See All
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Full Specialties, Situations & Surgeries Modal Sheet with Carousel Effect */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setModalVisible(false)} />
          
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', height: Math.round(screenHeight * 0.85) }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.dragHandle} />
              
              {/* Header Title Row */}
              <View style={styles.modalTitleRow}>
                <View>
                  <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#18181B' }]}>
                    Explore Care & Treatments
                  </Text>
                  <Text style={[styles.modalSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    Specialties, health symptoms & planned surgeries
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.closeBtn, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]} 
                  onPress={() => setModalVisible(false)}
                >
                  <X size={18} color={isDark ? '#FFF' : '#000'} />
                </TouchableOpacity>
              </View>

              {/* 3-Way Segmented Capsule Switcher (Specialties, Situations, Surgeries) */}
              <View style={[styles.capsuleSwitcherContainer, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                <TouchableOpacity
                  style={[
                    styles.capsuleTab,
                    modalTab === 'specialties' && [
                      styles.activeCapsuleTab,
                      { backgroundColor: '#10B981' }
                    ]
                  ]}
                  onPress={() => handleTabSwitch('specialties', 0)}
                  activeOpacity={0.8}
                >
                  <Stethoscope size={13} color={modalTab === 'specialties' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#71717A')} />
                  <Text style={[styles.capsuleTabText, { color: modalTab === 'specialties' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#71717A') }]}>
                    Specialties
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.capsuleTab,
                    modalTab === 'situations' && [
                      styles.activeCapsuleTab,
                      { backgroundColor: '#10B981' }
                    ]
                  ]}
                  onPress={() => handleTabSwitch('situations', 1)}
                  activeOpacity={0.8}
                >
                  <AlertCircle size={13} color={modalTab === 'situations' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#71717A')} />
                  <Text style={[styles.capsuleTabText, { color: modalTab === 'situations' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#71717A') }]}>
                    Situations
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.capsuleTab,
                    modalTab === 'surgeries' && [
                      styles.activeCapsuleTab,
                      { backgroundColor: '#10B981' }
                    ]
                  ]}
                  onPress={() => handleTabSwitch('surgeries', 2)}
                  activeOpacity={0.8}
                >
                  <Activity size={13} color={modalTab === 'surgeries' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#71717A')} />
                  <Text style={[styles.capsuleTabText, { color: modalTab === 'surgeries' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#71717A') }]}>
                    Surgeries
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Horizontal Carousel View for Specialties, Situations & Surgeries */}
            <ScrollView
              ref={modalCarouselRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleCarouselScroll}
              style={{ flex: 1 }}
            >
              {/* 1. Specialties Page */}
              <View style={{ width: screenWidth }}>
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.gridScrollContent}
                >
                  <View style={styles.specialtyGrid}>
                    {ALL_EXPLORE_CATEGORIES.map((cat) => {
                      const isSelected = activeTab === cat.id;
                      return (
                        <TouchableOpacity
                          key={cat.id}
                          style={styles.gridItem}
                          onPress={() => handleSelectFromModal(cat.id)}
                          activeOpacity={0.75}
                        >
                          <View style={[styles.gridImageContainer, isSelected && styles.selectedImageContainer]}>
                            <Image 
                              source={resolveImageSource(cat.image)} 
                              style={styles.gridImage} 
                              resizeMode="cover"
                            />
                            {isSelected && (
                              <View style={styles.checkBadge}>
                                <Check size={11} color="#FFFFFF" strokeWidth={3} />
                              </View>
                            )}
                          </View>
                          <Text 
                            numberOfLines={2} 
                            style={[
                              styles.gridLabel, 
                              { color: isSelected ? '#10B981' : (isDark ? '#F3F4F6' : '#1F2937'), fontWeight: isSelected ? '700' : '600' }
                            ]}
                          >
                            {cat.id}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>

              {/* 2. Situations Page */}
              <View style={{ width: screenWidth }}>
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.gridScrollContent}
                >
                  <View style={styles.specialtyGrid}>
                    {SITUATIONS_DATA.map((sit) => {
                      const isSelected = activeTab === sit.mappedCategory;
                      return (
                        <TouchableOpacity
                          key={sit.id}
                          style={styles.gridItem}
                          onPress={() => handleSelectFromModal(sit.mappedCategory)}
                          activeOpacity={0.75}
                        >
                          <View style={[styles.gridImageContainer, isSelected && styles.selectedImageContainer]}>
                            <Image 
                              source={resolveImageSource(sit.image)} 
                              style={styles.gridImage} 
                              resizeMode="cover"
                            />
                            {isSelected && (
                              <View style={styles.checkBadge}>
                                <Check size={11} color="#FFFFFF" strokeWidth={3} />
                              </View>
                            )}
                          </View>
                          <Text 
                            numberOfLines={1} 
                            style={[
                              styles.gridLabel, 
                              { color: isSelected ? '#10B981' : (isDark ? '#F3F4F6' : '#1F2937'), fontWeight: isSelected ? '700' : '600' }
                            ]}
                          >
                            {sit.label}
                          </Text>
                          <Text 
                            numberOfLines={1} 
                            style={[styles.mappedCategoryTag, { color: isDark ? '#9CA3AF' : '#6B7280' }]}
                          >
                            {sit.mappedCategory}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>

              {/* 3. Surgeries Page */}
              <View style={{ width: screenWidth }}>
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.gridScrollContent}
                >
                  <View style={styles.specialtyGrid}>
                    {SURGERIES_DATA.map((sur) => {
                      const isSelected = activeTab === sur.mappedCategory;
                      return (
                        <TouchableOpacity
                          key={sur.id}
                          style={styles.gridItem}
                          onPress={() => handleSelectFromModal(sur.mappedCategory)}
                          activeOpacity={0.75}
                        >
                          <View style={[styles.gridImageContainer, isSelected && styles.selectedImageContainer]}>
                            <Image 
                              source={resolveImageSource(sur.image)} 
                              style={styles.gridImage} 
                              resizeMode="cover"
                            />
                            {isSelected && (
                              <View style={styles.checkBadge}>
                                <Check size={11} color="#FFFFFF" strokeWidth={3} />
                              </View>
                            )}
                          </View>
                          <Text 
                            numberOfLines={1} 
                            style={[
                              styles.gridLabel, 
                              { color: isSelected ? '#10B981' : (isDark ? '#F3F4F6' : '#1F2937'), fontWeight: isSelected ? '700' : '600' }
                            ]}
                          >
                            {sur.label}
                          </Text>
                          <Text 
                            numberOfLines={1} 
                            style={[styles.mappedCategoryTag, { color: isDark ? '#9CA3AF' : '#6B7280' }]}
                          >
                            {sur.mappedCategory}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 6,
    alignItems: 'flex-start',
    position: 'relative',
  },
  sliderTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  gradientBar: {
    width: SLIDER_WIDTH,
    height: 3,
    borderRadius: 1.5,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 5,
    width: ITEM_WIDTH,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  activeLabel: {
    fontWeight: '700',
  },
  seeAllPill: {
    alignItems: 'center',
    gap: 5,
    width: ITEM_WIDTH,
  },
  seeAllIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2,
  },
  seeAllLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150,150,150,0.1)',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(150,150,150,0.3)',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  modalSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capsuleSwitcherContainer: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 100,
    marginTop: 4,
  },
  capsuleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    borderRadius: 100,
  },
  activeCapsuleTab: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  capsuleTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  gridScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 50,
  },
  specialtyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    rowGap: 14,
  },
  gridItem: {
    width: '33.33%',
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 6,
  },
  gridImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedImageContainer: {
    borderWidth: 2.5,
    borderColor: '#10B981',
  },
  gridImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  checkBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  gridLabel: {
    fontSize: 11.5,
    textAlign: 'center',
    lineHeight: 15,
    paddingHorizontal: 2,
  },
  mappedCategoryTag: {
    fontSize: 9.5,
    textAlign: 'center',
    marginTop: 0,
  },
});
