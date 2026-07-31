import React, { useEffect, useCallback, useState } from 'react';
import { Platform, StyleSheet, View, Text, TouchableOpacity, Dimensions, BackHandler } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  SharedValue,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { Home, Calendar, Heart, Activity, Sparkles } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Mask, Rect, Circle, Line, Polyline } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { GlassView, GlassContainer, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import AndroidGlassView from '@/components/AndroidGlassView';
import GlobalChatOverlay from './GlobalChatOverlay';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TAB_META: Record<string, { label: string }> = {
  index: { label: 'Home' },
  package: { label: 'Packages' },
  care: { label: 'Care' },
  experts: { label: 'Experts' },
  today: { label: 'Today' },
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function CustomCalendarIcon({ size, color, fill, strokeWidth, isDark }: { size: number, color: string, fill: string, strokeWidth: number, isDark: boolean }) {
  const isFilled = fill !== 'transparent' && fill !== 'none';
  const innerStroke = isDark ? '#1e1e1e' : '#ffffff';
  const extraLineStroke = isFilled ? innerStroke : 'transparent';
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={isFilled ? fill : 'none'} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Defs>
        <LinearGradient id="active-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#9bf229" />
          <Stop offset="100%" stopColor="#14ce65" />
        </LinearGradient>
      </Defs>
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill={isFilled ? fill : 'none'} stroke={color} />
      <Line x1="16" y1="2" x2="16" y2="6" stroke={color} />
      <Line x1="8" y1="2" x2="8" y2="6" stroke={color} />
      <Line x1="3" y1="10" x2="21" y2="10" stroke={isFilled ? innerStroke : color} />
      
      {/* Bullet points for tasks */}
      <Line x1="7" y1="14" x2="7.01" y2="14" stroke={extraLineStroke} strokeWidth={strokeWidth} />
      <Line x1="11" y1="14" x2="17" y2="14" stroke={extraLineStroke} strokeWidth={strokeWidth * 0.8} />
      
      <Line x1="7" y1="18" x2="7.01" y2="18" stroke={extraLineStroke} strokeWidth={strokeWidth} />
      <Line x1="11" y1="18" x2="17" y2="18" stroke={extraLineStroke} strokeWidth={strokeWidth * 0.8} />
    </Svg>
  );
}

function ActiveHomeIcon({ size, strokeWidth, isDark, color }: { size: number, strokeWidth: number, isDark: boolean, color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Path d="M9 22V12h6v10" />
    </Svg>
  );
}

function ActiveHeartIcon({ size, strokeWidth, color }: { size: number, strokeWidth: number, color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </Svg>
  );
}

function ActiveActivityIcon({ size, strokeWidth, color }: { size: number, strokeWidth: number, color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </Svg>
  );
}

function getTabIcon(routeName: string, color: string, isFocused: boolean, isDark: boolean) {
  const size = 22;
  const stroke = isFocused ? 2.5 : 2;
  const fill = isFocused ? color : 'transparent';
  
  if (isFocused) {
    switch (routeName) {
      case 'index': return <ActiveHomeIcon size={size} strokeWidth={stroke} isDark={isDark} color={color} />;
      case 'package': return <CustomCalendarIcon size={size} color={color} fill={color} strokeWidth={stroke} isDark={isDark} />;
      case 'care': return <ActiveHeartIcon size={size} strokeWidth={stroke} color={color} />;
      case 'experts': return <Sparkles size={size} color={color} fill={color} strokeWidth={stroke} />;
      case 'today': return <ActiveHeartIcon size={size} strokeWidth={stroke} color={color} />;
      default: return <ActiveHomeIcon size={size} strokeWidth={stroke} isDark={isDark} color={color} />;
    }
  }

  // Inactive states
  switch (routeName) {
    case 'index': return <Home size={size} color={color} fill={fill} strokeWidth={stroke} />;
    case 'package': return <CustomCalendarIcon size={size} color={color} fill={fill} strokeWidth={stroke} isDark={isDark} />;
    case 'care': return <Heart size={size} color={color} fill={fill} strokeWidth={stroke} />;
    case 'experts': return <Sparkles size={size} color={color} fill={fill} strokeWidth={stroke} />;
    case 'today': return <Heart size={size} color={color} fill={fill} strokeWidth={stroke} />;
    default: return <Home size={size} color={color} fill={fill} strokeWidth={stroke} />;
  }
}

function PremiumLogo({ progress }: { progress: SharedValue<number> }) {
  const logoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.2], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <Animated.View style={[styles.logoWrapper, logoStyle]} pointerEvents="none">
      <Svg width={45} height={21} viewBox="0 0 94 44">
        <Defs>
          <LinearGradient id="o-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#9bf229" />
            <Stop offset="100%" stopColor="#14ce65" />
          </LinearGradient>
          <Mask id="heart-mask">
            <Rect width="94" height="44" fill="white" />
            <Path d="M 22 14 C 15 8, 7 13, 9 21 C 11 28, 19 33, 22 37 C 25 33, 33 28, 35 21 C 37 13, 29 8, 22 14 Z" fill="black" />
          </Mask>
          <LinearGradient id="n-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#1ad561" />
            <Stop offset="100%" stopColor="#009f68" />
          </LinearGradient>
        </Defs>
        <Circle cx="22" cy="22" r="22" fill="url(#o-grad)" mask="url(#heart-mask)" />
        <Path 
          d="M 52 39.5 V 22 A 17.5 17.5 0 0 1 87 22 V 39.5" 
          fill="none" 
          stroke="url(#n-grad)" 
          strokeWidth="9" 
          strokeLinecap="round" 
        />
      </Svg>
    </Animated.View>
  );
}

