import React from 'react';
import MensHealthCare from '@/components/care/MensHealthCare';
import { useTheme } from '@/hooks/useTheme';

export default function MenCategoryScreen() {
  const { colors, isDark } = useTheme();
  return <MensHealthCare colors={colors} isDark={isDark} />;
}
