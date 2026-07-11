import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { CheckCircle2, Video, CalendarDays, Activity } from 'lucide-react-native';

import HomeHeader from '@/components/HomeHeader';
import TopFogOverlay from '@/components/TopFogOverlay';
import ActivityTabBar from '@/components/activity/ActivityTabBar';
import OverviewSection from '@/components/activity/OverviewSection';
import TodaysPlanSection from '@/components/activity/TodaysPlanSection';
import QuickActionsRow from '@/components/activity/QuickActionsRow';

const TABS = [
  { id: 'track', label: 'Track', icon: Activity },
  { id: 'sessions', label: 'Sessions', icon: Video },
  { id: 'upcoming', label: 'Upcoming', icon: CalendarDays },
];

export default function ActivityScreen() {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('track');

  const renderTrackContent = () => (
    <>
      <OverviewSection colors={colors} isDark={isDark} />
      <TodaysPlanSection colors={colors} isDark={isDark} />
      <QuickActionsRow colors={colors} isDark={isDark} />
    </>
  );

  const renderPlaceholder = (title: string) => (
    <View style={styles.placeholderContainer}>
      <Text style={[styles.placeholderText, { color: colors.textMuted }]}>{title} content coming soon.</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FDFDFD' }]}>
      <TopFogOverlay />
      
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never" contentContainerStyle={styles.scrollContent}>
        
        <HomeHeader currentCity="Bangalore" avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" />

      <ActivityTabBar 
        isDark={isDark} 
        colors={colors} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        TABS={TABS} 
      />

      {activeTab === 'track' && renderTrackContent()}
      {activeTab === 'sessions' && renderPlaceholder('Sessions')}
      {activeTab === 'upcoming' && renderPlaceholder('Upcoming Appointments')}
    </ScrollView>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 120,
  },
  placeholderContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '500',
  }
});
