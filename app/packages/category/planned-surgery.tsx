import React from 'react';
import PlannedSurgeryCare from '@/components/care/PlannedSurgeryCare';
import { useTheme } from '@/hooks/useTheme';

export default function PlannedSurgeryCategoryScreen() {
  const { colors, isDark } = useTheme();
  return <PlannedSurgeryCare colors={colors} isDark={isDark} />;
}