function TabItem({ route, isFocused, meta, onPress, hoverIndex, tabIndex, isDragging }: any) {
  const { isDark } = useTheme();
  const activeIconColor = '#14ce65';
  const inactiveColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.45)';

  const pressScale = useSharedValue(1);
  const focusProgress = useSharedValue(isFocused ? 1 : 0);
  const pointerHoverProgress = useSharedValue(0);

  useEffect(() => {
    focusProgress.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const isHoveredScrub = isDragging.value && hoverIndex.value === tabIndex;
    const bubbleScale = withSpring(isHoveredScrub ? 1.15 : (1 + 0.05 * pointerHoverProgress.value), { damping: 14, stiffness: 280 });
    const bubbleY = withSpring(isHoveredScrub ? -3 : (-1 * pointerHoverProgress.value), { damping: 14, stiffness: 280 });

    return {
      opacity: 0.85 + 0.15 * focusProgress.value,
      transform: [
        { translateY: (-2 * focusProgress.value) + bubbleY },
        { scale: (1 + 0.08 * focusProgress.value) * bubbleScale },
      ],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: 0.65 + 0.35 * focusProgress.value,
    transform: [
      { translateY: -1 * focusProgress.value },
    ],
  }));

  const pointerHoverStyle = useAnimatedStyle(() => ({
    opacity: withTiming(pointerHoverProgress.value * (isFocused ? 0 : 0.15), { duration: 150 }),
    transform: [
      { scale: withSpring(0.95 + 0.05 * pointerHoverProgress.value, { damping: 15, stiffness: 300 }) },
    ],
  }));

  const handleMouseEnter = () => {
    pointerHoverProgress.value = withTiming(1, { duration: 150 });
  };

  const handleMouseLeave = () => {
    pointerHoverProgress.value = withTiming(0, { duration: 200 });
  };

  return (
    <AnimatedTouchable
      activeOpacity={0.8}
      onPress={onPress}
      onPressIn={() => { pressScale.value = withTiming(0.92, { duration: 100 }); }}
      onPressOut={() => { pressScale.value = withTiming(1, { duration: 150 }); }}
      {...({ onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave } as any)}
      style={[styles.tabButton, { transform: [{ scale: pressScale }] }]}
    >
      <Animated.View style={[styles.hoverBackdrop, pointerHoverStyle, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.1)' }]} pointerEvents="none" />
      <Animated.View style={animatedIconStyle}>
        {getTabIcon(route.name, isFocused ? activeIconColor : inactiveColor, isFocused, isDark)}
      </Animated.View>
      <Animated.View style={[styles.textCapsule, animatedTextStyle]}>
        <Text style={[styles.tabLabel, { color: isFocused ? (isDark ? '#FFFFFF' : '#0F172A') : inactiveColor, fontWeight: isFocused ? '800' : '600' }]}>
          {meta.label}
        </Text>
      </Animated.View>
    </AnimatedTouchable>
  );
}

