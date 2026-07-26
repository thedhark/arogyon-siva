import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface PlanCardProps {
  image: string;
  title: string;
  tag: string;
  colors: [string, string, ...string[]];
  categorySlug?: string;
  onPress?: () => void;
}

export default function PlanCard({ image, title, tag, colors, categorySlug, onPress }: PlanCardProps) {
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
      <ImageBackground source={{ uri: image }} style={styles.planCardImage} imageStyle={{ borderRadius: 24 }}>
        <LinearGradient colors={colors} style={styles.planCardGradient}>
          <View style={styles.planTag}>
            <Text style={styles.planTagText}>{tag}</Text>
          </View>
          <View style={styles.planCardContent}>
            <Text style={styles.planCardTitle}>{title}</Text>
            <View style={[styles.planCardFooter, { justifyContent: 'flex-end' }]}>
              <View style={styles.planCardBtn}>
                <ChevronRight size={14} color="#1b5e55" />
              </View>
            </View>
          </View>
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
  },
  planCardGradient: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
    borderRadius: 24,
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
  planCardContent: {
    gap: 2,
  },
  planCardTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
    lineHeight: 14,
  },
  planCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planCardDuration: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 9,
    fontWeight: '600',
  },
  planCardBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
