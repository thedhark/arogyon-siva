import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SITUATION_ILLUSTRATIONS } from '@/constants/medical-theme-assets';

type CategoryItem = {
  id: number;
  name: string;
  image: string | ImageSourcePropType;
};

const SPECIALITIES: CategoryItem[] = [
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

const SITUATIONS: CategoryItem[] = [
  { id: 11, name: 'Accident', image: SITUATION_ILLUSTRATIONS.accident },
  { id: 12, name: 'Fever', image: SITUATION_ILLUSTRATIONS.fever },
  { id: 13, name: 'Poisoning', image: SITUATION_ILLUSTRATIONS.poisoning },
  { id: 14, name: 'Chest Pain', image: SITUATION_ILLUSTRATIONS.chestPain },
  { id: 15, name: 'Breathing', image: SITUATION_ILLUSTRATIONS.breathing },
  { id: 16, name: 'Stomach Ache', image: SITUATION_ILLUSTRATIONS.stomachAche },
  { id: 25, name: 'Fracture', image: SITUATION_ILLUSTRATIONS.fracture },
  { id: 26, name: 'Migraine', image: SITUATION_ILLUSTRATIONS.migraine },
  { id: 27, name: 'Skin Burn', image: SITUATION_ILLUSTRATIONS.skinBurn },
  { id: 28, name: 'Allergy', image: SITUATION_ILLUSTRATIONS.allergy },
  { id: 29, name: 'BP Crisis', image: SITUATION_ILLUSTRATIONS.bpCrisis },
  { id: 30, name: 'Animal Bite', image: SITUATION_ILLUSTRATIONS.animalBite },
  { id: 31, name: 'Pimple & Acne', image: SITUATION_ILLUSTRATIONS.pimpleAcne },
  { id: 32, name: 'Hair Loss', image: SITUATION_ILLUSTRATIONS.hairLoss },
  { id: 33, name: 'Sexual Health', image: SITUATION_ILLUSTRATIONS.sexualHealth },
  { id: 34, name: 'Period Pain', image: SITUATION_ILLUSTRATIONS.periodPain },
  { id: 35, name: 'Weight Care', image: SITUATION_ILLUSTRATIONS.weightCare },
  { id: 36, name: 'Stress & Anxiety', image: SITUATION_ILLUSTRATIONS.stressAnxiety },
  { id: 37, name: 'Acidity & Gas', image: SITUATION_ILLUSTRATIONS.acidityGas },
  { id: 38, name: 'Toothache', image: SITUATION_ILLUSTRATIONS.toothache },
];

const getImageSource = (image: CategoryItem['image']) =>
  typeof image === 'string' ? { uri: image } : image;

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
                  <View style={[styles.imageWrapper, { backgroundColor: isDark ? '#252528' : '#F3F4F6' }]}>
                    <Image source={getImageSource(cat.image)} style={styles.categoryImage} resizeMode="cover" />
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
    marginBottom: 12,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
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
