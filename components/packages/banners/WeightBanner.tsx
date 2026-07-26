import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

interface Props {
  onBack?: () => void;
}

export default function WeightBanner({ onBack }: Props) {
  const router = useRouter();

  return (
    <View style={styles.bannerContainer}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000' }}
        style={styles.bannerImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gradientOverlay}
      />

      <SafeAreaView edges={['top']} style={styles.headerBar}>
        <TouchableOpacity onPress={onBack || (() => router.back())} style={styles.backBtn}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.offerBox}>
        <Text style={styles.offerHighlight}>30% OFF NUTRITION CONSULTATION</Text>
        <Text style={styles.offerSubtitle}>90-Day Medical Weight Loss & Metabolic Reset</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    height: 230,
    position: 'relative',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
  },
  offerBox: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  offerHighlight: {
    fontSize: 20,
    fontWeight: '900',
    color: '#84E034',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  offerSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
});
