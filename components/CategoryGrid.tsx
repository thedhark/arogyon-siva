import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const SPECIALITIES = [
  { id: 1, name: 'General Physician', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=200' },
  { id: 2, name: 'Dermatology', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=200' },
  { id: 5, name: 'Pediatrics', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200' },
  { id: 6, name: 'Orthopedics', image: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=200' },
  { id: 7, name: 'Cardiology', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=200' },
  { id: 8, name: 'Dentistry', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=200' },
  { id: 9, name: 'Gynecology', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=200' },
  { id: 16, name: 'ENT Specialist', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=200' },
  { id: 17, name: 'Urology', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=200' },
  { id: 18, name: 'Neurology', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=200' },
  { id: 19, name: 'Gastro', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=200' },
  { id: 20, name: 'Diabetes', image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=200' },
];

const SITUATIONS = [
  { id: 3, name: 'Diet & Nutrition', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=200' },
  { id: 4, name: 'Pregnancy', image: 'https://images.unsplash.com/photo-1519068737630-e5db30e12e42?q=80&w=200' },
  { id: 10, name: 'Mental Health', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=200' },
  { id: 11, name: 'Physiotherapy', image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=200' },
  { id: 12, name: 'Hair Care', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=200' },
  { id: 13, name: 'Ayurveda', image: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?q=80&w=200' },
  { id: 14, name: 'Homeopathy', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200' },
  { id: 15, name: 'Eye Care', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=200' },
  { id: 21, name: 'Weight Loss', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200' },
  { id: 22, name: 'Sexual Health', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=200' },
  { id: 23, name: 'Sleep', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=200' },
  { id: 24, name: 'Fitness & Yoga', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200' }
];

export default function CategoryGrid() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [activeTab, setActiveTab] = useState(0); // 0 = Specialities, 1 = Situations
  const leftEdge = useSharedValue(0);
  const rightEdge = useSharedValue(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const activeCategories = activeTab === 0 ? SPECIALITIES : SITUATIONS;

  const handleTabPress = (index: number) => {
    if (activeTab !== index) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setActiveTab(index);
      
      // Reset scroll position when swapping categories so it doesn't get stuck
      scrollViewRef.current?.scrollTo({ x: 0, animated: false });
      
      // EXAGGERATED WWDC LIQUID BUBBLE PHYSICS
      // Leading edge shoots to the destination fast
      const leadSpring = { damping: 14, stiffness: 350, mass: 0.4 };
      // Trailing edge lags heavily to create a massive gooey stretch
      const trailSpring = { damping: 20, stiffness: 80, mass: 1.5 };

      if (index === 1) {
        // Moving right: right edge leads
        rightEdge.value = withSpring(1, leadSpring);
        leftEdge.value = withSpring(1, trailSpring);
      } else {
        // Moving left: left edge leads
        leftEdge.value = withSpring(0, leadSpring);
        rightEdge.value = withSpring(0, trailSpring);
      }
    }
  };

  const animatedCapsuleStyle = useAnimatedStyle(() => {
    // leftEdge and rightEdge are normalized 0-1 values.
    // At index 0: leftEdge=0, rightEdge=0 -> left=2, right=(containerWidth/2)+2
    // At index 1: leftEdge=1, rightEdge=1 -> left=(containerWidth/2)+2, right=2
    
    // To prevent NaN before layout, default to a reasonable fallback
    const width = containerWidth || 300; 
    
    return {
      left: leftEdge.value * (width / 2) + 2,
      right: (1 - rightEdge.value) * (width / 2) + 2,
    };
  });

  // Split into chunks of 2 for a 2-row horizontal layout
  const rows = 2;
  const columns = Math.ceil(activeCategories.length / rows);
  
  const chunkedCategories = [];
  for (let i = 0; i < columns; i++) {
    chunkedCategories.push(activeCategories.slice(i * rows, i * rows + rows));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View 
          style={[styles.segmentContainer, { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }]}
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
          {containerWidth > 0 && (
            <Animated.View style={[
              styles.capsule, 
              { backgroundColor: isDark ? '#3A3A3C' : '#FFFFFF' }, 
              animatedCapsuleStyle
            ]} />
          )}
          
          <TouchableOpacity style={styles.segmentButton} onPress={() => handleTabPress(0)} activeOpacity={0.8}>
            <Text style={[styles.segmentText, activeTab === 0 ? (isDark ? styles.activeTextDark : styles.activeTextLight) : styles.inactiveText]}>Specialities</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.segmentButton} onPress={() => handleTabPress(1)} activeOpacity={0.8}>
            <Text style={[styles.segmentText, activeTab === 1 ? (isDark ? styles.activeTextDark : styles.activeTextLight) : styles.inactiveText]}>Situations</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false} 
        bounces={false} 
        overScrollMode="never"
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
      >
        {chunkedCategories.map((col, colIndex) => (
          <View key={colIndex} style={styles.column}>
            {col.map((cat) => {
              return (
                <TouchableOpacity 
                  key={cat.id} 
                  style={styles.categoryCard}
                  activeOpacity={0.7}
                  onPress={() => router.push(`/category/${cat.id}` as any)}
                >
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                  </View>
                  <Text style={[styles.categoryName, { color: colors.text }]} numberOfLines={2}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollArea: {
    marginHorizontal: -12,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  column: {
    gap: 16,
  },
  categoryCard: {
    width: 80,
    height: 105,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  imageWrapper: {
    width: 66,
    height: 66,
    marginBottom: 8,
    borderRadius: 33,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 33,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
  segmentContainer: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 20,
    padding: 2,
    position: 'relative',
    marginBottom: 8,
  },
  capsule: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTextLight: {
    color: '#000000',
  },
  activeTextDark: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#8E8E93',
    fontWeight: '500',
  }
});
