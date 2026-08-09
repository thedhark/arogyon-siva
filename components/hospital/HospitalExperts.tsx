import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { HeartPulse, Bone, Brain, Ribbon, ArrowUpDown, X, CheckCircle2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import DoctorCard from '@/components/DoctorCard';
import { useBookingStore } from '@/hooks/useBookingStore';

interface Props {
  doctors: any[];
  likedDocs: {[key: string]: boolean};
  toggleDocLike: (id: string) => void;
  colors: any;
  isDark: boolean;
  searchQuery?: string;
}

const PRIMARY_SPECIALTIES = [
  { id: 'All', name: 'All', icon: null },
  { id: 'Cardiology', name: 'Cardiology', icon: HeartPulse },
  { id: 'Orthopaedics', name: 'Orthopaedics', icon: Bone },
  { id: 'Neurology', name: 'Neurology', icon: Brain },
  { id: 'Oncology', name: 'Oncology', icon: Ribbon },
];

const ALL_SPECIALTIES = [
  { id: 'All', name: 'All Specialties' },
  { id: 'Cardiology', name: 'Cardiology' },
  { id: 'Orthopaedics', name: 'Orthopaedics' },
  { id: 'Neurology', name: 'Neurology' },
  { id: 'Oncology', name: 'Oncology' },
  { id: 'Gynaecologist', name: 'Gynaecologist & Obstetrics' },
  { id: 'Dermatologist', name: 'Dermatology & Skin' },
  { id: 'Pediatrics', name: 'Pediatrics & Child Care' },
  { id: 'ENT', name: 'ENT Specialist' },
  { id: 'Gastroenterology', name: 'Gastroenterology' },
  { id: 'Urology', name: 'Urology & Kidney' },
  { id: 'Pulmonology', name: 'Pulmonology & Chest' },
  { id: 'General Physician', name: 'General Medicine' },
];

export default function HospitalExperts({ doctors, likedDocs, toggleDocLike, colors, isDark, searchQuery: externalSearchQuery = '' }: Props) {
  const router = useRouter();
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const storeDoctors = useBookingStore(state => state.doctors);

  const allStoreDoctors = useMemo(() => Object.values(storeDoctors || {}), [storeDoctors]);
  const listToRender = (doctors && doctors.length > 0) ? doctors : allStoreDoctors;

  const filteredDoctors = useMemo(() => {
    const query = (externalSearchQuery || '').trim().toLowerCase();
    return listToRender.filter(d => {
      const matchSpec =
        selectedSpec === 'All' ||
        (d.speciality || '').toLowerCase().includes(selectedSpec.toLowerCase()) ||
        (selectedSpec === 'Cardiology' && d.speciality?.toLowerCase().includes('cardio')) ||
        (selectedSpec === 'Orthopaedics' && d.speciality?.toLowerCase().includes('ortho')) ||
        (selectedSpec === 'Gynaecologist' && d.speciality?.toLowerCase().includes('gynaec')) ||
        (selectedSpec === 'Dermatologist' && d.speciality?.toLowerCase().includes('derma'));

      const matchQuery =
        !query ||
        (d.name || '').toLowerCase().includes(query) ||
        (d.speciality || '').toLowerCase().includes(query);

      return matchSpec && matchQuery;
    });
  }, [listToRender, selectedSpec, externalSearchQuery]);

  return (
    <View style={styles.tabContent}>
      {/* Specialty Filter Scroll Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.specialtiesScroll}
      >
        {PRIMARY_SPECIALTIES.map((spec) => {
          const isActive = selectedSpec === spec.name;
          const IconComp = spec.icon;

          if (spec.id === 'All') {
            return (
              <TouchableOpacity
                key={spec.id}
                style={[
                  styles.allPill,
                  {
                    backgroundColor: isActive ? (isDark ? '#38BDF8' : '#0F172A') : (isDark ? '#27272A' : '#F8FAFC'),
                    borderColor: isActive ? 'transparent' : (isDark ? '#3F3F46' : '#E2E8F0'),
                  },
                ]}
                onPress={() => setSelectedSpec('All')}
                activeOpacity={0.8}
              >
                <Text style={[styles.allPillText, { color: isActive ? (isDark ? '#0F172A' : '#FFFFFF') : colors.text }]}>
                  All
                </Text>
                {isActive && <View style={[styles.allUnderline, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]} />}
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={spec.id}
              style={[
                styles.specPill,
                {
                  backgroundColor: isActive ? (isDark ? '#2E1065' : '#F3E8FF') : (isDark ? '#1E1E24' : '#FFFFFF'),
                  borderColor: isActive ? '#7C3AED' : (isDark ? '#333333' : '#E2E8F0'),
                },
              ]}
              onPress={() => setSelectedSpec(spec.name)}
              activeOpacity={0.8}
            >
              {IconComp && <IconComp size={14} color={isActive ? '#7C3AED' : (isDark ? '#CBD5E1' : '#1E293B')} style={{ marginRight: 5 }} />}
              <Text
                style={[
                  styles.specName,
                  {
                    color: isActive ? '#7C3AED' : (isDark ? '#E2E8F0' : '#1E293B'),
                    fontWeight: isActive ? '700' : '600',
                  },
                ]}
              >
                {spec.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.morePill, { borderColor: isDark ? '#3F3F46' : '#E2E8F0', backgroundColor: isDark ? '#1E1E24' : '#FFFFFF' }]}
          activeOpacity={0.7}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={[styles.morePillText, { color: isDark ? '#CBD5E1' : '#334155' }]}>+12</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Header & Experts List */}
      <View style={styles.topDoctorsHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Top Specialist Experts</Text>
        <TouchableOpacity style={[styles.sortBtn, { backgroundColor: isDark ? '#1E1E1E' : '#F8FAFC' }]}>
          <ArrowUpDown size={13} color="#6B7280" />
          <Text style={[styles.sortText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>Sort</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.doctorList}>
        {filteredDoctors.map((doc) => {
          const mappedDoc = {
            id: doc.id,
            name: doc.name,
            speciality: doc.speciality,
            degrees: doc.location ? (doc.location.includes(',') ? doc.location.split(',')[1].trim() : doc.location) : 'In-Clinic',
            rating: doc.rating || '4.8',
            reviews: doc.reviews || '100+',
            price: doc.fee || doc.price || '500',
            nextAvailable: 'Today',
            image: doc.image,
            tagType: Number(doc.rating) >= 4.9 ? 'fire' : Number(doc.rating) >= 4.7 ? 'zap' : 'thumb',
            tagText: Number(doc.rating) >= 4.9 ? 'Top Rated' : Number(doc.rating) >= 4.7 ? 'Popular' : 'Recommended',
          };

          return (
            <DoctorCard
              key={doc.id}
              doc={mappedDoc}
              isDark={isDark}
              colors={colors}
              isLiked={likedDocs[doc.id] || false}
              onPress={() => router.push({ pathname: '/doctor/[id]', params: { id: doc.id.toString() } })}
              onLikePress={() => toggleDocLike(doc.id)}
            />
          );
        })}
      </View>

      {/* Specialty Filter Modal */}
      {showCategoryModal && (
        <Modal visible={showCategoryModal} transparent animationType="slide" onRequestClose={() => setShowCategoryModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: isDark ? '#1E1E24' : '#FFFFFF' }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Select Expert Specialty</Text>
                <TouchableOpacity onPress={() => setShowCategoryModal(false)} style={styles.closeBtn}>
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
                {ALL_SPECIALTIES.map((item) => {
                  const isSelected = selectedSpec === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.modalItemRow,
                        isSelected && { backgroundColor: isDark ? '#2E1065' : '#F3E8FF' },
                      ]}
                      onPress={() => {
                        setSelectedSpec(item.id);
                        setShowCategoryModal(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalItemText,
                          { color: isSelected ? '#7C3AED' : colors.text, fontWeight: isSelected ? '800' : '600' },
                        ]}
                      >
                        {item.name}
                      </Text>
                      {isSelected && <CheckCircle2 size={18} color="#7C3AED" />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  specialtiesScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 10,
  },
  allPill: {
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 0.8,
    height: 28,
  },
  allPillText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  allUnderline: {
    width: 10,
    height: 2,
    borderRadius: 1,
    marginTop: 1,
  },
  specPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 0.8,
    height: 28,
  },
  specName: {
    fontSize: 11.5,
  },
  morePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  morePillText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  topDoctorsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 3,
  },
  doctorList: {
    gap: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 2,
  },
  modalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginVertical: 2,
  },
  modalItemText: {
    fontSize: 14,
  },
});
