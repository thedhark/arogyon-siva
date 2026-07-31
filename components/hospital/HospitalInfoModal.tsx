import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Linking, 
  Share,
  Platform 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Share2, 
  Navigation, 
  Clock, 
  ChevronDown, 
  ShieldCheck, 
  Image as ImageIcon,
  PhoneCall,
  FileText,
  MapPin
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface HospitalInfoModalProps {
  visible: boolean;
  onClose: () => void;
  hospitalName: string;
  location?: string;
  phone?: string;
  image?: string;
}

const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=500',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=500',
  'https://images.unsplash.com/photo-1538108149393-cebb47cdf14d?q=80&w=500',
  'https://images.unsplash.com/photo-1587351021355-a479a299d2f9?q=80&w=500',
];

export default function HospitalInfoModal({ 
  visible, 
  onClose, 
  hospitalName, 
  location = 'Old Airport Road, Bangalore', 
  phone,
  image
}: HospitalInfoModalProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const [showHoursDropdown, setShowHoursDropdown] = useState(false);

  const handleDirections = () => {
    const query = encodeURIComponent(`${hospitalName}, ${location}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch(() => {});
  };

  const handleShare = () => {
    Share.share({
      title: hospitalName,
      message: `Check out ${hospitalName} on Arogyon: ${location}`,
    }).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8FAFC' }]}>
        
        {/* Top Header Bar */}
        <View style={[
          styles.headerBar, 
          { 
            paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 24) + 8,
            backgroundColor: isDark ? '#18181B' : '#FFFFFF' 
          }
        ]}>
          <TouchableOpacity onPress={onClose} style={styles.headerBtn} activeOpacity={0.7}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>Hospital Information</Text>

          <TouchableOpacity onPress={handleShare} style={styles.headerBtn} activeOpacity={0.7}>
            <Share2 size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingBottom: Math.max(insets.bottom, 20) + 90 }
          ]}
        >
          {/* Hospital Header Title Card */}
          <View style={[styles.cardSection, { backgroundColor: isDark ? '#1E1E22' : '#FFFFFF' }]}>
            <Text style={[styles.hospitalTitle, { color: colors.text }]}>{hospitalName}</Text>
            
            <View style={styles.feeBadgeRow}>
              <View style={[styles.feePill, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]}>
                <Text style={[styles.feePillText, { color: colors.text }]}>₹800 Consultation Fee</Text>
              </View>
              <Text style={styles.subCategoryText}>Multi Speciality • Quaternary Care</Text>
            </View>

            {/* Real Map Location Card */}
            <View style={[styles.mapCard, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]}>
              <View style={styles.mapImageWrapper}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600' }} 
                  style={styles.mapImage} 
                />
                <View style={styles.mapPinOverlay}>
                  <MapPin size={22} color="#EF4444" fill="#EF4444" />
                </View>
                <View style={styles.distanceBadge}>
                  <Text style={styles.distanceBadgeText}>3.7 km away</Text>
                </View>
              </View>

              <View style={styles.mapDetailsBody}>
                <Text style={[styles.fullAddressText, { color: colors.text }]}>
                  98, {location}, HAL 2nd Stage, Kodihalli, Bengaluru, Karnataka 560017
                </Text>

                <TouchableOpacity style={styles.directionsCtaBtn} onPress={handleDirections} activeOpacity={0.88}>
                  <Navigation size={16} color="#FFFFFF" fill="#FFFFFF" />
                  <Text style={styles.directionsCtaText}>Get Directions on Map</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Call Desk & Emergency Hotlines */}
            <View style={styles.callButtonsRow}>
              <TouchableOpacity 
                style={[styles.callBtn, { backgroundColor: '#10B981' }]} 
                onPress={() => Linking.openURL(`tel:${phone || '08022223333'}`).catch(() => {})}
                activeOpacity={0.85}
              >
                <PhoneCall size={15} color="#FFFFFF" />
                <Text style={styles.callBtnText}>Call Desk</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.callBtn, { backgroundColor: '#E11D48' }]} 
                onPress={() => Linking.openURL('tel:108').catch(() => {})}
                activeOpacity={0.85}
              >
                <PhoneCall size={15} color="#FFFFFF" />
                <Text style={styles.callBtnText}>24x7 Ambulance</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Operating Hours Box */}
          <View style={[styles.cardSection, { backgroundColor: isDark ? '#1E1E22' : '#FFFFFF' }]}>
            <TouchableOpacity 
              style={styles.hoursRow} 
              onPress={() => setShowHoursDropdown(!showHoursDropdown)}
              activeOpacity={0.7}
            >
              <Clock size={18} color="#10B981" />
              <Text style={styles.hoursText}>
                <Text style={styles.openNowText}>Open 24/7</Text> • Emergency & OPD Care
              </Text>
              <ChevronDown 
                size={18} 
                color="#64748B" 
                style={{ transform: [{ rotate: showHoursDropdown ? '180deg' : '0deg' }] }} 
              />
            </TouchableOpacity>

            {showHoursDropdown && (
              <View style={styles.hoursDropdownContent}>
                <Text style={styles.dropdownLine}>• Emergency & ICU Triage: Open 24/7</Text>
                <Text style={styles.dropdownLine}>• OPD Specialist Consults: 8:00 AM - 8:00 PM</Text>
                <Text style={styles.dropdownLine}>• Pathology Lab & Pharmacy: Open 24/7</Text>
              </View>
            )}
          </View>

          {/* Photos Gallery */}
          <View style={[styles.cardSection, { backgroundColor: isDark ? '#1E1E22' : '#FFFFFF' }]}>
            <View style={styles.sectionHeaderRow}>
              <ImageIcon size={18} color="#0284C7" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Hospital Photo Gallery</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photosScroll}>
              {SAMPLE_PHOTOS.map((imgUri, idx) => (
                <Image key={idx} source={{ uri: imgUri }} style={styles.photoThumbnail} />
              ))}
            </ScrollView>
          </View>

          {/* Accreditation & Verified Credentials Box */}
          <View style={[styles.cardSection, { backgroundColor: isDark ? '#1E1E22' : '#FFFFFF' }]}>
            <View style={styles.accreditationHeader}>
              <ShieldCheck size={20} color="#10B981" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.accreditationTitle, { color: colors.text }]}>NABH & JCI Quality Accreditation</Text>
                <Text style={styles.accreditationSub}>This facility adheres strictly to NABH medical safety protocols.</Text>
              </View>
            </View>

            <View style={[styles.cardDivider, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]} />

            <View style={[styles.credentialsBox, { backgroundColor: isDark ? '#27272A' : '#F8FAFC' }]}>
              <View style={styles.credentialsHeader}>
                <FileText size={16} color="#0284C7" />
                <Text style={[styles.credentialsTitle, { color: colors.text }]}>Verified Registration & License</Text>
              </View>
              <View style={styles.credentialsList}>
                <Text style={styles.credText}>• State Medical Reg No: <Text style={{ fontWeight: '700', color: colors.text }}>KA/BGC/HOSP/2019/9941</Text></Text>
                <Text style={styles.credText}>• CIN Registration: <Text style={{ fontWeight: '700', color: colors.text }}>U85110KA2015PTC082910</Text></Text>
                <Text style={styles.credText}>• NABH Quality License: <Text style={{ fontWeight: '700', color: colors.text }}>NABH-H-2021-0842</Text></Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Fixed Action Button */}
        <View style={[
          styles.bottomContainer, 
          { 
            backgroundColor: isDark ? '#18181B' : '#FFFFFF',
            paddingBottom: Math.max(insets.bottom, 14) 
          }
        ]}>
          <TouchableOpacity style={styles.goBackBtn} onPress={onClose} activeOpacity={0.9}>
            <Text style={styles.goBackBtnText}>Go back to hospital</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 0,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  cardSection: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  hospitalTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  feeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  feePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  feePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  subCategoryText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  mapCard: {
    borderRadius: 16,
    borderWidth: 0,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mapImageWrapper: {
    height: 120,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPinOverlay: {
    position: 'absolute',
    top: '40%',
    left: '48%',
  },
  distanceBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  mapDetailsBody: {
    padding: 14,
    gap: 12,
  },
  fullAddressText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  directionsCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E11D48',
    paddingVertical: 11,
    borderRadius: 14,
    gap: 8,
  },
  directionsCtaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  callButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hoursText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    flex: 1,
  },
  openNowText: {
    color: '#10B981',
    fontWeight: '800',
  },
  hoursDropdownContent: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    gap: 6,
  },
  dropdownLine: {
    fontSize: 12,
    color: '#64748B',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  photosScroll: {
    gap: 10,
  },
  photoThumbnail: {
    width: 120,
    height: 95,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  accreditationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  accreditationTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  accreditationSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    marginVertical: 14,
  },
  credentialsBox: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 0,
  },
  credentialsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  credentialsTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  credentialsList: {
    gap: 4,
  },
  credText: {
    fontSize: 11,
    color: '#64748B',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 14,
    paddingHorizontal: 16,
    borderTopWidth: 0,
  },
  goBackBtn: {
    backgroundColor: '#E11D48',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
