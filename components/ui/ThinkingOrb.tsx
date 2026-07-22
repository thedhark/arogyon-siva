import React, { useState, useEffect, useRef } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { resolvePreset, MODE_DRAWS, OrbState, OrbSize, OrbTheme } from 'thinking-orbs';
import { useTheme } from '@/hooks/useTheme';

export type { OrbState, OrbSize, OrbTheme };

export interface ThinkingOrbProps {
  /** Which animation state to show: 'working' | 'searching' | 'solving' | 'listening' | 'composing' | 'shaping' */
  state?: OrbState;
  /** Size preset: 64 or 20 (or any numeric size in pixels). Default is 64. */
  size?: OrbSize | number;
  /** Theme mode: 'auto' | 'dark' | 'light'. Default is 'auto'. */
  theme?: OrbTheme;
  /** Speed multiplier. Default is 1. */
  speed?: number;
  /** Freeze animation frame. Default is false. */
  paused?: boolean;
  /** Custom container styles */
  style?: any;
  'aria-label'?: string;
}

// Web component import
let WebThinkingOrbComponent: any = null;
if (Platform.OS === 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    WebThinkingOrbComponent = require('thinking-orbs').ThinkingOrb;
  } catch (e) {
    WebThinkingOrbComponent = null;
  }
}

interface DotData {
  x: number;
  y: number;
  r: number;
  fillStyle: string;
}

export function ThinkingOrb({
  state = 'listening',
  size = 64,
  theme = 'auto',
  speed = 1,
  paused = false,
  style,
  'aria-label': ariaLabel,
  ...rest
}: ThinkingOrbProps) {
  const { isDark } = useTheme();
  const appThemeMode = isDark ? 'dark' : 'light';

  // If on web and official ThinkingOrb is available, render web native canvas
  if (Platform.OS === 'web' && WebThinkingOrbComponent) {
    return (
      <WebThinkingOrbComponent
        state={state}
        size={size}
        theme={theme}
        speed={speed}
        paused={paused}
        style={style}
        aria-label={ariaLabel}
        {...rest}
      />
    );
  }

  // Native React Native implementation (iOS & Android)
  return (
    <NativeThinkingOrb
      state={state}
      size={size}
      theme={theme}
      speed={speed}
      paused={paused}
      appThemeMode={appThemeMode}
      style={style}
    />
  );
}

function NativeThinkingOrb({
  state,
  size,
  theme,
  speed,
  paused,
  appThemeMode,
  style,
}: {
  state: OrbState;
  size: number;
  theme: OrbTheme;
  speed: number;
  paused: boolean;
  appThemeMode: 'dark' | 'light';
  style?: any;
}) {
  const [dots, setDots] = useState<DotData[]>([]);
  const animFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const lastTimestampRef = useRef<number>(0);

  const numSize = typeof size === 'number' ? size : 64;
  const isDark =
    theme === 'dark' ? true : theme === 'light' ? false : appThemeMode === 'dark';

  useEffect(() => {
    const preset = resolvePreset(state, (numSize === 20 ? 20 : 64) as OrbSize);
    const drawFn = MODE_DRAWS[preset.mode];
    if (!drawFn) return;

    const effectiveSpeed = preset.speed * speed;

    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const dt = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      if (!paused) {
        timeRef.current += dt * effectiveSpeed;
      }

      const frameDots: DotData[] = [];
      const fakeCtx = {
        setTransform: () => {},
        clearRect: () => {},
        fillStyle: 'rgba(255,255,255,1)',
        beginPath: () => {},
        arc: (x: number, y: number, r: number) => {
          frameDots.push({
            x,
            y,
            r,
            fillStyle: fakeCtx.fillStyle,
          });
        },
        fill: () => {},
      };

      try {
        drawFn(fakeCtx as any, numSize, timeRef.current, isDark, preset.opts);
        setDots(frameDots);
      } catch (e) {
        // fallback silent handle
      }

      if (!paused) {
        animFrameId.current = requestAnimationFrame(animate);
      }
    };

    lastTimestampRef.current = 0;
    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [state, numSize, theme, speed, paused, isDark]);

  return (
    <View style={[{ width: numSize, height: numSize, justifyContent: 'center', alignItems: 'center' }, style]}>
      <Svg width={numSize} height={numSize} viewBox={`0 0 ${numSize} ${numSize}`}>
        {dots.map((dot, idx) => (
          <Circle
            key={idx}
            cx={dot.x}
            cy={dot.y}
            r={Math.max(0.2, dot.r)}
            fill={dot.fillStyle}
          />
        ))}
      </Svg>
    </View>
  );
}

export default ThinkingOrb;
