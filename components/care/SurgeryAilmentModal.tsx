import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  Animated 
} from 'react-native';
import { 
  X, 
  ArrowLeft, 
  ChevronRight, 
  Check, 
  Activity,
  Eye,
  User,
  Heart,
  Sparkles,
  Shield,
  Stethoscope,
  Smile,
  Circle
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export interface AilmentCategory {
  id: string;
  name: string;
  speciality: string;
  color: string;
  icon: any;
  ailments: string[];
}

export const SURGICAL_CATEGORIES: AilmentCategory[] = [
  {
    id: 'ortho',
    name: 'Knee and Joints related',
    speciality: 'Orthopedics',
    color: '#6366F1',
    icon: Activity,
    ailments: [
      'Knee Replacement',
      'Arthroscopy',
      'Carpal Tunnel Syndrome',
      'Lumbar Laminectomy',
      'ACL Repair',
      'Microdiscectomy',
      'Knee Arthroscopy',
      'Shoulder Arthroscopy',
      'Hip Replacement',
    ],
  },
  {
    id: 'eye',
    name: 'Eye related',
    speciality: 'Ophthalmology',
    color: '#38BDF8',
    icon: Eye,
    ailments: [
      'Cataract Surgery',
      'LASIK Vision Correction',
      'Glaucoma Surgery',
      'Squint Correction',
      'Retinal Surgery',
    ],
  },
  {
    id: 'gen-surgery',
    name: 'General Surgery',
    speciality: 'General Surgery',
    color: '#F43F5E',
    icon: User,
    ailments: [
      'Hernia Repair (Laparoscopic)',
      'Gallbladder Removal (Cholecystectomy)',
      'Appendectomy',
      'Hydrocele Surgery',
      'Sebaceous Cyst Removal',
    ],
  },
  {
    id: 'procto',
    name: 'Anus related',
    speciality: 'Proctology',
    color: '#FB923C',
    icon: Shield,
    ailments: [
      'Piles (Hemorrhoids Laser Surgery)',
      'Fissure Laser Surgery',
      'Fistula Laser Surgery',
      'Pilonidal Sinus Surgery',
    ],
  },
  {
    id: 'cardio',
    name: 'Cardiology related',
    speciality: 'Cardiology',
    color: '#EF4444',
    icon: Heart,
    ailments: [
      'Angioplasty & Stenting',
      'Pacemaker Implantation',
      'Coronary Artery Bypass (CABG)',
      'Heart Valve Surgery',
    ],
  },
  {
    id: 'cosmetic',
    name: 'Cosmetic Surgery related',
    speciality: 'Cosmetic & Plastic Surgery',
    color: '#F472B6',
    icon: Sparkles,
    ailments: [
      'Gynecomastia Surgery',
      'Liposuction',
      'Rhinoplasty (Nose Surgery)',
      'Tummy Tuck (Abdominoplasty)',
      'Hair Transplant (FUE)',
    ],
  },
  {
    id: 'uro',
    name: 'Kidney related',
    speciality: 'Urology',
    color: '#10B981',
    icon: Stethoscope,
    ailments: [
      'Laser Kidney Stone Removal (RIRS)',
      'Prostate Surgery (TURP/HoLEP)',
      'Phimosis (Laser Circumcision)',
      'Varicocele Repair',
    ],
  },
  {
    id: 'gynaec',
    name: 'Gynaecology related',
    speciality: 'Gynaecology',
    color: '#EC4899',
    icon: Heart,
    ailments: [
      'Laparoscopic Hysterectomy',
      'Myomectomy (Fibroid Removal)',
      'Ovarian Cystectomy',
      'Normal / C-Section Delivery',
      'IVF Consultation',
    ],
  },
  {
    id: 'dentist',
    name: 'Dentist',
    speciality: 'Dental Surgery',
    color: '#3B82F6',
    icon: Smile,
    ailments: [
      'Dental Implants',
      'Wisdom Tooth Extraction',
      'Root Canal Treatment (RCT)',
      'Teeth Alignment & Braces',
    ],
  },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectAilment: (ailment: string, category: string) => void;
  selectedAilment?: string;
  isDark?: boolean;
}

export default function SurgeryAilmentModal({
  visible,
  onClose,
  onSelectAilment,
  selectedAilment,
  isDark = false,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<AilmentCategory | null>(null);

  const handleCategoryPress = (category: AilmentCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  };

  const handleAilmentPress = (ailment: string) => {
    Haptics.selectionAsync();
    onSelectAilment(ailment, selectedCategory?.speciality || '');
    onClose();
    setSelectedCategory(null);
  };

  const handleBackToCategories = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(null);
  };

  const handleModalClose = () => {
    onClose();
    setSelectedCategory(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleModalClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContentCard, 
          { backgroundColor: isDark ? '#111927' : '#FFFFFF' }
        ]}>
          
          {/* Header Level 1: Category Selection */}
          {!selectedCategory ? (
            <View style={styles.modalHeaderRow}>
              <TouchableOpacity 
                style={styles.closeIconBtn} 
                onPress={handleModalClose}
                activeOpacity={0.8}
              >
                <X size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>

              <Text style={[styles.modalTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Select your Surgical ailment
              </Text>
            </View>
          ) : (
            /* Header Level 2: Specific Ailments List */
            <View style={styles.modalHeaderRowLevel2}>
              <TouchableOpacity 
                style={styles.backIconBtn} 
                onPress={handleBackToCategories}
                activeOpacity={0.8}
              >
                <ArrowLeft size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>

              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitleTextLevel2, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Select your ailment
                </Text>
                <Text style={styles.modalSubTitleLevel2}>
                  Showing {selectedCategory.ailments.length} {selectedCategory.speciality} ailments
                </Text>
              </View>

              <View style={[styles.categoryBadgeCircle, { backgroundColor: selectedCategory.color + '20' }]}>
                {React.createElement(selectedCategory.icon, { size: 22, color: selectedCategory.color })}
              </View>
            </View>
          )}

          {/* Body Level 1: Category List matching screenshot */}
          {!selectedCategory ? (
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={styles.listContainer}
            >
              {SURGICAL_CATEGORIES.map((cat, idx) => {
                const IconComp = cat.icon;
                const isLast = idx === SURGICAL_CATEGORIES.length - 1;

                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryRow,
                      !isLast && styles.rowDivider,
                    ]}
                    onPress={() => handleCategoryPress(cat)}
                    activeOpacity={0.7}
                  >
                    {/* Circle Icon */}
                    <View style={[styles.iconCircle, { backgroundColor: cat.color + '15' }]}>
                      <IconComp size={24} color={cat.color} />
                    </View>

                    {/* Category Title & Speciality */}
                    <View style={styles.categoryTextWrap}>
                      <Text style={[styles.categoryName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                        {cat.name}
                      </Text>
                      <Text style={styles.categorySpeciality}>
                        {cat.speciality}
                      </Text>
                    </View>

                    <ChevronRight size={22} color="#94A3B8" />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            /* Body Level 2: Specific Ailment List matching screenshot 2 */
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={styles.listContainer}
            >
              {selectedCategory.ailments.map((ailment, idx) => {
                const isSelected = selectedAilment === ailment;
                const isLast = idx === selectedCategory.ailments.length - 1;

                return (
                  <TouchableOpacity
                    key={ailment}
                    style={[
                      styles.ailmentRow,
                      !isLast && styles.rowDivider,
                    ]}
                    onPress={() => handleAilmentPress(ailment)}
                    activeOpacity={0.7}
                  >
                    {/* Small Icon Badge */}
                    <View style={[styles.smallIconCircle, { backgroundColor: selectedCategory.color + '15' }]}>
                      {React.createElement(selectedCategory.icon, { size: 18, color: selectedCategory.color })}
                    </View>

                    <Text style={[
                      styles.ailmentText, 
                      { color: isSelected ? selectedCategory.color : (isDark ? '#E2E8F0' : '#334155') },
                      isSelected && { fontWeight: '700' }
                    ]}>
                      {ailment}
                    </Text>

                    {/* Radio Button Circle matching screenshot */}
                    <View style={styles.radioOuterCircle}>
                      {isSelected ? (
                        <View style={[styles.radioInnerCircle, { backgroundColor: selectedCategory.color }]} />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContentCard: {
    width: '100%',
    maxHeight: '85%',
    minHeight: 520,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 14,
  },
  closeIconBtn: {
    padding: 4,
  },
  modalTitleText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  modalHeaderRowLevel2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  backIconBtn: {
    padding: 4,
  },
  modalTitleTextLevel2: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalSubTitleLevel2: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  categoryBadgeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    paddingVertical: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTextWrap: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
  },
  categorySpeciality: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  ailmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 14,
  },
  smallIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ailmentText: {
    flex: 1,
    fontSize: 15.5,
    fontWeight: '600',
  },
  radioOuterCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
