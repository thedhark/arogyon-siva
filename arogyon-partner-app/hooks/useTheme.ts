import { COLORS } from '../constants/theme';

export function useTheme() {
  const isDark = true; // High-contrast sleek dark theme default for partner dashboard
  const colors = isDark ? COLORS.dark : COLORS.light;

  return {
    isDark,
    colors,
  };
}
