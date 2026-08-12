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
  ShieldCheck,
  Users, 
  User,
  Building2, 
  Stethoscope, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  X,
  Share2,
  Globe,
  Plane,
  Heart,
  FileCheck,
  FileText,
  Headphones,
  PhoneCall,
  MessageSquare
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import InquiryFormCard, { FormFieldConfig } from './InquiryFormCard';
import WhyArogyonGrid, { WhyItem } from './WhyArogyonGrid';
import { ArogyonBrandLogo } from './PlannedSurgeryCare';

interface Props {
  colors: any;
  isDark: boolean;
}

const SERVICE_OPTIONS = [
  'Medical Tourism Package',
  'Second Medical Opinion (Online)',
  'Tele-Consultation with Chief Specialist',
  'Medical Visa Invitation Letter',
  'Airport Pick-up & Local Stay',
  'Oncology & Cancer Treatment',
  'Cardiac Surgery & Angioplasty',
  'Joint & Knee Replacement',
];

const COUNTRY_OPTIONS = [
  'United Arab Emirates (UAE)',
  'Saudi Arabia / GCC',
  'Bangladesh',
  'Nepal',
  'Kenya / East Africa',
  'Nigeria / West Africa',
  'United Kingdom / Europe',
  'United States / Americas',
  'Other International Location',
];

const TREATMENTS_ACCORDION = [
  {
    title: 'Medical Tourism Specialities',
    items: ['Proton Therapy & Cancer Care', 'Robotic Cardiac Bypass & Valve Replacement', 'Bilateral Knee & Hip Replacement', 'Organ Transplant Assistance', 'Advanced Neurosurgery'],
  },
  {
    title: 'Tele-Health & Remote Opinions',
    items: ['1:1 Video Consultation with Chief Medical Officer', 'Comprehensive MRI / CT Scan Review', 'Multidisciplinary Tumor Board Opinion', 'Prescription & Treatment Plan Translation'],
  },
  {
    title: 'Travel, Visa & Stay Services',
    items: ['24-Hour Urgent Medical Visa Invitation Letter', 'VIP Airport Transfer & Ambulance Reception', 'Hotel & Serviced Apartments Near Hospital', 'Dedicated Personal Translator (Arabic/French/Russian)'],
  },
  {
    title: 'Post-Treatment Global Care',
    items: ['Tele-Follow-up After Returning Home', 'Medicines Dispatch & International Delivery', 'Local Physician Coordination in Home Country'],
  },
];

const PATIENT_REVIEWS = [
  {
    id: 'rev-1',
    initial: 'A',
    name: 'Ahmed K. (UAE)',
    rating: '5.0',
    review: 'Arogyon arranged my father cardiac procedure in Bangalore seamlessly. Visa letter was issued within 24 hours, and the translator was at the airport to receive us!',
  },
  {
    id: 'rev-2',
    initial: 'E',
    name: 'Elena R. (Uzbekistan)',
    rating: '4.9',
    review: 'Outstanding tele-consultation with top oncologist before flying to India. Save us time and gave complete confidence in the treatment plan.',
  },
  {
    id: 'rev-3',
    initial: 'J',
    name: 'Joseph M. (Kenya)',
    rating: '5.0',
    review: 'The international patient coordinator took care of everything—hospital admission, currency exchange, and hotel stay for my wife.',
  },
];

