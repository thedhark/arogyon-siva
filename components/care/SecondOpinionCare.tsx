import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Phone,
  ShieldCheck,
  ClipboardCheck,
  Award,
  IndianRupee,
  Users,
  Stethoscope,
  FileText,
  MapPin,
  User,
  PhoneCall,
  FileUp,
  ChevronDown,
  CheckCircle2,
  Heart,
  Share2,
  X,
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

const CONDITION_OPTIONS = [
  'Oncology & Cancer Diagnosis',
  'Cardiac Surgery & Heart Care',
  'Orthopedics & Joint Replacement',
  'Neurosurgery & Spine Disorder',
  'Gastroenterology & Liver Care',
  'Organ Transplant Recommendation',
  'Pediatric Surgery',
  'Other Complex Medical Condition',
];

const DIAGNOSIS_OPTIONS = [
  'Initial Doctor Consultation Done',
  'MRI / CT Scan / Lab Reports Ready',
  'Biopsy / Histopathology Report Ready',
  'Surgery Recommended by Primary Doctor',
  'Seeking Alternative Treatment Plan',
];

const CITY_OPTIONS = [
  'Bangalore',
  'Hyderabad',
  'Tirupati',
  'Chennai',
  'Delhi NCR',
  'Mumbai',
  'International Patient',
];

const WHY_SECOND_OPINION: WhyItem[] = [
  {
    id: 'w1',
    title: 'Confirm Diagnosis',
    description: 'Get confirmation from top specialists',
    icon: ShieldCheck,
    iconBg: '#E0F2FE',
    iconColor: '#0284C7',
  },
  {
    id: 'w2',
    title: 'Better Treatment Decisions',
    description: 'Explore all possible options',
    icon: ClipboardCheck,
    iconBg: '#E0F7FA',
    iconColor: '#00838F',
  },
  {
    id: 'w3',
    title: 'Expert Insights',
    description: 'Reviewed by senior doctors',
    icon: Award,
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
  },
  {
    id: 'w4',
    title: 'Reduce Unnecessary Procedures',
    description: 'Avoid unnecessary tests or surgeries',
    icon: IndianRupee,
    iconBg: '#DCFCE7',
    iconColor: '#15803D',
  },
];