const generateAiResponse = (query: string): string => {
  const q = query.toLowerCase();
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('help')) {
    return "Hello! I'm Arogyon AI, your personal health assistant. I can help you find specialists, track health plans, book clinic visits, or explain medical packages. What's on your mind today?";
  }
  if (q.includes('pain') || q.includes('fever') || q.includes('cough') || q.includes('headache') || q.includes('stomach') || q.includes('hurt')) {
    return "I'm sorry to hear that you are feeling unwell. For symptoms of discomfort or pain, it's best to consult a clinical expert. Would you like me to guide you to book an In-Clinic Specialist or a General Physician visit at Apollo Hospitals?";
  }
  if (q.includes('book') || q.includes('doctor') || q.includes('clinic') || q.includes('appointment') || q.includes('specialist') || q.includes('physician')) {
    return "I can help you find top-rated specialists for in-clinic visits! You can search for doctors by tapping on the Services row on the home page or browsing through the 'Care' tab. Would you like to check out general physicians or physiotherapists?";
  }
  if (q.includes('diet') || q.includes('nutrition') || q.includes('weight') || q.includes('eating') || q.includes('food')) {
    return "A tailored diet is essential for optimal health! We have custom Ayurvedic Diet & Lifestyle plans managed 1-on-1 by certified nutritionists. You can subscribe to these diet packages under the 'Plans' tab.";
  }
  if (q.includes('gym') || q.includes('yoga') || q.includes('fitness') || q.includes('exercise') || q.includes('workout')) {
    return "Physical activity keeps the body strong and minds clear! We partner with top centers to offer premium Gym & Yoga plans. You can view them by going to 'Wellness' from the quick actions or checking the Fitness category.";
  }
  if (q.includes('lab') || q.includes('test') || q.includes('blood') || q.includes('report') || q.includes('diagnostic')) {
    return "We offer convenient at-home sample collection for diagnostic lab tests. You can book individual tests or comprehensive health checkups directly from the home page. Let me know if you'd like me to guide you there!";
  }
  return "That sounds like an important health query. To give you the safest and most accurate guidance, would you like me to help you navigate to book an in-person clinical consultation with one of our verified specialists?";
};

