// Design tokens for the Triangle app
export const Colors = {
  dark: {
    background: '#071114',
    surface: '#0d1b1f',
    surfaceElevated: '#13272c',
    surfaceGlass: 'rgba(13, 27, 31, 0.74)',
    text: '#eff8f7',
    textSecondary: '#a8bbb8',
    textMuted: '#6e8684',
    accent: '#0a84ff',
    accentLight: '#42d6c9',
    accentSoft: 'rgba(10, 132, 255, 0.16)',
    success: '#28c76f',
    warning: '#f5b84b',
    danger: '#ff5a5f',
    border: 'rgba(255, 255, 255, 0.06)',
    borderLight: 'rgba(255, 255, 255, 0.12)',
    gradient: {
      primary: ['#0a84ff', '#42d6c9'] as const,
      aurora: ['#0a84ff', '#42d6c9', '#28c76f'] as const,
      ember: ['#ff5a5f', '#f5b84b'] as const,
      midnight: ['#071114', '#123238', '#0a5661'] as const,
      glass: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'] as const,
    },
  },
  light: {
    background: '#ffffff',
    surface: '#ffffff',
    surfaceElevated: '#edf6f6',
    surfaceGlass: 'rgba(255, 255, 255, 0.72)',
    text: '#102a2d',
    textSecondary: '#536b6e',
    textMuted: '#91a3a5',
    accent: '#0878d9',
    accentLight: '#18b7a8',
    accentSoft: 'rgba(8, 120, 217, 0.09)',
    success: '#1fbf75',
    warning: '#df9c26',
    danger: '#e94f5a',
    border: 'rgba(0, 0, 0, 0.06)',
    borderLight: 'rgba(0, 0, 0, 0.10)',
    gradient: {
      primary: ['#0878d9', '#18b7a8'] as const,
      aurora: ['#0878d9', '#18b7a8', '#1fbf75'] as const,
      ember: ['#e94f5a', '#df9c26'] as const,
      midnight: ['#f6fbfb', '#d8eeee', '#93c8cf'] as const,
      glass: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)'] as const,
    },
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  hero: { fontSize: 34, fontWeight: '800' as const, letterSpacing: 0 },
  title: { fontSize: 24, fontWeight: '700' as const, letterSpacing: 0 },
  heading: { fontSize: 20, fontWeight: '700' as const, letterSpacing: 0 },
  subheading: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '500' as const },
  micro: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0 },
};
