import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Platform, StyleSheet, View, Text, TouchableOpacity, Dimensions, TextInput, BackHandler } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  SharedValue,
  interpolate,
  Extrapolation,
  useAnimatedKeyboard,
} from 'react-native-reanimated';
import { Home, Calendar, Heart, Activity, Send, Plus, Mic } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Mask, Rect, Circle, Text as SvgText, Line, Polyline } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import GlobalChatOverlay from './GlobalChatOverlay';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TAB_META: Record<string, { label: string }> = {
  index: { label: 'Home' },
  plans: { label: 'Plan' },
  care: { label: 'Care' },
  activity: { label: 'Activity' },
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

function ActiveHomeIcon({ size, strokeWidth, isDark }: { size: number, strokeWidth: number, isDark: boolean }) {
  const innerStroke = isDark ? '#1e1e1e' : '#ffffff';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="url(#active-grad)" stroke="url(#active-grad)" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Defs>
        <LinearGradient id="active-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#9bf229" />
          <Stop offset="100%" stopColor="#14ce65" />
        </LinearGradient>
      </Defs>
      <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Path d="M9 22V12h6v10" stroke={innerStroke} />
    </Svg>
  );
}

function ActiveHeartIcon({ size, strokeWidth }: { size: number, strokeWidth: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="url(#active-grad)" stroke="url(#active-grad)" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Defs>
        <LinearGradient id="active-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#9bf229" />
          <Stop offset="100%" stopColor="#14ce65" />
        </LinearGradient>
      </Defs>
      <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </Svg>
  );
}

function ActiveActivityIcon({ size, strokeWidth }: { size: number, strokeWidth: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#active-grad)" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Defs>
        <LinearGradient id="active-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#9bf229" />
          <Stop offset="100%" stopColor="#14ce65" />
        </LinearGradient>
      </Defs>
      <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </Svg>
  );
}

function getTabIcon(routeName: string, color: string, isFocused: boolean, isDark: boolean) {
  const size = 20;
  const stroke = isFocused ? 2.5 : 2;
  const fill = isFocused ? color : 'transparent';
  
  if (isFocused) {
    switch (routeName) {
      case 'index': return <ActiveHomeIcon size={size} strokeWidth={stroke} isDark={isDark} />;
      case 'plans': return <CustomCalendarIcon size={size} color="url(#active-grad)" fill="url(#active-grad)" strokeWidth={stroke} isDark={isDark} />;
      case 'care': return <ActiveHeartIcon size={size} strokeWidth={stroke} />;
      case 'activity': return <ActiveActivityIcon size={size} strokeWidth={stroke + 0.5} />;
      default: return <ActiveHomeIcon size={size} strokeWidth={stroke} isDark={isDark} />;
    }
  }

  // Inactive states
  switch (routeName) {
    case 'index': return <Home size={size} color={color} fill={fill} strokeWidth={stroke} />;
    case 'plans': return <CustomCalendarIcon size={size} color={color} fill={fill} strokeWidth={stroke} isDark={isDark} />;
    case 'care': return <Heart size={size} color={color} fill={fill} strokeWidth={stroke} />;
    case 'activity': return <Activity size={size} color={color} strokeWidth={stroke} />;
    default: return <Home size={size} color={color} fill={fill} strokeWidth={stroke} />;
  }
}

function PremiumLogo({ progress }: { progress: SharedValue<number> }) {
  const logoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.2], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <Animated.View style={[styles.logoWrapper, logoStyle]} pointerEvents="none">
      <Svg width={44} height={23} viewBox="0 0 88 44">
        <Defs>
          <LinearGradient id="o-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#9bf229" />
            <Stop offset="100%" stopColor="#14ce65" />
          </LinearGradient>
          <Mask id="heart-mask">
            <Rect width="88" height="44" fill="white" />
            <Path d="M 22 14 C 15 8, 7 13, 9 21 C 11 28, 19 33, 22 37 C 25 33, 33 28, 35 21 C 37 13, 29 8, 22 14 Z" fill="black" />
          </Mask>
          <LinearGradient id="n-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#1ad561" />
            <Stop offset="100%" stopColor="#009f68" />
          </LinearGradient>
        </Defs>
        <Circle cx="22" cy="22" r="22" fill="url(#o-grad)" mask="url(#heart-mask)" />
        <Path 
          d="M 56 38.5 V 15.5 A 10 10 0 0 1 76 15.5 V 38.5" 
          fill="none" 
          stroke="url(#n-grad)" 
          strokeWidth="11" 
          strokeLinecap="round" 
        />
      </Svg>
    </Animated.View>
  );
}

