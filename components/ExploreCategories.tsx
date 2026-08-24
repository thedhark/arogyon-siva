import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Dimensions, Platform, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { MEDICAL_ILLUSTRATIONS, SPECIALTY_ILLUSTRATIONS, SITUATION_ILLUSTRATIONS } from '@/constants/medical-illustrations';
import { LayoutGrid, X, Check, Stethoscope, AlertCircle } from 'lucide-react-native';
import Animated, { 
  FadeInRight, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export const ALL_EXPLORE_CATEGORIES = [
  { id: 'All', label: 'All', image: MEDICAL_ILLUSTRATIONS.hospital },
  { id: 'General Physician', label: 'General', image: SPECIALTY_ILLUSTRATIONS.generalPhysician },
  { id: "Women's Health", label: "Women's", image: SPECIALTY_ILLUSTRATIONS.gynecology },
  { id: 'Skin', label: 'Skin', image: SPECIALTY_ILLUSTRATIONS.dermatology },
  { id: 'Child Care', label: 'Child Care', image: SPECIALTY_ILLUSTRATIONS.pediatrics },
  { id: 'Dentist', label: 'Dentist', image: SPECIALTY_ILLUSTRATIONS.dentistry },
  { id: 'Eye', label: 'Eye', image: SPECIALTY_ILLUSTRATIONS.ophthalmology },
  { id: 'Ear Nose Throat', label: 'ENT', image: SPECIALTY_ILLUSTRATIONS.entCare },
  { id: 'Mental Wellness', label: 'Mental', image: SPECIALTY_ILLUSTRATIONS.psychiatry },
  { id: 'Joints & Bones', label: 'Joints & Bone', image: SPECIALTY_ILLUSTRATIONS.orthopedics },
  { id: 'Brain & Nerves', label: 'Brain & Nerve', image: SPECIALTY_ILLUSTRATIONS.neurology },
  { id: 'Urinary Issues', label: 'Urinary', image: SPECIALTY_ILLUSTRATIONS.urology },
  { id: 'Lungs & Breathing', label: 'Lungs', image: SPECIALTY_ILLUSTRATIONS.pulmonology },
  { id: 'Heart Specialist', label: 'Heart', image: SPECIALTY_ILLUSTRATIONS.cardiology },
  { id: 'Stomach & Digestion', label: 'Stomach', image: SPECIALTY_ILLUSTRATIONS.gastroenterology },
  { id: 'Diabetes Management', label: 'Diabetes', image: SPECIALTY_ILLUSTRATIONS.diabetology },
  { id: 'Cancer Specialist', label: 'Cancer', image: SPECIALTY_ILLUSTRATIONS.oncology },
];

export const SITUATIONS_DATA = [
  { id: 'fever', label: 'High Fever', mappedCategory: 'General Physician', image: SITUATION_ILLUSTRATIONS.fever },
  { id: 'chestPain', label: 'Chest Pain', mappedCategory: 'Heart Specialist', image: SITUATION_ILLUSTRATIONS.chestPain },
  { id: 'breathing', label: 'Breathing Issue', mappedCategory: 'Lungs & Breathing', image: SITUATION_ILLUSTRATIONS.breathing },
  { id: 'stomachAche', label: 'Stomach Pain', mappedCategory: 'Stomach & Digestion', image: SITUATION_ILLUSTRATIONS.stomachAche },
  { id: 'fracture', label: 'Fracture & Injury', mappedCategory: 'Joints & Bones', image: SITUATION_ILLUSTRATIONS.fracture },
  { id: 'migraine', label: 'Migraine / Head', mappedCategory: 'Brain & Nerves', image: SITUATION_ILLUSTRATIONS.migraine },
  { id: 'pimpleAcne', label: 'Acne & Skin', mappedCategory: 'Skin', image: SITUATION_ILLUSTRATIONS.pimpleAcne },
  { id: 'hairLoss', label: 'Hair Loss', mappedCategory: 'Skin', image: SITUATION_ILLUSTRATIONS.hairLoss },
  { id: 'periodPain', label: 'Period Pain', mappedCategory: "Women's Health", image: SITUATION_ILLUSTRATIONS.periodPain },
  { id: 'stressAnxiety', label: 'Stress & Anxiety', mappedCategory: 'Mental Wellness', image: SITUATION_ILLUSTRATIONS.stressAnxiety },
  { id: 'allergy', label: 'Severe Allergy', mappedCategory: 'General Physician', image: SITUATION_ILLUSTRATIONS.allergy },
  { id: 'bpCrisis', label: 'BP / Heart Rate', mappedCategory: 'Heart Specialist', image: SITUATION_ILLUSTRATIONS.bpCrisis },
  { id: 'accident', label: 'Accident Trauma', mappedCategory: 'All', image: SITUATION_ILLUSTRATIONS.accident },
  { id: 'animalBite', label: 'Animal Bite', mappedCategory: 'General Physician', image: SITUATION_ILLUSTRATIONS.animalBite },
  { id: 'weightCare', label: 'Weight Management', mappedCategory: 'Diabetes Management', image: SITUATION_ILLUSTRATIONS.weightCare },
];

const TOP_CATEGORIES = ALL_EXPLORE_CATEGORIES.slice(0, 7);

const ITEM_WIDTH = 68;
const GAP = 8;
const PADDING_LEFT = 16;
const SLIDER_WIDTH = 48;
const SLIDER_OFFSET = (ITEM_WIDTH - SLIDER_WIDTH) / 2; // 10

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
  const scrollViewRef = useRef<ScrollView>(null);
  const [internalModalVisible, setInternalModalVisible] = useState(false);
  const [modalTab, setModalTab] = useState<'specialties' | 'situations'>('specialties');

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
      >
        {/* Premium Animated Green Gradient Slider */}
        <Animated.View style={[styles.sliderTrack, animatedSliderStyle]}>
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
            <Animated.View key={cat.id} entering={FadeInRight.delay(index * 40)}>
              <TouchableOpacity 
                style={styles.categoryItem}
                onPress={() => handlePress(cat.id, index)}
                activeOpacity={0.75}
              >
                <View style={[
                  styles.imageContainer, 
                  isActive && styles.activeImageContainer,
                  { backgroundColor: isDark ? '#252528' : '#F3F4F6' }
                ]}>
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

        {/* "See All" Pill placed right after Eye */}
        <Animated.View entering={FadeInRight.delay(visibleCategories.length * 40)}>
          <TouchableOpacity 
            style={styles.seeAllPill}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setModalVisible(true);
            }}
            activeOpacity={0.75}
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

      {/* Full Specialties & Situations Modal Sheet */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setModalVisible(false)} />
          
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.dragHandle} />
              
              {/* Header Title Row */}
              <View style={styles.modalTitleRow}>
                <View>
                  <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#18181B' }]}>
                    Explore Care & Symptoms
                  </Text>
                  <Text style={[styles.modalSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    Find verified specialists or browse by health situation
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.closeBtn, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]} 
                  onPress={() => setModalVisible(false)}
                >
                  <X size={18} color={isDark ? '#FFF' : '#000'} />
                </TouchableOpacity>
              </View>

              {/* Segmented Capsule Switcher (Specialties vs Situations) */}
              <View style={[styles.capsuleSwitcherContainer, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                <TouchableOpacity
                  style={[
                    styles.capsuleTab,
                    modalTab === 'specialties' && [
                      styles.activeCapsuleTab,
                      { backgroundColor: '#10B981' }
                    ]
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setModalTab('specialties');
                  }}
                  activeOpacity={0.8}
                >
                  <Stethoscope size={14} color={modalTab === 'specialties' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#71717A')} />
                  <Text style={[styles.capsuleTabText, { color: modalTab === 'specialties' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#71717A') }]}>
                    Specialties ({ALL_EXPLORE_CATEGORIES.length})
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
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setModalTab('situations');
                  }}
                  activeOpacity={0.8}
                >
                  <AlertCircle size={14} color={modalTab === 'situations' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#71717A')} />
                  <Text style={[styles.capsuleTabText, { color: modalTab === 'situations' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#71717A') }]}>
                    Situations ({SITUATIONS_DATA.length})
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Grid of Items */}
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.gridScrollContent}
            >
              {modalTab === 'specialties' ? (
                /* Specialties Grid */
                <View style={styles.specialtyGrid}>
                  {ALL_EXPLORE_CATEGORIES.map((cat) => {
                    const isSelected = activeTab === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.gridItem,
                          { 
                            backgroundColor: isDark ? (isSelected ? '#064E3B' : '#27272A') : (isSelected ? '#ECFDF5' : '#F9FAFB'),
                            borderColor: isSelected ? '#10B981' : (isDark ? '#3F3F46' : '#E5E7EB'),
                          }
                        ]}
                        onPress={() => handleSelectFromModal(cat.id)}
                        activeOpacity={0.75}
                      >
                        <View style={styles.gridImageContainer}>
                          <Image 
                            source={typeof cat.image === 'string' ? { uri: cat.image } : cat.image} 
                            style={styles.gridImage} 
                            resizeMode="cover"
                          />
                          {isSelected && (
                            <View style={styles.checkBadge}>
                              <Check size={10} color="#FFFFFF" strokeWidth={3} />
                            </View>
                          )}
                        </View>
                        <Text 
                          numberOfLines={2} 
                          style={[
                            styles.gridLabel, 
                            { color: isSelected ? '#10B981' : (isDark ? '#FFFFFF' : '#1F2937'), fontWeight: isSelected ? '700' : '600' }
                          ]}
                        >
                          {cat.id}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                /* Situations & Symptoms Grid */
                <View style={styles.specialtyGrid}>
                  {SITUATIONS_DATA.map((sit) => {
                    const isSelected = activeTab === sit.mappedCategory;
                    return (
                      <TouchableOpacity
                        key={sit.id}
                        style={[
                          styles.gridItem,
                          { 
                            backgroundColor: isDark ? (isSelected ? '#064E3B' : '#27272A') : (isSelected ? '#ECFDF5' : '#F9FAFB'),
                            borderColor: isSelected ? '#10B981' : (isDark ? '#3F3F46' : '#E5E7EB'),
                          }
                        ]}
                        onPress={() => handleSelectFromModal(sit.mappedCategory)}
                        activeOpacity={0.75}
                      >
                        <View style={styles.gridImageContainer}>
                          <Image 
                            source={typeof sit.image === 'string' ? { uri: sit.image } : sit.image} 
                            style={styles.gridImage} 
                            resizeMode="cover"
                          />
                          {isSelected && (
                            <View style={styles.checkBadge}>
                              <Check size={10} color="#FFFFFF" strokeWidth={3} />
                            </View>
                          )}
                        </View>
                        <Text 
                          numberOfLines={1} 
                          style={[
                            styles.gridLabel, 
                            { color: isSelected ? '#10B981' : (isDark ? '#FFFFFF' : '#1F2937'), fontWeight: isSelected ? '700' : '600' }
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
              )}
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
    gap: 8,
    alignItems: 'flex-start',
    position: 'relative',
    paddingBottom: 10,
  },
  sliderTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  gradientBar: {
    width: SLIDER_WIDTH,
    height: 4,
    borderRadius: 2,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 6,
    width: ITEM_WIDTH,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  activeImageContainer: {
    transform: [{ scale: 1.05 }],
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeLabel: {
    fontWeight: '700',
  },
  seeAllPill: {
    alignItems: 'center',
    gap: 6,
    width: ITEM_WIDTH,
  },
  seeAllIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  seeAllLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '84%',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
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
    gap: 6,
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
    paddingBottom: 24,
  },
  specialtyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (Dimensions.get('window').width - 32 - 20) / 3,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
  },
  gridImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLabel: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  mappedCategoryTag: {
    fontSize: 9,
    textAlign: 'center',
  },
});
