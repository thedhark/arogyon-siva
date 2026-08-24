import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { getTrustedDoctorsForCategory } from '@/constants/trusted-doctors';
import TrustedDoctorCard from '@/components/home/TrustedDoctorCard';
import { Fonts } from '@/constants/theme';

interface TrustedDoctorsSectionProps {
  activeTab: string;
}

export default function TrustedDoctorsSection({ activeTab }: TrustedDoctorsSectionProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const doctors = useMemo(() => {
    return getTrustedDoctorsForCategory(activeTab);
  }, [activeTab]);

  const handleViewAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/top-doctors' as any);
  };

  if (!doctors || doctors.length === 0) {
    return null;
  }

  return (
    <Animated.View key={activeTab} entering={FadeIn.duration(240)} style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: isDark ? '#F9FAFB' : '#111827' }]}>
          Most trusted <Text style={styles.titleHighlight}>Doctors</Text>
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleViewAll}
          style={styles.viewAllBtn}
        >
          <Text style={styles.viewAllText}>View all</Text>
          <ChevronRight size={15} color="#E11D48" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Horizontal Doctors Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={288}
      >
        {doctors.map((doctor) => (
          <TrustedDoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18.5,
    fontFamily: Fonts.bold,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  titleHighlight: {
    color: '#E11D48',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  viewAllText: {
    color: '#E11D48',
    fontSize: 13.5,
    fontFamily: Fonts.semiBold,
    fontWeight: '600',
  },
  scrollContent: {
    paddingLeft: 16,
    paddingRight: 4,
  },
});
