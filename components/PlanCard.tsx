import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { resolveImageSource } from '@/utils/imageUtils';

const { width } = Dimensions.get('window');

interface PlanCardProps {
  image: string;
  title: string;
  tag?: string;
  colors?: [string, string, ...string[]];
  categorySlug?: string;
  onPress?: () => void;
}

export default function PlanCard({ image, title, tag, colors = ['transparent', 'rgba(0, 0, 0, 0.65)'], categorySlug, onPress }: PlanCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (categorySlug) {
      router.push(`/packages/category/${categorySlug}` as any);
    } else {
      router.push('/packages/category/pregnancy' as any);
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.planCard} onPress={handlePress}>
      <ImageBackground source={resolveImageSource(image)} style={styles.planCardImage} imageStyle={{ borderRadius: 24 }}>
        {tag ? (
          <View style={styles.planTagContainer}>
            <View style={styles.planTag}>
              <Text style={styles.planTagText}>{tag}</Text>
            </View>
          </View>
        ) : null}
        
        <LinearGradient colors={colors} style={styles.bottomGradient}>
          <Text style={styles.planCardTitle}>{title}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  planCard: {
    width: width * 0.28,
    height: 180,
    borderRadius: 24, // M3 Fully Rounded
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    backgroundColor: '#fff',
  },
  planCardImage: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  planTagContainer: {
    padding: 8,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 55,
    paddingHorizontal: 10,
    paddingBottom: 10,
    justifyContent: 'flex-end',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  planTag: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  planTagText: {
    color: '#333',
    fontSize: 8,
    fontWeight: '800',
  },
  planCardTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
