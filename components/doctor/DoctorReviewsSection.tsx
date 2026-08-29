import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star, CheckCircle2, MessageSquare, ThumbsUp } from 'lucide-react-native';
import { Fonts } from '@/constants/theme';

interface ReviewItem {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
  tag?: string;
}

const SAMPLE_REVIEWS: ReviewItem[] = [
  {
    id: 'r1',
    patientName: 'Kavita M.',
    rating: 5,
    date: '2 days ago',
    comment: 'Extremely polite and thorough examination. Listened carefully to all symptoms and explained the diagnosis with great patience.',
    tag: 'Thorough Diagnosis',
  },
  {
    id: 'r2',
    patientName: 'Rahul V.',
    rating: 5,
    date: '1 week ago',
    comment: 'Very minimal wait time at the clinic. Treatment plan worked within 48 hours. Highly recommend to everyone.',
    tag: 'Accurate Treatment',
  },
  {
    id: 'r3',
    patientName: 'Pooja S.',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Caring doctor with modern medical insights. Answered all my questions and guided through follow-up steps.',
    tag: 'Friendly & Caring',
  },
];

interface DoctorReviewsSectionProps {
  doctorRating?: string;
  reviewsCount?: string;
  isDark: boolean;
  colors: any;
}

export default function DoctorReviewsSection({
  doctorRating = '4.8',
  reviewsCount = '1.2K',
  isDark,
  colors,
}: DoctorReviewsSectionProps) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            borderColor: isDark ? '#2C2C2E' : '#E5E7EB',
          },
        ]}
      >
        {/* Section Header */}
        <View style={styles.headerRow}>
          <MessageSquare size={17} color="#F59E0B" />
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Verified Patient Reviews
          </Text>
        </View>

        {/* Rating Summary Bar */}
        <View
          style={[
            styles.summaryStrip,
            {
              backgroundColor: isDark ? '#25252A' : '#F9FAFB',
              borderColor: isDark ? '#33333F' : '#E5E7EB',
            },
          ]}
        >
          <View style={styles.bigRatingBox}>
            <Text style={[styles.bigRatingText, { color: colors.text }]}>{doctorRating}</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={11} color="#F59E0B" fill="#F59E0B" />
              ))}
            </View>
            <Text style={[styles.totalReviewsText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              {reviewsCount} ratings
            </Text>
          </View>

          <View style={styles.highlightRight}>
            <View style={styles.highlightItem}>
              <ThumbsUp size={12} color="#10B981" />
              <Text style={[styles.highlightText, { color: colors.text }]}>98% Satisfaction</Text>
            </View>
            <View style={styles.highlightItem}>
              <CheckCircle2 size={12} color="#3B82F6" />
              <Text style={[styles.highlightText, { color: colors.text }]}>100% Verified Visits</Text>
            </View>
          </View>
        </View>

        {/* Reviews List */}
        <View style={styles.reviewsList}>
          {SAMPLE_REVIEWS.map((rev) => (
            <View
              key={rev.id}
              style={[
                styles.reviewCard,
                {
                  backgroundColor: isDark ? '#25252A' : '#F9FAFB',
                  borderColor: isDark ? '#2C2C2E' : '#F3F4F6',
                },
              ]}
            >
              <View style={styles.reviewHeader}>
                <View style={styles.patientInfo}>
                  <Text style={[styles.patientName, { color: colors.text }]}>
                    {rev.patientName}
                  </Text>
                  <View style={styles.verifiedVisitTag}>
                    <CheckCircle2 size={10} color="#10B981" />
                    <Text style={styles.verifiedVisitText}>Verified Patient</Text>
                  </View>
                </View>
                <Text style={[styles.reviewDate, { color: isDark ? '#9CA3AF' : '#9CA3AF' }]}>
                  {rev.date}
                </Text>
              </View>

              <Text style={[styles.commentText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
                "{rev.comment}"
              </Text>

              {rev.tag && (
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>{rev.tag}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14.5,
    fontFamily: Fonts.bold,
    fontWeight: '800',
  },
  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  bigRatingBox: {
    alignItems: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: 'rgba(156, 163, 175, 0.2)',
  },
  bigRatingText: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    fontWeight: '900',
    lineHeight: 28,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 2,
  },
  totalReviewsText: {
    fontSize: 10,
    fontFamily: Fonts.medium,
  },
  highlightRight: {
    flex: 1,
    paddingLeft: 14,
    gap: 6,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  highlightText: {
    fontSize: 11.5,
    fontFamily: Fonts.semiBold,
    fontWeight: '600',
  },
  reviewsList: {
    gap: 10,
  },
  reviewCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  patientName: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    fontWeight: '700',
  },
  verifiedVisitTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedVisitText: {
    fontSize: 9.5,
    fontFamily: Fonts.medium,
    color: '#10B981',
  },
  reviewDate: {
    fontSize: 10.5,
    fontFamily: Fonts.regular,
  },
  commentText: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: Fonts.regular,
    fontStyle: 'italic',
  },
  tagBadge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: '#3B82F6',
    fontWeight: '700',
  },
});