function TabItem({ route, isFocused, meta, onPress }: any) {
  const { isDark } = useTheme();
  const activeIconColor = isDark ? '#ffffff' : '#000000';
  const inactiveColor = isDark ? '#9CA3AF' : '#8E8E93';

  const pressScale = useSharedValue(1);
  const focusProgress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    focusProgress.value = withSpring(isFocused ? 1 : 0, {
      mass: 1,
      damping: 14,
      stiffness: 180,
    });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -2 * focusProgress.value },
      { scale: 1 + 0.15 * focusProgress.value },
    ],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + 0.5 * focusProgress.value,
    transform: [
      { translateY: -1 * focusProgress.value },
    ],
  }));

  return (
    <AnimatedTouchable
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => { pressScale.value = withTiming(0.9, { duration: 100 }); }}
      onPressOut={() => { pressScale.value = withTiming(1, { duration: 150 }); }}
      style={[styles.tabButton, { transform: [{ scale: pressScale }] }]}
    >
      <Animated.View style={animatedIconStyle}>
        {getTabIcon(route.name, isFocused ? activeIconColor : inactiveColor, isFocused, isDark)}
      </Animated.View>
      <Animated.View style={[styles.textCapsule, animatedTextStyle]}>
        <Text style={[styles.tabLabel, { color: isFocused ? activeIconColor : inactiveColor }]}>
          {meta.label}
        </Text>
      </Animated.View>
    </AnimatedTouchable>
  );
}

