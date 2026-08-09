import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Linking, 
  Platform 
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Phone, 
  Shield, 
  Users, 
  Building2, 
  Stethoscope, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  X,
  Share2,
  Heart,
  Activity,
  FlaskConical,
  HeartPulse
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArogyonBrandLogo } from './PlannedSurgeryCare';

interface Props {
  colors: any;
  isDark: boolean;
}

const PACKAGE_OPTIONS = [
  'Executive Master Health Checkup (80+ Tests)',
  'Cardiac Preventive Risk Screening',
  'Diabetes & Metabolic Health Profile',
  'Senior Citizen Comprehensive Health Check',
  'Cancer Biomarker Screening Package',
  'Whole Body MRI Screening',
];

const CITY_OPTIONS = [
  'Bangalore',
  'Tirupati',
  'Hyderabad',
  'Chennai',
  'Delhi NCR',
  'Mumbai',
  'Pune',
];

const TREATMENTS_ACCORDION = [
  {
    title: 'Executive Full Body Screening',
    items: ['Complete Hemogram (CBC)', 'Liver & Kidney Function Panel', 'Lipid Profile & Atherosclerosis Risk', 'Thyroid Function (T3, T4, TSH)', 'HbA1c Average Blood Sugar'],
  },
  {
    title: 'Advanced Diagnostic Imaging',
    items: ['Whole Body MRI & Screening', 'CT Coronary Calcium Scoring', 'Ultrasound Abdomen & Pelvis', 'Digital X-Ray Chest', 'DEXA Bone Mineral Density'],
  },
  {
    title: 'Diabetic & Cardiac Specialities',
    items: ['Treadmill Stress Test (TMT)', '2D Echocardiogram with Doppler', 'Microalbuminuria & Renal Panel', 'Diabetic Neuropathy Foot Check'],
  },
  {
    title: 'Home Sample Collection',
    items: ['Free Home Phlebotomist Visit', 'NABL Certified Cold-Chain Transport', 'WhatsApp Digital Report Delivery within 12 Hrs', 'Free Doctor Tele-Report Consultation'],
  },
];

const PATIENT_REVIEWS = [
  {
    id: 'rev-1',
    initial: 'N',
    name: 'Narayana Moorthy',
    rating: '5.0',
    review: 'Free home sample collection at 7 AM on Sunday! The phlebotomist was professional, and reports arrived on WhatsApp by 4 PM.',
  },
  {
    id: 'rev-2',
    initial: 'A',
    name: 'Anand B.',
    rating: '4.9',
    review: 'Doctor report consultation was very detailed. Helped me spot early fatty liver and reverse it within 6 months.',
  },
  {
    id: 'rev-3',
    initial: 'S',
    name: 'Sunita Rao',
    rating: '5.0',
    review: 'Booked the senior citizen comprehensive health checkup for my mother. Smooth experience from home visit to doctor discussion.',
  },
];