export default function SecondOpinionCare({ isDark }: Props) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  // Form state
  const [medicalCondition, setMedicalCondition] = useState('Select your condition');
  const [currentDiagnosis, setCurrentDiagnosis] = useState('Treatment, diagnosis or summary');
  const [selectedCity, setSelectedCity] = useState('Select city');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);

  // Modals
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleCallPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL('tel:18001234567').catch(() => setShowSuccessModal(true));
  };

  const handleFileUpload = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUploadedFilesCount((prev) => prev + 1);
  };

  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowSuccessModal(true);
  };

  const formFields: FormFieldConfig[] = [
    {
      key: 'condition',
      type: 'dropdown',
      icon: Stethoscope,
      label: 'Medical Condition',
      value: medicalCondition === 'Select your condition' ? '' : medicalCondition,
      placeholder: 'Select your condition',
      onPressDropdown: () => setShowConditionModal(true),
    },
    {
      key: 'diagnosis',
      type: 'dropdown',
      icon: FileText,
      label: 'Share Current Diagnosis (Optional)',
      value: currentDiagnosis === 'Treatment, diagnosis or summary' ? '' : currentDiagnosis,
      placeholder: 'Treatment, diagnosis or summary',
      onPressDropdown: () => setShowDiagnosisModal(true),
    },
    {
      key: 'city',
      type: 'dropdown',
      icon: MapPin,
      label: 'Your Location',
      value: selectedCity === 'Select city' ? '' : selectedCity,
      placeholder: 'Select city',
      onPressDropdown: () => setShowCityModal(true),
    },
    {
      key: 'name',
      type: 'text',
      icon: User,
      label: 'Full Name',
      value: patientName,
      placeholder: 'Enter your name',
      onChangeText: setPatientName,
    },
    {
      key: 'phone',
      type: 'phone',
      icon: PhoneCall,
      label: 'Mobile Number',
      value: patientPhone,
      countryCode: '+91',
      countryFlag: '🇮🇳',
      placeholder: 'Enter mobile number',
      onChangeText: setPatientPhone,
    },
    {
      key: 'files',
      type: 'file',
      icon: FileUp,
      label: 'Upload Reports (Optional)',
      subtext: 'Reports, prescriptions or test results',
      fileHint: 'PDF, JPG, PNG up to 25MB each',
      fileButtonText: uploadedFilesCount > 0 ? `${uploadedFilesCount} File(s) Attached` : 'Upload Files',
      onFileUpload: handleFileUpload,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#080C14' : '#F4F8FA' }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Hero Cover Image Banner */}
        <View style={styles.heroCoverContainer}>
          <Image
            source="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000"
            style={styles.heroCoverImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.85)']}
            style={styles.heroCoverGradient}
          >
            {/* Top Action Bar */}
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
                  <Heart
                    size={18}
                    color={isSaved ? '#EF4444' : '#0F172A'}
                    fill={isSaved ? '#EF4444' : 'transparent'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.roundActionBtn}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  activeOpacity={0.85}
                >
                  <Share2 size={18} color="#0F172A" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Hero Overlay */}
            <View style={styles.heroTextOverlayWrap}>
              <View style={styles.verifiedBrandRow}>
                <Text style={styles.verifiedBrandText}>Arogyon Expert Panel</Text>
                <CheckCircle2 size={15} color="#0EA5E9" fill="#0EA5E9" />
              </View>
              <Text style={styles.heroMainTitle}>Medical Second Opinion</Text>
              <Text style={styles.heroMainSubtitle}>
                Get expert review & diagnosis confirmation from senior specialists within 24 hours.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Brand Bar */}
        <View style={styles.topBadgeRow}>
          <View style={styles.assuredBadge}>
            <ArogyonBrandLogo size={17} isDark={isDark} />
            <View style={styles.assuredTagPill}>
              <Text style={styles.assuredTagText}>SECOND OPINION</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.headerCallBtn} onPress={handleCallPress} activeOpacity={0.8}>
            <Phone size={13} color="#FFFFFF" />
            <Text style={styles.headerCallBtnText}>Call Specialist Desk</Text>
          </TouchableOpacity>
        </View>

        {/* Pixel-Perfect Form (Image 1 Mockup) */}
        <InquiryFormCard
          isDark={isDark}
          headerIcon={Users}
          headerIconBg="#E0F2FE"
          headerIconColor="#0284C7"
          title="Request a Second Opinion"
          subtitle="Fill in a few details and our experts will review your case."
          fields={formFields}
          submitButtonText="Submit Request"
          submitButtonBg="#04323F"
          onSubmit={handleSubmit}
          disclaimerText="By submitting, you agree to Arogyon's "
          privacyLinkText="Privacy Policy"
        />

        {/* Pixel-Perfect 4-Card Why Section (Image 1 Mockup) */}
        <WhyArogyonGrid
          isDark={isDark}
          sectionTitle="Why Get a Second Opinion?"
          items={WHY_SECOND_OPINION}
        />
      </ScrollView>

      {/* Option Selection Modals */}
      <Modal visible={showConditionModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#111827' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#0F2936' }]}>
                Select Medical Condition
              </Text>
              <TouchableOpacity onPress={() => setShowConditionModal(false)}>
                <X size={20} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>
            {CONDITION_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.modalOption, { borderBottomColor: isDark ? '#1F2937' : '#F1F5F9' }]}
                onPress={() => {
                  setMedicalCondition(item);
                  setShowConditionModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: isDark ? '#E2E8F0' : '#0F2936' }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal visible={showDiagnosisModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#111827' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#0F2936' }]}>
                Share Current Diagnosis
              </Text>
              <TouchableOpacity onPress={() => setShowDiagnosisModal(false)}>
                <X size={20} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>
            {DIAGNOSIS_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.modalOption, { borderBottomColor: isDark ? '#1F2937' : '#F1F5F9' }]}
                onPress={() => {
                  setCurrentDiagnosis(item);
                  setShowDiagnosisModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: isDark ? '#E2E8F0' : '#0F2936' }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal visible={showCityModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#111827' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#0F2936' }]}>
                Select City
              </Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <X size={20} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>
            {CITY_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.modalOption, { borderBottomColor: isDark ? '#1F2937' : '#F1F5F9' }]}
                onPress={() => {
                  setSelectedCity(item);
                  setShowCityModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: isDark ? '#E2E8F0' : '#0F2936' }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.successModalCard, { backgroundColor: isDark ? '#111827' : '#FFFFFF' }]}>
            <View style={styles.successIconCircle}>
              <CheckCircle2 size={36} color="#059669" />
            </View>
            <Text style={[styles.successTitle, { color: isDark ? '#FFF' : '#0F2936' }]}>
              Request Submitted!
            </Text>
            <Text style={[styles.successSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Our medical board will review your details and contact you within 2 hours.
            </Text>
            <TouchableOpacity
              style={styles.closeSuccessBtn}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.closeSuccessText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingBottom: 40 },
  heroCoverContainer: { height: 200, position: 'relative' },
  heroCoverImage: { width: '100%', height: '100%', position: 'absolute' },
  heroCoverGradient: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', padding: 16 },
  topActionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  roundActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightActionsWrap: { flexDirection: 'row', gap: 8 },
  heroTextOverlayWrap: { marginBottom: 4 },
  verifiedBrandRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  verifiedBrandText: { color: '#E0F2FE', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  heroMainTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  heroMainSubtitle: { color: '#E2E8F0', fontSize: 12, fontWeight: '400', marginTop: 2 },
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  assuredBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  assuredTagPill: { backgroundColor: '#E0F2FE', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  assuredTagText: { color: '#0284C7', fontSize: 10, fontWeight: '800' },
  headerCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#04323F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  headerCallBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700' },
  modalOption: { paddingVertical: 14, borderBottomWidth: 1 },
  modalOptionText: { fontSize: 14, fontWeight: '500' },
  successModalCard: { margin: 24, borderRadius: 20, padding: 24, alignItems: 'center', alignSelf: 'center', width: '85%' },
  successIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  successSubtitle: { fontSize: 13, textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  closeSuccessBtn: { backgroundColor: '#04323F', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  closeSuccessText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
