import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, Heart, Star, Flame, Zap, ThumbsUp, Briefcase, User } from 'lucide-react-native';

interface DoctorCardProps {
  doc: any;
  isDark: boolean;
  colors: any;
  isLiked: boolean;
  onPress: () => void;
  onLikePress: () => void;
}

export default function DoctorCard({ doc, isDark, colors, isLiked, onPress, onLikePress }: DoctorCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.docCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}
      onPress={onPress}
    >
      {/* Top Info Section */}
      <View style={styles.docCardTop}>
        <View style={styles.docLeft}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: doc.image }} style={styles.docAvatar} />
            <View style={styles.onlineDot} />
          </View>
        </View>
        
        <View style={styles.docInfo}>
          <View style={styles.docHeaderRow}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.docName, { color: colors.text }]} numberOfLines={1}>{doc.name}</Text>
              <CheckCircle2 size={16} color="#3B82F6" fill="#E0E7FF" style={{ marginLeft: 4 }} />
            </View>
            <TouchableOpacity onPress={onLikePress} style={{ paddingLeft: 8 }}>
              <Heart size={20} color={isLiked ? "#EF4444" : "#6B7280"} fill={isLiked ? "#EF4444" : "transparent"} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.docSpecialty}>{doc.speciality}</Text>
          <Text style={styles.docDegrees}>{doc.degrees}</Text>
          
          <View style={styles.docStatsRow}>
            <View style={styles.ratingBadge}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.docRating}>{doc.rating}</Text>
            </View>
            <Text style={styles.docReviews}>({doc.reviews} reviews)</Text>
            
            {doc.tagType === 'fire' && (
              <View style={[styles.highlightTag, { backgroundColor: '#ECFDF5' }]}>
                <Flame size={12} color="#10B981" fill="#10B981" />
                <Text style={[styles.highlightTagText, { color: '#10B981' }]}>{doc.tagText}</Text>
              </View>
            )}
            {doc.tagType === 'zap' && (
              <View style={[styles.highlightTag, { backgroundColor: '#EFF6FF' }]}>
                <Zap size={12} color="#3B82F6" fill="#3B82F6" />
                <Text style={[styles.highlightTagText, { color: '#3B82F6' }]}>{doc.tagText}</Text>
              </View>
            )}
            {doc.tagType === 'thumb' && (
              <View style={[styles.highlightTag, { backgroundColor: '#FFF7ED' }]}>
                <ThumbsUp size={12} color="#F97316" fill="#F97316" />
                <Text style={[styles.highlightTagText, { color: '#F97316' }]}>{doc.tagText}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.docPillRow}>
            <View style={styles.infoPill}>
              <Briefcase size={12} color="#6B7280" />
              <Text style={styles.infoPillText}>{doc.experience}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Dashed Divider */}
      <View style={styles.dashedDivider} />

      {/* Bottom Action Section */}
      <View style={styles.docCardBottom}>
        <View style={styles.feeCol}>
          <Text style={[styles.bottomColVal, { color: colors.text }]}>₹{doc.price}</Text>
          <Text style={styles.bottomColLabel}>Consultation Fee</Text>
        </View>
        
        <View style={styles.verticalDivider} />
        
        <View style={styles.availabilityCol}>
          <Text style={[styles.bottomColVal, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>{doc.nextAvailable}</Text>
          <Text style={styles.bottomColLabel}>Next Available</Text>
        </View>
        
        <LinearGradient colors={['#14B8A6', '#6366F1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bookGradientBtn}>
          <View style={styles.bookBtnInner}>
            <Text style={styles.bookBtnText}>Book</Text>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  docCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  docCardTop: {
    flexDirection: 'row',
    padding: 16,
  },
  docLeft: {
    marginRight: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  docAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F3F4F6',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  docInfo: {
    flex: 1,
  },
  docHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  docName: {
    fontSize: 18,
    fontWeight: '800',
  },
  docSpecialty: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 2,
  },
  docDegrees: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  docStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docRating: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F59E0B',
    marginLeft: 4,
  },
  docReviews: {
    fontSize: 12,
    color: '#6B7280',
  },
  highlightTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  highlightTagText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  docPillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  infoPillText: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  dashedDivider: {
    height: 1,
    width: '100%',
    backgroundColor: '#F3F4F6',
  },
  docCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FAFAFA',
  },
  feeCol: {
    // Auto width
  },
  availabilityCol: {
    flex: 1,
  },
  bottomColVal: {
    fontSize: 15,
    fontWeight: '800',
  },
  bottomColLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  bookGradientBtn: {
    borderRadius: 20,
    marginLeft: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookBtnInner: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
