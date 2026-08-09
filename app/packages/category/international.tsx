import React from 'react';
import InternationalPatientCare from '@/components/care/InternationalPatientCare';
import { useTheme } from '@/hooks/useTheme';

export default function InternationalCategoryScreen() {
  const { colors, isDark } = useTheme();
  return <InternationalPatientCare colors={colors} isDark={isDark} />;
}
