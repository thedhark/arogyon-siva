import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Moon, Bell, Shield, CircleHelp, LogOut } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const SETTINGS_ITEMS = [
    { id: '1', title: 'Appearance', icon: Moon, subtitle: 'Dark & Light Mode' },
    { id: '2', title: 'Notifications', icon: Bell, subtitle: 'Push alerts & emails' },
    { id: '3', title: 'Privacy & Security', icon: Shield, subtitle: 'Biometrics & 2FA' },
    { id: '4', title: 'Help & Support', icon: CircleHelp, subtitle: 'FAQs & Contact' },
  ];

  return (
    <AnimatedScreen entrance="fade" style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          {SETTINGS_ITEMS.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.settingRow, 
                index !== SETTINGS_ITEMS.length - 1 && [styles.borderBottom, { borderBottomColor: isDark ? '#333' : '#F3F4F6' }]
              ]}
            >
              <View style={styles.iconWrapper}>
                <item.icon size={22} color={colors.text} />
              </View>
              <View style={styles.textWrapper}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: { padding: 20 },
  section: {
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  borderBottom: { borderBottomWidth: 1 },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textWrapper: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  settingSubtitle: { fontSize: 13, fontWeight: '400' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    gap: 8,
  },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
});