export default function PreventiveHealthCare({ colors, isDark }: Props) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [selectedPackage, setSelectedPackage] = useState('Package Required');
  const [selectedCity, setSelectedCity] = useState('Tirupati');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('+919550715570');

  // Modals
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Accordion
  const [expandedSection, setExpandedSection] = useState<string | null>('Executive Full Body Screening');

  const handleBookAppointment = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowSuccessModal(true);
  };

  const handleCallPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL('tel:18001234567').catch(() => {
      setShowSuccessModal(true);
    });
  };

  const toggleAccordion = (title: string) => {
    Haptics.selectionAsync();
    setExpandedSection(prev => (prev === title ? null : title));
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#080C14' : '#F0FDFA' }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Full-Bleed Hero Cover Image Banner */}
        <View style={styles.heroCoverContainer}>
          <Image
            source="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1000"
            style={styles.heroCoverImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.85)']}
            style={styles.heroCoverGradient}
          >
            {/* Top Action Buttons Bar */}
            <View style={styles.topActionsRow}>
              <TouchableOpacity 
                style={styles.roundActionBtn} 
                onPress={() => router.back()}
                activeOpacity={0.85}
              >
                <ArrowLeft size={18} color="#0F172A" />
              </TouchableOpacity>

              <View style={styles.rightActionsWrap}>
                <TouchableOpacity 
                  style={styles.roundActionBtn} 
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsSaved(!isSaved);
                  }}
                  activeOpacity={0.85}
                >
                  <Heart size={18} color={isSaved ? '#EF4444' : '#0F172A'} fill={isSaved ? '#EF4444' : 'transparent'} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.roundActionBtn} 
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  activeOpacity={0.85}
                >
                  <Share2 size={18} color="#0F172A" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Left Text Content Over Image */}
            <View style={styles.heroTextOverlayWrap}>
              <View style={styles.verifiedBrandRow}>
                <Text style={styles.verifiedBrandText}>Arogyon Preventive Diagnostics</Text>
                <CheckCircle2 size={15} color="#0D9488" fill="#0D9488" />
              </View>

              <Text style={styles.heroMainTitle}>Preventive Health & Checkups</Text>
              <Text style={styles.heroMainSubtitle}>Proactive health screening, NABL accredited labs & doctor report review.</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Main Content Body */}
        <View style={styles.heroSection}>
          {/* Top Pill Badges Row */}
          <View style={styles.topBadgeRow}>
            <View style={styles.assuredBadge}>
              <ArogyonBrandLogo size={17} isDark={isDark} />
              <View style={styles.assuredTagPill}>
                <Text style={styles.assuredTagText}>PREVENTIVE</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.headerCallBtn} onPress={handleCallPress} activeOpacity={0.8}>
              <Phone size={13} color="#FFFFFF" />
              <Text style={styles.headerCallBtnText}>Call Diagnostics Desk</Text>
            </TouchableOpacity>
          </View>

          {/* Book Consultation Form Card */}
          <View style={[
            styles.formCard, 
            { 
              backgroundColor: isDark ? '#0F1C1A' : '#CCFBF1', 
              borderColor: isDark ? 'rgba(13, 148, 136, 0.3)' : '#99F6E4' 
            }
          ]}>
            <Text style={[styles.formCardTitle, { color: isDark ? '#FFFFFF' : '#115E59' }]}>
              Schedule Preventive Screening
            </Text>
            <Text style={[styles.formCardSubtitle, { color: isDark ? '#2DD4BF' : '#0D9488' }]}>
              Free Home Sample Collection & Doctor Consultation Included
            </Text>

            {/* Package Dropdown */}
            <TouchableOpacity 
              style={[styles.dropdownInput, { backgroundColor: isDark ? '#0A1312' : '#FFFFFF' }]}
              onPress={() => setShowPackageModal(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.dropdownText, { color: selectedPackage === 'Package Required' ? '#94A3B8' : (isDark ? '#FFFFFF' : '#115E59') }]}>
                {selectedPackage}
              </Text>
              <ChevronDown size={18} color="#64748B" />
            </TouchableOpacity>

            {/* City Dropdown */}
            <TouchableOpacity 
              style={[styles.dropdownInput, { backgroundColor: isDark ? '#0A1312' : '#FFFFFF' }]}
              onPress={() => setShowCityModal(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.dropdownText, { color: isDark ? '#FFFFFF' : '#115E59' }]}>
                {selectedCity}
              </Text>
              <ChevronDown size={18} color="#64748B" />
            </TouchableOpacity>

            {/* Name Input */}
            <TextInput
              style={[styles.textInput, { backgroundColor: isDark ? '#0A1312' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#115E59' }]}
              placeholder="Full Name"
              placeholderTextColor="#94A3B8"
              value={patientName}
              onChangeText={setPatientName}
            />

            {/* Phone Number Input */}
            <TextInput
              style={[styles.textInput, { backgroundColor: isDark ? '#0A1312' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#115E59' }]}
              placeholder="+91 98765 43210"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={patientPhone}
              onChangeText={setPatientPhone}
            />

            {/* Submit CTA Button */}
            <TouchableOpacity 
              style={styles.bookSubmitBtn}
              onPress={handleBookAppointment}
              activeOpacity={0.9}
            >
              <Text style={styles.bookSubmitBtnText}>Book Checkup Now</Text>
            </TouchableOpacity>

            <Text style={styles.formDisclaimer}>
              By submitting, you agree to Arogyon's <Text style={styles.tncLink}>T&C</Text>
            </Text>
          </View>

          {/* Why Arogyon Assured Section */}
          <View style={styles.sectionWrap}>
            <Text style={[styles.sectionHeading, { color: isDark ? '#FFFFFF' : '#115E59' }]}>
              Why Arogyon Preventive Health?
            </Text>

            <View style={[styles.infoCard, { backgroundColor: isDark ? '#0F1C1A' : '#CCFBF1', borderColor: '#99F6E4' }]}>
              <Text style={[styles.infoCardHeader, { color: isDark ? '#FFFFFF' : '#115E59' }]}>
                Diagnostic Excellence & Accuracy
              </Text>

              <View style={styles.benefitItem}>
                <FlaskConical size={20} color="#0D9488" style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>NABL & ISO Accredited Precision Labs</Text>
                  <Text style={styles.benefitSub}>
                    100% automated robotics processing ensuring 99.9% diagnostic accuracy.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Users size={20} color="#115E59" style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>Free Home Sample Collection</Text>
                  <Text style={styles.benefitSub}>
                    Certified phlebotomists collect samples at your doorstep with cold-chain transport.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Stethoscope size={20} color="#0D9488" style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>Included Physician Report Discussion</Text>
                  <Text style={styles.benefitSub}>
                    Free 1:1 tele-consultation with senior physician to explain report findings and lifestyle guidance.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Treatments Offered Accordions */}
          <View style={styles.sectionWrap}>
            <Text style={[styles.sectionHeading, { color: isDark ? '#FFFFFF' : '#115E59' }]}>
              Test Packages & Screening
            </Text>

            <View style={[styles.accordionContainer, { backgroundColor: isDark ? '#122421' : '#FFFFFF' }]}>
              {TREATMENTS_ACCORDION.map((acc, index) => {
                const isOpen = expandedSection === acc.title;
                const isLast = index === TREATMENTS_ACCORDION.length - 1;

                return (
                  <View key={acc.title} style={[!isLast && styles.accordionBorder]}>
                    <TouchableOpacity
                      style={styles.accordionHeaderRow}
                      onPress={() => toggleAccordion(acc.title)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.accordionTitle, { color: isDark ? '#FFFFFF' : '#115E59' }]}>
                        {acc.title}
                      </Text>
                      {isOpen ? <ChevronUp size={20} color="#0D9488" /> : <ChevronDown size={20} color="#64748B" />}
                    </TouchableOpacity>

                    {isOpen && (
                      <View style={styles.accordionBody}>
                        {acc.items.map(item => (
                          <TouchableOpacity
                            key={item}
                            style={styles.accordionItemRow}
                            onPress={() => {
                              setSelectedPackage(item);
                              Haptics.selectionAsync();
                            }}
                          >
                            <CheckCircle2 size={16} color="#0D9488" />
                            <Text style={[styles.accordionItemText, { color: isDark ? '#CBD5E1' : '#334155' }]}>
                              {item}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Experiences You Can Trust Testimonial Section */}
          <View style={styles.sectionWrap}>
            <Text style={[styles.sectionHeading, { color: isDark ? '#FFFFFF' : '#115E59' }]}>
              Patient Reviews
            </Text>

            <View style={[styles.reviewContainerCard, { backgroundColor: isDark ? '#122421' : '#FFFFFF' }]}>
              <View style={styles.overallRatingRow}>
                <Star size={18} color="#0D9488" fill="#0D9488" />
                <Text style={[styles.overallRatingText, { color: isDark ? '#FFFFFF' : '#115E59' }]}>
                  Rated 4.95 <Text style={{ fontSize: 13, fontWeight: '500', color: '#64748B' }}>(68,900 Checkups Completed)</Text>
                </Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewsScroll}>
                {PATIENT_REVIEWS.map(rev => (
                  <View key={rev.id} style={[styles.reviewCard, { backgroundColor: isDark ? '#0A1312' : '#CCFBF1' }]}>
                    <View style={styles.reviewUserHeader}>
                      <View style={styles.userAvatarCircle}>
                        <Text style={styles.userAvatarText}>{rev.initial}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.reviewerName, { color: isDark ? '#FFFFFF' : '#115E59' }]}>
                          {rev.name}
                        </Text>
                        <View style={styles.starRow}>
                          <Star size={12} color="#0D9488" fill="#0D9488" />
                          <Text style={styles.reviewStarText}>{rev.rating}</Text>
                        </View>
                      </View>
                    </View>
                    <Text style={[styles.reviewBodyText, { color: isDark ? '#CBD5E1' : '#475569' }]} numberOfLines={5}>
                      {rev.review}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Arogyon Brand Vision Banner */}
          <LinearGradient
            colors={['#115E59', '#0D9488', '#0F766E']}
            style={styles.visionBanner}
          >
            <ArogyonBrandLogo size={26} isDark={true} />
            <Text style={styles.visionText}>
              Empowering individuals with early disease detection, actionable wellness insights, and lifelong vitality.
            </Text>
          </LinearGradient>

          <View style={{ height: 90 }} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Call Bar */}
      <View style={[styles.stickyBottomBar, { backgroundColor: isDark ? '#122421' : '#FFFFFF', borderTopColor: isDark ? '#333' : '#E2E8F0' }]}>
        <View style={styles.stickyBottomLeft}>
          <Image
            source="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=150"
            style={styles.stickyAvatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.stickyQuestionText, { color: isDark ? '#FFFFFF' : '#115E59' }]} numberOfLines={1}>
              Need help selecting a checkup package?
            </Text>
            <Text style={styles.stickySubText} numberOfLines={1}>
              Diagnostic advisors online to help.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.stickyCallBtn} onPress={handleCallPress} activeOpacity={0.9}>
          <Phone size={14} color="#FFFFFF" />
          <Text style={styles.stickyCallBtnText}>Call Desk</Text>
        </TouchableOpacity>
      </View>

      {/* Select Package Modal */}
      <Modal visible={showPackageModal} transparent animationType="slide" onRequestClose={() => setShowPackageModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#122421' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#115E59' }]}>Select Checkup Package</Text>
              <TouchableOpacity onPress={() => setShowPackageModal(false)}>
                <X size={20} color={isDark ? '#FFFFFF' : '#115E59'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 320 }}>
              {PACKAGE_OPTIONS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={styles.modalItemRow}
                  onPress={() => {
                    setSelectedPackage(s);
                    setShowPackageModal(false);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={[styles.modalItemText, { color: selectedPackage === s ? '#0D9488' : (isDark ? '#CBD5E1' : '#334155'), fontWeight: selectedPackage === s ? '700' : '500' }]}>
                    {s}
                  </Text>
                  {selectedPackage === s && <CheckCircle2 size={18} color="#0D9488" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Select City Modal */}
      <Modal visible={showCityModal} transparent animationType="slide" onRequestClose={() => setShowCityModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#122421' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#115E59' }]}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <X size={20} color={isDark ? '#FFFFFF' : '#115E59'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
              {CITY_OPTIONS.map(c => (
                <TouchableOpacity
                  key={c}
                  style={styles.modalItemRow}
                  onPress={() => {
                    setSelectedCity(c);
                    setShowCityModal(false);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={[styles.modalItemText, { color: selectedCity === c ? '#0D9488' : (isDark ? '#CBD5E1' : '#334155'), fontWeight: selectedCity === c ? '700' : '500' }]}>
                    {c}
                  </Text>
                  {selectedCity === c && <CheckCircle2 size={18} color="#0D9488" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Callback Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade" onRequestClose={() => setShowSuccessModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#122421' : '#FFFFFF', alignItems: 'center', padding: 24 }]}>
            <CheckCircle2 size={54} color="#0D9488" />
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#115E59', marginTop: 14, textAlign: 'center' }]}>
              Checkup Scheduled!
            </Text>
            <Text style={{ fontSize: 13.5, color: '#64748B', textAlign: 'center', marginTop: 6, lineHeight: 20 }}>
              Our Diagnostic Care Manager will call you back within 15 minutes to confirm home sample collection for <Text style={{ fontWeight: '700', color: '#115E59' }}>{selectedPackage}</Text> in {selectedCity}.
            </Text>

            <TouchableOpacity
              style={[styles.bookSubmitBtn, { width: '100%', marginTop: 20 }]}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.bookSubmitBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroCoverContainer: {
    height: 232,
    width: '100%',
    position: 'relative',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroCoverImage: {
    width: '100%',
    height: '100%',
  },
  heroCoverGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 52 : 38,
    paddingHorizontal: 16,
    paddingBottom: 38,
  },
  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightActionsWrap: {
    flexDirection: 'row',
    gap: 10,
  },
  roundActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  heroTextOverlayWrap: {
    gap: 4,
  },
  verifiedBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedBrandText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroMainTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroMainSubtitle: {
    color: '#CCFBF1',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  assuredBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  assuredTagPill: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  assuredTagText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 9,
    letterSpacing: 0.8,
  },
  headerCallBtn: {
    backgroundColor: '#115E59',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  headerCallBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 20,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  formCardTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  formCardSubtitle: {
    fontSize: 12.5,
    fontWeight: '500',
    marginBottom: 16,
    marginTop: 2,
  },
  dropdownInput: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#99F6E4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '600',
  },
  textInput: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  bookSubmitBtn: {
    backgroundColor: '#115E59',
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  bookSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  formDisclaimer: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
  },
  tncLink: {
    color: '#0D9488',
    fontWeight: '700',
  },
  sectionWrap: {
    marginTop: 24,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  infoCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 18,
  },
  infoCardHeader: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  benefitTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#115E59',
  },
  benefitSub: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    lineHeight: 16,
  },
  accordionContainer: {
    borderRadius: 22,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  accordionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCFBF1',
  },
  accordionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  accordionBody: {
    paddingBottom: 14,
    gap: 8,
  },
  accordionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  accordionItemText: {
    fontSize: 13.5,
    fontWeight: '500',
  },
  reviewContainerCard: {
    borderRadius: 24,
    padding: 16,
  },
  overallRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CCFBF1',
    marginBottom: 14,
  },
  overallRatingText: {
    fontSize: 15,
    fontWeight: '800',
  },
  reviewsScroll: {
    gap: 12,
  },
  reviewCard: {
    width: 260,
    padding: 14,
    borderRadius: 18,
  },
  reviewUserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  userAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  reviewerName: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  reviewStarText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#115E59',
  },
  reviewBodyText: {
    fontSize: 12,
    lineHeight: 17,
  },
  visionBanner: {
    borderRadius: 26,
    padding: 24,
    marginTop: 28,
    alignItems: 'center',
  },
  visionText: {
    color: '#CCFBF1',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 100,
  },
  stickyBottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  stickyAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  stickyQuestionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  stickySubText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  stickyCallBtn: {
    backgroundColor: '#115E59',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 14,
  },
  stickyCallBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
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
    borderRadius: 24,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CCFBF1',
  },
  modalTitle: {
    fontSize: 16.5,
    fontWeight: '800',
  },
  modalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 2,
  },
  modalItemText: {
    fontSize: 14,
  },
});
