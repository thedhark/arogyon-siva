import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import CategoryScreenLayout from '@/components/packages/CategoryScreenLayout';
import { useTheme } from '@/hooks/useTheme';

import PlannedSurgeryCare from '@/components/care/PlannedSurgeryCare';
import InternationalPatientCare from '@/components/care/InternationalPatientCare';
import WomensHealthCare from '@/components/care/WomensHealthCare';
import MensHealthCare from '@/components/care/MensHealthCare';
import PreventiveHealthCare from '@/components/care/PreventiveHealthCare';
import SecondOpinionCare from '@/components/care/SecondOpinionCare';

export default function DynamicCategoryScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { colors, isDark } = useTheme();

  const slug = (typeof id === 'string' ? id : '').toLowerCase().trim();
  const normalizedId = slug.replace(/[-_]/g, '');

  if (['opinion', 'secondopinion', '2ndopinion', 'second-opinion'].includes(normalizedId)) {
    return <SecondOpinionCare colors={colors} isDark={isDark} />;
  }

  if (['postsurgery', 'plannedsurgery', 'surgery', 'generalsurgery', '5'].includes(normalizedId)) {
    return <PlannedSurgeryCare colors={colors} isDark={isDark} />;
  }

  if (['international', 'internationalcare', 'internationalpatientcare', 'medicaltourism', 'globalcare'].includes(normalizedId)) {
    return <InternationalPatientCare colors={colors} isDark={isDark} />;
  }

  if (['women', 'womens', 'womenshealth', 'gynaecologist', 'gynecology', 'maternity', 'maternitycare', '9'].includes(normalizedId)) {
    return <WomensHealthCare colors={colors} isDark={isDark} />;
  }

  if (['men', 'mens', 'menshealth', 'executivewellness'].includes(normalizedId)) {
    return <MensHealthCare colors={colors} isDark={isDark} />;
  }

  if (['preventive', 'preventivehealth', 'fitness', 'fullbody', 'wellness', 'wellnesscare'].includes(normalizedId)) {
    return <PreventiveHealthCare colors={colors} isDark={isDark} />;
  }

  return <CategoryScreenLayout categorySlug={slug || 'skin'} />;
}
