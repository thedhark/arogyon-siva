import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Search, Mic } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import AndroidGlassView from '@/components/AndroidGlassView';

const searchTerms = [
  'Search "General Physician"',
  'Search "Pregnancy Care"',
  'Search "Blood Tests"',
  'Search "Skin Specialist"'
];

export default function PremiumSearchBar() {
  const { isDark, colors } = useTheme();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const supportsLiquidGlass = isLiquidGlassAvailable();
  
  // Use refs to persist animated values across re-renders
  const translateY = useRef(new Animated.Value(15)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const animate = () => {
      // Fade in and slide up
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (!isMounted) return;
        
        // Hold for 2.5 seconds
        setTimeout(() => {
          if (!isMounted) return;
          
          // Fade out and slide up further
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -15,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start(() => {
            if (!isMounted) return;
            
            // Go to next item
            setCurrentIndex((prev) => (prev + 1) % searchTerms.length);
            
            // Reset position immediately without animating
            translateY.setValue(15);
            
            // Loop
            animate();
          });
        }, 2500);
      });
    };

    animate();

    return () => {
      isMounted = false;
    };
  }, []);

  const textColor = isDark ? '#9CA3AF' : '#6B7280';
  const iconColor = colors.success;

  const containerBgStyle = supportsLiquidGlass 
    ? styles.glassTransparent 
    : (Platform.OS === 'ios' ? styles.blurContainer : (isDark ? styles.containerDark : styles.containerLight));

  return (
    <TouchableOpacity 
      activeOpacity={1} 
      style={styles.outerWrapper}
      onPress={() => router.push('/search')}
    >
      <View style={[styles.container, containerBgStyle]}>
        {Platform.OS === 'android' ? null : supportsLiquidGlass ? (
          <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 14, overflow: 'hidden' }]} />
        ) : (
          Platform.OS === 'ios' && (
            <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={[StyleSheet.absoluteFill, { borderRadius: 14, overflow: 'hidden' }]} />
          )
        )}

        <View style={styles.leftSection}>
          <Search size={20} color={iconColor} style={styles.icon} />
          
          <View style={styles.textContainer}>
            <Animated.View 
              style={{
                opacity: opacity,
                transform: [{ translateY: translateY }],
                width: '100%',
              }}
            >
              <Text 
                numberOfLines={1} 
                ellipsizeMode="tail" 
                style={[styles.animatedText, { color: textColor }]}
              >
                {searchTerms[currentIndex]}
              </Text>
            </Animated.View>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.divider} />
          <Mic size={20} color={iconColor} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingHorizontal: 16,
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  containerDark: {
    backgroundColor: '#1E1E1E',
  },
  glassTransparent: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  blurContainer: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
    }),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    height: 24,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  animatedText: {
    fontSize: 15,
    fontWeight: '400',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 14,
  },
});
