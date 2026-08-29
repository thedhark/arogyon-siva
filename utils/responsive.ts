import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: rawWidth, height: rawHeight } = Dimensions.get('window');

// On web / desktop, clamp the dimensions so responsive scaling mirrors a standard mobile viewport (max 430pt)
const SCREEN_WIDTH = Platform.OS === 'web' ? Math.min(rawWidth, 430) : rawWidth;
const SCREEN_HEIGHT = Platform.OS === 'web' ? Math.min(rawHeight, 932) : rawHeight;

// Guideline screen dimensions based on standard 6.1" iPhone (390pt width x 844pt height)
const GUIDELINE_BASE_WIDTH = 390;
const GUIDELINE_BASE_HEIGHT = 844;

/**
 * Scale dimension horizontally based on screen width (clamped for web/desktop)
 */
export const scale = (size: number): number => {
  return Math.round((SCREEN_WIDTH / GUIDELINE_BASE_WIDTH) * size);
};

/**
 * Scale dimension vertically based on screen height (clamped for web/desktop)
 */
export const verticalScale = (size: number): number => {
  return Math.round((SCREEN_HEIGHT / GUIDELINE_BASE_HEIGHT) * size);
};

/**
 * Moderate scale with configurable resize factor (default 0.5)
 * Useful for fonts, paddings, and icon wrapper sizes to prevent overly large expansion on tablet/max screens
 */
export const moderateScale = (size: number, factor = 0.5): number => {
  return Math.round(size + (scale(size) - size) * factor);
};

/**
 * Get dynamic top inset space, handling notch, dynamic island (e.g. 59-60pt on iPhone 17 Pro Max), and Android status bars.
 */
export const getDynamicTopInset = (topInset: number, defaultOffset = 12): number => {
  return Math.max(topInset, 24) + defaultOffset;
};

export { SCREEN_WIDTH, SCREEN_HEIGHT };

