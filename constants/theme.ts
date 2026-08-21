// Design tokens for the Triangle app
export const Colors = {
  dark: {
    background: '#111318', // M3 Surface
    surface: '#1E2025',    // M3 Surface Container
    surfaceElevated: '#282A2F', // M3 Surface Container High
    surfaceGlass: 'rgba(30, 32, 37, 0.9)', // Solid-like fallback
    text: '#E2E2E9',       // M3 On Surface
    textSecondary: '#C4C6D0', // M3 On Surface Variant
    textMuted: '#8E9099',  // M3 Outline
    accent: '#A8C7FA',     // M3 Primary
    accentLight: '#D3E3FD', // M3 Primary Container
    accentSoft: '#004A77', // M3 Primary (darker variant)
    success: '#6DD58C',    // M3 Tertiary
    warning: '#F2B8B5',    // M3 Error (M3 uses error/tertiary, we map warning)
    danger: '#F2B8B5',     // M3 Error
    border: '#44474E',     // M3 Outline Variant
    borderLight: '#44474E',
    gradient: {
      primary: ['#A8C7FA', '#D3E3FD'] as const,
      aurora: ['#A8C7FA', '#6DD58C', '#D3E3FD'] as const,
      ember: ['#F2B8B5', '#8C1D18'] as const,
      midnight: ['#111318', '#1E2025', '#282A2F'] as const,
      glass: ['#1E2025', '#282A2F'] as const,
    },
  },
  light: {
    background: '#FFFFFF', // Pure White M3 Surface
    surface: '#F3F4F9',    // M3 Surface Container
    surfaceElevated: '#EBECE1', // M3 Surface Container High
    surfaceGlass: 'rgba(243, 244, 249, 0.95)', // Solid-like fallback
    text: '#1A1C1E',       // M3 On Surface
    textSecondary: '#43474E', // M3 On Surface Variant
    textMuted: '#73777F',  // M3 Outline
    accent: '#0061A4',     // M3 Primary
    accentLight: '#D1E4FF', // M3 Primary Container
    accentSoft: '#E6F0FF', // M3 Soft Primary
    success: '#006D3B',    // M3 Tertiary
    warning: '#BA1A1A',    // M3 Error (mapped)
    danger: '#BA1A1A',     // M3 Error
    border: '#C2C7CF',     // M3 Outline Variant
    borderLight: '#C2C7CF',
    gradient: {
      primary: ['#0061A4', '#D1E4FF'] as const,
      aurora: ['#0061A4', '#006D3B', '#D1E4FF'] as const,
      ember: ['#BA1A1A', '#FFDAD6'] as const,
      midnight: ['#FDFBFF', '#F3F4F9', '#EBECE1'] as const,
      glass: ['#F3F4F9', '#EBECE1'] as const,
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
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,   // M3 Expressive extreme rounding
  xxl: 40,
  full: 9999,
};

export const AspectRatios = {
  facilityHero: 16 / 9,      // Tier 1: Hospitals & Diagnostic Labs landscape photos
  specializedHub: 4 / 3,     // Tier 2: Eye Care, Dental, Specialized Care featured banners
  specialtySquare: 1 / 1,    // Tier 3: Medical Specialties 3D/vector icons
  symptomSquare: 1 / 1,      // Tier 4: Acute Symptoms & Treatments icons
  bannerWide: 3 / 1,         // Promotional horizontal banners
};

export const LayoutDimensions = {
  tier1Facility: { minWidth: 280, height: 180, borderRadius: 20 },
  tier2Specialized: { width: 160, height: 140, borderRadius: 16 },
  tier3Specialty: { width: 88, height: 104, iconSize: 48, borderRadius: 16 },
  tier4Symptom: { width: 76, height: 84, iconSize: 36, borderRadius: 14 },
};

export const Fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
};

export const Typography = {
  hero: { fontFamily: Fonts.bold, fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
  title: { fontFamily: Fonts.bold, fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.25 },
  heading: { fontFamily: Fonts.semiBold, fontSize: 20, fontWeight: '600' as const, letterSpacing: -0.15 },
  subheading: { fontFamily: Fonts.semiBold, fontSize: 16, fontWeight: '600' as const, letterSpacing: -0.1 },
  body: { fontFamily: Fonts.regular, fontSize: 15, fontWeight: '400' as const, lineHeight: 22, letterSpacing: 0.2 },
  caption: { fontFamily: Fonts.medium, fontSize: 13, fontWeight: '500' as const, letterSpacing: 0.1 },
  micro: { fontFamily: Fonts.medium, fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.3 },
};


