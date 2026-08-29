import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import ProfileCard from '@/components/profile/ProfileCard';
import QuickAccessGrid from '@/components/profile/QuickAccessGrid';

export default function WebRightSidebar() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <View style={[
      styles.sidebarContainer,
      {
        right: 0,
        width: 350,
        backgroundColor: isDark ? '#121212' : '#FFFFFF',
        borderLeftColor: isDark ? '#262626' : '#F0F2F5',
      }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push('/profile/settings')}
          accessibilityLabel="Profile Settings"
        >
          <Settings size={22} color={colors.text} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <ProfileCard />
        </View>

        <View style={styles.section}>
          <QuickAccessGrid />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebarContainer: {
    width: 340,
    borderLeftWidth: 1,
    paddingTop: 24,
    ...(Platform.OS === 'web' ? {
      position: 'fixed',
      top: 0,
      bottom: 0,
      zIndex: 100,
    } : { flex: 1 }) as any,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  settingsBtn: {
    padding: 6,
    borderRadius: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 8,
  },
});