export default function InternationalPatientCare({ colors, isDark }: Props) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [selectedService, setSelectedService] = useState('Medical Service');
  const [selectedCountry, setSelectedCountry] = useState('United Arab Emirates (UAE)');
  const [patientName, setPatientName] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [patientPhone, setPatientPhone] = useState('50 123 4567');

  // Modals
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Accordion
  const [expandedSection, setExpandedSection] = useState<string | null>('Medical Tourism Specialities');

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
    <View style={[styles.container, { backgroundColor: isDark ? '#080C14' : '#F2F7F9' }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Full-Bleed Hero Cover Image Banner */}
        <View style={styles.heroCoverContainer}>
          <Image
            source="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000"
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
                <Text style={styles.verifiedBrandText}>Arogyon International Patient Desk</Text>
                <CheckCircle2 size={15} color="#3B82F6" fill="#3B82F6" />
              </View>

              <Text style={styles.heroMainTitle}>International Patient Care</Text>
              <Text style={styles.heroMainSubtitle}>World-class medical care, tele-consults & travel concierge.</Text>
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
                <Text style={styles.assuredTagText}>GLOBAL</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.headerCallBtn} onPress={handleCallPress} activeOpacity={0.8}>
              <Phone size={13} color="#FFFFFF" />
              <Text style={styles.headerCallBtnText}>Call International Desk</Text>
            </TouchableOpacity>
          </View>

          {/* Form Card matching Image 2 Mockup */}
          <InquiryFormCard
            isDark={isDark}
            headerIcon={Globe}
            headerIconBg="#D6EBF8"
            headerIconColor="#0284C7"
            title="Request Medical Assistance"
            subtitle="Get video opinion & visa support within 24 hours"
            fields={[
              {
                key: 'service',
                type: 'dropdown',
                icon: Stethoscope,
                label: 'Medical Service',
                value: selectedService === 'Medical Service' ? '' : selectedService,
                placeholder: 'Select medical service',
                onPressDropdown: () => setShowServiceModal(true),
              },
              {
                key: 'country',
                type: 'dropdown',
                icon: Globe,
                label: 'Country You Are In',
                value: selectedCountry,
                placeholder: 'United Arab Emirates (UAE)',
                onPressDropdown: () => setShowCountryModal(true),
              },
              {
                key: 'name',
                type: 'text',
                icon: User,
                label: 'Full Name (as in Passport)',
                value: patientName,
                placeholder: 'Enter full name',
                onChangeText: setPatientName,
              },
              {
                key: 'passport',
                type: 'text',
                icon: FileText,
                label: 'Passport Number',
                value: passportNumber,
                placeholder: 'Enter passport number',
                onChangeText: setPassportNumber,
              },
              {
                key: 'phone',
                type: 'phone',
                icon: PhoneCall,
                label: 'WhatsApp / Mobile Number',
                value: patientPhone,
                countryCode: '+971',
                countryFlag: '🇦🇪',
                placeholder: '50 123 4567',
                onChangeText: setPatientPhone,
              },
            ]}
            submitButtonText="Contact International Desk"
            submitButtonBg="#032541"
            onSubmit={handleBookAppointment}
            disclaimerText="By submitting, you agree to Arogyon's "
            privacyLinkText="Global Privacy Policy"
          />

          {/* 4-Card Why Arogyon Global Care Grid matching Image 2 Mockup */}
          <WhyArogyonGrid
            isDark={isDark}
            sectionTitle="Why Arogyon Global Care?"
            items={[
              {
                id: 'g1',
                title: 'Visa & Travel Support',
                description: 'Visa invitation in 24 hrs & travel concierge.',
                icon: Plane,
                iconBg: '#E0F2FE',
                iconColor: '#0284C7',
              },
              {
                id: 'g2',
                title: 'Top Hospitals Worldwide',
                description: 'Partnered with accredited hospitals globally.',
                icon: Building2,
                iconBg: '#E0F7FA',
                iconColor: '#00838F',
              },
              {
                id: 'g3',
                title: '24/7 Care Experts',
                description: 'Dedicated care team available round the clock.',
                icon: Headphones,
                iconBg: '#F3E8FF',
                iconColor: '#9333EA',
              },
              {
                id: 'g4',
                title: 'End-to-End Assistance',
                description: 'From treatment planning to travel back home.',
                icon: ShieldCheck,
                iconBg: '#DCFCE7',
                iconColor: '#15803D',
              },
            ]}
          />



          {/* Arogyon Brand Vision Banner */}
          <LinearGradient
            colors={['#0B3848', '#0D4457', '#0A3342']}
            style={styles.visionBanner}
          >
            <ArogyonBrandLogo size={26} isDark={true} />
            <Text style={styles.visionText}>
              Connecting international patients to India's most trusted medical directors with compassionate, guided care.
            </Text>
          </LinearGradient>

          <View style={{ height: 90 }} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Call Bar */}
      <View style={[styles.stickyBottomBar, { backgroundColor: isDark ? '#111927' : '#FFFFFF', borderTopColor: isDark ? '#333' : '#E2E8F0' }]}>
        <View style={styles.stickyBottomLeft}>
          <Image
            source="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
            style={styles.stickyAvatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.stickyQuestionText, { color: isDark ? '#FFFFFF' : '#0B3848' }]} numberOfLines={1}>
              Planning treatment from abroad?
            </Text>
            <Text style={styles.stickySubText} numberOfLines={1}>
              Our international Desk is online 24/7.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.stickyCallBtn} onPress={handleCallPress} activeOpacity={0.9}>
          <Phone size={14} color="#FFFFFF" />
          <Text style={styles.stickyCallBtnText}>Call Desk</Text>
        </TouchableOpacity>
      </View>

      {/* Select Service Modal */}
      <Modal visible={showServiceModal} transparent animationType="slide" onRequestClose={() => setShowServiceModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#111927' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0B3848' }]}>Select Service</Text>
              <TouchableOpacity onPress={() => setShowServiceModal(false)}>
                <X size={20} color={isDark ? '#FFFFFF' : '#0B3848'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 320 }}>
              {SERVICE_OPTIONS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={styles.modalItemRow}
                  onPress={() => {
                    setSelectedService(s);
                    setShowServiceModal(false);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={[styles.modalItemText, { color: selectedService === s ? '#0B3848' : (isDark ? '#CBD5E1' : '#334155'), fontWeight: selectedService === s ? '700' : '500' }]}>
                    {s}
                  </Text>
                  {selectedService === s && <CheckCircle2 size={18} color="#48C728" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Select Country Modal */}
      <Modal visible={showCountryModal} transparent animationType="slide" onRequestClose={() => setShowCountryModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#111927' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0B3848' }]}>Select Country</Text>
              <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                <X size={20} color={isDark ? '#FFFFFF' : '#0B3848'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
              {COUNTRY_OPTIONS.map(c => (
                <TouchableOpacity
                  key={c}
                  style={styles.modalItemRow}
                  onPress={() => {
                    setSelectedCountry(c);
                    setShowCountryModal(false);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={[styles.modalItemText, { color: selectedCountry === c ? '#0B3848' : (isDark ? '#CBD5E1' : '#334155'), fontWeight: selectedCountry === c ? '700' : '500' }]}>
                    {c}
                  </Text>
                  {selectedCountry === c && <CheckCircle2 size={18} color="#48C728" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Callback Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade" onRequestClose={() => setShowSuccessModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#111927' : '#FFFFFF', alignItems: 'center', padding: 24 }]}>
            <CheckCircle2 size={54} color="#48C728" />
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0B3848', marginTop: 14, textAlign: 'center' }]}>
              Request Received!
            </Text>
            <Text style={{ fontSize: 13.5, color: '#64748B', textAlign: 'center', marginTop: 6, lineHeight: 20 }}>
              Our Senior International Patient Coordinator will contact you on WhatsApp / Phone within 2 hours regarding <Text style={{ fontWeight: '700', color: '#0B3848' }}>{selectedService}</Text>.
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
    color: '#E2E8F0',
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
    borderColor: '#E2E8F0',
  },
  assuredTagPill: {
    backgroundColor: '#0B3848',
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
    backgroundColor: '#0B3848',
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
    borderColor: '#CBD5E1',
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
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  bookSubmitBtn: {
    backgroundColor: '#0B3848',
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
    color: '#48C728',
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
    color: '#0B3848',
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
    borderBottomColor: '#F1F5F9',
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
    borderBottomColor: '#F1F5F9',
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
    backgroundColor: '#0284C7',
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
    color: '#0B3848',
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
    color: '#E2F7EB',
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
    backgroundColor: '#0B3848',
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
    borderBottomColor: '#F1F5F9',
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