export default function ChromicTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { isDark, colors } = useTheme();
  const supportsLiquidGlass = isLiquidGlassAvailable();
  const chatModeProgress = useSharedValue(0);

  const visibleRoutes = state.routes.filter((route: any) => {
    const { options } = descriptors[route.key];
    return (options as { href?: string | null }).href !== null && TAB_META[route.name];
  });

  const handleLogoPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (chatModeProgress.value > 0.5) {
      chatModeProgress.value = withTiming(0, { duration: 250 });
    } else {
      chatModeProgress.value = withTiming(1, { duration: 300 });
    }
  }, []);

  const handleCloseChat = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    chatModeProgress.value = withTiming(0, { duration: 250 });
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (chatModeProgress.value > 0) {
        handleCloseChat();
        return true;
      }
      return false;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [handleCloseChat]);

  const focusedVisibleIndex = visibleRoutes.findIndex(
    (route: any) => state.routes.indexOf(route) === state.index
  );

  const containerWidth = useSharedValue(0);
  const leadPosition = useSharedValue(focusedVisibleIndex !== -1 ? focusedVisibleIndex : 0);
  const trailPosition = useSharedValue(focusedVisibleIndex !== -1 ? focusedVisibleIndex : 0);

  useEffect(() => {
    const nextIndex = visibleRoutes.findIndex(
      (route: any) => state.routes.indexOf(route) === state.index
    );

    if (nextIndex !== -1) {
      // The leading edge leaves first; the trailing edge follows. They reshape
      // one mounted GlassView instead of cross-fading two separate indicators.
      leadPosition.value = withSpring(nextIndex, {
        damping: 17,
        stiffness: 360,
        mass: 0.48,
      });
      trailPosition.value = withSpring(nextIndex, {
        damping: 20,
        stiffness: 150,
        mass: 0.82,
      });
    }
  }, [state.index, visibleRoutes]);

  const indicatorStyle = useAnimatedStyle(() => {
    if (containerWidth.value === 0) return { opacity: 0, transform: [{ translateX: 0 }], width: 0 };

    // The nav container has 6pt leading and 12pt trailing padding.
    const availableWidth = containerWidth.value - 18;
    const tabW = availableWidth / visibleRoutes.length;
    const indicatorWidth = Math.min(tabW - 8, 72);

    const leadCenter = 6 + leadPosition.value * tabW + (tabW / 2);
    const trailCenter = 6 + trailPosition.value * tabW + (tabW / 2);

    const leftEdge = Math.min(leadCenter, trailCenter) - (indicatorWidth / 2);
    const rightEdge = Math.max(leadCenter, trailCenter) + (indicatorWidth / 2);
    
    const widthVal = rightEdge - leftEdge;
    const stretch = Math.min(Math.abs(leadPosition.value - trailPosition.value), 1);

    return {
      transform: [{ translateX: leftEdge }, { scaleY: 1 - (stretch * 0.08) }],
      width: widthVal,
      opacity: 1,
    };
  });

  // Animations for morphing
  const navContainerStyle = useAnimatedStyle(() => {
    return {
      flex: interpolate(chatModeProgress.value, [0, 0.5], [1, 0.01], Extrapolation.CLAMP),
      opacity: interpolate(chatModeProgress.value, [0, 0.5], [1, 0], Extrapolation.CLAMP),
      transform: [
        { scale: interpolate(chatModeProgress.value, [0, 0.5], [1, 0.8], Extrapolation.CLAMP) }
      ],
      marginRight: interpolate(chatModeProgress.value, [0, 1], [0, -20], Extrapolation.CLAMP),
    };
  });

  // ── Scrub gesture: hold and drag to switch tabs with bubble effect ──
  const isDraggingScrub = useSharedValue(false);
  const hoverIndex = useSharedValue(-1);
  const lastHoverIndex = useSharedValue(-1);
  const tabCount = visibleRoutes.length;

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const triggerMediumHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const navigateToTab = useCallback((index: number) => {
    const route = visibleRoutes[index];
    if (route) {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    }
  }, [visibleRoutes, navigation]);

  const scrubGesture = Gesture.Pan()
    .activateAfterLongPress(250)
    .onStart((e) => {
      'worklet';
      isDraggingScrub.value = true;
      if (containerWidth.value > 0) {
        const paddingLeft = 6;
        const adjustedX = e.x - paddingLeft;
        const availableWidth = containerWidth.value - 18;
        const tabW = availableWidth / tabCount;
        const idx = Math.floor(adjustedX / tabW);
        const clampedIdx = Math.max(0, Math.min(idx, tabCount - 1));
        hoverIndex.value = clampedIdx;
        lastHoverIndex.value = clampedIdx;
        leadPosition.value = withSpring(clampedIdx, { damping: 20, stiffness: 300, mass: 0.6 });
        trailPosition.value = withSpring(clampedIdx, { damping: 22, stiffness: 250, mass: 0.8 });
        runOnJS(triggerMediumHaptic)();
      }
    })
    .onUpdate((e) => {
      'worklet';
      if (containerWidth.value > 0) {
        const paddingLeft = 6;
        const adjustedX = e.x - paddingLeft;
        const availableWidth = containerWidth.value - 18;
        const tabW = availableWidth / tabCount;
        const idx = Math.floor(adjustedX / tabW);
        const clampedIdx = Math.max(0, Math.min(idx, tabCount - 1));
        hoverIndex.value = clampedIdx;

        if (clampedIdx !== lastHoverIndex.value) {
          lastHoverIndex.value = clampedIdx;
          leadPosition.value = withSpring(clampedIdx, { damping: 20, stiffness: 300, mass: 0.6 });
          trailPosition.value = withSpring(clampedIdx, { damping: 22, stiffness: 250, mass: 0.8 });
          runOnJS(triggerHaptic)();
        }
      }
    })
    .onEnd(() => {
      'worklet';
      const finalIndex = hoverIndex.value;
      isDraggingScrub.value = false;
      hoverIndex.value = -1;
      lastHoverIndex.value = -1;
      if (finalIndex >= 0) {
        runOnJS(navigateToTab)(finalIndex);
      }
    })
    .onFinalize(() => {
      'worklet';
      isDraggingScrub.value = false;
      hoverIndex.value = -1;
      lastHoverIndex.value = -1;
    });

  const logoContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(chatModeProgress.value, [0, 0.2], [1, 0], Extrapolation.CLAMP),
      transform: [
        { scale: interpolate(chatModeProgress.value, [0, 0.2], [1, 0.8], Extrapolation.CLAMP) }
      ],
    };
  });

  const fogStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(chatModeProgress.value, [0, 0.2], [1, 0], Extrapolation.CLAMP),
    };
  });

  const renderPillContainers = () => {
    const containerBgStyle = supportsLiquidGlass 
      ? styles.glassTransparent 
      : (Platform.OS === 'ios' ? styles.blurContainer : (isDark ? styles.softGlassDark : styles.softGlassLight));

    return (
      <>
        <GestureDetector gesture={scrubGesture}>
        <Animated.View 
          style={[styles.navContainer, containerBgStyle, navContainerStyle]} 
          onLayout={(e) => { containerWidth.value = e.nativeEvent.layout.width; }}
        >
          {Platform.OS === 'android' ? null : supportsLiquidGlass ? (
            <GlassView glassEffectStyle="regular" isInteractive={false} style={[StyleSheet.absoluteFill, { borderRadius: 31, overflow: 'hidden' }]} />
          ) : (
            Platform.OS === 'ios' && (
              <BlurView intensity={85} tint={isDark ? 'dark' : 'light'} style={[StyleSheet.absoluteFill, { borderRadius: 31, overflow: 'hidden' }]} />
            )
          )}

          {/* Animated Pure Crystal-Clear Liquid Glass Active Tab Indicator */}
          <Animated.View 
            style={[
              styles.activeIndicator, 
              indicatorStyle,
              styles.activeIndicatorShadow,
            ]} 
          >
            {Platform.OS === 'android' ? (
              <AndroidGlassView style={[StyleSheet.absoluteFill, { borderRadius: 24, overflow: 'hidden' }]} />
            ) : supportsLiquidGlass ? (
              <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 24, overflow: 'hidden' }]} />
            ) : (
              <BlurView intensity={75} tint={isDark ? 'dark' : 'light'} style={[StyleSheet.absoluteFill, { borderRadius: 24, overflow: 'hidden' }]} />
            )}
            <ExpoLinearGradient
              pointerEvents="none"
              colors={isDark
                ? ['rgba(255,255,255,0.24)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']
                : ['rgba(255,255,255,0.68)', 'rgba(255,255,255,0.24)', 'rgba(255,255,255,0.08)']}
              locations={[0, 0.5, 1]}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={[StyleSheet.absoluteFill, styles.indicatorSheen]}
            />
            <View
              style={[
                StyleSheet.absoluteFill, 
                { 
                  borderRadius: 24, 
                  borderWidth: 1, 
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.44)' : 'rgba(255, 255, 255, 0.88)',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.08)',
                }
              ]} 
            />
            <View style={styles.specularRimLine} pointerEvents="none" />
          </Animated.View>

          {visibleRoutes.map((route: any, index: number) => {
            const isFocused = state.index === state.routes.indexOf(route);
            const meta = TAB_META[route.name];

            const onPress = () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <View
                key={route.key}
                style={styles.tabSlot}
              >
                <TabItem 
                  route={route} 
                  isFocused={isFocused} 
                  meta={meta} 
                  onPress={onPress} 
                  hoverIndex={hoverIndex} 
                  tabIndex={index} 
                  isDragging={isDraggingScrub} 
                />
              </View>
            );
          })}
        </Animated.View>
        </GestureDetector>

        <AnimatedTouchable
          activeOpacity={0.85}
          onPress={handleLogoPress}
          style={[
            styles.logoContainer,
            containerBgStyle,
            logoContainerStyle
          ]}
        >
          {Platform.OS === 'android' ? null : supportsLiquidGlass ? (
            <GlassView glassEffectStyle="regular" tintColor={isDark ? '#333333' : '#ffffff'} isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 31, overflow: 'hidden' }]} />
          ) : (
            Platform.OS === 'ios' && (
              <BlurView intensity={85} tint={isDark ? 'dark' : 'light'} style={[StyleSheet.absoluteFill, { borderRadius: 31, overflow: 'hidden' }]} />
            )
          )}
          {/* Default Logo */}
          <PremiumLogo progress={chatModeProgress} />
        </AnimatedTouchable>
      </>
    );
  };

  return (
    <>
      <GlobalChatOverlay 
        chatModeProgress={chatModeProgress} 
        onClose={handleCloseChat} 
      />

      <Animated.View style={[styles.fogBackground, fogStyle]} pointerEvents="none">
        <ExpoLinearGradient
          colors={[
            isDark ? 'rgba(18,18,18,0)' : 'rgba(253,253,253,0)',
            isDark ? 'rgba(18,18,18,0.7)' : 'rgba(253,253,253,0.85)',
            isDark ? 'rgba(18,18,18,1)' : '#FDFDFD'
          ]}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {supportsLiquidGlass ? (
        <GlassContainer spacing={24} style={styles.wrapper}>
          {renderPillContainers()}
        </GlassContainer>
      ) : (
        <Animated.View style={styles.wrapper}>
          {renderPillContainers()}
        </Animated.View>
      )}
    </>
  );
}

