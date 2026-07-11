import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Star, CheckCircle2 } from 'lucide-react-native';

interface DoctorInfoBlockProps {
  doctor: any;
  isDark: boolean;
  colors: any;
}

export default function DoctorInfoBlock({ doctor, isDark, colors }: DoctorInfoBlockProps) {
  return (
    <View style={styles.doctorInfoContainer}>
      <View style={styles.docTopRow}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: doctor.image }} style={styles.avatar} />
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.docDetails}>
          <View style={styles.nameRow}>
            <Text style={[styles.docName, { color: colors.text }]}>{doctor.name}</Text>
            <CheckCircle2 size={16} color="#3B82F6" fill="#E0E7FF" style={{ marginLeft: 4 }} />
          </View>
          <Text style={styles.docTitle}>{doctor.title}</Text>
          <Text style={styles.docDegrees}>{doctor.degrees}</Text>
          
          <View style={styles.ratingRow}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={[styles.ratingText, { color: '#F59E0B' }]}>{doctor.rating} <Text style={{ color: '#6B7280', fontWeight: '500' }}>({doctor.reviews})</Text></Text>
            
            <View style={[styles.infoPill, { backgroundColor: '#ECFDF5', borderColor: '#D1FAE5', marginLeft: 12 }]}>
              <Text style={[styles.infoPillText, { color: '#10B981', fontWeight: '700' }]}>🔥 Highly Booked</Text>
            </View>
          </View>

          {/* Pills Row */}
          <View style={styles.docPillRow}>
            <View style={[styles.infoPill, { backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
              <Text style={[styles.infoPillText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>💼 {doctor.experience}</Text>
            </View>
            <View style={[styles.infoPill, { backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
              <Text style={[styles.infoPillText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>🏥 {doctor.hospital}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  doctorInfoContainer: {
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 12,
  },
  docTopRow: {
    flexDirection: 'row',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F3F4F6',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  docDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  docName: {
    fontSize: 22,
    fontWeight: '800',
  },
  docTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 2,
  },
  docDegrees: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 4,
  },
  docPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoPillText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
