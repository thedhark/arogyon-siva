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
import SurgeryAilmentModal from './SurgeryAilmentModal';
import TreatmentBookingModal from './TreatmentBookingModal';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Phone, 
  Shield, 
  ShieldCheck,
  Users, 
  User,
  Eye,
  Building2, 
  Stethoscope, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  X,
  Plus,
  Heart,
  Activity,
  FileText,
  HeartPulse,
  Share2,
  Tag,
  Calendar,
  Edit3,
  MapPin,
  PhoneCall
} from 'lucide-react-native';
import InquiryFormCard, { FormFieldConfig } from './InquiryFormCard';
import WhyArogyonGrid, { WhyItem } from './WhyArogyonGrid';

const CARE_JOURNEY_STAGES = [
  {
    step: '01',
    tag: 'ASSESS & PLAN',
    title: '1. Assess & Plan',
    subtitle: 'Comprehensive diagnostic examination, expert doctor consultation & personalized treatment plan.',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=600',
    icon: Activity,
    accent: '#0B3848',
  },
  {
    step: '02',
    tag: 'SURGERY',
    title: '2. Planned Surgeries',
    subtitle: 'Expert surgical specialists, advanced laparoscopic & minimally invasive procedures in NABH hospitals.',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=600',
    icon: Stethoscope,
    accent: '#48C728',
  },
  {
    step: '03',
    tag: 'RECOVERY',
    title: '3. Recovery & Thrive',
    subtitle: '24/7 dedicated care manager support, post-op nursing, rehabilitation & healthy lifestyle follow-up.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600',
    icon: HeartPulse,
    accent: '#0B3848',
  },
];
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface Props {
  colors: any;
  isDark: boolean;
}

