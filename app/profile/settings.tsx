import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Modal, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Bell, Shield, CircleHelp, LogOut, Activity, RefreshCw, Smartphone, ChevronRight, FileText, Star, Lock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import { useProfileStore } from '@/hooks/useProfileStore';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const settings = useProfileStore((state) => state.settings);
  const updateSettings = useProfileStore((state) => state.updateSettings);

  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const FAQS = [
    { q: 'Is my medical data kept private and secure?', a: 'Yes! All health records and personal data are encrypted end-to-end using AES-256 standards. Your medical records are accessible only to you and your authorized care providers.' },
    { q: 'Can I manage records for my family members?', a: 'Absolutely. Navigate to Family Members in Profile to add parents, spouse, or children, then filter and upload records for each member.' },
    { q: 'How do cashless insurance claims work?', a: 'Link your insurance policy under Profile -> Insurance. Present your digitized Arogyon Insurance Card at any partner hospital desk for instant cashless authorization.' },
  ];

  return (
    <AnimatedScreen entrance="fade" style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings & Preferences</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Notifications & Alerts */}
        <Text style={[styles.sectionHeading, { color: colors.text, marginTop: 24 }]}>Notifications & Alerts</Text>
        <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.toggleTitle, { color: colors.text }]}>Appointment Reminders</Text>
              <Text style={[styles.toggleSub, { color: colors.textMuted }]}>Push alerts 1 hour before booking</Text>
            </View>
            <Switch
              value={settings.appointmentReminders}
              onValueChange={(val) => updateSettings({ appointmentReminders: val })}
              trackColor={{ false: '#767577', true: colors.accent }}
            />
          </View>

          <View style={[styles.toggleRow, { borderTopWidth: 1, borderTopColor: isDark ? '#333' : '#F0F0F0' }]}>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.toggleTitle, { color: colors.text }]}>Lab Test Report Alerts</Text>
              <Text style={[styles.toggleSub, { color: colors.textMuted }]}>Notify when lab results are ready</Text>
            </View>
            <Switch
              value={settings.labReportAlerts}
              onValueChange={(val) => updateSettings({ labReportAlerts: val })}
              trackColor={{ false: '#767577', true: colors.accent }}
            />
          </View>

          <View style={[styles.toggleRow, { borderTopWidth: 1, borderTopColor: isDark ? '#333' : '#F0F0F0' }]}>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.toggleTitle, { color: colors.text }]}>Medication Pill Reminders</Text>
              <Text style={[styles.toggleSub, { color: colors.textMuted }]}>Timely alerts for daily dosages</Text>
            </View>
            <Switch
              value={settings.pillReminders}
              onValueChange={(val) => updateSettings({ pillReminders: val })}
              trackColor={{ false: '#767577', true: colors.accent }}
            />
          </View>
        </View>

        {/* Security & Privacy */}
        <Text style={[styles.sectionHeading, { color: colors.text, marginTop: 24 }]}>Privacy & Security</Text>
        <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.toggleTitle, { color: colors.text }]}>Biometric Screen Lock</Text>
              <Text style={[styles.toggleSub, { color: colors.textMuted }]}>Require FaceID / Fingerprint to open app</Text>
            </View>
            <Switch
              value={settings.biometricSecurity}
              onValueChange={(val) => updateSettings({ biometricSecurity: val })}
              trackColor={{ false: '#767577', true: colors.accent }}
            />
          </View>
        </View>

        {/* Help, FAQs & Terms */}
        <Text style={[styles.sectionHeading, { color: colors.text, marginTop: 24 }]}>Support & Legal</Text>
        <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0', padding: 0 }]}>
          
          <TouchableOpacity style={styles.navRow} onPress={() => setShowFaqModal(true)}>
            <CircleHelp size={20} color={colors.accent} style={{ marginRight: 12 }} />
            <Text style={[styles.navText, { color: colors.text }]}>Frequently Asked Questions (FAQs)</Text>
            <ChevronRight size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.navRow, { borderTopWidth: 1, borderTopColor: isDark ? '#333' : '#F0F0F0' }]} onPress={() => setShowTermsModal(true)}>
            <FileText size={20} color={colors.accent} style={{ marginRight: 12 }} />
            <Text style={[styles.navText, { color: colors.text }]}>Terms & Conditions</Text>
            <ChevronRight size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.navRow, { borderTopWidth: 1, borderTopColor: isDark ? '#333' : '#F0F0F0' }]} onPress={() => Alert.alert('Rate Arogyon', 'Thank you for rating Arogyon on App Store / Play Store!')}>
            <Star size={20} color="#F59E0B" style={{ marginRight: 12 }} />
            <Text style={[styles.navText, { color: colors.text }]}>Rate App on App Store / Play Store</Text>
            <ChevronRight size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={() => {
            Alert.alert(
              'Log Out', 
              'Are you sure you want to log out of your Arogyon account?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Log Out', 
                  style: 'destructive',
                  onPress: () => router.replace('/auth/login')
                }
              ]
            );
          }}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: colors.textMuted }]}>
          Arogyon Premium v2.4.0 • Expo SDK 54
        </Text>
      </ScrollView>

      {/* FAQ Modal */}
      <Modal visible={showFaqModal} animationType="slide" transparent={false}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background, paddingTop: insets.top + 20 }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Help & FAQs</Text>
            <TouchableOpacity onPress={() => setShowFaqModal(false)}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.accent }}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {FAQS.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.faqCard, { backgroundColor: isDark ? '#1E1E1E' : '#F9F9F9' }]}
                onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, { color: colors.text }]}>{item.q}</Text>
                  <ChevronRight size={18} color={colors.textMuted} style={{ transform: [{ rotate: expandedFaq === i ? '90deg' : '0deg' }] }} />
                </View>
                {expandedFaq === i && (
                  <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{item.a}</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Terms & Conditions Modal */}
      <Modal visible={showTermsModal} animationType="slide" transparent={false}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background, paddingTop: insets.top + 20 }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Terms & Conditions</Text>
            <TouchableOpacity onPress={() => setShowTermsModal(false)}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.accent }}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={[styles.legalHeading, { color: colors.text }]}>1. Acceptance of Terms</Text>
            <Text style={[styles.legalBody, { color: colors.textSecondary }]}>
              By accessing or using the Arogyon Healthcare application, you agree to comply with and be bound by these Terms of Service.
            </Text>

            <Text style={[styles.legalHeading, { color: colors.text, marginTop: 16 }]}>2. Medical Disclaimer</Text>
            <Text style={[styles.legalBody, { color: colors.textSecondary }]}>
              Arogyon is a digital health record and consultation scheduling platform. Online tele-consultations are not a replacement for emergency hospital trauma care. In medical emergencies, immediately call 108/emergency services.
            </Text>

            <Text style={[styles.legalHeading, { color: colors.text, marginTop: 16 }]}>3. Data Privacy & Health Records</Text>
            <Text style={[styles.legalBody, { color: colors.textSecondary }]}>
              Your uploaded lab reports, prescriptions, and health metrics are encrypted. Arogyon does not sell or share personal health data with unverified third parties.
            </Text>
          </ScrollView>
        </View>
      </Modal>

    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: { paddingRight: 16 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 60 },
  sectionHeading: { fontSize: 16, fontWeight: '800', marginBottom: 12, letterSpacing: -0.3 },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 8,
  },
  syncHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconBox: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  cardSubtitle: { fontSize: 12 },
  syncBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, gap: 6 },
  syncBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  spinning: { transform: [{ rotate: '180deg' }] },
  statsRow: { flexDirection: 'row', padding: 14, borderRadius: 16, marginBottom: 16, justifyContent: 'space-around' },
  statCol: { alignItems: 'center' },
  statVal: { fontSize: 16, fontWeight: '800', marginBottom: 2 },
  statLbl: { fontSize: 11, fontWeight: '600' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  toggleTextCol: { flex: 1, paddingRight: 12 },
  toggleTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  toggleSub: { fontSize: 12 },
  navRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  navText: { flex: 1, fontSize: 15, fontWeight: '600' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    marginTop: 24,
    marginBottom: 16,
    gap: 8,
  },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
  versionText: { textAlign: 'center', fontSize: 12, marginTop: 8 },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  faqCard: { padding: 16, borderRadius: 16, marginBottom: 12 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 15, fontWeight: '700', flex: 1, paddingRight: 8 },
  faqAnswer: { fontSize: 14, lineHeight: 22, marginTop: 10 },
  legalHeading: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  legalBody: { fontSize: 14, lineHeight: 22 },
});

