import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform, Pressable } from 'react-native';
import { Search, Mic } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { BlurView } from 'expo-blur';

const searchTerms = [
  "Search doctor",
  "Search pregnancy",
  "Book appointment",
  "Book online consultation"
];

export default function PremiumSearchBar() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  
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

  const innerContent = (
    <View style={styles.contentContainer}>
      <Search size={18} color={isDark ? '#AAAAAA' : '#666666'} style={styles.icon} />
      <View style={styles.textContainer}>
        <Animated.View 
          style={{
            opacity: opacity,
            transform: [{ translateY: translateY }]
          }}
        >
          <Text 
            style={[
              styles.animatedText, 
              { color: isDark ? '#AAAAAA' : '#888888' }
            ]}
          >
            {searchTerms[currentIndex]}...
          </Text>
        </Animated.View>
      </View>
      <View style={styles.divider} />
      <Mic size={20} color="#EF4444" style={styles.micIcon} />
    </View>
  );

  return (
    <View style={styles.outerWrapper}>
      <Pressable 
        style={({ pressed }) => [
          styles.container, 
          Platform.OS === 'android' && { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
          pressed && Platform.OS === 'ios' && { opacity: 0.8, transform: [{ scale: 0.99 }] }
        ]}
        android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }}
        onPress={() => router.push('/search')}
      >
        {Platform.OS === 'ios' ? (
          <BlurView intensity={isDark ? 50 : 80} tint={isDark ? "dark" : "light"} style={styles.glassView}>
            {innerContent}
          </BlurView>
        ) : innerContent}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    marginBottom: 8,
  },
  container: {
    height: 48, // Slightly taller M3 pill
    borderRadius: 24, // Perfect fully rounded pill
    borderWidth: Platform.OS === 'android' ? 1 : 0, // Let BlurView handle background on iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  glassView: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 24,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: Platform.OS === 'android' ? 16 : 0,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    height: 24,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  animatedText: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  micIcon: {
    padding: 4,
  },
  softGlassDark: {}
});
