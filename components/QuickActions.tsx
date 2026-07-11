import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Stethoscope, FlaskConical, Accessibility, Dumbbell, Video } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import QuickAction from '@/components/QuickAction';

export default function QuickActions() {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>Quick Actions</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false} overScrollMode="never" style={styles.fullWidthScroll} contentContainerStyle={styles.quickActionsScroll}>
        <QuickAction icon={<Stethoscope size={24} color="#1b5e55" />} label={"Book\nDoctor"} />
        <QuickAction icon={<FlaskConical size={24} color="#1b5e55" />} label={"Book\nLab Test"} />
        <QuickAction icon={<Accessibility size={24} color="#8a3ab9" />} label={"Find\nPhysiotherapy"} />
        <QuickAction icon={<Dumbbell size={24} color="#ff9900" />} label={"Join\nGym"} />
        <QuickAction icon={<Video size={24} color="#1b5e55" />} label={"Consult\nOnline"} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  fullWidthScroll: {
    marginHorizontal: -12,
  },
  quickActionsScroll: {
    gap: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});
