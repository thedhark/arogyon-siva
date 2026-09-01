import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, LayoutAnimation, UIManager } from 'react-native';
import { 
  Info, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  Clock, 
  Languages, 
  Users, 
  Sparkles, 
  ShieldCheck,
  Stethoscope
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface DoctorAboutCardProps {
  doctor: any;
  hospitalName?: string;
  isDark?: boolean;
}

export default function DoctorAboutCard({
  doctor,
  hospitalName: hospitalNameProp = 'Apollo Hospital',
  isDark: isDarkProp,
}: DoctorAboutCardProps) {
  const { isDark: themeDark } = useTheme();
  const isDark = isDarkProp ?? themeDark;

  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  if (!doctor) return null;

  const docName = doctor.name || doctor.title || 'Doctor';
  const docSpeciality = doctor.specialty || doctor.speciality || doctor.degrees || 'Specialist';
  const hospitalName = doctor.hospitalName || doctor.hospital || hospitalNameProp || 'Apollo Hospital';
  
  const bio = doctor.about || doctor.bio || 
    `Senior clinical practitioner at ${hospitalName} with extensive expertise in ${docSpeciality.toLowerCase()}, advanced patient diagnosis, preventive healthcare, and customized patient recovery plans.`;

  const experience = doctor.experience || doctor.experienceYears || '8+ Years Exp';
  const qualification = doctor.qualification || doctor.degrees || doctor.education || 'MBBS, MD';
  const languages = Array.isArray(doctor.languages) 
    ? doctor.languages.join(', ') 
    : doctor.languages || 'English, Hindi';
  const patientsTreated = doctor.patientsTreated || doctor.patientCount || '8,500+ Treated';
  const tags: string[] = Array.isArray(doctor.tags) ? doctor.tags : ['Consultation', 'Preventive Care', 'Diagnosis'];
  const services: { id?: string; name: string; price?: string }[] = Array.isArray(doctor.services) ? doctor.services : [];

  const toggleBio = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsBioExpanded((prev) => !prev);
  };

  const toggleMoreDetails = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowMoreDetails((prev) => !prev);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#16181D' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
        },
      ]}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#EEF2FF' }]}>
            <Stethoscope size={15} color="#6366F1" />
          </View>
          <Text style={[styles.title, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            About Doctor
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.moreToggleBtn, { backgroundColor: isDark ? '#22252C' : '#F8FAFC' }]}
          onPress={toggleMoreDetails}
          activeOpacity={0.7}
        >
          <Text style={[styles.moreToggleText, { color: '#6366F1' }]}>
            {showMoreDetails ? 'Less Options' : 'More Options'}
          </Text>
          {showMoreDetails ? (
            <ChevronUp size={14} color="#6366F1" />
          ) : (
            <ChevronDown size={14} color="#6366F1" />
          )}
        </TouchableOpacity>
      </View>

      {/* Bio Paragraph */}
      <Text
        style={[
          styles.bioText,
          { color: isDark ? '#94A3B8' : '#475569' },
        ]}
        numberOfLines={isBioExpanded ? undefined : 2}
      >
        {bio}
      </Text>

      {bio.length > 90 && (
        <TouchableOpacity
          onPress={toggleBio}
          activeOpacity={0.7}
          style={styles.readMoreBtn}
        >
          <Text style={styles.readMoreText}>
            {isBioExpanded ? 'Read Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Doctor Quick Attribute Badges */}
      <View style={styles.badgeGrid}>
        <View style={[styles.badgePill, { backgroundColor: isDark ? '#22252C' : '#F8FAFC', borderColor: isDark ? '#2E3340' : '#E2E8F0' }]}>
          <Clock size={12} color={isDark ? '#94A3B8' : '#64748B'} />
          <Text style={[styles.badgeText, { color: isDark ? '#F1F5F9' : '#334155' }]}>{experience}</Text>
        </View>

        <View style={[styles.badgePill, { backgroundColor: isDark ? '#22252C' : '#F8FAFC', borderColor: isDark ? '#2E3340' : '#E2E8F0' }]}>
          <GraduationCap size={13} color={isDark ? '#94A3B8' : '#64748B'} />
          <Text style={[styles.badgeText, { color: isDark ? '#F1F5F9' : '#334155' }]} numberOfLines={1}>
            {qualification}
          </Text>
        </View>

        <View style={[styles.badgePill, { backgroundColor: isDark ? '#22252C' : '#F8FAFC', borderColor: isDark ? '#2E3340' : '#E2E8F0' }]}>
          <Languages size={12} color={isDark ? '#94A3B8' : '#64748B'} />
          <Text style={[styles.badgeText, { color: isDark ? '#F1F5F9' : '#334155' }]} numberOfLines={1}>
            {languages}
          </Text>
        </View>

        <View style={[styles.badgePill, { backgroundColor: isDark ? '#22252C' : '#F8FAFC', borderColor: isDark ? '#2E3340' : '#E2E8F0' }]}>
          <Users size={12} color={isDark ? '#94A3B8' : '#64748B'} />
          <Text style={[styles.badgeText, { color: isDark ? '#F1F5F9' : '#334155' }]}>{patientsTreated}</Text>
        </View>
      </View>

      {/* Expanded "More Options / Details" Section */}
      {showMoreDetails && (
        <View style={[styles.expandedContainer, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}>
          {/* Key Specializations / Tags */}
          <Text style={[styles.subSectionTitle, { color: isDark ? '#E2E8F0' : '#334155' }]}>
            Key Expertise & Specializations
          </Text>
          <View style={styles.tagsRow}>
            {tags.map((t, idx) => (
              <View 
                key={`${t}-${idx}`} 
                style={[
                  styles.specialtyChip, 
                  { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.12)' : '#EEF2FF', borderColor: isDark ? '#4338CA' : '#C7D2FE' }
                ]}
              >
                <Sparkles size={11} color="#6366F1" />
                <Text style={styles.specialtyChipText}>{t}</Text>
              </View>
            ))}
          </View>

          {/* Consultation Services If Available */}
          {services.length > 0 && (
            <View style={styles.servicesSection}>
              <Text style={[styles.subSectionTitle, { color: isDark ? '#E2E8F0' : '#334155', marginTop: 10 }]}>
                Available Services
              </Text>
              {services.map((s, idx) => (
                <View key={s.id || idx} style={[styles.serviceItemRow, { borderBottomColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC' }]}>
                  <Text style={[styles.serviceName, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                    • {s.name}
                  </Text>
                  {s.price ? (
                    <Text style={[styles.servicePrice, { color: isDark ? '#A5B4FC' : '#4F46E5' }]}>
                      {s.price}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}

          {/* Consultation Perks Banner */}
          <View style={[styles.perksBanner, { backgroundColor: isDark ? '#1F2937' : '#F0FDF4' }]}>
            <ShieldCheck size={16} color="#10B981" />
            <Text style={[styles.perksText, { color: isDark ? '#D1FAE5' : '#065F46' }]}>
              Verified Doctor • Free 7-Day Follow-Up Included
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  moreToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  moreToggleText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    fontWeight: '700',
  },
  bioText: {
    fontSize: 12.5,
    lineHeight: 18,
    fontFamily: Fonts.regular,
  },
  readMoreBtn: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    fontWeight: '700',
    color: '#6366F1',
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    fontWeight: '600',
  },
  expandedContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  subSectionTitle: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  specialtyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.8,
  },
  specialtyChipText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: '#4F46E5',
    fontWeight: '600',
  },
  servicesSection: {
    marginBottom: 10,
  },
  serviceItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
  },
  serviceName: {
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  servicePrice: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    fontWeight: '700',
  },
  perksBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 6,
  },
  perksText: {
    fontSize: 11.5,
    fontFamily: Fonts.semiBold,
    fontWeight: '600',
    flex: 1,
  },
});
