import React from 'react';
import WomensHealthCare from '@/components/care/WomensHealthCare';
import { useTheme } from '@/hooks/useTheme';

export default function WomenCategoryScreen() {
  const { colors, isDark } = useTheme();
  return <WomensHealthCare colors={colors} isDark={isDark} />;
}
