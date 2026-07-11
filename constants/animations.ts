import { Easing } from 'react-native-reanimated';

/** Shared spring presets — use across tab bar, buttons, and screen entrances */
export const Springs = {
  snappy: { damping: 18, stiffness: 220, mass: 0.8 },
  gentle: { damping: 22, stiffness: 160, mass: 0.9 },
  bouncy: { damping: 12, stiffness: 180, mass: 0.7 },
  chromic: { damping: 20, stiffness: 140, mass: 1 },
} as const;

export const Timings = {
  fast: { duration: 180, easing: Easing.out(Easing.cubic) },
  medium: { duration: 320, easing: Easing.out(Easing.cubic) },
  slow: { duration: 520, easing: Easing.inOut(Easing.cubic) },
  chromicLoop: { duration: 4200, easing: Easing.linear },
} as const;

/** Stagger delay helper for list / grid entrances */
export function staggerDelay(index: number, base = 60, step = 45) {
  return base + index * step;
}
