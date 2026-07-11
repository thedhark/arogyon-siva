import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

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

  return (
    <View style={styles.outerWrapper}>
      <TouchableOpacity 
        style={[styles.container, isDark ? styles.softGlassDark : styles.softGlassLight]}
        activeOpacity={0.8}
        onPress={() => router.push('/search')}
      >
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
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    marginBottom: 24,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44, // Decreased height
    borderRadius: 22, // Matching radius
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    height: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  animatedText: {
    fontSize: 14,
    fontWeight: '500',
    position: 'absolute',
  },
  softGlassLight: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E4E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  softGlassDark: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#E5E4E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
});
