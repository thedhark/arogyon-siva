import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Settings, ArrowLeft, Building2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

import AnimatedScreen from '@/components/AnimatedScreen';
import ProfileCard from '@/components/profile/ProfileCard';
import ArogyanPlusBanner from '@/components/profile/ArogyanPlusBanner';
import QuickAccessGrid from '@/components/profile/QuickAccessGrid';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  return (
    <AnimatedScreen entrance="fade" style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/profile/settings')}>
          <Settings size={26} color={colors.text} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <ProfileCard />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <ArogyanPlusBanner />
        </Animated.View>

        {/* Partner App Switcher Card */}
        <Animated.View entering={FadeInDown.delay(250).springify()}>
          <TouchableOpacity
            style={styles.partnerCard}
            onPress={() => router.push('/(partner)/dashboard' as any)}
            activeOpacity={0.88}
          >
            <View style={styles.partnerCardLeft}>
              <View style={styles.partnerIconBox}>
                <Building2 size={22} color="#FFFFFF" />
              </View>
              <View style={styles.partnerTextGroup}>
                <View style={styles.partnerTitleRow}>
                  <Text style={styles.partnerTitle}>Hospital Partner Portal</Text>
                  <View style={styles.partnerBadge}>
                    <Text style={styles.partnerBadgeText}>PARTNER</Text>
                  </View>
                </View>
                <Text style={styles.partnerSub}>Manage hospital page, boost campaigns & patient leads</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <QuickAccessGrid />
        </Animated.View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    paddingRight: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  settingsBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  bottomSpacer: {
    height: 100, // Safe padding for the bottom
  },
  partnerCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  partnerCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  partnerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerTextGroup: {
    flex: 1,
  },
  partnerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  partnerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  partnerBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  partnerBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#60A5FA',
  },
  partnerSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
});
