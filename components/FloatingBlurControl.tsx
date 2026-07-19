import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassView } from 'expo-glass-effect';
import { MoreVertical } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGlass } from '@/contexts/GlassContext';
import { useTheme } from '@/hooks/useTheme';

const TABS = ['All', 'Categories'];

export default function FloatingBlurControl() {
  const insets = useSafeAreaInsets();
  const { settings } = useGlass();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  
  // Animation for the sliding active pill
  const activeIndex = TABS.indexOf(activeTab);
  const slideValue = useSharedValue(0);
  
  React.useEffect(() => {
    slideValue.value = withSpring(activeIndex, {
      damping: 20,
      stiffness: 200,
    });
  }, [activeIndex]);

  const pillStyle = useAnimatedStyle(() => {
    // Assuming each tab is roughly 96px wide
    return {
      transform: [{ translateX: slideValue.value * 96 }],
    };
  });

  return (
    <View style={[styles.wrapper, { top: insets.top + 16 }]}>
      <View style={[
        styles.blurContainer,
        { 
          backgroundColor: `rgba(20, 20, 20, ${settings.bgOpacity})`,
          borderColor: `rgba(255, 255, 255, ${settings.borderOpacity})`,
        }
      ]}>
        
        <GlassView 
          glassEffectStyle="regular" 
          colorScheme={isDark ? 'dark' : 'light'} 
          style={StyleSheet.absoluteFill} 
        />

        {/* Left Side: Segmented Control */}
        <View style={styles.segmentedControl}>
          {/* Animated Background Pill */}
          <Animated.View style={[styles.activePillBg, pillStyle]} />
          
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={styles.tabButton}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Right Side: Options Menu */}
        <TouchableOpacity style={styles.menuButton}>
          <MoreVertical size={20} color="#FFFFFF" />
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100, // Float above everything
    pointerEvents: 'box-none',
  },
  blurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(20, 20, 20, 0.45)', // Dark milky base to match screenshot
    borderRadius: 30,
    padding: 6,
    paddingRight: 16,
    width: '90%',
    maxWidth: 360,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)', // Subtle glass edge
    overflow: 'hidden',
  },
  segmentedControl: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  activePillBg: {
    position: 'absolute',
    width: 96,
    height: 44,
    backgroundColor: 'rgba(220, 220, 220, 0.95)', // The bright active pill (All)
    borderRadius: 24,
  },
  tabButton: {
    width: 96,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Stay above the animated background
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#000000', // Dark text on the light active pill
    fontWeight: '600',
  },
  menuButton: {
    padding: 4,
  }
});
