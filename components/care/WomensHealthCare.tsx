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
  Baby,
  Flower2,
  Ribbon,
  MessageSquare
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArogyonBrandLogo } from './PlannedSurgeryCare';

interface Props {
  colors: any;
  isDark: boolean;
}

const SERVICE_OPTIONS = [
  'Maternity & Pregnancy Care Package',
  'PCOS / PCOD Management Plan',
  'IVF & Reproductive Health Consultation',
  'Laparoscopic Gynecological Surgery',
  'Fibroid & Ovarian Cyst Care',
  'Breast Health Screening & Mammography',
  'Comprehensive Women Executive Checkup',
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
    title: 'Maternity & Birth Care',
    items: ['Normal Delivery Package', 'High-Risk Pregnancy Management', 'Painless Birthing (Epidural Care)', 'L3 Neonatal ICU (NICU) Infrastructure', 'Antenatal & Postnatal Physiotherapy'],
  },
  {
    title: 'Fertility & Reproductive Health',
    items: ['1:1 Fertility Specialist Consultation', 'IVF, IUI & Egg Freezing Protocols', 'Advanced PCOS / PCOD Reversal Program', 'Endometriosis Management'],
  },
  {
    title: 'Minimal Access Surgery',
    items: ['Laparoscopic Hysterectomy (Keyhole)', 'Laparoscopic Myomectomy (Fibroid Removal)', 'Ovarian Cystectomy', 'Hysteroscopic Polypectomy'],
  },
  {
    title: 'Preventive Women Screening',
    items: ['Digital Mammography & Breast Ultrasound', 'Pap Smear & HPV Vaccination', 'Bone Mineral Density (DEXA Scan)', 'Hormonal Wellness Panel'],
  },
];

const PATIENT_REVIEWS = [
  {
    id: 'rev-1',
    initial: 'S',
    name: 'Sowmya V.',
    rating: '5.0',
    review: 'Arogyon female gynecologist team made my entire pregnancy journey smooth and stress-free. The delivery package was completely transparent with zero surprise costs.',
  },
  {
    id: 'rev-2',
    initial: 'P',
    name: 'Pooja Sharma',
    rating: '4.9',
    review: 'Regulated my PCOS cycle in 4 months with their customized nutrition and hormonal management plan. Highly recommended!',
  },
  {
    id: 'rev-3',
    initial: 'M',
    name: 'Meenakshi R.',
    rating: '5.0',
    review: 'Laparoscopic fibroid surgery was completely painless. Discharged within 24 hours with full nursing support.',
  },
];