export default function ChromicTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { isDark, colors } = useTheme();
  const chatModeProgress = useSharedValue(0);
  const keyboard = useAnimatedKeyboard();
  
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const visibleRoutes = state.routes.filter((route) => {
    const { options } = descriptors[route.key];
    return (options as { href?: string | null }).href !== null && TAB_META[route.name];
  });

  const handleLogoPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (chatModeProgress.value === 0) {
      chatModeProgress.value = withTiming(1, { duration: 300 });
    }
  }, []);

  const handleCloseChat = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
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

  const [tabWidth, setTabWidth] = useState(0);
  const leftEdge = useSharedValue(0);
  const rightEdge = useSharedValue(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (tabWidth > 0) {
      const focusedVisibleIndex = visibleRoutes.findIndex(
        (route) => state.routes.indexOf(route) === state.index
      );
      
      const targetLeft = focusedVisibleIndex * tabWidth;
      const targetRight = targetLeft + tabWidth;

      if (isFirstRender.current) {
        leftEdge.value = targetLeft;
        rightEdge.value = targetRight;
        isFirstRender.current = false;
        return;
      }

      const SPRING_FAST = { damping: 15, stiffness: 180, mass: 0.8 };
      const SPRING_SLOW = { damping: 15, stiffness: 180, mass: 1.4 };

      if (targetLeft > leftEdge.value) {
        // Moving right: right edge stretches first
        rightEdge.value = withSpring(targetRight, SPRING_FAST);
        leftEdge.value = withSpring(targetLeft, SPRING_SLOW);
      } else {
        // Moving left: left edge stretches first
        leftEdge.value = withSpring(targetLeft, SPRING_FAST);
        rightEdge.value = withSpring(targetRight, SPRING_SLOW);
      }
    }
  }, [state.index, visibleRoutes, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftEdge.value }],
    width: rightEdge.value - leftEdge.value,
  }));

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

  const logoContainerStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(chatModeProgress.value, [0, 1], [54, SCREEN_WIDTH - 20], Extrapolation.CLAMP),
      borderRadius: interpolate(chatModeProgress.value, [0, 1], [27, 24], Extrapolation.CLAMP),
      backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
    };
  });

  const inputContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(chatModeProgress.value, [0.5, 1], [0, 1], Extrapolation.CLAMP),
      pointerEvents: chatModeProgress.value > 0.5 ? 'auto' : 'none',
    };
  });

  const wrapperStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -keyboard.height.value }]
    };
  });

  return (
    <>
      <GlobalChatOverlay chatModeProgress={chatModeProgress} onClose={handleCloseChat} />

      <ExpoLinearGradient
        colors={[
          isDark ? 'rgba(18,18,18,0)' : 'rgba(253,253,253,0)',
          isDark ? 'rgba(18,18,18,0.7)' : 'rgba(253,253,253,0.85)',
          isDark ? 'rgba(18,18,18,1)' : '#FDFDFD'
        ]}
        locations={[0, 0.4, 1]}
        style={styles.fogBackground}
        pointerEvents="none"
      />

      <Animated.View style={[styles.wrapper, wrapperStyle]}>
        <Animated.View style={[styles.navContainer, isDark ? styles.softGlassDark : styles.softGlassLight, navContainerStyle]} >
          <BlurView intensity={Platform.OS === 'ios' ? 50 : 100} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          
          {tabWidth > 0 && (
            <Animated.View style={[styles.indicatorWrapper, indicatorStyle]}>
               <View style={[styles.indicator, isDark && styles.indicatorDark]} />
            </Animated.View>
          )}

          {visibleRoutes.map((route, index) => {
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
                onLayout={(e) => {
                  if (index === 0) setTabWidth(e.nativeEvent.layout.width);
                }}
              >
                <TabItem route={route} isFocused={isFocused} meta={meta} onPress={onPress} />
              </View>
            );
          })}
        </Animated.View>

        <AnimatedTouchable
          activeOpacity={0.85}
          onPress={handleLogoPress}
          style={[
            styles.logoContainer,
            isDark ? styles.softGlassDark : styles.softGlassLight,
            logoContainerStyle
          ]}
        >
          <BlurView intensity={Platform.OS === 'ios' ? 50 : 100} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} pointerEvents="none" />
          
          {/* Default Logo */}
          <PremiumLogo progress={chatModeProgress} />

          {/* Chat Input that fades in */}
          <Animated.View style={[StyleSheet.absoluteFill, inputContainerStyle, { overflow: 'hidden', borderRadius: 27 }]}>
            <ExpoLinearGradient
              colors={['#9bf229', '#009f68']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBorder}
            >
              <View style={[styles.innerInputRow, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
                <TouchableOpacity style={styles.iconBtn}>
                  <Plus size={20} color="#10B981" />
                </TouchableOpacity>
                <TextInput
                  ref={inputRef}
                  style={[styles.textInput, { color: colors.text }]}
                  placeholder="Ask Arogyon AI..."
                  placeholderTextColor={colors.textMuted}
                  value={inputText}
                  onChangeText={setInputText}
                />
                <TouchableOpacity style={styles.iconBtn}>
                  <Mic size={20} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendBtn}>
                  <Send size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </ExpoLinearGradient>
          </Animated.View>
        </AnimatedTouchable>
      </Animated.View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 12,
    zIndex: 999,
  },
  fogBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: Platform.OS === 'ios' ? 34 + 54 : 24 + 54,
    zIndex: 998,
  },
  navContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 27,
    paddingLeft: 4,
    paddingRight: 12,
    overflow: 'hidden',
  },
  tabSlot: {
    flex: 1,
    height: '100%',
  },
  logoContainer: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  gradientBorder: {
    flex: 1,
    padding: 2, // 2px gradient border
    borderRadius: 27,
  },
  innerInputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25, // Slightly smaller than wrapper
    paddingHorizontal: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    paddingHorizontal: 8,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  softGlassLight: {
    backgroundColor: 'rgba(255,255,255,0.4)',
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
    backgroundColor: 'rgba(30,30,30,0.4)',
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
  indicatorWrapper: {
    position: 'absolute',
    left: 4,
    bottom: 5,
    top: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 0,
  },
  indicator: {
    width: '82%',
    height: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  indicatorDark: {
    backgroundColor: '#333333',
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
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
