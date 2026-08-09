import React from 'react';
import WomensHealthCare from '@/components/care/WomensHealthCare';
import { useTheme } from '@/hooks/useTheme';

export default function WomensCategoryScreen() {
  const { colors, isDark } = useTheme();
  return <WomensHealthCare colors={colors} isDark={isDark} />;
}