import { Keyboard } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? 34 : 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 24,
    zIndex: 999,
  },
  fogBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: Platform.OS === 'ios' ? 34 + 62 : 24 + 62,
    zIndex: 998,
  },
  navContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 62,
    borderRadius: 31,
    borderCurve: 'continuous',
    paddingLeft: 6,
    paddingRight: 12,
    overflow: 'hidden',
  },
  tabSlot: {
    flex: 1,
    height: '100%',
  },
  logoContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  softGlassLight: {
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  softGlassDark: {
    backgroundColor: '#1e1e1e',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  glassTransparent: {
    backgroundColor: 'transparent',
  },
  blurContainer: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
    }),
  },
  indicatorWrapper: {
    position: 'absolute',
    left: 6,
    top: 6,
    height: 50,
    zIndex: 0,
  },
  activeIndicator: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    borderRadius: 25,
    overflow: 'hidden',
    zIndex: 0,
  },
  activeIndicatorShadow: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
  },
  indicatorSheen: {
    borderRadius: 25,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: 4,
    zIndex: 1,
  },
  textCapsule: {
    marginTop: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tabLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  hoverBackdrop: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 4,
    right: 4,
    borderRadius: 22,
    zIndex: -1,
  },
  specularRimLine: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 1,
  },
});
