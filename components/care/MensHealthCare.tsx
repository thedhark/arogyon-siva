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
  UserCheck,
  Zap
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArogyonBrandLogo } from './PlannedSurgeryCare';

interface Props {
  colors: any;
  isDark: boolean;
}

const SERVICE_OPTIONS = [
  'Executive Cardiac Screening',
  'Prostate & Urology Consultation',
  'Andrology & Hormonal Health Panel',
  'Hair Restoration & FUE Transplant',
  'Laser Kidney Stone Care',
  'Gynecomastia Aesthetic Correction',
  'Full Body Executive Health Checkup',
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
    title: 'Urology & Prostate Care',
    items: ['Laser Kidney Stone Removal (RIRS/URSL)', 'Prostate Surgery (TURP / HoLEP)', 'Laser Circumcision (Phimosis)', 'Varicocele Repair'],
  },
  {
    title: 'Cardiac & Vascular Health',
    items: ['Executive Treadmill Test (TMT) & Echo', 'Coronary Calcium Scoring (CT Angio)', 'Hypertension & Lipid Optimization', 'Preventive Vascular Screening'],
  },
  {
    title: 'Andrology & Hormonal Health',
    items: ['Testosterone & Hormonal Panel', 'Metabolic Syndrome & Diabetes Care', 'Erectile & Sexual Health Counseling', 'Fertility & Sperm Health Analysis'],
  },
  {
    title: 'Aesthetics & Hair Restoration',
    items: ['Gynecomastia Surgery (Male Chest Reduction)', 'FUE Hair Transplant & PRP Therapy', 'Dermatological Skin & Hair Care'],
  },
];

const PATIENT_REVIEWS = [
  {
    id: 'rev-1',
    initial: 'V',
    name: 'Vikram S.',
    rating: '5.0',
    review: 'Fast and completely confidential service for laser kidney stone removal. Discharged the next day with zero pain.',
  },
  {
    id: 'rev-2',
    initial: 'R',
    name: 'Rajesh G.',
    rating: '4.9',
    review: 'Executive cardiac checkup was super smooth. Got my treadmill, echo, and blood reports discussed with the chief cardiologist in 4 hours.',
  },
  {
    id: 'rev-3',
    initial: 'A',
    name: 'Anand K.',
    rating: '5.0',
    review: 'FUE hair transplant results after 6 months are incredible. Professional team and discreet care manager.',
  },
];

