import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageSourcePropType, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolation } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import AndroidGlassView from '@/components/AndroidGlassView';
import { SPECIALTY_ILLUSTRATIONS } from '@/constants/medical-illustrations';

type CategoryItem = {
  id: number;
  name: string;
  image: string | ImageSourcePropType;
};

const GENERAL_CARE: CategoryItem[] = [
  { id: 1, name: 'General Physician', image: SPECIALTY_ILLUSTRATIONS.generalPhysician },
  { id: 4, name: 'Dentist', image: SPECIALTY_ILLUSTRATIONS.dentistry },
  { id: 9, name: "Women's Health", image: SPECIALTY_ILLUSTRATIONS.gynecology },
  { id: 18, name: 'Skin Specialist', image: SPECIALTY_ILLUSTRATIONS.dermatology },
  { id: 3, name: 'Eye Specialist', image: SPECIALTY_ILLUSTRATIONS.ophthalmology },
  { id: 19, name: 'Ear, Nose & Throat', image: SPECIALTY_ILLUSTRATIONS.entCare },
  { id: 7, name: 'Child Care', image: SPECIALTY_ILLUSTRATIONS.pediatrics },
  { id: 20, name: 'Mental Wellness', image: SPECIALTY_ILLUSTRATIONS.psychiatry },
  { id: 39, name: 'Veterinary', image: SPECIALTY_ILLUSTRATIONS.veterinary },
  { id: 33, name: "Men's Health", image: SPECIALTY_ILLUSTRATIONS.sexualHealth },
];

const ADVANCED_CARE: CategoryItem[] = [
  { id: 8, name: 'Bones & Joints', image: SPECIALTY_ILLUSTRATIONS.orthopedics },
  { id: 10, name: 'Brain & Nerves', image: SPECIALTY_ILLUSTRATIONS.neurology },
  { id: 17, name: 'Urinary Issues', image: SPECIALTY_ILLUSTRATIONS.urology },
  { id: 23, name: 'Lungs & Breathing', image: SPECIALTY_ILLUSTRATIONS.pulmonology },
  { id: 2, name: 'Heart Specialist', image: SPECIALTY_ILLUSTRATIONS.cardiology },
  { id: 22, name: 'Stomach & Digestion', image: SPECIALTY_ILLUSTRATIONS.gastroenterology },
  { id: 21, name: 'Diabetes', image: SPECIALTY_ILLUSTRATIONS.diabetology },
  { id: 6, name: 'Cancer Specialist', image: SPECIALTY_ILLUSTRATIONS.oncology },
  { id: 40, name: 'Plastic Surgery', image: SPECIALTY_ILLUSTRATIONS.plasticSurgery },
  { id: 41, name: 'Hair', image: SPECIALTY_ILLUSTRATIONS.hairPlantation },
];

const getImageSource = (image: CategoryItem['image']) =>
  typeof image === 'string' ? { uri: image } : image;

export default function CategoryGrid() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [activeTab, setActiveTab] = useState(0); // 0 = General Care, 1 = Advanced Care
  const leftEdge = useSharedValue(0);
  const rightEdge = useSharedValue(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const supportsLiquidGlass = Platform.OS === 'ios' && typeof isLiquidGlassAvailable === 'function' && isLiquidGlassAvailable();

  const activeCategories = activeTab === 0 ? GENERAL_CARE : ADVANCED_CARE;

  const handleTabPress = (index: number) => {
    if (activeTab !== index) {
      if (Platform.OS === 'ios') {
        Haptics.selectionAsync();
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
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
    
    // Stretch differential between leading and trailing edges
    const stretch = Math.abs(rightEdge.value - leftEdge.value);
    
    // Vertical squash scale (compress height slightly during high-speed stretch)
    const scaleY = interpolate(stretch, [0, 0.4], [1, 0.86], Extrapolation.CLAMP);

    return {
      left: leftEdge.value * (width / 2) + 3,
      right: (1 - rightEdge.value) * (width / 2) + 3,
      transform: [
        { scaleY },
      ],
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
          style={[
            styles.segmentContainer, 
            { 
              backgroundColor: isDark ? 'rgba(28,28,30,0.65)' : 'rgba(238,238,242,0.75)',
              borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
            }
          ]}
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
          {supportsLiquidGlass ? (
            <GlassView 
              glassEffectStyle="regular"
              isInteractive={true}
              style={StyleSheet.absoluteFillObject}
            />
          ) : Platform.OS === 'ios' ? (
            <BlurView 
              tint={isDark ? 'dark' : 'light'} 
              intensity={40} 
              style={StyleSheet.absoluteFillObject} 
            />
          ) : (
            <AndroidGlassView style={StyleSheet.absoluteFillObject} />
          )}

          {containerWidth > 0 && (
            <Animated.View style={[
              styles.capsule, 
              { 
                backgroundColor: isDark ? 'rgba(60,60,65,0.95)' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.9)',
                borderWidth: StyleSheet.hairlineWidth,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: isDark ? 0.35 : 0.16,
                shadowRadius: 6,
                elevation: 4,
              }, 
              animatedCapsuleStyle
            ]} />
          )}
          
          <TouchableOpacity style={styles.segmentButton} onPress={() => handleTabPress(0)} activeOpacity={0.8}>
            <Text style={[styles.segmentText, activeTab === 0 ? (isDark ? styles.activeTextDark : styles.activeTextLight) : styles.inactiveText]}>General Care</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.segmentButton} onPress={() => handleTabPress(1)} activeOpacity={0.8}>
            <Text style={[styles.segmentText, activeTab === 1 ? (isDark ? styles.activeTextDark : styles.activeTextLight) : styles.inactiveText]}>Advanced Care</Text>
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
    gap: 8,
  },
  column: {
    gap: 8,
  },
  categoryCard: {
    width: 68,
    height: 104,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  imageWrapper: {
    width: 64,
    height: 64,
    marginBottom: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    borderRadius: 20,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
  segmentContainer: {
    flexDirection: 'row',
    height: 42,
    borderRadius: 21,
    padding: 3,
    position: 'relative',
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  capsule: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    borderRadius: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
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
