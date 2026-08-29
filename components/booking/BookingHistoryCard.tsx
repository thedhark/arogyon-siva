import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  ChevronRight,
  MoreVertical,
  RotateCcw,
  Star,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Headphones,
  FileText,
  Plus,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { Appointment } from '@/hooks/useBookingStore';

interface Props {
  appointment: Appointment;
  onReorderPress?: (appointment: Appointment) => void;
  onSupportPress?: (appointment: Appointment) => void;
  onShareFeedbackPress?: (appointment: Appointment, rating: number) => void;
  onTrackRefundPress?: (appointment: Appointment) => void;
  onViewReceiptPress?: (appointment: Appointment) => void;
}

export default function BookingHistoryCard({
  appointment,
  onReorderPress,
  onSupportPress,
  onShareFeedbackPress,
  onTrackRefundPress,
  onViewReceiptPress,
}: Props) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);

  // Animated star scales for bouncy micro-animation
  const starScales = [
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
  ];

  const isFailed = appointment.paymentStatus === 'refunded' || appointment.status === 'cancelled';
  const isCompleted = appointment.status === 'completed';
  const isUpcoming = appointment.status === 'upcoming';

  const hospitalName = appointment.hospitalName || 'Apollo Hospitals';
  const locationText = appointment.location || 'Banjara Hills, Hyderabad';
  const doctorName = appointment.doctorName || 'Doctor Specialist';
  const speciality = appointment.speciality || 'Consultant Specialist';
  const priceVal = appointment.totalPaid || appointment.fee || '800';

  const handleRating = (stars: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setRating(stars);

    // Trigger bouncy spring micro-animation for stars
    for (let i = 0; i < stars; i++) {
      starScales[i].value = withSequence(
        withSpring(1.4, { damping: 5, stiffness: 320 }),
        withSpring(1, { damping: 7, stiffness: 220 })
      );
    }
  };

  const handleCardPress = () => {
    router.push(`/appointments/${appointment.id}` as any);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleCardPress}
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? '#162038' : '#FFFFFF',
          borderColor: isDark ? '#233252' : '#E0ECF8',
        },
      ]}
    >
      {/* 1. Header: Hospital Thumbnail + Info + 3-dots */}
      <View style={styles.topHeader}>
        <Image
          source={{
            uri:
              appointment.image ||
              'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200',
          }}
          style={styles.hospitalThumb}
        />
        <View style={styles.headerInfoCol}>
          <Text style={[styles.hospitalTitle, { color: colors.text }]} numberOfLines={1}>
            {hospitalName}
          </Text>
          <Text style={styles.locationSubtitle} numberOfLines={1}>
            {locationText}
          </Text>
          <TouchableOpacity
            style={styles.viewDetailsRow}
            onPress={handleCardPress}
            activeOpacity={0.7}
          >
            <Text style={styles.viewDetailsText}>View menu</Text>
            <ChevronRight size={12} color="#E11D48" strokeWidth={2.6} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.dotsButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MoreVertical size={18} color={isDark ? '#94A3B8' : '#64748B'} />
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: isDark ? '#233252' : '#F1F5F9' }]} />

      {/* 2. Items List */}
      <View style={styles.itemsListContainer}>
        <View style={styles.itemRow}>
          <Text style={[styles.itemTitleText, { color: colors.text }]} numberOfLines={1}>
            {doctorName} ({speciality})
          </Text>
        </View>
      </View>

      {/* 3. Booking Date & Status & Price Row */}
      <View style={styles.dateAndPriceRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.placedDateText}>
            Order placed on {appointment.date || '25 Aug'}, {appointment.time || '8:30PM'}
          </Text>

          {isCompleted && (
            <View style={styles.statusInlineRow}>
              <CheckCircle2 size={13} color="#10B981" />
              <Text style={styles.completedStatusText}>Delivered</Text>
            </View>
          )}

          {isUpcoming && (
            <View style={styles.statusInlineRow}>
              <Calendar size={13} color="#2563EB" />
              <Text style={styles.upcomingStatusText}>
                {appointment.confirmationStatus === 'visit_requested'
                  ? 'Visit Requested • Verifying Slot'
                  : 'Confirmed Scheduled'}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.priceContainer}
          onPress={handleCardPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.priceText, { color: colors.text }]}>₹{Number(priceVal).toFixed(2)}</Text>
          <ChevronRight size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* 4. Failed Alert or Bottom Actions */}
      {isFailed && (
        <View style={styles.failedAlertContainer}>
          <View style={styles.failedAlertLeft}>
            <AlertCircle size={16} color="#EF4444" style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.failedTitle}>Booking Cancelled / Refund</Text>
              <Text style={styles.failedDesc}>
                {appointment.arnNumber ? `ARN: ${appointment.arnNumber}` : 'Full refund approved.'}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {onTrackRefundPress && (
              <TouchableOpacity
                style={[styles.supportOutlineBtn, { borderColor: '#EF4444' }]}
                onPress={() => onTrackRefundPress(appointment)}
                activeOpacity={0.8}
              >
                <RotateCcw size={13} color="#EF4444" strokeWidth={2.2} />
                <Text style={[styles.supportOutlineText, { color: '#EF4444' }]}>Track Refund</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.reorderBtn}
              onPress={() => onReorderPress?.(appointment)}
              activeOpacity={0.85}
            >
              <RotateCcw size={14} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.reorderBtnText}>Rebook</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isCompleted && (
        <View style={styles.completedActionsRow}>
          {/* Rate Stars + Share More Feedback Stack */}
          <View style={styles.rateCol}>
            <View style={styles.rateRow}>
              <Text style={[styles.rateLabel, { color: colors.text }]}>Rate</Text>
              <View style={styles.starsGroup}>
                {[0, 1, 2, 3, 4].map((i) => {
                  const starVal = i + 1;
                  const isFilled = starVal <= rating;
                  const animStyle = useAnimatedStyle(() => ({
                    transform: [{ scale: starScales[i].value }],
                  }));

                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => handleRating(starVal)}
                      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                      style={styles.starTouchItem}
                    >
                      <Animated.View style={animStyle}>
                        <Star
                          size={19}
                          color={isFilled ? '#F59E0B' : isDark ? '#4B5563' : '#CBD5E1'}
                          fill={isFilled ? '#F59E0B' : 'transparent'}
                        />
                      </Animated.View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Share more feedback link */}
            {rating > 0 && (
              <TouchableOpacity
                style={styles.shareFeedbackLink}
                onPress={() => onShareFeedbackPress?.(appointment, rating)}
                activeOpacity={0.7}
              >
                <Text style={styles.shareFeedbackText}>Share more feedback</Text>
                <ChevronRight size={13} color="#E11D48" strokeWidth={2.6} />
              </TouchableOpacity>
            )}
          </View>

          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            {onViewReceiptPress && (
              <TouchableOpacity
                style={[
                  styles.supportOutlineBtn,
                  { borderColor: isDark ? '#334155' : '#E2E8F0' },
                ]}
                onPress={() => onViewReceiptPress(appointment)}
                activeOpacity={0.75}
              >
                <FileText size={13} color="#005C4B" />
                <Text style={[styles.supportOutlineText, { color: '#005C4B' }]}>Receipt</Text>
              </TouchableOpacity>
            )}

            {/* Reorder / Book Again Button */}
            <TouchableOpacity
              style={styles.reorderBtn}
              onPress={() => onReorderPress?.(appointment)}
              activeOpacity={0.85}
            >
              <RotateCcw size={14} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.reorderBtnText}>Reorder</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isUpcoming && (
        <View style={styles.upcomingActionsRow}>
          {onViewReceiptPress && (
            <TouchableOpacity
              style={[
                styles.supportOutlineBtn,
                { borderColor: isDark ? '#334155' : '#E2E8F0' },
              ]}
              onPress={() => onViewReceiptPress(appointment)}
              activeOpacity={0.75}
            >
              <FileText size={13} color="#005C4B" />
              <Text style={[styles.supportOutlineText, { color: '#005C4B' }]}>Receipt</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.supportOutlineBtn,
              { borderColor: isDark ? '#334155' : '#E2E8F0' },
            ]}
            onPress={() => onSupportPress?.(appointment)}
            activeOpacity={0.75}
          >
            <Headphones size={14} color="#4F46E5" />
            <Text style={styles.supportOutlineText}>Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reorderBtn, { backgroundColor: '#4F46E5' }]}
            onPress={handleCardPress}
            activeOpacity={0.85}
          >
            <Text style={styles.reorderBtnText}>View Details</Text>
            <ChevronRight size={14} color="#FFFFFF" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  hospitalThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  headerInfoCol: {
    flex: 1,
  },
  hospitalTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  locationSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 2,
  },
  viewDetailsText: {
    fontFamily: Fonts.bold,
    fontSize: 11.5,
    color: '#E11D48',
    fontWeight: '700',
  },
  dotsButton: {
    padding: 4,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  itemsListContainer: {
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitleText: {
    fontFamily: Fonts.semiBold,
    fontSize: 13.5,
    fontWeight: '600',
    flex: 1,
  },
  dateAndPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 8,
  },
  placedDateText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#64748B',
  },
  statusInlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  completedStatusText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  upcomingStatusText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  priceText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    fontWeight: '700',
  },
  failedAlertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(239, 68, 68, 0.15)',
    marginTop: 4,
    gap: 8,
  },
  failedAlertLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  failedTitle: {
    fontFamily: Fonts.bold,
    fontSize: 12.5,
    color: '#EF4444',
    fontWeight: '700',
  },
  failedDesc: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 14,
    marginTop: 1,
  },
  completedActionsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    marginTop: 4,
  },
  rateCol: {
    flex: 1,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rateLabel: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    fontWeight: '700',
  },
  starsGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  starTouchItem: {
    padding: 2,
  },
  shareFeedbackLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 2,
  },
  shareFeedbackText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#E11D48',
    fontWeight: '700',
  },
  upcomingActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    marginTop: 4,
    gap: 10,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E11D48',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  reorderBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  supportOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 5,
  },
  supportOutlineText: {
    fontFamily: Fonts.bold,
    fontSize: 12.5,
    color: '#4F46E5',
    fontWeight: '700',
  },
});
