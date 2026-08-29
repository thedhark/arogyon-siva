import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { X, Star, Check, Camera, CheckCircle2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { Appointment } from '@/hooks/useBookingStore';

interface BookingFeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  booking: Appointment;
  initialRating?: number;
  onSubmitSuccess?: (rating: number, comment: string, recommend: boolean) => void;
}

export default function BookingFeedbackModal({
  visible,
  onClose,
  booking,
  initialRating = 5,
  onSubmitSuccess,
}: BookingFeedbackModalProps) {
  const { colors, isDark } = useTheme();

  const [rating, setRating] = useState<number>(initialRating || 5);
  const [recommend, setRecommend] = useState<boolean>(true);
  const [comment, setComment] = useState<string>('');
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Reanimated star scale animations
  const starScales = [
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
  ];

  const handleStarPress = (index: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setRating(index + 1);

    // Bouncy spring animation on the tapped star and preceding stars
    for (let i = 0; i <= index; i++) {
      starScales[i].value = withSequence(
        withSpring(1.35, { damping: 6, stiffness: 300 }),
        withSpring(1, { damping: 8, stiffness: 200 })
      );
    }
  };

  const getFeedbackHeading = (r: number) => {
    if (r === 5) return "We're glad you loved it";
    if (r === 4) return "Glad you had a good experience";
    if (r === 3) return "Thanks for sharing your feedback";
    return "We're sorry it didn't meet expectations";
  };

  const handleSubmit = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setIsSubmitted(true);
    if (onSubmitSuccess) {
      onSubmitSuccess(rating, comment, recommend);
    }
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  const doctorName = booking?.doctorName || 'Dr. Ramesh Verma';
  const hospitalName = booking?.hospitalName || 'Apollo Hospitals';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.bottomContentWrap}>
          {/* Floating Dark Circular Close Button above sheet */}
          <TouchableOpacity
            style={styles.floatingCloseBtn}
            onPress={onClose}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={20} color="#FFFFFF" strokeWidth={2.6} />
          </TouchableOpacity>

          <View
            style={[
              styles.sheetContainer,
              {
                backgroundColor: isDark ? '#162038' : '#F4F7FB',
                borderColor: isDark ? '#233252' : '#E0ECF8',
              },
            ]}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {isSubmitted ? (
                /* Success Confirmation State */
                <View style={styles.successContainer}>
                  <CheckCircle2 size={56} color="#10B981" />
                  <Text style={[styles.successTitle, { color: colors.text }]}>
                    Thank You for Your Feedback!
                  </Text>
                  <Text style={styles.successSubtitle}>
                    Your review helps {doctorName} and other patients on Arogyon.
                  </Text>
                </View>
              ) : (
                <>
                  {/* 1. Top Rating Summary Card */}
                  <View
                    style={[
                      styles.ratingSummaryCard,
                      {
                        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                        borderColor: isDark ? '#334155' : '#E2E8F0',
                      },
                    ]}
                  >
                    {/* 5 Big Interactive Stars */}
                    <View style={styles.starsRow}>
                      {[0, 1, 2, 3, 4].map((i) => {
                        const starNum = i + 1;
                        const isFilled = starNum <= rating;
                        const animatedStyle = useAnimatedStyle(() => ({
                          transform: [{ scale: starScales[i].value }],
                        }));

                        return (
                          <TouchableOpacity
                            key={i}
                            onPress={() => handleStarPress(i)}
                            activeOpacity={0.8}
                            style={styles.starTouchArea}
                          >
                            <Animated.View style={animatedStyle}>
                              <Star
                                size={28}
                                color={isFilled ? '#F59E0B' : isDark ? '#4B5563' : '#CBD5E1'}
                                fill={isFilled ? '#F59E0B' : 'transparent'}
                              />
                            </Animated.View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Feedback Title & Doctor/Hospital */}
                    <Text style={[styles.feedbackHeading, { color: colors.text }]}>
                      {getFeedbackHeading(rating)}
                    </Text>
                    <Text style={styles.hospitalSubtitle} numberOfLines={1}>
                      {hospitalName} • {doctorName}
                    </Text>
                  </View>

                  {/* 2. Middle Recommendation & Note Card */}
                  <View
                    style={[
                      styles.recommendCard,
                      {
                        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                        borderColor: isDark ? '#334155' : '#E2E8F0',
                      },
                    ]}
                  >
                    {/* Recommend Checkbox Row */}
                    <TouchableOpacity
                      style={styles.checkboxRow}
                      onPress={() => {
                        if (Platform.OS !== 'web') {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                        setRecommend(!recommend);
                      }}
                      activeOpacity={0.75}
                    >
                      <View
                        style={[
                          styles.checkboxBox,
                          recommend ? styles.checkboxChecked : styles.checkboxUnchecked,
                        ]}
                      >
                        {recommend && <Check size={14} color="#FFFFFF" strokeWidth={3.2} />}
                      </View>
                      <Text style={[styles.recommendTitle, { color: colors.text }]}>
                        I recommend it to my friends
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.recommendDesc}>
                      Doctor and care services in this booking will appear as a recommendation to friends who have your contact.
                    </Text>

                    {/* Dotted Divider */}
                    <View style={[styles.dashedDivider, { borderColor: isDark ? '#334155' : '#E2E8F0' }]} />

                    {/* Send a note heading */}
                    <Text style={[styles.noteHeading, { color: colors.text }]}>
                      Send a note to the doctor & clinic
                    </Text>

                    {/* Note TextInput */}
                    <TextInput
                      style={[
                        styles.noteInput,
                        {
                          backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                          borderColor: isDark ? '#334155' : '#E2E8F0',
                          color: colors.text,
                        },
                      ]}
                      placeholder="Add your thoughts here"
                      placeholderTextColor={isDark ? '#71717A' : '#94A3B8'}
                      value={comment}
                      onChangeText={setComment}
                      multiline
                      numberOfLines={3}
                    />

                    {/* Add Photo Button */}
                    <TouchableOpacity
                      style={styles.addPhotoBtn}
                      onPress={() => {
                        if (Platform.OS !== 'web') {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                        setAttachedPhoto(
                          attachedPhoto
                            ? null
                            : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=300'
                        );
                      }}
                      activeOpacity={0.75}
                    >
                      <Camera size={16} color="#64748B" />
                      <Text style={styles.addPhotoText}>
                        {attachedPhoto ? 'Photo Attached (Remove)' : 'Add photo'}
                      </Text>
                    </TouchableOpacity>

                    {attachedPhoto && (
                      <Image source={{ uri: attachedPhoto }} style={styles.attachedPreview} />
                    )}
                  </View>
                </>
              )}
            </ScrollView>

            {/* 3. Bottom Submit Button */}
            {!isSubmitted && (
              <View style={styles.footerBar}>
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleSubmit}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitBtnText}>Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  bottomContentWrap: {
    width: '100%',
    alignItems: 'center',
  },
  floatingCloseBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  sheetContainer: {
    width: '100%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    maxHeight: '88%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  scrollContent: {
    padding: 16,
  },
  ratingSummaryCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  starTouchArea: {
    padding: 2,
  },
  feedbackHeading: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  hospitalSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  recommendCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#E11D48',
  },
  checkboxUnchecked: {
    borderWidth: 1.5,
    borderColor: '#94A3B8',
  },
  recommendTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    fontWeight: '700',
  },
  recommendDesc: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    paddingLeft: 30,
    marginBottom: 12,
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    marginVertical: 10,
  },
  noteHeading: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 8,
  },
  noteInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    minHeight: 70,
    textAlignVertical: 'top',
    fontSize: 13.5,
    fontFamily: Fonts.medium,
    marginBottom: 10,
  },
  addPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  addPhotoText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#64748B',
  },
  attachedPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginTop: 8,
  },
  footerBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  submitBtn: {
    backgroundColor: '#E11D48',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    gap: 10,
  },
  successTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  successSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
});
