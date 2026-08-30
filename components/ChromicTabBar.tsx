import React, { useEffect, useCallback } from 'react';
import { Platform, StyleSheet, View, Text, TouchableOpacity, BackHandler, useWindowDimensions } from 'react-native';
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
} from 'react-native-reanimated';
import { Grid, HeartPulse, Heart } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Mask, Rect, Circle } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { GlassView, GlassContainer, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import GlobalChatOverlay from './GlobalChatOverlay';
import { useTabBarStore } from '@/hooks/useTabBarStore';

const TAB_META: Record<string, { label: string }> = {
  index: { label: 'Home' },
  package: { label: 'Packages' },
  care: { label: 'Care' },
  today: { label: 'Today' },
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function getTabIcon(routeName: string, color: string, isFocused: boolean) {
  const size = 22;
  const strokeWidth = isFocused ? 2.4 : 1.9;

  switch (routeName) {
    case 'index':
      return <Grid size={size} color={color} strokeWidth={strokeWidth} />;
    case 'package':
      return <HeartPulse size={size} color={color} strokeWidth={strokeWidth} />;
    case 'care':
    case 'today':
      return <Heart size={size} color={color} strokeWidth={strokeWidth} />;
    default:
      return <Grid size={size} color={color} strokeWidth={strokeWidth} />;
  }
}

function PremiumLogo({ progress }: { progress: SharedValue<number> }) {
  const logoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.2], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <Animated.View style={[styles.logoWrapper, logoStyle]} pointerEvents="none">
      <Svg width={43.5} height={21} viewBox="0 0 91 44">
        <Defs>
          <LinearGradient id="o-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#38BDF8" />
            <Stop offset="100%" stopColor="#2563EB" />
          </LinearGradient>
          <Mask id="heart-mask">
            <Rect width="91" height="44" fill="white" />
            <Path d="M 22 14 C 15 8, 7 13, 9 21 C 11 28, 19 33, 22 37 C 25 33, 33 28, 35 21 C 37 13, 29 8, 22 14 Z" fill="black" />
          </Mask>
          <LinearGradient id="n-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#3B82F6" />
            <Stop offset="100%" stopColor="#1D4ED8" />
          </LinearGradient>
        </Defs>
        <Circle cx="22" cy="22" r="22" fill="url(#o-grad)" mask="url(#heart-mask)" />
        <Path 
          d="M 52 39.5 V 22 A 15.5 15.5 0 0 1 83 22 V 39.5" 
          fill="none" 
          stroke="url(#n-grad)" 
          strokeWidth="9" 
          strokeLinecap="round" 
        />
      </Svg>
    </Animated.View>
  );
}

function TabItem({ route, isFocused, meta, onPress }: any) {
  const { isDark } = useTheme();
  const activeColor = isDark ? '#FFFFFF' : '#000000';
  const inactiveColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.42)';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.tabButton}
    >
      <View style={styles.iconWrapper}>
        {getTabIcon(route.name, isFocused ? activeColor : inactiveColor, isFocused)}
      </View>
      <View style={styles.textCapsule}>
        <Text style={[styles.tabLabel, { color: isFocused ? activeColor : inactiveColor, fontWeight: isFocused ? '800' : '600' }]}>
          {meta.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ChromicTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { isDark } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && windowWidth >= 1024;
  const supportsLiquidGlass = isLiquidGlassAvailable();
  const chatModeProgress = useSharedValue(0);
  const isTabBarVisible = useTabBarStore((s) => s.isTabBarVisible);
  const setTabBarVisible = useTabBarStore((s) => s.setTabBarVisible);
  const tabBarScrollAnim = useSharedValue(0);

  useEffect(() => {
    tabBarScrollAnim.value = withSpring(isTabBarVisible ? 0 : 130, {
      damping: 20,
      stiffness: 220,
      mass: 0.6,
    });
  }, [isTabBarVisible]);

  const tabBarScrollAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tabBarScrollAnim.value }],
      opacity: interpolate(tabBarScrollAnim.value, [0, 90], [1, 0], Extrapolation.CLAMP),
    };
  });

  const visibleRoutes = state.routes.filter((route: any) => {
    const { options } = descriptors[route.key];
    return (options as { href?: string | null }).href !== null && TAB_META[route.name];
  });

  const handleLogoPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTabBarVisible(true);
    if (chatModeProgress.value > 0.5) {
      chatModeProgress.value = withTiming(0, { duration: 250 });
    } else {
      chatModeProgress.value = withTiming(1, { duration: 300 });
    }
  }, [setTabBarVisible]);

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

  // Animations for morphing when opening AI chat overlay
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
        <Animated.View 
          style={[styles.navContainer, containerBgStyle, navContainerStyle]} 
        >
          {Platform.OS === 'android' ? null : supportsLiquidGlass ? (
            <GlassView glassEffectStyle="regular" isInteractive={false} style={[StyleSheet.absoluteFill, { borderRadius: 31, overflow: 'hidden' }]} />
          ) : (
            Platform.OS === 'ios' && (
              <BlurView intensity={85} tint={isDark ? 'dark' : 'light'} style={[StyleSheet.absoluteFill, { borderRadius: 31, overflow: 'hidden' }]} />
            )
          )}

          {visibleRoutes.map((route: any) => {
            const isFocused = state.index === state.routes.indexOf(route);
            const meta = TAB_META[route.name];

            const onPress = () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setTabBarVisible(true);
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
                />
              </View>
            );
          })}
        </Animated.View>

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

  if (isDesktopWeb) {
    return null;
  }

  return (
    <>
      <GlobalChatOverlay 
        chatModeProgress={chatModeProgress} 
        onClose={handleCloseChat} 
      />

      <Animated.View style={[styles.fogBackground, fogStyle, tabBarScrollAnimatedStyle]} pointerEvents="none">
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

      <Animated.View style={[styles.wrapperOuter, tabBarScrollAnimatedStyle]} pointerEvents="box-none">
        {supportsLiquidGlass ? (
          <GlassContainer spacing={24} style={styles.wrapper}>
            {renderPillContainers()}
          </GlassContainer>
        ) : (
          <View style={styles.wrapper}>
            {renderPillContainers()}
          </View>
        )}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapperOuter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? 34 : 24,
    zIndex: 999,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 24,
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
    paddingHorizontal: 12,
  },
  tabSlot: {
    flex: 1,
    height: '100%',
    zIndex: 10,
    elevation: 2,
  },
  logoContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
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
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
        shadowColor: '#000000',
      },
    }),
  },
  softGlassDark: {
    backgroundColor: '#1e1e1e',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
        shadowColor: '#000000',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
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
      android: {
        elevation: 8,
        shadowColor: '#000000',
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: 4,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCapsule: {
    marginTop: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});