export default function MensHealthCare({ colors, isDark }: Props) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [selectedService, setSelectedService] = useState('Service Required');
  const [selectedCity, setSelectedCity] = useState('Tirupati');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('+919550715570');

  // Modals
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Accordion
  const [expandedSection, setExpandedSection] = useState<string | null>('Urology & Prostate Care');

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
    <View style={[styles.container, { backgroundColor: isDark ? '#080C14' : '#F2F6F9' }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Full-Bleed Hero Cover Image Banner */}
        <View style={styles.heroCoverContainer}>
          <Image
            source="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1000"
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
                <Text style={styles.verifiedBrandText}>Arogyon Men's Care Desk</Text>
                <CheckCircle2 size={15} color="#0284C7" fill="#0284C7" />
              </View>

              <Text style={styles.heroMainTitle}>Men's Health & Vitality</Text>
              <Text style={styles.heroMainSubtitle}>Discreet, expert care for cardiac, urology, and wellness.</Text>
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
                <Text style={styles.assuredTagText}>MEN'S HEALTH</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.headerCallBtn} onPress={handleCallPress} activeOpacity={0.8}>
              <Phone size={13} color="#FFFFFF" />
              <Text style={styles.headerCallBtnText}>Call Men's Desk</Text>
            </TouchableOpacity>
          </View>

          {/* Book Consultation Form Card */}
          <View style={[
            styles.formCard, 
            { 
              backgroundColor: isDark ? '#111A24' : '#E0F2FE', 
              borderColor: isDark ? 'rgba(2, 132, 199, 0.3)' : '#BAE6FD' 
            }
          ]}>
            <Text style={[styles.formCardTitle, { color: isDark ? '#FFFFFF' : '#0369A1' }]}>
              Consult Senior Specialist
            </Text>
            <Text style={[styles.formCardSubtitle, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
              100% Confidential & Priority Direct Access
            </Text>

            {/* Service Dropdown */}
            <TouchableOpacity 
              style={[styles.dropdownInput, { backgroundColor: isDark ? '#0B131C' : '#FFFFFF' }]}
              onPress={() => setShowServiceModal(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.dropdownText, { color: selectedService === 'Service Required' ? '#94A3B8' : (isDark ? '#FFFFFF' : '#0369A1') }]}>
                {selectedService}
              </Text>
              <ChevronDown size={18} color="#64748B" />
            </TouchableOpacity>

            {/* City Dropdown */}
            <TouchableOpacity 
              style={[styles.dropdownInput, { backgroundColor: isDark ? '#0B131C' : '#FFFFFF' }]}
              onPress={() => setShowCityModal(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.dropdownText, { color: isDark ? '#FFFFFF' : '#0369A1' }]}>
                {selectedCity}
              </Text>
              <ChevronDown size={18} color="#64748B" />
            </TouchableOpacity>

            {/* Name Input */}
            <TextInput
              style={[styles.textInput, { backgroundColor: isDark ? '#0B131C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0369A1' }]}
              placeholder="Full Name"
              placeholderTextColor="#94A3B8"
              value={patientName}
              onChangeText={setPatientName}
            />

            {/* Phone Number Input */}
            <TextInput
              style={[styles.textInput, { backgroundColor: isDark ? '#0B131C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0369A1' }]}
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
              <Text style={styles.bookSubmitBtnText}>Book Appointment</Text>
            </TouchableOpacity>

            <Text style={styles.formDisclaimer}>
              By submitting, you agree to Arogyon's <Text style={styles.tncLink}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Why Arogyon Assured Section */}
          <View style={styles.sectionWrap}>
            <Text style={[styles.sectionHeading, { color: isDark ? '#FFFFFF' : '#0369A1' }]}>
              Why Arogyon Men's Care?
            </Text>

            <View style={[styles.infoCard, { backgroundColor: isDark ? '#111A24' : '#E0F2FE', borderColor: '#BAE6FD' }]}>
              <Text style={[styles.infoCardHeader, { color: isDark ? '#FFFFFF' : '#0369A1' }]}>
                Discreet & Specialized Medical Protocol
              </Text>

              <View style={styles.benefitItem}>
                <Shield size={20} color="#0284C7" style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>100% Confidential Consultations</Text>
                  <Text style={styles.benefitSub}>
                    Private consultation suites with zero wait time and dedicated care managers.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Stethoscope size={20} color="#0369A1" style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>Senior Urologists & Cardiologists</Text>
                  <Text style={styles.benefitSub}>
                    Leading specialists in minimally-invasive laser RIRS, prostate, and cardiac interventions.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Zap size={20} color="#0284C7" style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>Executive Vitality & Wellness</Text>
                  <Text style={styles.benefitSub}>
                    Comprehensive hormonal, cardiac, and metabolic screening tailored for men.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Treatments Offered Accordions */}
          <View style={styles.sectionWrap}>
            <Text style={[styles.sectionHeading, { color: isDark ? '#FFFFFF' : '#0369A1' }]}>
              Treatments & Specialities
            </Text>

            <View style={[styles.accordionContainer, { backgroundColor: isDark ? '#161F2A' : '#FFFFFF' }]}>
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
                      <Text style={[styles.accordionTitle, { color: isDark ? '#FFFFFF' : '#0369A1' }]}>
                        {acc.title}
                      </Text>
                      {isOpen ? <ChevronUp size={20} color="#0284C7" /> : <ChevronDown size={20} color="#64748B" />}
                    </TouchableOpacity>

                    {isOpen && (
                      <View style={styles.accordionBody}>
                        {acc.items.map(item => (
                          <TouchableOpacity
                            key={item}
                            style={styles.accordionItemRow}
                            onPress={() => {
                              setSelectedService(item);
                              Haptics.selectionAsync();
                            }}
                          >
                            <CheckCircle2 size={16} color="#0284C7" />
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
            <Text style={[styles.sectionHeading, { color: isDark ? '#FFFFFF' : '#0369A1' }]}>
              Patient Reviews
            </Text>

            <View style={[styles.reviewContainerCard, { backgroundColor: isDark ? '#161F2A' : '#FFFFFF' }]}>
              <View style={styles.overallRatingRow}>
                <Star size={18} color="#0284C7" fill="#0284C7" />
                <Text style={[styles.overallRatingText, { color: isDark ? '#FFFFFF' : '#0369A1' }]}>
                  Rated 4.92 <Text style={{ fontSize: 13, fontWeight: '500', color: '#64748B' }}>(28,400 Male Patients)</Text>
                </Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewsScroll}>
                {PATIENT_REVIEWS.map(rev => (
                  <View key={rev.id} style={[styles.reviewCard, { backgroundColor: isDark ? '#0B131C' : '#E0F2FE' }]}>
                    <View style={styles.reviewUserHeader}>
                      <View style={styles.userAvatarCircle}>
                        <Text style={styles.userAvatarText}>{rev.initial}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.reviewerName, { color: isDark ? '#FFFFFF' : '#0369A1' }]}>
                          {rev.name}
                        </Text>
                        <View style={styles.starRow}>
                          <Star size={12} color="#0284C7" fill="#0284C7" />
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
            colors={['#0369A1', '#0284C7', '#075985']}
            style={styles.visionBanner}
          >
            <ArogyonBrandLogo size={26} isDark={true} />
            <Text style={styles.visionText}>
              Providing men with confident, confidential, and cutting-edge medical care for long-term health and vitality.
            </Text>
          </LinearGradient>

          <View style={{ height: 90 }} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Call Bar */}
      <View style={[styles.stickyBottomBar, { backgroundColor: isDark ? '#161F2A' : '#FFFFFF', borderTopColor: isDark ? '#333' : '#E2E8F0' }]}>
        <View style={styles.stickyBottomLeft}>
          <Image
            source="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=150"
            style={styles.stickyAvatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.stickyQuestionText, { color: isDark ? '#FFFFFF' : '#0369A1' }]} numberOfLines={1}>
              Have questions about men's health?
            </Text>
            <Text style={styles.stickySubText} numberOfLines={1}>
              Confidential consultation line online.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.stickyCallBtn} onPress={handleCallPress} activeOpacity={0.9}>
          <Phone size={14} color="#FFFFFF" />
          <Text style={styles.stickyCallBtnText}>Call Expert</Text>
        </TouchableOpacity>
      </View>

      {/* Select Service Modal */}
      <Modal visible={showServiceModal} transparent animationType="slide" onRequestClose={() => setShowServiceModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#161F2A' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0369A1' }]}>Select Service</Text>
              <TouchableOpacity onPress={() => setShowServiceModal(false)}>
                <X size={20} color={isDark ? '#FFFFFF' : '#0369A1'} />
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
                  <Text style={[styles.modalItemText, { color: selectedService === s ? '#0284C7' : (isDark ? '#CBD5E1' : '#334155'), fontWeight: selectedService === s ? '700' : '500' }]}>
                    {s}
                  </Text>
                  {selectedService === s && <CheckCircle2 size={18} color="#0284C7" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Select City Modal */}
      <Modal visible={showCityModal} transparent animationType="slide" onRequestClose={() => setShowCityModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#161F2A' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0369A1' }]}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <X size={20} color={isDark ? '#FFFFFF' : '#0369A1'} />
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
                  <Text style={[styles.modalItemText, { color: selectedCity === c ? '#0284C7' : (isDark ? '#CBD5E1' : '#334155'), fontWeight: selectedCity === c ? '700' : '500' }]}>
                    {c}
                  </Text>
                  {selectedCity === c && <CheckCircle2 size={18} color="#0284C7" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Callback Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade" onRequestClose={() => setShowSuccessModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#161F2A' : '#FFFFFF', alignItems: 'center', padding: 24 }]}>
            <CheckCircle2 size={54} color="#0284C7" />
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0369A1', marginTop: 14, textAlign: 'center' }]}>
              Consultation Requested!
            </Text>
            <Text style={{ fontSize: 13.5, color: '#64748B', textAlign: 'center', marginTop: 6, lineHeight: 20 }}>
              Our Senior Medical Care Manager will call you back within 15 minutes for your <Text style={{ fontWeight: '700', color: '#0369A1' }}>{selectedService}</Text> consultation in {selectedCity}.
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
    color: '#E0F2FE',
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
    borderColor: '#BAE6FD',
  },
  assuredTagPill: {
    backgroundColor: '#0284C7',
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
    backgroundColor: '#0369A1',
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
    borderColor: '#BAE6FD',
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
    borderColor: '#BAE6FD',
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  bookSubmitBtn: {
    backgroundColor: '#0369A1',
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
    color: '#0284C7',
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
    color: '#0369A1',
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
    borderBottomColor: '#E0F2FE',
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
    borderBottomColor: '#E0F2FE',
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
    color: '#0369A1',
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
    color: '#E0F2FE',
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
    backgroundColor: '#0369A1',
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
    borderBottomColor: '#E0F2FE',
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