// Apple-level Minimal End-to-End Care Journey Hero Banner
export const HeroEndToEndJourneyBanner = ({ isDark }: { isDark: boolean }) => {
  const stages = [
    { num: '01', title: 'Assess & Plan', sub: 'Diagnosis & Exam', icon: Activity, color: '#48C728' },
    { num: '02', title: 'Planned Surgeries', sub: 'Expert Care', icon: Stethoscope, color: '#38BDF8' },
    { num: '03', title: 'Recovery & Thrive', sub: 'Rehab & Follow-up', icon: HeartPulse, color: '#F43F5E' },
  ];

  return (
    <LinearGradient
      colors={isDark ? ['#0B222E', '#0A3342', '#081D27'] : ['#0B3848', '#0E495D', '#0A303E']}
      style={styles.heroJourneyBannerCard}
    >
      {/* Generated 3D Apple-Style Hero Illustration */}
      <View style={styles.heroIllustrationContainer}>
        <Image
          source={require('@/assets/images/expert-module/arogyon-surgery-care-banner.png')}
          style={styles.heroBannerImage}
          contentFit="cover"
        />
      </View>

      {/* Top Banner Tag Header */}
      <View style={styles.heroJourneyHeaderRow}>
        <View style={styles.heroJourneyBadge}>
          <Shield size={12} color="#48C728" />
          <Text style={styles.heroJourneyBadgeText}>AROGYON SURGERY CARE PROTOCOL</Text>
        </View>
        <Text style={styles.heroJourneySubtitleHeader}>3-Step Guided Care</Text>
      </View>

      {/* Main Apple-Level Flow Graphic */}
      <View style={styles.heroFlowRow}>
        {stages.map((stg, idx) => {
          const IconComp = stg.icon;
          const isLast = idx === stages.length - 1;
          return (
            <React.Fragment key={stg.num}>
              <View style={styles.flowNodeWrap}>
                <View style={[styles.flowIconCircle, { borderColor: stg.color }]}>
                  <IconComp size={16} color={stg.color} />
                  <View style={[styles.flowNumPill, { backgroundColor: stg.color }]}>
                    <Text style={styles.flowNumText}>{stg.num}</Text>
                  </View>
                </View>
                <Text style={styles.flowNodeTitle} numberOfLines={1}>{stg.title}</Text>
                <Text style={styles.flowNodeSub} numberOfLines={1}>{stg.sub}</Text>
              </View>

              {!isLast && (
                <View style={styles.flowConnectorLineWrap}>
                  <View style={styles.flowConnectorLine} />
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Bottom Summary Bar */}
      <View style={styles.heroJourneyFooterBar}>
        <CheckCircle2 size={13} color="#48C728" />
        <Text style={styles.heroJourneyFooterText}>
          Personal Care Manager Assistance From Contact to Full Recovery
        </Text>
      </View>
    </LinearGradient>
  );
};
export const ArogyonBrandLogo = ({ size = 22, isDark = false }: { size?: number; isDark?: boolean }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontSize: size, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0B3848', letterSpacing: -0.5 }}>
        A
      </Text>
      <View style={{ 
        position: 'absolute', 
        left: size * 0.16, 
        bottom: size * 0.08, 
        backgroundColor: '#48C728', 
        width: size * 0.34, 
        height: size * 0.34, 
        borderRadius: size * 0.17, 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Plus size={size * 0.24} color="#FFFFFF" strokeWidth={3.5} />
      </View>
    </View>
    <Text style={{ fontSize: size, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0B3848', letterSpacing: -0.5 }}>
      rogy
    </Text>
    <View style={{ 
      width: size * 0.82, 
      height: size * 0.82, 
      borderRadius: size * 0.41, 
      backgroundColor: '#48C728', 
      alignItems: 'center', 
      justifyContent: 'center', 
      marginHorizontal: 1.5 
    }}>
      <Heart size={size * 0.44} color="#FFFFFF" fill="#FFFFFF" />
    </View>
    <Text style={{ fontSize: size, fontWeight: '900', color: '#48C728', letterSpacing: -0.5 }}>
      n
    </Text>
  </View>
);

const SURGERY_OPTIONS = [
  'Cataract Surgery',
  'Hernia Repair',
  'Knee Replacement',
  'Kidney Stone Removal',
  'Gallbladder Surgery',
  'Piles / Laser Proctology',
  'LASIK Eye Surgery',
  'ACL Reconstruction',
  'Gynecomastia',
  'Dental Implants',
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

const POPULAR_TREATMENT_ITEMS = [
  { name: 'Piles', color: '#818CF8', icon: Activity },
  { name: 'Varicose Veins', color: '#38BDF8', icon: Activity },
  { name: 'Hernia', color: '#FB923C', icon: User },
  { name: 'Lasik', color: '#34D399', icon: Eye },
  { name: 'Gallstone', color: '#F43F5E', icon: Activity },
  { name: 'Anal Fistula', color: '#818CF8', icon: Activity },
  { name: 'Cataract', color: '#38BDF8', icon: Eye },
  { name: 'Kidney Stone', color: '#10B981', icon: Stethoscope },
  { name: 'Circumcision', color: '#EC4899', icon: Activity },
  { name: 'Anal Fissure', color: '#818CF8', icon: Activity },
  { name: 'Lipoma Removal', color: '#F472B6', icon: User },
  { name: 'Sebaceous Cyst', color: '#FB923C', icon: User },
  { name: 'Pilonidal Sinus', color: '#F43F5E', icon: Activity },
  { name: 'Lump in Breast', color: '#EC4899', icon: Heart },
  { name: 'TURP', color: '#6366F1', icon: Stethoscope },
  { name: 'Hydrocele', color: '#38BDF8', icon: User },
  { name: 'Knee Replacement', color: '#818CF8', icon: Activity },
  { name: 'Hair Transplant', color: '#F472B6', icon: Sparkles },
  { name: 'Gynecomastia', color: '#FB923C', icon: User },
];

const TREATMENTS_ACCORDION = [
  {
    title: 'Popular',
    items: ['Cataract Surgery', 'Hernia Repair', 'Kidney Stone Removal', 'Laser Piles Treatment', 'LASIK Eye Care'],
  },
  {
    title: 'General Surgery',
    items: ['Gallbladder Removal (Laparoscopic)', 'Hernia Repair (Inguinal/Umbilical)', 'Appendectomy', 'Hydrocele Treatment'],
  },
  {
    title: 'Proctology',
    items: ['Laser Piles Treatment', 'Anal Fissure Surgery', 'Fistula Treatment', 'Pilonidal Sinus Surgery'],
  },
  {
    title: 'Ophthalmology',
    items: ['Micro-Incision Cataract Surgery', 'Blade-Free LASIK', 'Squint Correction', 'Glaucoma Management'],
  },
  {
    title: 'Urology',
    items: ['Laser Kidney Stone Removal (RIRS/URSL)', 'Prostate Surgery (TURP)', 'Phimosis (Circumcision)', 'Varicocele Repair'],
  },
  {
    title: 'Cosmetic Surgery',
    items: ['Gynecomastia Surgery', 'Liposuction', 'Hair Transplant', 'Rhinoplasty'],
  },
  {
    title: 'Orthopedics',
    items: ['Total Knee Replacement', 'Total Hip Replacement', 'ACL Tear Reconstruction', 'Arthroscopy'],
  },
  {
    title: 'Robotic Surgeries',
    items: ['Robotic Knee Replacement', 'Robotic Hernia Repair', 'Robotic Bariatric Surgery'],
  },
  {
    title: 'Oncology',
    items: ['Breast Cancer Surgery', 'Tumor Excision', 'Thyroidectomy', 'Malignancy Staging'],
  },
  {
    title: 'Dental',
    items: ['Dental Implants', 'Impacted Wisdom Tooth Extraction', 'Root Canal Treatment'],
  },
];

const PATIENT_REVIEWS = [
  {
    id: 'rev-1',
    initial: 'C',
    name: 'Chakraborty N',
    rating: '4.9',
    review: 'I was lucky the biopsy confirmed no cancer cells. I am truly thankful to Dr. Sampurna Ghose and her team for their cordial behaviour, cooperation and always positive attitude toward patient care.',
  },
  {
    id: 'rev-2',
    initial: 'A',
    name: 'Avdesh Sharma',
    rating: '5.0',
    review: 'Dr. Priya is very professional with a personal touch and guidance. She provides a holistic treatment regimen and is the best surgeon we have come across.',
  },
  {
    id: 'rev-3',
    initial: 'R',
    name: 'Ramesh K.',
    rating: '4.8',
    review: 'Arogyon Care Manager assisted me from insurance approval to post-op checkup. Zero out-of-pocket hassle and smooth admission process!',
  },
];

export default function PlannedSurgeryCare({ colors, isDark }: Props) {
  const router = useRouter();

  // Saved state
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [selectedSurgery, setSelectedSurgery] = useState('Surgery');
  const [selectedCity, setSelectedCity] = useState('Tirupati');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('+919550715570');

  // Modals & Dropdowns
  const [showSurgeryModal, setShowSurgeryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Treatment Booking Modal state matching screenshot 2
  const [showTreatmentBookingModal, setShowTreatmentBookingModal] = useState(false);
  const [activeTreatmentForBooking, setActiveTreatmentForBooking] = useState('');

  const handleTreatmentClick = (treatmentName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveTreatmentForBooking(treatmentName);
    setShowTreatmentBookingModal(true);
  };

  // Accordion open states
  const [expandedSection, setExpandedSection] = useState<string | null>('Popular');

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
        {/* Full-Bleed Hero Cover Image Container matching screenshot */}
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
                <Text style={styles.verifiedBrandText}>Arogyon Assured Hospitals</Text>
                <CheckCircle2 size={15} color="#3B82F6" fill="#3B82F6" />
              </View>

              <Text style={styles.heroMainTitle}>Planned Surgery Care</Text>
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
                <Text style={styles.assuredTagText}>ASSURED</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.headerCallBtn} onPress={handleCallPress} activeOpacity={0.8}>
              <Phone size={13} color="#FFFFFF" />
              <Text style={styles.headerCallBtnText}>Call</Text>
            </TouchableOpacity>
          </View>



          {/* Book Consultation Form Card matching Image 3 Mockup */}
          <InquiryFormCard
            isDark={isDark}
            headerIcon={Calendar}
            headerIconBg="#D1FAF0"
            headerIconColor="#059669"
            title="Book your consultation"
            subtitle="Get a call back within 15 minutes"
            topRightBadge={{
              text: '100% Secure',
              icon: ShieldCheck,
              bg: '#DCFCE7',
              color: '#15803D',
            }}
            fields={[
              {
                key: 'surgery',
                type: 'dropdown',
                icon: Edit3,
                label: 'I need help with',
                value: selectedSurgery,
                placeholder: 'Surgery',
                onPressDropdown: () => setShowSurgeryModal(true),
              },
              {
                key: 'city',
                type: 'dropdown',
                icon: MapPin,
                label: 'Preferred location',
                value: selectedCity,
                placeholder: 'Tirupati',
                onPressDropdown: () => setShowCityModal(true),
              },
              {
                key: 'name',
                type: 'text',
                icon: User,
                label: 'Your name',
                value: patientName,
                placeholder: 'Enter your name',
                onChangeText: setPatientName,
              },
              {
                key: 'phone',
                type: 'phone',
                icon: PhoneCall,
                label: 'Mobile number',
                value: patientPhone,
                countryCode: '+91',
                countryFlag: '🇮🇳',
                placeholder: '95507 15570',
                onChangeText: setPatientPhone,
              },
            ]}
            submitButtonText="Book Appointment"
            submitButtonBg="#053A47"
            onSubmit={handleBookAppointment}
            disclaimerText="By submitting the form, you agree to Arogyon's "
            privacyLinkText="Terms & Conditions"
          />

          {/* 4-Card Why Arogyon Assured Grid matching Image 3 Mockup */}
          <WhyArogyonGrid
            isDark={isDark}
            sectionTitle="Why Arogyon Assured?"
            items={[
              {
                id: 'a1',
                title: '4.5/5 Hospital Rating',
                description: 'Trusted by thousands',
                icon: Star,
                iconBg: '#ECFDF5',
                iconColor: '#059669',
              },
              {
                id: 'a2',
                title: 'Verified Hospitals',
                description: 'Rigorous quality checks',
                icon: ShieldCheck,
                iconBg: '#E0F2FE',
                iconColor: '#0284C7',
              },
              {
                id: 'a3',
                title: 'Expert Surgeons',
                description: 'Experienced & specialized',
                icon: Users,
                iconBg: '#F3E8FF',
                iconColor: '#9333EA',
              },
              {
                id: 'a4',
                title: 'End-to-End Care',
                description: 'From consultation to recovery',
                icon: Heart,
                iconBg: '#FCE7F3',
                iconColor: '#DB2777',
              },
            ]}
          />





          {/* Arogyon Brand Vision Curved Banner */}
          <LinearGradient
            colors={['#0B3848', '#0D4457', '#0A3342']}
            style={styles.visionBanner}
          >
            <ArogyonBrandLogo size={26} isDark={true} />
            <Text style={styles.visionText}>
              Our vision is to help mankind live healthier, longer lives by making quality healthcare accessible, affordable and convenient.
            </Text>
          </LinearGradient>

          <View style={{ height: 90 }} />
        </View>
      </ScrollView>

      {/* Fixed Sticky Bottom Call Bar (NO Floating Button) */}
      <View style={[styles.stickyBottomBar, { backgroundColor: isDark ? '#111927' : '#FFFFFF', borderTopColor: isDark ? '#333' : '#E2E8F0' }]}>
        <View style={styles.stickyBottomLeft}>
          <Image
            source="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
            style={styles.stickyAvatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.stickyQuestionText, { color: isDark ? '#FFFFFF' : '#0B3848' }]} numberOfLines={1}>
              Got any surgery questions?
            </Text>
            <Text style={styles.stickySubText} numberOfLines={1}>
              We're here to help.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.stickyCallBtn} onPress={handleCallPress} activeOpacity={0.9}>
          <Phone size={14} color="#FFFFFF" />
          <Text style={styles.stickyCallBtnText}>Call</Text>
        </TouchableOpacity>
      </View>

      {/* 2-Step Surgical Ailment Modal matching screenshot */}
      <SurgeryAilmentModal
        visible={showSurgeryModal}
        onClose={() => setShowSurgeryModal(false)}
        selectedAilment={selectedSurgery}
        onSelectAilment={(ailment) => setSelectedSurgery(ailment)}
        isDark={isDark}
      />

      {/* Direct Treatment Booking Bottom Sheet Modal matching screenshot 2 */}
      <TreatmentBookingModal
        visible={showTreatmentBookingModal}
        onClose={() => setShowTreatmentBookingModal(false)}
        treatmentName={activeTreatmentForBooking}
        onSuccess={(treatment, name, phone, city) => {
          setSelectedSurgery(treatment);
          setPatientName(name);
          setPatientPhone(phone);
          setSelectedCity(city);
          setShowSuccessModal(true);
        }}
        isDark={isDark}
      />

      {/* Select City Modal */}
      <Modal visible={showCityModal} transparent animationType="slide" onRequestClose={() => setShowCityModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#111927' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0B3848' }]}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <X size={20} color={isDark ? '#FFFFFF' : '#0B3848'} />
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
                  <Text style={[styles.modalItemText, { color: selectedCity === c ? '#0B3848' : (isDark ? '#CBD5E1' : '#334155'), fontWeight: selectedCity === c ? '700' : '500' }]}>
                    {c}
                  </Text>
                  {selectedCity === c && <CheckCircle2 size={18} color="#48C728" />}
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
              Callback Request Received!
            </Text>
            <Text style={{ fontSize: 13.5, color: '#64748B', textAlign: 'center', marginTop: 6, lineHeight: 20 }}>
              Our senior surgery coordinator will call you back within 15 minutes for your <Text style={{ fontWeight: '700', color: '#0B3848' }}>{selectedSurgery}</Text> consultation in {selectedCity}.
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
  pricingOfferCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -26,
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 20,
  },
  pricingLeftCol: {
    gap: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  mainPriceText: {
    fontSize: 24,
    fontWeight: '900',
  },
  originalPriceText: {
    fontSize: 14,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  savingsText: {
    fontSize: 12.5,
    color: '#10B981',
    fontWeight: '700',
  },
  discountBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  discountBadgeText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#3B82F6',
  },
  topHeaderBar: {
    backgroundColor: '#0B3848',
    paddingTop: Platform.OS === 'ios' ? 50 : 36,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  assuredTagPill: {
    backgroundColor: '#48C728',
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
  heroTextWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    fontSize: 13.5,
    color: '#0B3848',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 4,
  },
  heroGraphicContainer: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    position: 'relative',
  },
  heroBackdropCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#0B3848',
    position: 'absolute',
  },
  heroDoctorImage: {
    width: 200,
    height: 260,
    borderRadius: 100,
    zIndex: 2,
  },
  statPill: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  statPillTopLeft: {
    top: 20,
    left: 4,
  },
  statPillTopRight: {
    top: 20,
    right: 4,
  },
  statPillBottomLeft: {
    bottom: 30,
    left: 4,
  },
  statPillBottomRight: {
    bottom: 30,
    right: 4,
  },
  statPillNum: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B3848',
  },
  statPillLabel: {
    fontSize: 10.5,
    color: '#334155',
    fontWeight: '600',
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 20,
    marginTop: 14,
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
  sectionSubHeading: {
    fontSize: 12.5,
    marginTop: -8,
    marginBottom: 14,
    fontWeight: '500',
    lineHeight: 17,
  },
  heroJourneyBannerCard: {
    borderRadius: 24,
    padding: 16,
    marginVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  heroIllustrationContainer: {
    height: 120,
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
  },
  heroJourneyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroJourneyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(72, 199, 40, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(72, 199, 40, 0.3)',
  },
  heroJourneyBadgeText: {
    color: '#48C728',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  heroJourneySubtitleHeader: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  heroFlowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  flowNodeWrap: {
    alignItems: 'center',
    flex: 1,
  },
  flowIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  flowNumPill: {
    position: 'absolute',
    bottom: -4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  flowNumText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  flowNodeTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  flowNodeSub: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 1,
  },
  flowConnectorLineWrap: {
    width: 10,
    alignItems: 'center',
    marginTop: -16,
  },
  flowConnectorLine: {
    width: '100%',
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heroJourneyFooterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  heroJourneyFooterText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  journeyScroll: {
    gap: 12,
    paddingRight: 16,
  },
  journeyCard: {
    width: 250,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  journeyImageWrap: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  journeyImage: {
    width: '100%',
    height: '100%',
  },
  stepNumBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepNumText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  journeyBodyWrap: {
    padding: 14,
  },
  journeyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  journeyCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
    marginRight: 6,
  },
  journeyCardSub: {
    fontSize: 11.5,
    lineHeight: 16.5,
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
  statsGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
  },
  gridStatCol: {
    alignItems: 'center',
  },
  gridStatNum: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B3848',
  },
  gridStatLabel: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
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
  popularGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 2,
    justifyContent: 'space-between',
  },
  popularGridCard: {
    width: '22.5%',
    minHeight: 90,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    marginBottom: 4,
  },
  popularIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  popularGridText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
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
    backgroundColor: '#F59E0B',
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
