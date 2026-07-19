import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Svg, { Path, Polyline, Line } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useDerivedValue } from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { GlassView } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlass } from '@/contexts/GlassContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const HomeIcon = ({ color }: { color: string }) => (
  <Svg viewBox="0 0 24 24" width={24} height={24} fill={color}>
    <Path d="M11.47 3.84a.75.75 0 011.06 0l8.99 9a.75.75 0 11-1.06 1.06l-1.21-1.22V20a1.5 1.5 0 01-1.5 1.5h-3.75A1.5 1.5 0 0112.5 20v-4.5h-1V20a1.5 1.5 0 01-1.5 1.5H6.25A1.5 1.5 0 014.75 20v-7.32l-1.21 1.22a.75.75 0 01-1.06-1.06l8.99-9z"/>
  </Svg>
);

const PackageIcon = ({ color }: { color: string }) => (
  <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <Polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <Line x1="12" y1="22.08" x2="12" y2="12" />
  </Svg>
);

const HeartIcon = ({ color }: { color: string }) => (
  <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

function TabButton({ route, isFocused, onPress, onLongPress }: any) {
  const { isDark } = useTheme();
  
  const activeColor = isDark ? '#FFFFFF' : '#0f172a';
  const inactiveColor = isDark ? '#9CA3AF' : '#4B5563'; 
  
  const color = isFocused ? activeColor : inactiveColor;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  let Icon = HomeIcon;
  if (route.name === 'package') Icon = PackageIcon;
  if (route.name === 'care') Icon = HeartIcon;

  return (
    <AnimatedTouchable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(e);
      }}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[styles.button, animatedStyle]}
    >
      <Icon color={color} />
    </AnimatedTouchable>
  );
}

export default function MaterialTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { isDark } = useTheme();
  const { settings } = useGlass();
  const insets = useSafeAreaInsets();
  
  const activeIndex = useSharedValue(state.index);
  useEffect(() => {
    activeIndex.value = withSpring(state.index, { damping: 18, stiffness: 180 });
  }, [activeIndex, state.index]);

  const indicatorX = useDerivedValue(() => {
    if (activeIndex.value <= 1) {
       return 24 + activeIndex.value * (142 - 24);
    } else {
       return 142 + (activeIndex.value - 1) * (260 - 142);
    }
  });

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  // Apply live tuning settings
  const containerGradStart = isDark 
    ? `rgba(30, 30, 35, ${settings.bgOpacity})` 
    : `rgba(255, 255, 255, ${settings.bgOpacity})`;
  const containerGradEnd = isDark 
    ? `rgba(20, 20, 25, ${Math.max(0, settings.bgOpacity - 0.2)})` 
    : `rgba(255, 255, 255, ${Math.max(0, settings.bgOpacity - 0.2)})`;
    
  const borderColor = isDark 
    ? `rgba(255, 255, 255, ${settings.borderOpacity})` 
    : `rgba(255, 255, 255, ${settings.borderOpacity * 1.5})`;
  const borderTop = isDark 
    ? `rgba(255, 255, 255, ${settings.highlightOpacity})` 
    : `rgba(255, 255, 255, ${settings.highlightOpacity * 2})`;
  
  const pillBg = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.3)';
  const pillBorder = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.6)';

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.blurContainer}>
        <GlassView 
          glassEffectStyle="regular" 
          colorScheme={isDark ? 'dark' : 'light'} 
          style={StyleSheet.absoluteFill} 
        />
        
        <LinearGradient 
          colors={[containerGradStart, containerGradEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.innerContainer, { borderColor, borderTopColor: borderTop }]}
        >
          {/* Active Tab Glass Button Indicator (Pure RN Animated View) */}
          <Animated.View style={[
            styles.activePill,
            { backgroundColor: pillBg, borderColor: pillBorder },
            indicatorStyle
          ]} />

          {/* 3. The Interactive Buttons */}
          <View style={styles.buttonRow}>
            {state.routes.map((route, index) => {
              if (!['index', 'package', 'care'].includes(route.name)) return null;

              const isFocused = state.index === index;
              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              };
              const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

              return (
                <TabButton
                  key={route.key}
                  route={route}
                  isFocused={isFocused}
                  onPress={onPress}
                  onLongPress={onLongPress}
                />
              );
            })}
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'box-none',
  },
  blurContainer: {
    width: 340,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 10,
  },
  innerContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 36,
  },
  activePill: {
    position: 'absolute',
    top: 7, // (72 - 56) / 2 - 1 for border
    left: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    paddingHorizontal: 24,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
