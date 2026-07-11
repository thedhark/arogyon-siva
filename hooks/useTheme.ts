import { Colors } from '@/constants/theme';
import { useColorScheme } from './useColorScheme';

export function useTheme() {
  return { isDark: false, colors: Colors.light, scheme: 'light' as const };
}
