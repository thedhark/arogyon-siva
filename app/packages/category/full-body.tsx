import React from 'react';
import PreventiveHealthCare from '@/components/care/PreventiveHealthCare';
import { useTheme } from '@/hooks/useTheme';

export default function FullBodyCategoryScreen() {
  const { colors, isDark } = useTheme();
  return <PreventiveHealthCare colors={colors} isDark={isDark} />;
}
