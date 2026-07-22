import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const SPECIALITIES = [
  { id: 1, name: 'General Physician', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=200' },
  { id: 2, name: 'Cardiology', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=200' },
  { id: 3, name: 'Ophthalmology', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=200' },
  { id: 4, name: 'Dentistry', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=200' },
  { id: 5, name: 'General Surgery', image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=200' },
  { id: 6, name: 'Oncology', image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=200' },
  { id: 7, name: 'Pediatrics', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200' },
  { id: 8, name: 'Orthopedics', image: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=200' },
  { id: 9, name: 'Gynecology', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=200' },
  { id: 10, name: 'Neurology', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=200' },
  { id: 17, name: 'Urology', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=200' },
  { id: 18, name: 'Dermatology', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=200' },
  { id: 19, name: 'ENT Care', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=200' },
  { id: 20, name: 'Psychiatry', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200' },
  { id: 21, name: 'Diabetology', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=200' },
  { id: 22, name: 'Gastroenterology', image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=200' },
  { id: 23, name: 'Pulmonology', image: 'https://images.unsplash.com/photo-1584061803517-5e8c1e6c98dc?q=80&w=200' },
  { id: 24, name: 'Nephrology', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=200' },
];

const SITUATIONS = [
  { id: 11, name: 'Accident', image: 'https://images.unsplash.com/photo-1587559070757-f72a388edbba?q=80&w=200' },
  { id: 12, name: 'Fever', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=200' },
  { id: 13, name: 'Poisoning', image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?q=80&w=200' },
  { id: 14, name: 'Chest Pain', image: 'https://images.unsplash.com/photo-1505575967455-40e256f73376?q=80&w=200' },
  { id: 15, name: 'Breathing', image: 'https://images.unsplash.com/photo-1584061803517-5e8c1e6c98dc?q=80&w=200' },
  { id: 16, name: 'Stomach Ache', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=200' },
  { id: 25, name: 'Fracture', image: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=200' },
  { id: 26, name: 'Migraine', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200' },
  { id: 27, name: 'Skin Burn', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=200' },
  { id: 28, name: 'Allergy', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=200' },
  { id: 29, name: 'BP Crisis', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=200' },
  { id: 30, name: 'Animal Bite', image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=200' },
  { id: 31, name: 'Pimple & Acne', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=200' },
  { id: 32, name: 'Hair Loss', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=200' },
  { id: 33, name: 'Sexual Health', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=200' },
  { id: 34, name: 'Period Pain', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=200' },
  { id: 35, name: 'Weight Care', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=200' },
  { id: 36, name: 'Stress & Anxiety', image: 'https://images.unsplash.com/photo-1499209974431-9dac3cea0047?q=80&w=200' },
  { id: 37, name: 'Acidity & Gas', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=200' },
  { id: 38, name: 'Toothache', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=200' },
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
    gap: 16,
  },
  column: {
    gap: 16,
  },
  categoryCard: {
    width: 84,
    height: 124,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  imageWrapper: {
    width: 84,
    height: 84,
    marginBottom: 8,
    borderRadius: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 23,
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