export default function WomensHealthCare({ colors, isDark }: Props) {
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
  const [expandedSection, setExpandedSection] = useState<string | null>('Maternity & Birth Care');

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
    <View style={[styles.container, { backgroundColor: isDark ? '#080C14' : '#FDF7FA' }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Full-Bleed Hero Cover Image Banner */}
        <View style={styles.heroCoverContainer}>
          <Image
            source="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1000"
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
                <Text style={styles.verifiedBrandText}>Arogyon Women's Care Desk</Text>
                <CheckCircle2 size={15} color="#EC4899" fill="#EC4899" />
              </View>

              <Text style={styles.heroMainTitle}>Women's Health & Maternity</Text>
              <Text style={styles.heroMainSubtitle}>Compassionate, 360° care for every stage of a woman's life.</Text>
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
                <Text style={styles.assuredTagText}>WOMEN'S CARE</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.headerCallBtn} onPress={handleCallPress} activeOpacity={0.8}>
              <Phone size={13} color="#FFFFFF" />
              <Text style={styles.headerCallBtnText}>Call Women's Desk</Text>
            </TouchableOpacity>
          </View>

          {/* Book Consultation Form Card */}
          <View style={[
            styles.formCard, 
            { 
              backgroundColor: isDark ? '#1F131D' : '#FDF2F8', 
              borderColor: isDark ? 'rgba(236, 72, 153, 0.3)' : '#FBCFE8' 
            }
          ]}>
            <Text style={[styles.formCardTitle, { color: isDark ? '#FFFFFF' : '#831843' }]}>
              Consult Gynecologist & Maternity Expert
            </Text>
            <Text style={[styles.formCardSubtitle, { color: isDark ? '#F472B6' : '#9D174D' }]}>
              100% Confidential & Female Specialist Team Available
            </Text>

            {/* Service Dropdown */}
            <TouchableOpacity 
              style={[styles.dropdownInput, { backgroundColor: isDark ? '#140B13' : '#FFFFFF' }]}
              onPress={() => setShowServiceModal(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.dropdownText, { color: selectedService === 'Service Required' ? '#94A3B8' : (isDark ? '#FFFFFF' : '#831843') }]}>
                {selectedService}
              </Text>
              <ChevronDown size={18} color="#64748B" />
            </TouchableOpacity>

            {/* City Dropdown */}
            <TouchableOpacity 
              style={[styles.dropdownInput, { backgroundColor: isDark ? '#140B13' : '#FFFFFF' }]}
              onPress={() => setShowCityModal(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.dropdownText, { color: isDark ? '#FFFFFF' : '#831843' }]}>
                {selectedCity}
              </Text>
              <ChevronDown size={18} color="#64748B" />
            </TouchableOpacity>

            {/* Name Input */}
            <TextInput
              style={[styles.textInput, { backgroundColor: isDark ? '#140B13' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#831843' }]}
              placeholder="Full Name"
              placeholderTextColor="#94A3B8"
              value={patientName}
              onChangeText={setPatientName}
            />

            {/* Phone Number Input */}
            <TextInput
              style={[styles.textInput, { backgroundColor: isDark ? '#140B13' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#831843' }]}
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
              By submitting, you agree to Arogyon's <Text style={styles.tncLink}>T&C</Text>
            </Text>
          </View>

          {/* Why Arogyon Assured Section */}
          <View style={styles.sectionWrap}>
            <Text style={[styles.sectionHeading, { color: isDark ? '#FFFFFF' : '#831843' }]}>
              Why Arogyon Women's Care?
            </Text>

            <View style={[styles.infoCard, { backgroundColor: isDark ? '#1F131D' : '#FDF2F8', borderColor: '#FBCFE8' }]}>
              <Text style={[styles.infoCardHeader, { color: isDark ? '#FFFFFF' : '#831843' }]}>
                Women-First Healthcare Infrastructure
              </Text>

              <View style={styles.benefitItem}>
                <Flower2 size={20} color="#EC4899" style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>100% Female Senior Medical Panel</Text>
                  <Text style={styles.benefitSub}>
                    Consult experienced female gynecologists, obstetricians, and laparoscopic surgeons for complete privacy.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Baby size={20} color="#BE185D" style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>Tier-1 Level-3 NICU & Birthing Suites</Text>
                  <Text style={styles.benefitSub}>
                    Advanced neonatal care, 24/7 fetal monitoring, and painless labor epidural support.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Ribbon size={20} color="#EC4899" style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>Holistic Hormonal & Breast Screening</Text>
                  <Text style={styles.benefitSub}>
                    360° wellness covering PCOS reversal, fertility, bone density, and 3D mammography.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Treatments Offered Accordions */}
          <View style={styles.sectionWrap}>
            <Text style={[styles.sectionHeading, { color: isDark ? '#FFFFFF' : '#831843' }]}>
              Treatments & Services
            </Text>

            <View style={[styles.accordionContainer, { backgroundColor: isDark ? '#1C121A' : '#FFFFFF' }]}>
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
                      <Text style={[styles.accordionTitle, { color: isDark ? '#FFFFFF' : '#831843' }]}>
                        {acc.title}
                      </Text>
                      {isOpen ? <ChevronUp size={20} color="#EC4899" /> : <ChevronDown size={20} color="#64748B" />}
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
                            <CheckCircle2 size={16} color="#EC4899" />
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
            <Text style={[styles.sectionHeading, { color: isDark ? '#FFFFFF' : '#831843' }]}>
              Patient Experiences
            </Text>

            <View style={[styles.reviewContainerCard, { backgroundColor: isDark ? '#1C121A' : '#FFFFFF' }]}>
              <View style={styles.overallRatingRow}>
                <Star size={18} color="#BE185D" fill="#BE185D" />
                <Text style={[styles.overallRatingText, { color: isDark ? '#FFFFFF' : '#831843' }]}>
                  Rated 4.90 <Text style={{ fontSize: 13, fontWeight: '500', color: '#64748B' }}>(42,150 Women Patients)</Text>
                </Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewsScroll}>
                {PATIENT_REVIEWS.map(rev => (
                  <View key={rev.id} style={[styles.reviewCard, { backgroundColor: isDark ? '#140B13' : '#FDF2F8' }]}>
                    <View style={styles.reviewUserHeader}>
                      <View style={styles.userAvatarCircle}>
                        <Text style={styles.userAvatarText}>{rev.initial}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.reviewerName, { color: isDark ? '#FFFFFF' : '#831843' }]}>
                          {rev.name}
                        </Text>
                        <View style={styles.starRow}>
                          <Star size={12} color="#BE185D" fill="#BE185D" />
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
            colors={['#831843', '#9D174D', '#BE185D']}
            style={styles.visionBanner}
          >
            <ArogyonBrandLogo size={26} isDark={true} />
            <Text style={styles.visionText}>
              Empowering women with compassionate, specialized, and confidential healthcare across all stages of life.
            </Text>
          </LinearGradient>

          <View style={{ height: 90 }} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Call Bar */}
      <View style={[styles.stickyBottomBar, { backgroundColor: isDark ? '#1C121A' : '#FFFFFF', borderTopColor: isDark ? '#333' : '#E2E8F0' }]}>
        <View style={styles.stickyBottomLeft}>
          <Image
            source="https://images.unsplash.com/photo-1594824436998-d50d0eb3f3df?q=80&w=150"
            style={styles.stickyAvatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.stickyQuestionText, { color: isDark ? '#FFFFFF' : '#831843' }]} numberOfLines={1}>
              Have questions about women's care?
            </Text>
            <Text style={styles.stickySubText} numberOfLines={1}>
              Female care managers online to help.
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
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#1C121A' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#831843' }]}>Select Service</Text>
              <TouchableOpacity onPress={() => setShowServiceModal(false)}>
                <X size={20} color={isDark ? '#FFFFFF' : '#831843'} />
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
                  <Text style={[styles.modalItemText, { color: selectedService === s ? '#EC4899' : (isDark ? '#CBD5E1' : '#334155'), fontWeight: selectedService === s ? '700' : '500' }]}>
                    {s}
                  </Text>
                  {selectedService === s && <CheckCircle2 size={18} color="#EC4899" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Select City Modal */}
      <Modal visible={showCityModal} transparent animationType="slide" onRequestClose={() => setShowCityModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#1C121A' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#831843' }]}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <X size={20} color={isDark ? '#FFFFFF' : '#831843'} />
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
                  <Text style={[styles.modalItemText, { color: selectedCity === c ? '#EC4899' : (isDark ? '#CBD5E1' : '#334155'), fontWeight: selectedCity === c ? '700' : '500' }]}>
                    {c}
                  </Text>
                  {selectedCity === c && <CheckCircle2 size={18} color="#EC4899" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Callback Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade" onRequestClose={() => setShowSuccessModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#1C121A' : '#FFFFFF', alignItems: 'center', padding: 24 }]}>
            <CheckCircle2 size={54} color="#EC4899" />
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#831843', marginTop: 14, textAlign: 'center' }]}>
              Consultation Requested!
            </Text>
            <Text style={{ fontSize: 13.5, color: '#64748B', textAlign: 'center', marginTop: 6, lineHeight: 20 }}>
              Our Senior Female Care Manager will call you back within 15 minutes for your <Text style={{ fontWeight: '700', color: '#BE185D' }}>{selectedService}</Text> consultation in {selectedCity}.
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
    color: '#FCE7F3',
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
    borderColor: '#FBCFE8',
  },
  assuredTagPill: {
    backgroundColor: '#EC4899',
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
    backgroundColor: '#BE185D',
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
    borderColor: '#FBCFE8',
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
    borderColor: '#FBCFE8',
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  bookSubmitBtn: {
    backgroundColor: '#BE185D',
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
    color: '#EC4899',
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
    color: '#831843',
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
    borderBottomColor: '#FDF2F8',
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
    borderBottomColor: '#FDF2F8',
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
    backgroundColor: '#EC4899',
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
    color: '#BE185D',
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
    color: '#FCE7F3',
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
    backgroundColor: '#BE185D',
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
    borderBottomColor: '#FDF2F8',
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
